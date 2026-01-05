import Link from 'next/link';
import { Zap, Shield, Mail, Twitter, Linkedin, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-primary/10 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all p-1">
                                <img src="/logo.png" alt="Capital Sentinel" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gradient-gold uppercase leading-none">Capital Sentinel</span>
                        </Link>
                        <p className="text-foreground/40 text-xs leading-relaxed max-w-sm mb-8 font-medium tracking-wide">
                            The world's first fully automated market intelligence bureau. Delivering high-authority, revenue-optimized insights powered by advanced predictive algorithms.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Linkedin, Globe].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-lg border border-primary/10 flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary/30 transition-all glass">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Intelligence Sectors</h4>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/40">
                            <li><Link href="/?category=Finance" className="hover:text-primary transition-colors">Wealth Management</Link></li>
                            <li><Link href="/?category=Tech" className="hover:text-primary transition-colors">Disruptive Tech</Link></li>
                            <li><Link href="/?category=Insurance" className="hover:text-primary transition-colors">Risk Mitigation</Link></li>
                            <li><Link href="/?category=Legal" className="hover:text-primary transition-colors">Policy Analysis</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Institutional</h4>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/40">
                            <li><Link href="/about" className="hover:text-primary transition-colors">The Bureau</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Protocol</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terminal Terms</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Secure Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-foreground/20">
                    <div className="flex items-center gap-2">
                        <Shield size={12} className="text-primary/40" />
                        Institutional Grade Intelligence • © {new Date().getFullYear()} Capital Sentinel
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/sitemap.xml" className="hover:text-primary transition-colors">Archive Index</Link>
                        <span className="w-1 h-1 bg-primary/20 rounded-full" />
                        <span className="text-primary/40">Powered by Wealth-Miner v4.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
