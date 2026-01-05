import { Zap, Menu, Phone, Mail, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const categories = ['Finance', 'Tech', 'Insurance', 'Legal', 'Software'];

    return (
        <nav className="border-b border-primary/10 glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-10 md:w-12 h-10 md:h-12 bg-white rounded-xl overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all shadow-gold p-1.5 bg-gradient-to-br from-white to-gray-200">
                        <img src="/logo.png" alt="Capital Sentinel" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black tracking-tighter text-gradient-gold uppercase leading-none">Capital Sentinel</span>
                        <span className="text-[10px] font-black tracking-[0.4em] text-primary/60 uppercase leading-none mt-1.5 hidden md:block">Wealth Intelligence</span>
                    </div>
                </Link>

                {/* Navigation Desktop */}
                <div className="hidden lg:flex items-center gap-10">
                    {categories.map(cat => (
                        <Link
                            key={cat}
                            href={`/?category=${cat}`}
                            className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-all relative group"
                        >
                            {cat}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <button className="text-foreground/40 hover:text-primary transition-colors hidden md:block">
                        <Search size={20} />
                    </button>
                    <button className="bg-primary text-background px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-gold active:scale-95">
                        Subscribe
                    </button>
                    <button className="text-foreground/60 md:hidden lg:hidden">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
