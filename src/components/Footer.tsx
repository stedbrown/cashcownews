import Link from 'next/link';
import { Zap, Twitter, Mail, Shield } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
                    <div className="max-w-sm">
                        <Link href="/" className="flex items-center gap-2 mb-8 group">
                            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                                <Zap className="text-white fill-white" size={20} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter serif">CASH<span className="text-primary">COW</span></span>
                        </Link>
                        <p className="text-gray-400 text-xs leading-relaxed mb-8 uppercase font-bold tracking-[0.1em]">
                            Global Content Engine powered by GPT-4o & DALL-E 3.
                            Processed in Real-Time from Google Trends RSS.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 border border-gray-100 rounded hover:border-primary transition-colors text-gray-400 hover:text-primary">
                                <Twitter size={16} />
                            </Link>
                            <Link href="#" className="p-2 border border-gray-100 rounded hover:border-primary transition-colors text-gray-400 hover:text-primary">
                                <Mail size={16} />
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-12 sm:gap-24">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6 pb-2 border-b border-gray-100">Intelligence</h4>
                            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <li><Link href="/?category=Finance" className="hover:text-primary transition-colors">Finance</Link></li>
                                <li><Link href="/?category=Tech" className="hover:text-primary transition-colors">Markets</Link></li>
                                <li><Link href="/?category=Insurance" className="hover:text-primary transition-colors">Risk</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6 pb-2 border-b border-gray-100">Legal</h4>
                            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                                <li><Link href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    <div>
                        © {new Date().getFullYear()} Cash Cow Intelligence Network.
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Shield size={12} className="text-primary" /> Verified Secure Content
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
