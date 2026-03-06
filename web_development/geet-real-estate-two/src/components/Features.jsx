import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

// --- Card 1: Diagnostic Shuffler (Renting) ---
const RentingShuffler = () => {
    const [cards, setCards] = useState([
        { id: 1, label: 'Residential Index', text: 'Market Optimum' },
        { id: 2, label: 'Commercial Space', text: 'Zero Friction' },
        { id: 3, label: 'Short Term Hub', text: 'Dynamic Terms' },
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
                const isTop = idx === 0;
                const scale = 1 - (idx * 0.05);
                const yOffset = idx * 12;
                const opacity = 1 - (idx * 0.2);

                return (
                    <div
                        key={card.id}
                        className={`absolute top-0 w-full p-4 rounded-2xl bg-cardbg border border-plasma/20 shadow-[0px_0px_10px_rgba(123,97,255,0.1)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
                        style={{
                            transform: `translateY(${yOffset}px) scale(${scale})`,
                            opacity,
                            zIndex: 10 - idx
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] uppercase text-primary/40">Classification</span>
                            <span className="font-heading font-semibold text-sm text-primary">{card.label}</span>
                            <span className="font-mono text-xs text-plasma mt-2">{card.text}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- Card 2: Telemetry Typewriter (Buying) ---
const BuyingTypewriter = () => {
    const messages = [
        "Compiling off-market data vectors...",
        "Isolating high-yield luxury spaces.",
        "Bypassing standard commission protocols...",
        "Asset synchronization complete."
    ];
    const [text, setText] = useState('');
    const [msgIdx, setMsgIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);

    useEffect(() => {
        const currentMsg = messages[msgIdx];
        if (charIdx < currentMsg.length) {
            const timeout = setTimeout(() => {
                setText(prev => prev + currentMsg[charIdx]);
                setCharIdx(c => c + 1);
            }, 40);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setText('');
                setCharIdx(0);
                setMsgIdx((m) => (m + 1) % messages.length);
            }, 2500);
            return () => clearTimeout(timeout);
        }
    }, [charIdx, msgIdx]);

    return (
        <div className="w-full h-48 bg-deepvoid rounded-2xl p-5 border border-plasma/30 shadow-[inset_0_0_20px_rgba(123,97,255,0.05)] flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-plasma animate-pulse drop-shadow-[0_0_5px_rgba(123,97,255,0.8)]"></div>
                <span className="font-mono text-[10px] text-plasma uppercase tracking-widest drop-shadow-[0_0_2px_rgba(123,97,255,0.5)]">System Log</span>
            </div>
            <div className="font-mono text-xs text-primary/80 leading-relaxed">
                <span className="text-plasma/60">{'>'} </span>
                {text}
                <span className="inline-block w-2 h-3 bg-plasma ml-1 animate-pulse align-middle drop-shadow-[0_0_5px_rgba(123,97,255,0.8)]"></span>
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

            gsap.set('.sim-cursor', { x: 0, y: 150, opacity: 0 });
            gsap.set('.day-cell', { backgroundColor: 'transparent', color: '#F0EFF4', opacity: 0.4 });
            gsap.set('.save-btn', { scale: 1 });

            tl.to('.sim-cursor', { opacity: 1, duration: 0.3 })
                .to('.sim-cursor', { x: 75, y: 40, duration: 0.8, ease: 'power2.inOut' })
                .to('.sim-cursor', { scale: 0.8, duration: 0.1 })
                .to('.day-3', { backgroundColor: '#7B61FF', color: '#0A0A14', opacity: 1, boxShadow: '0 0 10px rgba(123,97,255,0.5)', duration: 0.1 })
                .to('.sim-cursor', { scale: 1, duration: 0.1 })
                .to('.sim-cursor', { x: 140, y: 100, duration: 0.6, ease: 'power2.inOut', delay: 0.2 })
                .to('.sim-cursor', { scale: 0.8, duration: 0.1 })
                .to('.save-btn', { scale: 0.95, boxShadow: '0 0 15px rgba(123,97,255,0.8)', duration: 0.1 })
                .to('.save-btn', { scale: 1, boxShadow: '0 0 5px rgba(123,97,255,0.3)', duration: 0.1 })
                .to('.sim-cursor', { scale: 1, duration: 0.1 })
                .to('.sim-cursor', { opacity: 0, duration: 0.3, delay: 0.2 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div ref={containerRef} className="w-full h-48 bg-cardbg rounded-2xl p-5 border border-plasma/20 relative overflow-hidden flex flex-col justify-between">
            <div>
                <span className="font-mono text-[10px] uppercase text-primary/40">Lease Vector</span>
                <div className="flex gap-2 mt-4">
                    {days.map((d, i) => (
                        <div key={i} className={`day-cell day-${i} w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] transition-all`}>
                            {d}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end relative z-20">
                <div className="save-btn font-mono text-[10px] bg-plasma text-deepvoid px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary transition-colors shadow-[0_0_5px_rgba(123,97,255,0.3)]">
                    EXECUTE
                </div>
            </div>

            <svg
                className="sim-cursor absolute z-30 w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(240,239,244,0.8)]"
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
        <section id="features" className="py-24 px-6 md:px-[10vw] bg-deepvoid w-full border-t border-plasma/10 relative">
            {/* Background glow behind features */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-plasma/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">

                <div className="flex flex-col gap-4 max-w-2xl">
                    <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary tracking-tight">
                        Algorithmic real estate protocols.
                    </h2>
                    <p className="font-mono text-sm text-primary/60 text-balance leading-relaxed">
                        <span className="text-plasma mr-2">{'//'}</span>
                        Our ecosystem covers the full spectrum of high-end property operations, engineered for zero friction and absolute transparency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Card 1 */}
                    <div className="premium-shadow bg-cardbg border border-plasma/20 rounded-[2rem] p-6 flex flex-col gap-8 group hover:-translate-y-[2px] hover:border-plasma/50 hover:shadow-[0_0_30px_rgba(123,97,255,0.2)] transition-all duration-500">
                        <div>
                            <h3 className="font-heading font-semibold text-xl text-primary drop-shadow-[0_0_10px_rgba(240,239,244,0.2)]">Renting</h3>
                            <p className="font-body text-sm text-primary/50 mt-2">Discover premium rentals negotiated to their absolute algorithmic floor.</p>
                        </div>
                        <RentingShuffler />
                    </div>

                    {/* Card 2 */}
                    <div className="premium-shadow bg-cardbg border border-plasma/20 rounded-[2rem] p-6 flex flex-col gap-8 group hover:-translate-y-[2px] hover:border-plasma/50 hover:shadow-[0_0_30px_rgba(123,97,255,0.2)] transition-all duration-500">
                        <div>
                            <h3 className="font-heading font-semibold text-xl text-primary drop-shadow-[0_0_10px_rgba(240,239,244,0.2)]">Buying</h3>
                            <p className="font-body text-sm text-primary/50 mt-2">Acquire prestigious properties with the lowest calculated commissions in the network.</p>
                        </div>
                        <BuyingTypewriter />
                    </div>

                    {/* Card 3 */}
                    <div className="premium-shadow bg-cardbg border border-plasma/20 rounded-[2rem] p-6 flex flex-col gap-8 group hover:-translate-y-[2px] hover:border-plasma/50 hover:shadow-[0_0_30px_rgba(123,97,255,0.2)] transition-all duration-500">
                        <div>
                            <h3 className="font-heading font-semibold text-xl text-primary drop-shadow-[0_0_10px_rgba(240,239,244,0.2)]">Leasing</h3>
                            <p className="font-body text-sm text-primary/50 mt-2">Streamlined digital property leasing protocols built for systematic landlords.</p>
                        </div>
                        <LeasingScheduler />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;
