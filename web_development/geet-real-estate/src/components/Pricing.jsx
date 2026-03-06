import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
        <section id="contact" ref={containerRef} className="py-24 px-6 md:px-[10vw] bg-ivory">
            <div className="max-w-7xl mx-auto">
                <div className="w-full bg-slate/5 rounded-[3rem] border border-slate/10 p-12 md:p-24 flex flex-col items-center justify-center text-center relative overflow-hidden">

                    {/* Subtle noise over the card */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] mix-blend-overlay"></div>

                    <span className="cta-elem font-mono text-xs text-accent uppercase tracking-widest mb-6">Initialize Enquiry</span>

                    <h2 className="cta-elem font-heading font-bold text-4xl md:text-6xl text-obsidian tracking-tight mb-8">
                        Start your search <span className="font-drama italic text-slate/50 font-normal">today.</span>
                    </h2>

                    <p className="cta-elem font-body text-lg text-slate/70 max-w-xl mx-auto mb-10 text-balance">
                        Speak directly with our senior property consultants to outline your required specifications and market targets.
                    </p>

                    <button className="cta-elem magnetic-btn bg-obsidian text-ivory px-10 py-5 rounded-full font-body font-semibold tracking-wide hover:text-champagne transition-colors shadow-xl shadow-obsidian/10 flex items-center gap-3 group">
                        Book a Callback
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
