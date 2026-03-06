import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Morph when scrolled past early hero
            if (window.scrollY > 80) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 w-[90%] max-w-5xl border ${scrolled
                    ? 'bg-deepvoid/80 backdrop-blur-xl border-plasma/30 shadow-[0_0_15px_rgba(123,97,255,0.2)] text-primary'
                    : 'bg-transparent text-primary border-transparent'
                }`}
        >
            <div className="flex items-center gap-1 font-heading font-bold text-lg tracking-tight">
                <span className="text-plasma drop-shadow-[0_0_5px_rgba(123,97,255,0.8)]">GEET</span>
                <span>REAL ESTATE</span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest uppercase text-primary/70">
                <a href="#features" className="hover:text-plasma hover:-translate-y-[1px] transition-all">Solutions</a>
                <a href="#philosophy" className="hover:text-plasma hover:-translate-y-[1px] transition-all">Philosophy</a>
                <a href="#protocol" className="hover:text-plasma hover:-translate-y-[1px] transition-all">Protocol</a>
            </div>

            <a
                href="#contact"
                className={`magnetic-btn rounded-full px-5 py-2.5 font-body font-medium text-sm transition-colors ${scrolled
                        ? 'bg-plasma text-deepvoid hover:bg-primary'
                        : 'bg-primary text-deepvoid hover:bg-plasma'
                    }`}
            >
                <span>Initialize Contact</span>
            </a>
        </nav>
    );
};

export default Navbar;
