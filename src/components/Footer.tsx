import Link from 'next/link';
import { Zap, Shield } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
                    <div className="max-w-md">
                        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
                            <div className="bg-black p-1.5 rounded transition-colors group-hover:bg-primary">
                                <Zap className="text-white fill-white" size={18} />
                            </div>
                            <span className="text-2xl font-black tracking-[0.05em] serif">
                                THE CAPITAL <span className="text-primary">SENTINEL</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-[11px] leading-loose uppercase font-medium tracking-[0.15em] max-w-xs">
                            Automated Market Intelligence.<br />
                            Strategic Global Analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-24">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-900 mb-8">Intelligence</h4>
                            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                <li><Link href="/?category=Finance" className="hover:text-black transition-colors">Finance</Link></li>
                                <li><Link href="/?category=Tech" className="hover:text-black transition-colors">Markets</Link></li>
                                <li><Link href="/?category=Insurance" className="hover:text-black transition-colors">Risk</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-900 mb-8">Institutional</h4>
                            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
                                <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-black transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300">
                    <div>
                        © {new Date().getFullYear()} The Capital Sentinel Bureau.
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2.5 text-gray-400">
                            <Shield size={10} className="text-gray-400" />
                            Institutional Grade Content
                        </div>
                        <Link href="/sitemap.xml" className="hover:text-black transition-colors">Digital Archive</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
