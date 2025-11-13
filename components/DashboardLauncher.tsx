import React from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';
import { PersonaType, ViewType } from '../types.tsx';

interface PersonaCardProps {
    title: string;
    description: string;
    persona: PersonaType;
    emoji: string;
    colorClass: 'accent-green' | 'accent-blue' | 'accent-teal'; // Explicitly define allowed color classes
    launchView: ViewType;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ title, description, persona, emoji, colorClass, launchView }) => {
    const { dispatch } = useAppState();

    const handleLaunch = () => {
        dispatch({ type: 'SET_PERSONA', payload: persona });
        // The SET_PERSONA action in AppStateContext now also sets the view
    };

    return (
        <button
            onClick={handleLaunch}
            className={`bg-card-dark rounded-lg shadow-md p-6 border border-gray-700 flex flex-col h-full text-left transition-colors duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-${colorClass}/50`}
            aria-label={`Launch ${title} Dashboard`}
        >
            <div className="flex items-center mb-3">
                <span className={`text-4xl mr-4 text-${colorClass}`}>{emoji}</span>
                <h3 className={`text-3xl font-bold text-${colorClass}`}>{title}</h3>
            </div>
            <p className="mb-6 text-text-light text-opacity-80 flex-grow">{description}</p>
            <span
                className={`w-full mt-auto p-3 bg-${colorClass} bg-opacity-80 text-background-dark rounded-md text-center font-bold`}
            >
                Launch Dashboard
            </span>
        </button>
    );
};

const DashboardLauncher: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto py-8">
            <header className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold text-accent-teal mb-6">Wonky Sprout OS</h1>
                <p className="text-xl md:text-2xl font-semibold text-text-light text-opacity-90 max-w-3xl mx-auto">
                    Select your operating persona to access tailored protocols and tools.
                    Structure Engineered for Chaos.
                </p>
            </header>
            
            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <PersonaCard
                    title="My Dashboard"
                    description="Your personalized mission control for deep work, life maintenance, and personal growth. Only what you need, when you need it."
                    persona="william"
                    emoji="🛠️"
                    colorClass="accent-green"
                    launchView="williams-dashboard" // Default view for William's dashboard, can be customized later
                />
                 <PersonaCard
                    title="Co-Parenting Hub"
                    description="A structured toolkit for low-friction, high-clarity communication and logistics with the co-parent. Facts, not feelings."
                    persona="co-parenting"
                    emoji="👨‍👧‍👦"
                    colorClass="accent-blue"
                    launchView="co-parenting-dashboard"
                />
                 <PersonaCard
                    title="Willow's Corner"
                    description="Willow's personal space for checklists, gem collection, and rewards. Predictability and fun."
                    persona="willow"
                    emoji="🌸"
                    colorClass="accent-teal"
                    launchView="willows-dashboard" // Updated launchView
                />
                 <PersonaCard
                    title="Bash's Corner"
                    description="Bash's personalized checklists, gem collection, and rewards. Adventure with structure."
                    persona="sebastian"
                    emoji="🦖"
                    colorClass="accent-teal"
                    launchView="sebastians-dashboard" // Updated launchView
                />
            </section>
        </div>
    );
};

export default DashboardLauncher;