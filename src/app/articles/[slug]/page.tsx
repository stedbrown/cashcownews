import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, Tag } from 'lucide-react';

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data: article } = await supabase
        .from('articles')
        .select('title, meta_description, keywords')
        .eq('slug', slug)
        .single();

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | Cash Cow Trends`,
        description: article.meta_description,
        keywords: article.keywords?.join(', '),
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!article) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(article.published_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        <Tag size={14} />
                        {article.category}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {article.title}
                </h1>
                {article.meta_description && (
                    <p className="text-xl text-gray-600 italic border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
                        {article.meta_description}
                    </p>
                )}
            </header>

            <div
                className="prose prose-lg max-w-none 
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-a:text-blue-600 hover:prose-a:text-blue-500
          prose-table:border prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm
          prose-th:bg-gray-50 prose-th:px-4 prose-th:py-3 prose-th:text-left
          prose-td:px-4 prose-td:py-3 prose-td:border-t"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <footer className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                    {article.keywords?.map((keyword: string) => (
                        <span key={keyword} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            #{keyword}
                        </span>
                    ))}
                </div>
            </footer>
        </article>
    );
}
