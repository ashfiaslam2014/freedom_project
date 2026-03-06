import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const protocols = [
    {
        step: "01",
        title: "Discovery & Valuation",
        desc: "Analyzing market data to establish baseline property metrics and pinpoint optimal pricing structures.",
        SvgAnim: () => (
            <svg className="w-full h-full text-obsidian animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
                <circle cx="50" cy="50" r="30" strokeOpacity="0.5" />
                <circle cx="50" cy="50" r="20" strokeDasharray="2 4" />
                <path d="M50 10 L50 90 M10 50 L90 50" strokeOpacity="0.2" />
            </svg>
        )
    },
    {
        step: "02",
        title: "Network Syndication",
        desc: "Broadcasting requirements across exclusive UAE broker networks to secure premium off-market access.",
        SvgAnim: () => {
            const dots = Array.from({ length: 64 }).map((_, i) => ({
                x: (i % 8) * 12 + 8,
                y: Math.floor(i / 8) * 12 + 8
            }));
            return (
                <div className="relative w-full h-full bg-ivory/50 rounded-xl overflow-hidden border border-slate/10">
                    <svg className="w-full h-full text-obsidian" viewBox="0 0 100 100" fill="currentColor">
                        {dots.map((d, i) => (
                            <circle key={i} cx={d.x} cy={d.y} r="1.5" className="opacity-20" />
                        ))}
                    </svg>
                    {/* Scanning Laser */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-accent blur-[1px] animate-[scan_3s_ease-in-out_infinite]" />
                </div>
            );
        }
    },
    {
        step: "03",
        title: "Closing Execution",
        desc: "Finalizing rigorous transactions with precision, ensuring the lowest commission margins guaranteed.",
        SvgAnim: () => (
            <svg className="w-full h-full text-accent" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path
                    d="M0 50 H60 L75 20 L100 90 L125 30 L140 50 H200"
                    className="animate-[dash_2s_linear_infinite]"
                    strokeDasharray="300"
                    strokeDashoffset="300"
                />
            </svg>
        )
    }
];

const Protocol = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.protocol-card');

            cards.forEach((card, index) => {
                if (index === cards.length - 1) return; // Last card doesn't scale down

                const nextCard = cards[index + 1];

                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.5,
                    filter: 'blur(20px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: nextCard,
                        start: 'top bottom',
                        end: 'top top',
                        scrub: true,
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="protocol" className="relative w-full bg-ivory pb-24" ref={containerRef}>

            {protocols.map((protocol, index) => (
                <div
                    key={index}
                    className="protocol-card sticky top-0 h-screen w-full flex items-center justify-center p-6"
                >
                    {/* Card Container constraints equivalent to 'max-w-5xl' */}
                    <div className="w-full max-w-5xl h-[70vh] md:h-[60vh] premium-shadow bg-background rounded-[3rem] border border-slate/10 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center justify-between">

                        {/* Text Side */}
                        <div className="flex-1 flex flex-col gap-6">
                            <span className="font-mono text-sm tracking-widest text-slate/40">Step // {protocol.step}</span>
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-obsidian tracking-tight">
                                {protocol.title}
                            </h2>
                            <p className="font-body text-slate/70 text-lg md:text-xl leading-relaxed max-w-md">
                                {protocol.desc}
                            </p>
                        </div>

                        {/* Visual Side */}
                        <div className="flex-1 w-full h-full max-h-[300px] bg-slate/5 rounded-[2rem] p-8 flex items-center justify-center relative overflow-hidden border border-slate/10">
                            <protocol.SvgAnim />
                        </div>

                    </div>
                </div>
            ))}

        </section>
    );
};

export default Protocol;
