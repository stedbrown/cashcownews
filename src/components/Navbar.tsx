import { Zap, Menu, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <nav className="bg-white border-b border-gray-200">
            {/* Top Utility Bar */}
            <div className="border-b border-gray-100 py-2 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <div className="flex gap-6">
                        <span>{today}</span>
                        <span className="flex items-center gap-1"><Globe size={10} /> International Edition</span>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                        <Link href="/subscribe" className="bg-primary text-white px-3 py-1 -mt-1 rounded font-black hover:bg-gray-900 transition-colors">Subscribe</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-3 group mb-8">
                    <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                        <Zap className="text-white fill-white" size={28} />
                    </div>
                    <span className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter serif">
                        CASH<span className="text-primary">COW</span>
                    </span>
                </Link>

                {/* Sub Navigation */}
                <div className="w-full flex justify-between items-center border-y border-gray-100 py-3">
                    <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900">
                        <Menu size={18} /> Sections
                    </button>

                    <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-gray-500">
                        <Link href="/?category=Finance" className="hover:text-primary transition-colors">Finance</Link>
                        <Link href="/?category=Tech" className="hover:text-primary transition-colors">Markets</Link>
                        <Link href="/?category=Insurance" className="hover:text-primary transition-colors">Risk</Link>
                        <Link href="/?category=Legal" className="hover:text-primary transition-colors">Policy</Link>
                        <Link href="/?category=Software" className="hover:text-primary transition-colors">Innovation</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Intelligence</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
