import { Shield } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <main className="bg-white min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-16 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3 text-primary mb-4">
                        <Shield size={24} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance & Safety</span>
                    </div>
                    <h1 className="text-5xl font-black serif text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Last Updated: January 2026</p>
                </header>

                <div className="prose prose-xl prose-slate max-w-none serif-prose 
                    prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tighter prose-headings:serif
                    prose-p:text-gray-600 prose-p:leading-relaxed">
                    <h2>1. Data Collection</h2>
                    <p>
                        The Capital Sentinel utilizes automated systems to aggregate search trends and generate reporting.
                        We do not collect personal identifiers from casual readers unless explicitly provided via subscription forms.
                    </p>

                    <h2>2. Tracking & AdSense</h2>
                    <p>
                        This site uses Google AdSense to serve advertisements. Google may use cookies to serve ads based on
                        a user's previous visits to this or other websites. Users may opt-out of personalized advertising
                        by visiting Google's Ad Settings.
                    </p>

                    <h2>3. AI-Generated Content</h2>
                    <p>
                        The content on this platform is generated using Large Language Models (LLMs) and automated data extraction.
                        While we strive for high-quality intelligence, we do not guarantee the absolute accuracy of real-time
                        automated reports.
                    </p>

                    <h2>4. Your Rights</h2>
                    <p>
                        In accordance with global privacy standards, users have the right to visit our portal anonymously.
                        We respect "Do Not Track" signals and similar browser-level privacy controls.
                    </p>
                </div>
            </div>
        </main>
    );
}
