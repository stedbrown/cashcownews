import { supabase } from '@/lib/supabase';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: articles } = await supabase
        .from('articles')
        .select('slug, published_at')
        .order('published_at', { ascending: false });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

    const articleEntries: MetadataRoute.Sitemap = (articles || []).map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: new Date(article.published_at),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...articleEntries,
    ];
}
