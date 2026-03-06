import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Pricing = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.cta-elem', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" ref={containerRef} className="py-24 px-6 md:px-[10vw] bg-deepvoid border-t border-plasma/10">
            <div className="max-w-7xl mx-auto">
                <div className="w-full bg-cardbg rounded-[3rem] border border-plasma/30 p-12 md:p-24 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_50px_rgba(123,97,255,0.05)]">

                    {/* Neon Grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(123,97,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(123,97,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" style={{ maskImage: 'radial-gradient(circle at center, black, transparent 70%)' }}></div>

                    {/* Subtle noise */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] mix-blend-screen"></div>

                    <span className="cta-elem font-mono text-xs text-plasma uppercase tracking-widest mb-6 flex items-center justify-center gap-2 drop-shadow-[0_0_5px_rgba(123,97,255,0.8)]">
                        <span className="w-2 h-2 rounded-full bg-plasma animate-pulse inline-block"></span>
                        Establish Connection
                    </span>

                    <h2 className="cta-elem font-heading font-bold text-4xl md:text-6xl text-primary tracking-tight mb-8">
                        Access the <span className="font-drama italic text-plasma drop-shadow-[0_0_15px_rgba(123,97,255,0.5)]">Network.</span>
                    </h2>

                    <p className="cta-elem font-mono text-sm text-primary/60 max-w-xl mx-auto mb-10 text-balance leading-relaxed">
                        {'>'} Initialize direct communications with our core property algorithms and elite human consultants.
                    </p>

                    <button className="cta-elem magnetic-btn bg-plasma text-deepvoid px-10 py-5 rounded-full font-body font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(123,97,255,0.6)] transition-all flex items-center gap-3 group relative z-10 border border-plasma">
                        Initiate Sequence
                        <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>

                </div>
            </div>
        </section>
    );
};

export default Pricing;
