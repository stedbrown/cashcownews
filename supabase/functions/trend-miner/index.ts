import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import OpenAI from "https://esm.sh/openai@4.24.1"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiKey = Deno.env.get('OPENAI_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const openai = new OpenAI({ apiKey: openaiKey })

const TRENDS_RSS_URL = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"

const HIGH_CPC_KEYWORDS = [
    'Insurance', 'Loans', 'Mortgage', 'Attorney', 'Credit',
    'Lawyer', 'Donate', 'Degree', 'Hosting', 'Claim',
    'Conference Call', 'Trading', 'Software', 'Recovery',
    'Transfer', 'Gas/Electricity', 'Classes', 'Rehab', 'Treatment'
];

const BANNED_KEYWORDS = [
    'Football', 'Soccer', 'Movie', 'Song', 'Lyrics',
    'Celebrity', 'Gossip', 'Game', 'Sport'
];

serve(async (req: Request) => {
    try {
        const body = await req.json().catch(() => ({}));
        const forceMode = body.force === true;

        console.log(`Triggering trend-miner. Force Mode: ${forceMode}`)
        const response = await fetch(TRENDS_RSS_URL)
        const xml = await response.text()

        // Simple regex to extract titles and news items from XML
        const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]

        const allTrends = items.map(match => {
            const content = match[1]
            const title = content.match(/<title>(.*?)<\/title>/)?.[1] || ""
            const description = content.match(/<description>(.*?)<\/description>/)?.[1] || ""
            return { title, description }
        })

        // 1. Initial Local Filter
        const filteredTrends = allTrends.filter(trend => {
            if (forceMode) return true; // Bypass filters in force mode

            const text = `${trend.title} ${trend.description}`.toLowerCase();
            const hasBanned = BANNED_KEYWORDS.some(word => trend.title.toLowerCase().includes(word.toLowerCase()));
            if (hasBanned) return false;
            return true;
        }).slice(0, forceMode ? 1 : 10); // In force mode, just take the first one to avoid high costs

        const results = []

        for (const trend of filteredTrends) {
            console.log(`Analyzing trend: ${trend.title}`)

            const prompt = `
        Trend Title: ${trend.title}
        Trend Description: ${trend.description}
        
        STRICT RULES:
        ${forceMode ? "IGNORE CPC FILTERS. Generate a high-value article for this trend regardless of its category." : `1. Is this trend related to one of these High-CPC themes or affine concepts? Themes: ${HIGH_CPC_KEYWORDS.join(', ')}`}
        2. Filter out anything related to: ${BANNED_KEYWORDS.join(', ')}
        
        IF NOT HIGH VALUE ${forceMode ? "AND NOT IN FORCE MODE" : ""}, return JSON: {"skip": true}
        
        IF HIGH VALUE, generate:
        - title: Must be AGGRESSIVE CLICKBAIT that promises a massive solving or a secret. 
          Use numbers, superlatives, and psychological triggers.
          Example: "7 Secret Insurance Hacks That Save You $5,000 Immediately" or "WARNING: Why 90% of Tech Firms Fail Without This Specific Software".
        - slug: SEO friendly.
        - content: LONG-FORM HTML Article (minimum 1500 words).
          Must include:
          - Multiple <h2> and <h3> headers.
          - At least two detailed <table> (comparisons, pricing, specs).
          - Multiple bulleted/numbered lists.
          - Use a professional yet urgent/persuasive tone.
          - Deep dive into features, pros/cons, and industry secrets.
        - meta_description: High-CTR SEO description.
        - category: One of (Finance, Tech, Legal, Software, Insurance).
        - keywords: 5 high-cpc keywords.
        - image_prompt: A descriptive prompt for DALL-E 3 to create a stunning, viral-worthy cinematic image.
        
        Response MUST be strictly JSON.
      `

            const completion = await openai.chat.completions.create({
                model: "gpt-4o", // Upgraded to flagship
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })

            const aiResponse = JSON.parse(completion.choices[0].message.content!)

            if (aiResponse.skip) {
                console.log(`Skipping low-value trend: ${trend.title}`)
                continue
            }

            // Generate Image via DALL-E 3
            console.log(`Generating image for: ${aiResponse.slug}`)
            let imageUrl = null;
            try {
                const imageGeneration = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: aiResponse.image_prompt,
                    n: 1,
                    size: "1024x1024",
                });
                imageUrl = imageGeneration.data[0].url;
            } catch (imgError) {
                console.error("Image generation failed:", imgError);
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
                    image_url: imageUrl,
                    published_at: new Date().toISOString()
                }, { onConflict: 'slug' })

            if (error) {
                console.error(`Error saving article ${aiResponse.slug}:`, error)
            } else {
                console.log(`Saved High-CPC article with image: ${aiResponse.slug}`)
                results.push(aiResponse.slug)
            }
        }

        return new Response(JSON.stringify({ success: true, processed: results }), {
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
