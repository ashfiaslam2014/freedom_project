import { useEffect, useState } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route/hash change
    const handleNavClick = () => setMenuOpen(false);

    return (
        <>
            <nav
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 w-[90%] max-w-5xl ${scrolled
                        ? 'bg-ivory/60 backdrop-blur-xl border border-slate/10 shadow-sm text-obsidian'
                        : 'bg-transparent text-ivory border border-transparent'
                    }`}
            >
                <div className="flex items-center gap-1 font-heading font-bold text-lg tracking-tight">
                    <span className="text-accent">Geet</span>
                    <span>Real Estate</span>
                </div>

                <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest uppercase">
                    <a href="#features" className="hover:-translate-y-[1px] transition-transform">Solutions</a>
                    <a href="#philosophy" className="hover:-translate-y-[1px] transition-transform">Philosophy</a>
                    <a href="#protocol" className="hover:-translate-y-[1px] transition-transform">Protocol</a>
                </div>

                <a
                    href="#contact"
                    className={`hidden md:flex magnetic-btn rounded-full px-5 py-2.5 font-body font-medium text-sm transition-colors ${scrolled
                            ? 'bg-obsidian text-ivory hover:text-champagne'
                            : 'bg-champagne text-obsidian hover:text-ivory'
                        }`}
                >
                    <span>Book Enquiry</span>
                </a>

                {/* Hamburger — mobile only */}
                <button
                    className="md:hidden flex flex-col gap-[5px] p-2 -mr-1"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-5 h-[1.5px] transition-all duration-300 ${scrolled ? 'bg-obsidian' : 'bg-ivory'} ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                    <span className={`block w-5 h-[1.5px] transition-all duration-300 ${scrolled ? 'bg-obsidian' : 'bg-ivory'} ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-5 h-[1.5px] transition-all duration-300 ${scrolled ? 'bg-obsidian' : 'bg-ivory'} ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                </button>
            </nav>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-40 flex flex-col justify-center items-center gap-10 bg-obsidian/95 backdrop-blur-xl transition-all duration-500 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <a href="#features" onClick={handleNavClick} className="font-mono text-sm uppercase tracking-widest text-ivory hover:text-champagne transition-colors">Solutions</a>
                <a href="#philosophy" onClick={handleNavClick} className="font-mono text-sm uppercase tracking-widest text-ivory hover:text-champagne transition-colors">Philosophy</a>
                <a href="#protocol" onClick={handleNavClick} className="font-mono text-sm uppercase tracking-widest text-ivory hover:text-champagne transition-colors">Protocol</a>
                <a
                    href="#contact"
                    onClick={handleNavClick}
                    className="magnetic-btn mt-4 bg-champagne text-obsidian px-8 py-4 rounded-full font-body font-semibold tracking-wide hover:bg-ivory transition-colors"
                >
                    <span>Book Enquiry</span>
                </a>
            </div>
        </>
    );
};

export default Navbar;
