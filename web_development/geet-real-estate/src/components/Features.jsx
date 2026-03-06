import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

// --- Card 1: Diagnostic Shuffler (Renting) ---
const RentingShuffler = () => {
    const [cards, setCards] = useState([
        { id: 1, label: 'Residential Rent', text: 'Lowest Market Rates' },
        { id: 2, label: 'Commercial Rent', text: 'Zero Hidden Fees' },
        { id: 3, label: 'Short Term', text: 'Flexible Terms' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards(prev => {
                const newArr = [...prev];
                const last = newArr.pop();
                newArr.unshift(last);
                return newArr;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-48 w-full flex items-center justify-center">
            {cards.map((card, idx) => {
                // We calculate style based on index
                const isTop = idx === 0;
                const scale = 1 - (idx * 0.05);
                const yOffset = idx * 12;
                const opacity = 1 - (idx * 0.2);

                return (
                    <div
                        key={card.id}
                        className={`absolute top-0 w-full p-4 rounded-2xl bg-ivory border border-slate/10 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
                        style={{
                            transform: `translateY(${yOffset}px) scale(${scale})`,
                            opacity,
                            zIndex: 10 - idx
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] uppercase text-slate/50">Property Type</span>
                            <span className="font-heading font-semibold text-sm text-obsidian">{card.label}</span>
                            <span className="font-mono text-xs text-accent mt-2">{card.text}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- Card 2: Telemetry Typewriter (Buying) ---
const BUYING_MESSAGES = [
    "Scanning exclusive market listings...",
    "Matching buyer criteria: Luxury Villas.",
    "Negotiating lowest commission rates...",
    "Property secured at 12% below market."
];

const BuyingTypewriter = () => {
    const [text, setText] = useState('');
    const [msgIdx, setMsgIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);

    useEffect(() => {
        const currentMsg = BUYING_MESSAGES[msgIdx];
        if (charIdx < currentMsg.length) {
            const timeout = setTimeout(() => {
                setText(prev => prev + currentMsg[charIdx]);
                setCharIdx(c => c + 1);
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setText('');
                setCharIdx(0);
                setMsgIdx((m) => (m + 1) % BUYING_MESSAGES.length);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [charIdx, msgIdx]);

    return (
        <div className="w-full h-48 bg-obsidian rounded-2xl p-5 border border-slate/20 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest">Live Feed</span>
            </div>
            <div className="font-mono text-xs text-ivory/80 leading-relaxed">
                <span className="text-slate/60">{'>'} </span>
                {text}
                <span className="inline-block w-2 h-3 bg-accent ml-1 animate-pulse align-middle"></span>
            </div>
        </div>
    );
};

// --- Card 3: Cursor Protocol Scheduler (Leasing) ---
const LeasingScheduler = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            // Initial state
            gsap.set('.sim-cursor', { x: 0, y: 150, opacity: 0 });
            gsap.set('.day-cell', { backgroundColor: 'transparent', color: '#827c75' }); // text-slate/50 equivalent
            gsap.set('.save-btn', { scale: 1 });

            // Move cursor in
            tl.to('.sim-cursor', { opacity: 1, duration: 0.3 })
                .to('.sim-cursor', { x: 75, y: 40, duration: 0.8, ease: 'power2.inOut' })
                // Hover day (Wednesday idx 3)
                .to('.sim-cursor', { scale: 0.8, duration: 0.1 })
                // Activate Cell
                .to('.day-3', { backgroundColor: '#C9A84C', color: '#0D0D12', duration: 0.1 })
                .to('.sim-cursor', { scale: 1, duration: 0.1 })
                // Move to Save
                .to('.sim-cursor', { x: 140, y: 100, duration: 0.6, ease: 'power2.inOut', delay: 0.2 })
                // Click save
                .to('.sim-cursor', { scale: 0.8, duration: 0.1 })
                .to('.save-btn', { scale: 0.95, duration: 0.1 })
                .to('.save-btn', { scale: 1, duration: 0.1 })
                .to('.sim-cursor', { scale: 1, duration: 0.1 })
                // Fade out cursor
                .to('.sim-cursor', { opacity: 0, duration: 0.3, delay: 0.2 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div ref={containerRef} className="w-full h-48 bg-ivory rounded-2xl p-5 border border-slate/10 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
                <span className="font-mono text-[10px] uppercase text-slate/50">Lease Scheduler</span>
                <div className="flex gap-2 mt-4">
                    {days.map((d, i) => (
                        <div key={i} className={`day-cell day-${i} w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] text-slate/50 transition-colors`}>
                            {d}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <div className="save-btn font-mono text-[10px] bg-obsidian text-ivory px-3 py-1.5 rounded-full cursor-pointer hover:text-champagne transition-colors">
                    Confirm
                </div>
            </div>

            {/* SVG Cursor */}
            <svg
                className="sim-cursor absolute z-10 w-4 h-4 text-obsidian drop-shadow-md"
                style={{ top: '20px', left: '20px' }}
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M7 2l12 11.2h-5.8l3.3 7.3-2.2 1-3.2-7.4-4.4 4.7z" />
            </svg>
        </div>
    );
};


const Features = () => {
    return (
        <section id="features" className="py-24 px-6 md:px-[10vw] bg-ivory w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">

                <div className="flex flex-col gap-4 max-w-2xl">
                    <h2 className="font-heading font-bold text-3xl md:text-5xl text-obsidian tracking-tight">
                        Comprehensive solutions at the lowest rates.
                    </h2>
                    <p className="font-body text-slate/80 text-lg text-balance">
                        Our ecosystem covers the full spectrum of high-end real estate operations, engineered for zero friction and absolute transparency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Card 1 */}
                    <div className="premium-shadow bg-ivory border border-slate/10 rounded-[2rem] p-6 flex flex-col gap-8 group hover:-translate-y-[2px] transition-transform duration-500">
                        <div>
                            <h3 className="font-heading font-semibold text-xl text-obsidian">Renting</h3>
                            <p className="font-body text-sm text-slate/60 mt-2">Discover premium rentals negotiated to lowest market rates.</p>
                        </div>
                        <RentingShuffler />
                    </div>

                    {/* Card 2 */}
                    <div className="premium-shadow bg-ivory border border-slate/10 rounded-[2rem] p-6 flex flex-col gap-8 group hover:-translate-y-[2px] transition-transform duration-500">
                        <div>
                            <h3 className="font-heading font-semibold text-xl text-obsidian">Buying</h3>
                            <p className="font-body text-sm text-slate/60 mt-2">Acquire prestigious properties with the lowest commissions in the UAE.</p>
                        </div>
                        <BuyingTypewriter />
                    </div>

                    {/* Card 3 */}
                    <div className="premium-shadow bg-ivory border border-slate/10 rounded-[2rem] p-6 flex flex-col gap-8 group hover:-translate-y-[2px] transition-transform duration-500">
                        <div>
                            <h3 className="font-heading font-semibold text-xl text-obsidian">Leasing</h3>
                            <p className="font-body text-sm text-slate/60 mt-2">Streamlined property leasing protocols built for landlords and tenants.</p>
                        </div>
                        <LeasingScheduler />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;
