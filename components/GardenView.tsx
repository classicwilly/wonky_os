

import React, { useMemo } from 'react';
import { useAppState } from '../contexts/AppStateContext.js';
import { useSystemHealth } from '../hooks/useSystemHealth.js';

const LivingSprout = ({ title, view }: { title: string, view: string }) => {
    const { score, diagnostics, stateColor, stateDescription, sproutState } = useSystemHealth();
    const { dispatch } = useAppState();

    const SproutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 transition-all duration-500 ${sproutState === 'wilted' ? 'text-gray-500' : stateColor} ${sproutState === 'healthy' ? 'animate-glow' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 20V10M12 10C10 10 8 8 8 6s2-4 4-4 4 2 4 4-2 4-4 4z" style={{ transformOrigin: 'bottom center', transform: sproutState === 'wilted' ? 'rotate(10deg)' : 'none', transition: 'transform 0.5s ease-in-out' }}/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10c2 0 4-2 4-4" />
        </svg>
    );

    return (
        <div className="bg-card-dark rounded-lg shadow-md p-6 border-2 border-accent-teal flex flex-col items-center">
            <h3 className="text-3xl font-bold text-accent-green mb-2">{title}</h3>
            <div className="flex items-center gap-4 my-4">
                 <SproutIcon />
                 <div className="text-center">
                    <p className={`text-6xl font-bold ${stateColor}`}>{score}</p>
                    <p className={`font-semibold ${stateColor}`}>{stateDescription}</p>
                 </div>
            </div>
            <div className="w-full text-left bg-gray-900 font-mono p-4 rounded-md border border-gray-700 mb-4 text-xs h-40 overflow-y-auto">
                <h4 className="font-bold text-accent-blue mb-2 blinking-cursor">SYSTEM LOG:</h4>
                <ul className="list-none space-y-1">
                    {diagnostics.slice(0, 5).map((d, i) => (
                        <li key={i} className={`flex items-start ${d.type === 'negative' ? 'text-yellow-300' : 'text-green-400'}`}>
                            <span className="mr-2 flex-shrink-0">{d.type === 'negative' ? '[WARN]' : '[ OK ]'}</span>
                            <span>{d.message}</span>
                        </li>
                    ))}
                    {diagnostics.length === 0 && <li className="text-gray-500">[INFO] No significant data points for analysis.</li>}
                </ul>
            </div>
            <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: view })}
                className="w-full px-6 py-3 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold"
            >
                Go to Ops Control
            </button>
        </div>
    );
};


const GardenView = () => {
    const { appState } = useAppState();

    if (!appState) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-teal"></div>
            </div>
        );
    }
    
    const { dashboardType } = appState;

    const personaMap: Record<string, { name: string, view: string }> = {
        william: { name: 'My Sprout', view: 'operations-control' },
        willow: { name: "Willow's Sprout", view: 'willows-dashboard' },
        sebastian: { name: "Bash's Sprout", view: 'sebastians-dashboard' },
        'co-parenting': { name: 'Co-Parenting Hub', view: 'co-parenting-dashboard' },
    };

    return (
        <div className="max-w-5xl mx-auto">
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Your Sprout Garden</h1>
                <p className="text-lg text-text-light text-opacity-80">
                    A living dashboard reflecting your system's health and connections.
                </p>
            </header>
            
            <section className="mb-12">
                 <div className="max-w-md mx-auto">
                    <LivingSprout
                        title={personaMap[dashboardType].name}
                        view={personaMap[dashboardType].view}
                    />
                 </div>
            </section>
        </div>
    );
};

export default GardenView;