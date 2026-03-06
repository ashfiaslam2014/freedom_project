import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const protocols = [
    {
        step: "01",
        title: "Market Sequence",
        desc: "Ingesting market arrays to establish high-fidelity property metrics and isolate price anomalies.",
        SvgAnim: () => (
            <svg className="w-full h-full text-plasma drop-shadow-[0_0_10px_rgba(123,97,255,0.8)] animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
                <circle cx="50" cy="50" r="30" strokeOpacity="0.5" stroke="#F0EFF4" />
                <circle cx="50" cy="50" r="20" strokeDasharray="2 4" stroke="#F0EFF4" />
                <path d="M50 10 L50 90 M10 50 L90 50" strokeOpacity="0.8" />
                {/* Central glowing core */}
                <circle cx="50" cy="50" r="5" fill="#7B61FF" className="animate-pulse" />
            </svg>
        )
    },
    {
        step: "02",
        title: "Neural Distribution",
        desc: "Transmitting encoded requirements across the UAE broker grid to unlock restricted asset layers.",
        SvgAnim: () => {
            const dots = Array.from({ length: 64 }).map((_, i) => ({
                x: (i % 8) * 12 + 8,
                y: Math.floor(i / 8) * 12 + 8
            }));
            return (
                <div className="relative w-full h-full bg-deepvoid/50 rounded-xl overflow-hidden border border-plasma/30">
                    <svg className="w-full h-full text-primary" viewBox="0 0 100 100" fill="currentColor">
                        {dots.map((d, i) => (
                            <circle key={i} cx={d.x} cy={d.y} r="1.5" className="opacity-20" />
                        ))}
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-plasma blur-[2px] animate-[scan_2.5s_ease-in-out_infinite] shadow-[0_0_10px_rgba(123,97,255,1)]" />
                    <style dangerouslySetInnerHTML={{
                        __html: `
            @keyframes scan {
              0%, 100% { transform: translateY(0); opacity: 0; }
              10% { opacity: 1; }
              50% { transform: translateY(100px); opacity: 1; }
              60% { opacity: 0; }
            }
          `}} />
                </div>
            );
        }
    },
    {
        step: "03",
        title: "Final Execution",
        desc: "Locking the transaction protocol with cryptographic precision, cementing the lowest commission margins.",
        SvgAnim: () => (
            <svg className="w-full h-full text-plasma drop-shadow-[0_0_15px_rgba(123,97,255,1)]" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path
                    d="M0 50 H60 L75 20 L100 90 L125 30 L140 50 H200"
                    className="animate-[dash_1.5s_linear_infinite]"
                    strokeDasharray="300"
                    strokeDashoffset="300"
                />
                {/* Faint background static heartbeat */}
                <path
                    d="M0 50 H60 L75 20 L100 90 L125 30 L140 50 H200"
                    strokeOpacity="0.1"
                    stroke="#F0EFF4"
                />
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        `}} />
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
                if (index === cards.length - 1) return;

                const nextCard = cards[index + 1];

                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.3,
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
        <section id="protocol" className="relative w-full bg-deepvoid pb-24 border-t border-plasma/10" ref={containerRef}>

            {protocols.map((protocol, index) => (
                <div
                    key={index}
                    className="protocol-card sticky top-0 h-screen w-full flex items-center justify-center p-6"
                >
                    <div className="w-full max-w-5xl h-[70vh] md:h-[60vh] premium-shadow bg-cardbg rounded-[3rem] border border-plasma/30 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center justify-between relative overflow-hidden">

                        {/* Background geometric flare inside card */}
                        <div className={`absolute -top-32 -left-32 w-64 h-64 bg-plasma rounded-full blur-[100px] opacity-10`} />

                        {/* Text Side */}
                        <div className="flex-1 flex flex-col gap-6 relative z-10">
                            <span className="font-mono text-sm tracking-widest text-plasma drop-shadow-[0_0_5px_rgba(123,97,255,0.5)]">Layer // {protocol.step}</span>
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary tracking-tight drop-shadow-[0_0_10px_rgba(240,239,244,0.2)]">
                                {protocol.title}
                            </h2>
                            <p className="font-mono text-xs md:text-sm text-primary/60 leading-relaxed max-w-md">
                                {'>'} {protocol.desc}
                            </p>
                        </div>

                        {/* Visual Side */}
                        <div className="flex-1 w-full h-full max-h-[300px] bg-deepvoid rounded-[2rem] p-8 flex items-center justify-center relative overflow-hidden border border-plasma/20 shadow-[inset_0_0_30px_rgba(123,97,255,0.05)] z-10">
                            <protocol.SvgAnim />
                            {/* Corner tech brackets */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-plasma/50"></div>
                            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-plasma/50"></div>
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-plasma/50"></div>
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-plasma/50"></div>
                        </div>

                    </div>
                </div>
            ))}

        </section>
    );
};

export default Protocol;
