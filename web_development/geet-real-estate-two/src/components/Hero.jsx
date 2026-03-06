import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Staggered fade up for text elements
            gsap.from('.hero-elem', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.2
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative h-[100dvh] w-full flex flex-col justify-end pb-[15vh] px-8 md:px-[10vw] overflow-hidden"
        >
            {/* Background Image - Neon bioluminescence/dark water vibe */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Bioluminescence City Neon Architecture"
                    className="w-full h-full object-cover object-center grayscale-[0.2]"
                />
                {/* Heavy primary-to-black gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deepvoid via-deepvoid/80 to-transparent"></div>
                <div className="absolute inset-0 bg-deepvoid/30 mix-blend-multiply border-b border-plasma/20"></div>
                {/* Subtle grid pattern over the image */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(123,97,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(123,97,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" style={{ maskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}></div>
            </div>

            {/* Content wrapper */}
            <div className="relative z-10 max-w-4xl text-primary">
                <h1 className="flex flex-col gap-2">
                    <span className="hero-elem font-heading font-bold text-3xl md:text-5xl lg:text-7xl tracking-tighter block text-balance">
                        Real estate access beyond
                    </span>
                    <span className="hero-elem font-drama italic text-5xl md:text-7xl lg:text-9xl text-plasma block drop-shadow-[0_0_20px_rgba(123,97,255,0.6)]">
                        Limitations.
                    </span>
                </h1>

                <p className="hero-elem mt-8 max-w-lg font-mono text-xs md:text-sm text-primary/70 leading-relaxed text-balance">
                    <span className="text-plasma mr-2">{'>'}</span>
                    Geet Real Estate provides precision-engineered solutions in the UAE.
                    Rent, buy, or lease prestige properties at optimal commission architectures.
                </p>

                <div className="hero-elem mt-12 flex items-center gap-4">
                    <a href="#contact" className="magnetic-btn bg-plasma text-deepvoid px-8 py-4 rounded-full font-body font-semibold tracking-wide border border-plasma shadow-[0_0_15px_rgba(123,97,255,0.3)] hover:shadow-[0_0_30px_rgba(123,97,255,0.6)] transition-all">
                        <span>Initiate Callback</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
