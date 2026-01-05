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
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-background">
      {/* Breaking News Ticker */}
      <div className="news-ticker-bg overflow-hidden py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
          <div className="flex-shrink-0 flex items-center gap-2 bg-primary px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter text-background">
            <Zap size={14} fill="currentColor" /> Breaking
          </div>
          <div className="flex-grow overflow-hidden relative">
            <div className="flex gap-12 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
              {tickerArticles.map((art) => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="text-foreground/80 hover:text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full" /> {art.title}
                </Link>
              ))}
              {/* Duplicate for infinite effect */}
              {tickerArticles.map((art) => (
                <Link key={`dup-${art.id}`} href={`/articles/${art.slug}`} className="text-foreground/80 hover:text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full" /> {art.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-12 gap-12">

          {/* Main Column */}
          <div className="col-span-12 lg:col-span-8">
            {/* Featured Hero */}
            {featured && (
              <div className="mb-24 relative">
                <Link href={`/articles/${featured.slug}`} className="group relative block overflow-hidden rounded-[2rem] border border-primary/10 shadow-premium">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    {featured.image_url ? (
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface">
                        <Zap className="text-primary/10" size={120} />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                    <span className="bg-primary text-background px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block shadow-gold">
                      {featured.category}
                    </span>
                    <h2 className="text-4xl md:text-7xl font-black text-foreground mb-6 leading-[0.9] tracking-tighter serif group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-foreground/60 text-lg md:text-xl leading-relaxed mb-8 line-clamp-2 max-w-2xl font-medium">
                      {featured.meta_description}
                    </p>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                      <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> 6 MIN READ</span>
                      <span className="h-4 w-px bg-primary/20" />
                      <span className="text-primary">LATEST INTEL</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Content Feed */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-16 px-4 py-6 rounded-3xl bg-surface border border-primary/10">
                <h3 className="text-2xl font-black text-gradient-gold uppercase tracking-tighter italic">Intelligence Matrix</h3>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                  <BarChart3 size={16} /> LIVE DATA STREAM
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {listArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className="group flex flex-col p-6 rounded-[2rem] bg-surface/50 border border-transparent hover:border-primary/20 hover:bg-surface transition-all duration-500 shadow-premium">
                    <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
                      <img
                        src={article.image_url || '/placeholder.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">
                      {article.category}
                    </span>
                    <h4 className="text-2xl font-black text-foreground mb-6 leading-tight group-hover:text-gradient-gold transition-all duration-300 serif">
                      {article.title}
                    </h4>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                        <Clock size={14} className="text-primary/60" />
                        {new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {(!articles || articles.length === 0) && (
                <div className="py-32 text-center bg-surface rounded-[3rem] border border-primary/5 shadow-premium">
                  <div className="mb-8 relative inline-block">
                    <Zap className="text-primary/20 animate-pulse" size={80} />
                    <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-20" />
                  </div>
                  <p className="text-foreground/40 font-black tracking-[0.3em] uppercase text-xs">Syncing Global Markets...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 lg:pl-12 hidden lg:block">
            {/* Newsletter widget */}
            <div className="mb-16 p-10 rounded-[2.5rem] glass relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
              <h4 className="text-2xl font-black text-foreground mb-4 serif leading-tight">The Wealth Whisperer</h4>
              <p className="text-foreground/60 text-sm mb-8 leading-relaxed">Exclusive financial intelligence delivered to the elite.</p>
              <div className="relative">
                <input type="email" placeholder="SECURE EMAIL" className="w-full bg-background/50 border border-primary/10 rounded-2xl px-6 py-4 text-[10px] font-black tracking-widest text-foreground outline-none focus:border-primary/40 transition-all" />
                <button className="absolute right-2 top-2 bottom-2 bg-primary text-background px-6 rounded-xl hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest shadow-gold">JOIN</button>
              </div>
            </div>

            {/* Trending widget */}
            <div className="mb-16 space-y-12">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-10 flex items-center gap-3">
                <TrendingUp size={16} className="text-primary" /> Authority Trends
              </h4>
              <div className="space-y-10">
                {articles?.slice(0, 5).map((art, idx) => (
                  <Link key={art.id} href={`/articles/${art.slug}`} className="flex gap-6 group">
                    <span className="text-4xl font-black text-foreground/5 group-hover:text-primary transition-colors serif italic">{idx + 1}</span>
                    <div className="pt-1">
                      <h5 className="text-base font-black text-foreground group-hover:text-primary transition-all duration-300 leading-snug tracking-tight mb-3 serif">{art.title}</h5>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">{art.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category widget */}
            <div className="bg-surface/50 p-10 rounded-[2.5rem] border border-primary/5 shadow-premium">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-10">Sector Intelligence</h4>
              <div className="grid grid-cols-1 gap-3">
                {categories.map(cat => (
                  <Link
                    key={cat}
                    href={`/?category=${cat}`}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center justify-between group ${category === cat ? 'bg-primary text-background shadow-gold' : 'bg-background/40 text-foreground/60 hover:bg-background hover:text-primary hover:border-primary/20 border border-transparent'}`}
                  >
                    <span>{cat}</span>
                    <ChevronRight size={14} className={`transition-transform group-hover:translate-x-1 ${category === cat ? 'text-background' : 'text-primary/40'}`} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/sitemap.xml" className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground/20 hover:text-primary transition-all flex items-center justify-center gap-3">
                Global Archives <ArrowRight size={12} className="text-primary/40" />
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </main>

  );
}
