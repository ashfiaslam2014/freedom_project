import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Philosophy = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Parallax
            gsap.to(bgRef.current, {
                y: '20%',
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });

            // SplitText style reveal
            const lines = gsap.utils.toArray('.phil-line');

            gsap.from(lines, {
                y: 60,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 80%',
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const statement2 = "We focus on: algorithmic precision and ".split(" ");

    return (
        <section
            id="philosophy"
            ref={sectionRef}
            className="relative w-full py-32 md:py-48 bg-deepvoid overflow-hidden flex items-center justify-center min-h-screen border-t border-plasma/10"
        >
            {/* Background Texture (Microscopy or dark water vibe) */}
            <div className="absolute inset-0 z-0 h-[120%] -top-[10%] w-full" ref={bgRef}>
                <img
                    src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Dark Abstract Liquid"
                    className="w-full h-full object-cover grayscale-[0.8] opacity-30 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-deepvoid via-transparent to-deepvoid"></div>
                {/* Vapor Clinic glow */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-plasma/10 blur-[150px] rounded-full pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 w-full" ref={textRef}>
                <div className="flex flex-col gap-12 text-center md:text-left">

                    <div className="overflow-hidden">
                        <h2 className="phil-line font-mono text-sm md:text-base text-plasma tracking-widest uppercase items-center gap-3">
                            <span className="w-4 h-4 inline-block bg-plasma rounded-full border border-primary animate-pulse mr-2"></span>
                            System Paradigm
                        </h2>
                    </div>

                    <div className="overflow-hidden mt-8">
                        <h2 className="phil-line font-heading font-medium text-xl md:text-3xl text-primary/40 tracking-tight">
                            Most platforms focus on: <span className="text-primary/80 drop-shadow-[0_0_5px_rgba(240,239,244,0.3)]">Opaque networks and high latency.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <div className="overflow-hidden">
                            <h2 className="phil-line font-drama italic text-4xl md:text-6xl lg:text-8xl text-primary tracking-tight">
                                We focus on:
                            </h2>
                        </div>
                        <div className="overflow-hidden mt-4">
                            <h2 className="phil-line font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-primary flex flex-wrap gap-x-4 gap-y-2 leading-tight">
                                {statement2.map((word, i) => (
                                    <span key={i} className="drop-shadow-[0_0_10px_rgba(240,239,244,0.3)]">{word}</span>
                                ))}
                                <span className="text-plasma block mt-2 md:mt-0 font-drama italic md:text-8xl drop-shadow-[0_0_20px_rgba(123,97,255,0.6)]">absolute clarity.</span>
                            </h2>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Philosophy;
