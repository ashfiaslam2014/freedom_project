import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-deepvoid text-primary/70 rounded-t-[4rem] px-8 md:px-[10vw] pt-24 pb-12 relative overflow-hidden border-t-2 border-plasma/20 shadow-[0_-10px_30px_rgba(123,97,255,0.05)]">

            {/* Structural Data Lines */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                <div className="absolute top-0 left-[20%] w-[1px] h-full bg-plasma"></div>
                <div className="absolute top-0 left-[50%] w-[1px] h-full bg-plasma"></div>
                <div className="absolute top-0 right-[20%] w-[1px] h-full bg-plasma"></div>
            </div>

            {/* Footer Content Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24 relative z-10">

                {/* Brand */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex flex-col font-heading font-bold text-3xl tracking-tight text-primary">
                        <span className="text-plasma drop-shadow-[0_0_8px_rgba(123,97,255,0.8)]">GEET</span>
                        <span>SYSTEMS</span>
                    </div>
                    <p className="font-mono text-xs text-primary/40 max-w-sm leading-relaxed">
                        {'>'} Precision infrastructure for high-yield real estate operations. Bypassing massive commissions in the UAE network via algorithmic optimization.
                    </p>

                    {/* Status Indicator */}
                    <div className="mt-8 flex items-center gap-3 bg-plasma/5 border border-plasma/20 px-4 py-2 rounded-full w-fit max-w-xs shadow-[inset_0_0_10px_rgba(123,97,255,0.1)]">
                        <div className="w-2 h-2 rounded-full bg-plasma animate-pulse shadow-[0_0_10px_rgba(123,97,255,0.8)]"></div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-plasma">Core Online</span>
                    </div>
                </div>

                {/* Links Col 1 */}
                <div className="flex flex-col gap-4 font-body text-sm">
                    <span className="font-mono text-[10px] text-plasma/70 uppercase tracking-widest mb-2 border-b border-plasma/20 pb-2 inline-block w-fit">Nodes</span>
                    <a href="#" className="hover:text-plasma hover:translate-x-1 transition-all">Rent Vector</a>
                    <a href="#" className="hover:text-plasma hover:translate-x-1 transition-all">Lease Pipeline</a>
                    <a href="#" className="hover:text-plasma hover:translate-x-1 transition-all">Asset Acquire</a>
                    <a href="#" className="hover:text-plasma hover:translate-x-1 transition-all">Market Sync</a>
                </div>

                {/* Links Col 2 */}
                <div className="flex flex-col gap-4 font-body text-sm">
                    <span className="font-mono text-[10px] text-plasma/70 uppercase tracking-widest mb-2 border-b border-plasma/20 pb-2 inline-block w-fit">Security</span>
                    <a href="#" className="hover:text-plasma hover:translate-x-1 transition-all">Data Privacy</a>
                    <a href="#" className="hover:text-plasma hover:translate-x-1 transition-all">Terms of Access</a>
                    <a href="#" className="hover:text-plasma hover:translate-x-1 transition-all">Commission Matrix</a>
                </div>

            </div>

            {/* Footer Bottom */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-plasma/20 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-primary/40 relative z-10">
                <span>&copy; {new Date().getFullYear()} Geet Systems. All protocols secure.</span>
                <span className="text-plasma">Dubai Node, UAE</span>
            </div>

        </footer>
    );
};

export default Footer;
