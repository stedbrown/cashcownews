import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, Tag, Clock, ChevronLeft, Share2, Mail, LayoutGrid, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import AdSenseUnit from '@/components/AdSenseUnit';

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
const TOP_SLOT_ID = '1234567890'; // Replace with a real slot ID placeholder
const SIDEBAR_SLOT_ID = '0987654321';
const MID_CONTENT_SLOT_ID = '5555555555';

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data: article } = await supabase
        .from('articles')
        .select('title, meta_description, keywords')
        .eq('slug', slug)
        .single();

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | The Capital Sentinel`,
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

    // Fetch related articles
    const { data: related } = await supabase
        .from('articles')
        .select('slug, title, image_url, category, published_at')
        .eq('category', article.category)
        .neq('id', article.id)
        .limit(3);

    // Fetch trending for sidebar
    const { data: trending } = await supabase
        .from('articles')
        .select('slug, title, category')
        .order('published_at', { ascending: false })
        .limit(5);

    const wordCount = article.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Inject In-Article Ad after first paragraph
    const injectAd = (html: string) => {
        const parts = html.split('</p>');
        if (parts.length > 1) {
            const firstPara = parts[0] + '</p>';
            const rest = parts.slice(1).join('</p>');
            return { firstPara, rest };
        }
        return { firstPara: html, rest: '' };
    };

    const { firstPara, rest } = injectAd(article.content);

    return (
        <main className="bg-[#FDFDFD] min-h-screen">
            {/* Minimal Sticky Nav for Article Context */}
            <div className="bg-white border-b border-gray-100 py-4 sticky top-0 md:relative z-40">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <ChevronLeft size={14} /> Back to Headlines
                    </Link>
                    <div className="hidden md:block">
                        Current Intelligence: <span className="text-gray-900">{article.category}</span>
                    </div>
                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Share2 size={14} /> Share
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-12 gap-12">

                    {/* Content Column */}
                    <div className="col-span-12 lg:col-span-8">
                        <header className="mb-12">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[10px] font-black uppercase bg-primary text-white px-3 py-1 rounded tracking-widest">
                                    {article.category}
                                </span>
                                <div className="h-px w-8 bg-gray-200" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                    <Clock size={12} /> {readingTime} MIN READ
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-10 leading-[1.05] tracking-tight serif">
                                {article.title}
                            </h1>

                            {/* AdSense Top Leaderboard */}
                            <AdSenseUnit
                                client_id={ADSENSE_CLIENT_ID}
                                slot_id={TOP_SLOT_ID}
                                format="horizontal"
                                className="mb-12"
                            />

                            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed mb-12 border-l-4 border-primary/20 pl-8 font-medium italic">
                                {article.meta_description}
                            </p>

                            <div className="flex items-center justify-between py-6 border-y border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <div>BY THE SENTINEL BUREAU <span className="text-gray-200 ml-3 mr-3">|</span> {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                <div className="flex gap-4">
                                    <Link href="#" className="hover:text-primary transition-colors">Digital Edition</Link>
                                    <Link href="#" className="hover:text-primary transition-colors">Reprints</Link>
                                </div>
                            </div>
                        </header>

                        {/* Featured Image */}
                        {article.image_url && (
                            <div className="mb-16">
                                <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
                                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                                </div>
                                <span className="block mt-4 text-[10px] font-bold text-gray-400 italic text-right uppercase tracking-widest">
                                    Generated by Global Market Intelligence for The Capital Sentinel
                                </span>
                            </div>
                        )}

                        <div
                            className="prose prose-xl prose-slate max-w-none serif-prose
                            prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tighter prose-headings:serif
                            prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:mb-8
                            prose-a:text-primary prose-a:font-bold prose-a:underline hover:prose-a:no-underline
                            prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
                            prose-img:rounded-2xl prose-img:shadow-lg
                            prose-table:border-collapse prose-table:w-full prose-table:my-12 prose-table:text-sm
                            prose-th:bg-gray-900 prose-th:p-4 prose-th:text-white prose-th:font-black prose-th:uppercase prose-th:tracking-widest
                            prose-td:p-4 prose-td:border prose-td:border-gray-200 prose-td:text-gray-700"
                        >
                            <div dangerouslySetInnerHTML={{ __html: firstPara }} />

                            {/* AdSense In-Article Ad */}
                            <AdSenseUnit
                                client_id={ADSENSE_CLIENT_ID}
                                slot_id={MID_CONTENT_SLOT_ID}
                                format="rectangle"
                                className="my-12"
                            />

                            <div dangerouslySetInnerHTML={{ __html: rest }} />
                        </div>

                        {/* Related Stories Section */}
                        {related && related.length > 0 && (
                            <section className="mt-24 pt-24 border-t border-gray-200">
                                <h3 className="text-2xl font-black text-gray-900 mb-12 uppercase tracking-tighter flex items-center gap-3">
                                    <LayoutGrid size={24} className="text-primary" /> Deeper Context
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {related.map(art => (
                                        <Link key={art.slug} href={`/articles/${art.slug}`} className="group">
                                            <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-gray-50">
                                                <img src={art.image_url || '/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            </div>
                                            <h4 className="text-sm font-black text-gray-900 leading-snug tracking-tight mb-2 group-hover:text-primary transition-colors serif">{art.title}</h4>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{art.category}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="col-span-12 lg:col-span-4 lg:pl-12 hidden lg:block">
                        <div className="sticky top-12 space-y-12">
                            {/* AdSense Sidebar Ad */}
                            <AdSenseUnit
                                client_id={ADSENSE_CLIENT_ID}
                                slot_id={SIDEBAR_SLOT_ID}
                                format="vertical"
                            />

                            {/* Trending in Category */}
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
                                    <TrendingUp size={14} className="text-primary" /> Trending Now
                                </h4>
                                <div className="space-y-8">
                                    {trending?.map((art, idx) => (
                                        <Link key={art.slug} href={`/articles/${art.slug}`} className="flex gap-4 group">
                                            <span className="text-2xl font-black text-gray-100 group-hover:text-primary transition-colors">{idx + 1}</span>
                                            <div>
                                                <h5 className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors leading-snug tracking-tight mb-1 serif">{art.title}</h5>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{art.category}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Keywords / Tags */}
                            <div className="p-8 border border-gray-100 rounded-2xl">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Subject Matter</h4>
                                <div className="flex flex-wrap gap-2">
                                    {article.keywords?.map((keyword: string) => (
                                        <span key={keyword} className="text-[10px] font-bold bg-white border border-gray-100 text-gray-400 px-3 py-1 rounded uppercase tracking-widest">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}
