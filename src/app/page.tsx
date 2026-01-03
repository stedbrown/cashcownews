import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Clock, Zap, Newspaper, Mail, ChevronRight, BarChart3 } from 'lucide-react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let query = supabase
    .from('articles')
    .select('id, slug, title, category, published_at, image_url, meta_description')
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data: articles } = await query.limit(15);
  const tickerArticles = articles?.slice(0, 5) || [];
  const featured = articles?.[0];
  const listArticles = articles?.slice(1) || [];

  const categories = ['Finance', 'Tech', 'Insurance', 'Legal', 'Software'];

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* Breaking News Ticker */}
      <div className="bg-gray-900 border-y border-gray-800 overflow-hidden py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
          <div className="flex-shrink-0 flex items-center gap-2 bg-primary px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter text-white">
            <Zap size={14} fill="currentColor" /> Breaking
          </div>
          <div className="flex-grow overflow-hidden relative">
            <div className="flex gap-12 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
              {tickerArticles.map((art) => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                  <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" /> {art.title}
                </Link>
              ))}
              {/* Duplicate for infinite effect */}
              {tickerArticles.map((art) => (
                <Link key={`dup-${art.id}`} href={`/articles/${art.slug}`} className="text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                  <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" /> {art.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-12">

          {/* Main Column */}
          <div className="col-span-12 lg:col-span-8">
            {/* Main Story Wrapper */}
            {featured && (
              <div className="mb-16">
                <Link href={`/articles/${featured.slug}`} className="group block">
                  <div className="relative aspect-[16/9] w-full bg-gray-50 rounded-2xl overflow-hidden mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    {featured.image_url ? (
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <Zap className="text-white/10" size={80} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {featured.category}
                      </span >
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight group-hover:text-primary transition-colors serif">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-6 line-clamp-3">
                    {featured.meta_description}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> 6 MIN READ</span>
                    <span className="h-4 w-px bg-gray-200" />
                    <span>BY THE SENTINEL BUREAU</span>
                    <span className="h-4 w-px bg-gray-200" />
                    <span className="text-primary">LATEST STORY</span>
                  </div>
                </Link>
              </div>
            )}

            {/* Sub Grid */}
            <div className="border-t border-gray-100 pt-16">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Current Intelligence</h3>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                  <BarChart3 size={14} /> LIVE TRENDS
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {listArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className="group flex flex-col">
                    <div className="aspect-[3/2] w-full rounded-xl overflow-hidden bg-gray-50 mb-6 shadow-sm group-hover:shadow-lg transition-all">
                      <img
                        src={article.image_url || '/placeholder.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">
                      {article.category}
                    </span>
                    <h4 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors serif">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <Clock size={12} />
                      {new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </Link>
                ))}
              </div>

              {(!articles || articles.length === 0) && (
                <div className="py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                  <Newspaper className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-400 font-bold tracking-tight">Syncing with global markets...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 lg:pl-12 border-l border-gray-100 hidden lg:block">


            {/* Trending widget */}
            <div className="mb-12">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> Most Critical Stories
              </h4>
              <div className="space-y-8">
                {articles?.slice(0, 5).map((art, idx) => (
                  <Link key={art.id} href={`/articles/${art.slug}`} className="flex gap-4 group">
                    <span className="text-3xl font-black text-gray-100 group-hover:text-primary transition-colors">{idx + 1}</span>
                    <div>
                      <h5 className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors leading-snug tracking-tight mb-2 serif">{art.title}</h5>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{art.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category widget */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Intelligence Sectors</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Link
                    key={cat}
                    href={`/?category=${cat}`}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-primary text-white' : 'bg-white border border-gray-100 text-gray-500 hover:border-primary hover:text-primary'}`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/sitemap.xml" className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-primary transition-colors flex items-center justify-center gap-2">
                View Global Archives <ArrowRight size={12} />
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
