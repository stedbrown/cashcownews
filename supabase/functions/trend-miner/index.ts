import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import OpenAI from "https://esm.sh/openai@4.24.1"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiKey = Deno.env.get('OPENAI_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const openai = new OpenAI({ apiKey: openaiKey })

const TRENDS_RSS_URL = "https://trends.google.com/trending/rss?geo=US"
const NEWS_RSS_BASE = "https://news.google.com/rss/headlines/section/topic/"

const CATEGORIES = [
    { name: 'BUSINESS', id: 'BUSINESS' },
    { name: 'TECHNOLOGY', id: 'TECHNOLOGY' },
    { name: 'HEALTH', id: 'HEALTH' },
    { name: 'SCIENCE', id: 'SCIENCE' }
];

const BANNED_KEYWORDS = [
    'Football', 'Soccer', 'Movie', 'Song', 'Lyrics',
    'Celebrity', 'Gossip', 'Game', 'Sport'
];

serve(async (req: Request) => {
    try {
        const body = await req.json().catch(() => ({}));
        const forceMode = body.force === true;

        const currentHour = new Date().getUTCHours();
        const categoryIndex = currentHour % CATEGORIES.length;
        const activeCategory = CATEGORIES[categoryIndex];
        const rssUrl = forceMode ? TRENDS_RSS_URL : `${NEWS_RSS_BASE}${activeCategory.id}?hl=en-US&gl=US&ceid=US:en`;

        console.log(`Triggering trend-miner. Mode: ${forceMode ? 'FORCE (Trends)' : `AUTO (${activeCategory.name})`}`)
        const response = await fetch(rssUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://news.google.com/"
            }
        })
        const xml = await response.text()
        console.log(`Fetched RSS. Status: ${response.status}, Length: ${xml.length}`)
        if (xml.length < 1000) {
            console.log("RSS response unusually short, full body:", xml)
        }

        // Resilient parsing: extract items and clean up potential encoding issues
        const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
        console.log(`Regex found ${itemMatches.length} raw items`)

        const allTrends = itemMatches.map(match => {
            const content = match[1]
            // More flexible regex for title and description
            const title = content.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)?.[1] || ""
            const description = content.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i)?.[1] || ""
            return {
                title: title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim(),
                description: description.replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim()
            }
        }).filter(t => t.title.length > 5);

        console.log(`Parsed ${allTrends.length} clean trends`)
        if (allTrends.length > 0) {
            console.log(`Top trend sample: ${allTrends[0].title}`)
        }

        // 1. Initial Selection: Group top 5 trends for AI clustering
        const candidateTrends = allTrends.filter(trend => {
            const text = `${trend.title} ${trend.description}`.toLowerCase();
            return !BANNED_KEYWORDS.some(word => text.includes(word.toLowerCase()));
        }).slice(0, 5);

        if (candidateTrends.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "No valid trends found" }), { status: 404 })
        }

        const results = []

        let lastAiResponse = null;

        const combinedTrendsText = candidateTrends.map((t, i) => `[${i + 1}] Title: ${t.title} | Desc: ${t.description}`).join('\n');

        const prompt = `
        YOU ARE THE CHIEF EDITOR OF THE CAPITAL SENTINEL (Financial & Wealth Authority).
        
        INPUT TRENDS FROM ${activeCategory.name}:
        ${combinedTrendsText}
        
        TASK:
        1. Identify the single best trend OR cluster 2-3 related trends into a one dominant "Wealth Machine" article.
        2. Even if the topic is general, pivot it to a "REVENUE/SUCCESS/INVESTMENT" angle (High CPC).
        
        STRICT FORMATTING:
        - title: AGGRESSIVE CLICKBAIT (High CTR, 0 markdown, Emotional/Financial trigger).
        - format: 100% CLEAN HTML (<h1>, <h2>, <h3>, <p>, <ul>, <li>, <table>, <strong>). NO MARKDOWN (NO ###, NO **).
        - content: 2000+ words. 
          STRICT CONTENT ORDER:
          1. <h1> Aggressive Title
          2. <p> Introduction (Curiosity Gap)
          3. [IMAGE PLACEHOLDER]
          4. <h2> The Hidden Truth Behind [Main Topic]
          5. [AD SLOT]
          6. <p> Exhaustive Analysis 1
          7. <h3> Net Worth & Financial Impact / Market Secrets
          8. <table> Facts & Data Analysis (Pricing, Comparisons, or Projections)
          9. [AD SLOT]
          10. <h2> 7 Secrets to [Achieving/Saving] Like [Topic]
          11. <ul> Detailed tips/hacks.
          12. [AD SLOT]
          13. <h2> Final Verdict: Is [Topic] Worth the Hype?
          14. <p> Conclusion.
        - meta_description: Extreme CTR description.
        - category: ${activeCategory.name}
        - keywords: 10 extremely high CPC keywords.
        - image_prompt: CINEMATIC, HIGH-CONTRAST, EMOTIONAL image.
        
        Response MUST be strictly JSON.
      `

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })

        const aiResponseRaw = completion.choices[0].message.content!;
        console.log(`Raw AI Response: ${aiResponseRaw.substring(0, 500)}`);
        const aiResponse = JSON.parse(aiResponseRaw);
        console.log(`AI selected trend(s) and generated: "${aiResponse.title}"`)

        // Always proceed - the prompt now demands a generation
        if (!aiResponse.title) {
            console.log(`AI failed to generate a response.`)
            return new Response(JSON.stringify({ success: false, message: "No article generated" }))
        }

        // Generate Image via DALL-E 3
        console.log(`Generating image for: ${aiResponse.slug}`)
        let finalImageUrl = null;
        try {
            const imageGeneration = await openai.images.generate({
                model: "dall-e-3",
                prompt: aiResponse.image_prompt,
                n: 1,
                size: "1024x1024",
            });
            const tempImageUrl = imageGeneration.data[0].url!;

            // 3. Persist Image to Supabase Storage
            console.log(`Persisting image to storage: ${aiResponse.slug}.png`)
            const imgRes = await fetch(tempImageUrl);
            const imgBlob = await imgRes.blob();

            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('article-images')
                .upload(`${aiResponse.slug}.png`, imgBlob, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) {
                console.error("Storage upload failed:", uploadError);
                finalImageUrl = tempImageUrl; // Fallback to temp URL if storage fails
            } else {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('article-images')
                    .getPublicUrl(`${aiResponse.slug}.png`);
                finalImageUrl = publicUrl;
                console.log(`Permanent image saved: ${finalImageUrl}`);
            }
        } catch (imgError) {
            console.error("Image generation/persistence failed:", imgError);
        }

        // Save to Supabase
        const { error } = await supabase
            .from('articles')
            .upsert({
                slug: aiResponse.slug,
                title: aiResponse.title,
                content: aiResponse.content,
                meta_description: aiResponse.meta_description,
                category: aiResponse.category,
                keywords: aiResponse.keywords,
                image_url: finalImageUrl,
                published_at: new Date().toISOString()
            }, { onConflict: 'slug' })

        if (error) {
            console.error(`Error saving article ${aiResponse.slug}:`, error)
        } else {
            console.log(`Saved article with permanent image: ${aiResponse.slug}`)
            results.push(aiResponse.slug)
        }
        // We only process one master article per execution now
        break;
    }

        return new Response(JSON.stringify({
        success: true,
        found_trends: allTrends.length,
        filtered_trends: filteredTrends.length,
        processed: results
    }), {
        headers: { "Content-Type": "application/json" }
    })
} catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
    })
}
})
