import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Philosophy = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Background Parallax
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

            // SplitText style reveal line by line
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

    const focusStatementWords = "lowest market rates and".split(" ");

    return (
        <section
            id="philosophy"
            ref={sectionRef}
            className="relative w-full py-32 md:py-48 bg-obsidian overflow-hidden flex items-center justify-center min-h-screen"
        >
            {/* Background Texture (Dark luxury interior / shadows) */}
            <div className="absolute inset-0 z-0 h-[120%] -top-[10%] w-full" ref={bgRef}>
                <img
                    src="https://images.unsplash.com/photo-1600607688066-890987f18a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Luxury Abstract Interior"
                    className="w-full h-full object-cover grayscale-[0.5] opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 w-full" ref={textRef}>
                <div className="flex flex-col gap-12 text-center md:text-left">

                    <div className="overflow-hidden">
                        <h2 className="phil-line font-heading font-medium text-xl md:text-3xl text-slate tracking-tight">
                            Most real estate focuses on: <span className="text-ivory/60">High commissions and rigid transactions.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="overflow-hidden">
                            <h2 className="phil-line font-drama italic text-4xl md:text-6xl lg:text-8xl text-ivory tracking-tight">
                                We focus on:
                            </h2>
                        </div>
                        <div className="overflow-hidden mt-4">
                            <h2 className="phil-line font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-ivory flex flex-wrap gap-x-4 gap-y-2 leading-tight">
                                {focusStatementWords.map((word, i) => (
                                    <span key={i}>{word}</span>
                                ))}
                                <span className="text-champagne block mt-2 md:mt-0 font-drama italic md:text-8xl">client transparency.</span>
                            </h2>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Philosophy;
