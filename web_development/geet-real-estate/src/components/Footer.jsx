import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-obsidian text-ivory/80 rounded-t-[4rem] px-8 md:px-[10vw] pt-24 pb-12 relative overflow-hidden">

            {/* Footer Content Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24 relative z-10">

                {/* Brand */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex flex-col font-heading font-bold text-3xl tracking-tight text-ivory">
                        <span className="text-accent">Geet</span>
                        <span>Real Estate</span>
                    </div>
                    <p className="font-body text-sm text-slate/40 max-w-sm leading-relaxed">
                        Precision longevity and asset management. We provide elite real estate solutions in the UAE with absolute transparency and unmatched commission structures.
                    </p>

                    {/* Status Indicator */}
                    <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#10B981]">System Operational</span>
                    </div>
                </div>

                {/* Links Col 1 */}
                <div className="flex flex-col gap-4 font-body text-sm">
                    <span className="font-mono text-[10px] text-slate/50 uppercase tracking-widest mb-2">Protocol</span>
                    <a href="#" className="hover:text-champagne transition-colors">Residential Renting</a>
                    <a href="#" className="hover:text-champagne transition-colors">Commercial Leasing</a>
                    <a href="#" className="hover:text-champagne transition-colors">Asset Acquisition</a>
                    <a href="#" className="hover:text-champagne transition-colors">Market Syndication</a>
                </div>

                {/* Links Col 2 */}
                <div className="flex flex-col gap-4 font-body text-sm">
                    <span className="font-mono text-[10px] text-slate/50 uppercase tracking-widest mb-2">Legal</span>
                    <a href="#" className="hover:text-champagne transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-champagne transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-champagne transition-colors">Commission Regulations</a>
                </div>

            </div>

            {/* Footer Bottom */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-slate/50 relative z-10">
                <span>&copy; {new Date().getFullYear()} Geet Real Estate. All rights reserved.</span>
                <span>Dubai, United Arab Emirates</span>
            </div>

        </footer>
    );
};

export default Footer;
