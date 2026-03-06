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
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
                    alt="Luxury Architecture"
                    className="w-full h-full object-cover object-center grayscale-[0.2]"
                />
                {/* Heavy primary-to-black gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent"></div>
                <div className="absolute inset-0 bg-obsidian/20 mix-blend-multiply"></div>
            </div>

            {/* Content wrapper */}
            <div className="relative z-10 max-w-4xl text-ivory">
                <h1 className="flex flex-col gap-2">
                    <span className="hero-elem font-heading font-bold text-3xl md:text-5xl lg:text-7xl tracking-tighter block text-balance">
                        Unparalleled access meets
                    </span>
                    <span className="hero-elem font-drama italic text-5xl md:text-7xl lg:text-9xl text-champagne block pr-4">
                        Exceptional living.
                    </span>
                </h1>

                <p className="hero-elem mt-8 max-w-lg font-body text-base md:text-xl text-ivory/80 leading-relaxed text-balance">
                    Geet Real Estate provides premier solutions in the UAE.
                    Rent, buy, or lease prestige properties at the lowest rates and commissions.
                </p>

                <div className="hero-elem mt-12 flex items-center gap-4">
                    <a href="#contact" className="magnetic-btn bg-accent text-obsidian px-8 py-4 rounded-full font-body font-semibold tracking-wide hover:bg-ivory transition-colors">
                        <span>Book a Callback</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
