import { Zap, Target, Award, Mail } from 'lucide-react';

export default function AboutPage() {
    const siteName = "CASH COW INTELLIGENCE";
    const domain = "cashcow.news"; // Placeholder domain

    return (
        <main className="bg-[#FDFDFD] min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-20 border-b border-gray-100 pb-12 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 text-primary mb-12">
                        <div className="bg-primary p-2 rounded-lg">
                            <Zap className="text-white fill-white" size={24} />
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 leading-none">
                            Institutional Profile
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black serif text-gray-900 mb-8 leading-[1.05] tracking-tight">
                        About {siteName}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 serif italic leading-relaxed max-w-2xl mx-auto md:mx-0">
                        Bridging the gap between raw global data and actionable strategic intelligence.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <Target size={20} />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 pt-0.5">Our Mission</h2>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed serif-prose">
                            Fornire analisi finanziarie e tecnologiche in tempo reale guidate dai dati.
                            In un'epoca di sovraccarico informativo, la nostra missione è filtrare il rumore per
                            estrarre il segnale più puro per i nostri lettori.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <Zap size={20} />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 pt-0.5">The Methodology</h2>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed serif-prose">
                            Utilizziamo algoritmi avanzati e intelligenza artificiale per analizzare migliaia di segnali
                            di mercato globali e fornire report sintetici e azionabili. La nostra engine 24/7
                            scansiona i trend emergenti prima che diventino mainstream.
                        </p>
                    </section>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-12 mb-24 shadow-sm">
                    <div className="flex items-center gap-3 text-primary mb-8">
                        <Award size={24} />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Editorial Standards</h2>
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none serif-prose prose-p:text-gray-600">
                        <p>
                            Ci impegniamo per l'accuratezza e l'obiettività dei dati. Ogni report generato dal nostro engine
                            AI è programmato per rispettare i più alti standard di neutralità editoriale. Sebbene il nostro
                            flusso sia completamente automatizzato, i modelli sono istruiti per prioritizzare fonti verificate
                            e dati strutturati.
                        </p>
                    </div>
                </div>

                <footer className="pt-12 border-t border-gray-100 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 text-primary mb-6">
                        <Mail size={20} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Reach the Desk</h3>
                    </div>
                    <p className="text-gray-400 text-sm serif italic mb-4">
                        Per richieste stampa o informazioni di carattere editoriale:
                    </p>
                    <a
                        href={`mailto:press@${domain}`}
                        className="text-2xl font-black text-gray-900 hover:text-primary transition-colors border-b-2 border-primary/20 hover:border-primary pb-1"
                    >
                        press@{domain}
                    </a>
                </footer>
            </div>
        </main>
    );
}
