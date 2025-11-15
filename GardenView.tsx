
import React, { useMemo } from 'react';
import { useAppState } from '../contexts/AppStateContext.js';


// Helper to get YYYY-MM-DD
const toYMD = (date: Date) => date.toISOString().split('T')[0];

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface SproutCardProps {
    title: string;
    view: string;
}
const SproutCard: React.FC<SproutCardProps> = ({ title, view }) => {
    const { dispatch } = useAppState();

    return (
        <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: view })}
            className="bg-card-dark rounded-lg shadow-md p-6 border border-gray-700 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 w-full h-full"
        >
            <span className="text-5xl mb-4">🌿</span>
            <h3 className="text-2xl font-bold text-accent-green mb-4">{title}</h3>
            <div className="mt-auto w-full">
                <span
                    className="w-full block px-6 py-3 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold"
                >
                    View Sprout
                </span>
            </div>
        </button>
    );
};



// Calculation logic for the sprout's health
const calculateSproutHealth = (appState: any) => {
    let score = 100;
    const diagnostics: { message: string, type: 'positive' | 'negative' }[] = [];
    const { checkedItems, tasks, statusMood, statusEnergy, habitTracker } = appState;

    // 1. Foundational Protocols (Essentials are critical)
    const morningMedsDone = checkedItems['essentials-meds-am'];
    const firstWaterDone = checkedItems['essentials-water-1'];
    const breakfastDone = checkedItems['essentials-food-1'];

    if (!morningMedsDone) {
        score -= 25;
        diagnostics.push({ message: "Morning medication not logged.", type: 'negative' });
    }
    if (!firstWaterDone) {
        score -= 15;
        diagnostics.push({ message: "Initial hydration protocol missed.", type: 'negative' });
    }
     if (!breakfastDone) {
        score -= 10;
        diagnostics.push({ message: "Morning nutrition not logged.", type: 'negative' });
    }
    if(morningMedsDone && firstWaterDone && breakfastDone) {
         diagnostics.push({ message: "Foundational protocols engaged.", type: 'positive' });
    }

    // 2. User Status
    if (statusMood === 'Overwhelmed') {
        score -= 20;
        diagnostics.push({ message: "Mood is Overwhelmed. System strain detected.", type: 'negative' });
    }
    if (statusEnergy === 'Low') {
        score -= 20;
        diagnostics.push({ message: "Energy is Low. Capacity reduced.", type: 'negative' });
    }
    if (statusMood === 'Focused' && statusEnergy === 'High') {
        diagnostics.push({ message: "Status is optimal: Focused & High Energy.", type: 'positive' });
    }

    // 3. Task Velocity
    const todayStr = toYMD(new Date());
    const todaysTasks = tasks.filter((t: any) => t.dueDate === todayStr);
    const completedToday = todaysTasks.filter((t: any) => t.status === 'done').length;
    if (todaysTasks.length > 0) {
        const completionRatio = completedToday / todaysTasks.length;
        score -= (1 - completionRatio) * 15; // Max -15
        if(completionRatio > 0.5) {
             diagnostics.push({ message: `${completedToday}/${todaysTasks.length} tasks completed. Good velocity.`, type: 'positive' });
        } else if (completionRatio < 0.5 && (todaysTasks.length - completedToday > 2)) {
             diagnostics.push({ message: `${todaysTasks.length - completedToday} tasks for today remain.`, type: 'negative' });
        }
    }

    // 4. Habit Compliance
    const todayHabitsLog = habitTracker.log[todayStr] || [];
    const totalHabits = habitTracker.habits.length;
    if (totalHabits > 0) {
        const completionRatio = todayHabitsLog.length / totalHabits;
        score -= (1 - completionRatio) * 15; // Max -15
        if(completionRatio === 1) {
            diagnostics.push({ message: "All daily habits completed.", type: 'positive' });
        }
    }

    return { score: Math.max(0, Math.round(score)), diagnostics };
};

const LivingSprout = ({ health, title, view }: { health: any, title: string, view: string }) => {
    const { score, diagnostics } = health;
    const { dispatch } = useAppState();

    let sproutState = 'normal';
    let stateColor = 'text-accent-teal';
    let stateDescription = 'System Stable';
    if (score >= 80) {
        sproutState = 'healthy';
        stateColor = 'text-accent-green';
        stateDescription = 'System Optimal';
    } else if (score < 40) {
        sproutState = 'wilted';
        stateColor = 'text-accent-warning';
        stateDescription = 'Warning: System Strain';
    }

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
            <div className="w-full text-left bg-gray-800 p-3 rounded-md border border-gray-700 mb-4">
                <h4 className="font-bold text-accent-blue mb-2">System Diagnostics:</h4>
                <ul className="list-none space-y-1 text-sm">
                    {diagnostics.slice(0, 4).map((d, i) => (
                        <li key={i} className={`flex items-start ${d.type === 'negative' ? 'text-yellow-400' : 'text-green-400'}`}>
                            <span className="mr-2 mt-1">{d.type === 'negative' ? '⚠️' : '✅'}</span>
                            <span>{d.message}</span>
                        </li>
                    ))}
                    {diagnostics.length === 0 && <li className="text-gray-400">No significant data points for analysis.</li>}
                </ul>
            </div>
            <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: view })}
                className="w-full px-6 py-3 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold"
            >
                Go to Dashboard
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

    const sproutHealth = calculateSproutHealth(appState);

    const personaMap: Record<string, { name: string, view: string }> = {
        william: { name: 'My Sprout', view: 'williams-dashboard' },
        willow: { name: "Willow's Sprout", view: 'willows-dashboard' },
        sebastian: { name: "Bash's Sprout", view: 'sebastians-dashboard' },
        'co-parenting': { name: 'Co-Parenting Hub', view: 'co-parenting-dashboard' },
        launcher: { name: 'System Launcher', view: 'garden-view' },
    };

    const allSprouts = [
        { key: 'william', name: 'My Sprout', view: 'williams-dashboard' },
        { key: 'willow', name: "Willow's Sprout", view: 'willows-dashboard' },
        { key: 'sebastian', name: "Bash's Sprout", view: 'sebastians-dashboard' },
        { key: 'co-parenting', name: 'Co-Parenting Hub', view: 'co-parenting-dashboard' },
    ];
    
    const otherSprouts = allSprouts.filter(s => s.key !== dashboardType);


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
                        health={sproutHealth}
                        title={personaMap[dashboardType].name}
                        view={personaMap[dashboardType].view}
                    />
                 </div>
            </section>
            
            {otherSprouts.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-accent-green mb-6 text-center">Other Sprouts in Your Garden</h2>
                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {otherSprouts.map(sprout => (
                            <SproutCard
                                key={sprout.key}
                                title={sprout.name}
                                view={sprout.view}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default GardenView;