
import React from 'react';
import { useAppState } from '../contexts/AppStateContext.js';
import { useSystemHealth } from '../hooks/useSystemHealth.js';
import ModuleIcon from './ModuleIcon.js';
import { ALL_WILLIAM_MODULES_CONFIG } from '../constants.js';
import { useProactiveAI } from '../hooks/useProactiveAI.js';
import SystemNudgeModule from './modules/william/SystemNudgeModule.js';
import ContentCard from './ContentCard.js';

// Import modules needed for the new layout
import StatusTrackerModule from './modules/StatusTrackerModule.js';
import DayProgressBarModule from './modules/DayProgressBarModule.js';
import WonkyAIModule from './modules/WonkyAIModule.js';


const SystemVitals = () => {
    const { appState } = useAppState();
    const { statusMood, statusEnergy } = appState;
    const { score, stateColor } = useSystemHealth();

    const moodIcon = statusMood === 'Focused' ? '🎯' : statusMood === 'Calm' ? '😌' : '🧠';
    const energyIcon = statusEnergy === 'High' ? '⚡️' : statusEnergy === 'Medium' ? '🔋' : '🔌';

    return (
        <ContentCard title="System Vitals" showHeader={false}>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className={`text-4xl font-bold ${stateColor}`}>{score}</p>
                    <p className={`text-sm font-semibold ${stateColor}`}>Health</p>
                </div>
                <div>
                    <p className="text-4xl">{moodIcon}</p>
                    <p className="text-sm font-semibold">{statusMood || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-4xl">{energyIcon}</p>
                    <p className="text-sm font-semibold">{statusEnergy || 'N/A'}</p>
                </div>
            </div>
        </ContentCard>
    );
};

// FIX: Typed as React.FC to handle key prop correctly.
const ModuleLauncher: React.FC = () => {
    const { appState, dispatch } = useAppState();
    const { williamDashboardModules } = appState;

    const launchableModules = ALL_WILLIAM_MODULES_CONFIG.filter(module =>
        williamDashboardModules.includes(module.id)
    );

    const handleLaunch = (moduleId) => {
        dispatch({ type: 'SET_VIEW', payload: `view-${moduleId}` });
    };

    return (
        <ContentCard title="Module Launcher">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {launchableModules.map(module => (
                    <ModuleIcon
                        key={module.id}
                        iconPath={module.icon}
                        label={module.name}
                        onClick={() => handleLaunch(module.id)}
                    />
                ))}
            </div>
        </ContentCard>
    );
};


const WilliamsDashboard = () => {
  const { appState, dispatch } = useAppState();
  const { isModMode } = appState;
  const allNudges = useProactiveAI(appState, dispatch);

  const handleDismissNudge = (nudgeId) => {
    dispatch({ type: 'DISMISS_NUDGE', payload: nudgeId });
  };
  
  const handleCustomizeDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'william-dashboard-builder' });
  };

  const currentNudge = allNudges.length > 0 ? allNudges[0] : null;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Operations Control</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Your central command interface. All systems nominal.
        </p>
        {isModMode && (
          <button
            onClick={handleCustomizeDashboard}
            className="absolute top-0 right-0 mt-2 px-4 py-2 bg-accent-blue text-background-dark font-semibold rounded-md hover:bg-blue-400 transition-colors duration-200 text-sm"
            aria-label="Customize Dashboard Modules"
          >
            Customize Dashboard
          </button>
        )}
      </header>
      
      <div className="space-y-6">
        {currentNudge && (
            <SystemNudgeModule
                nudge={currentNudge}
                onDismiss={handleDismissNudge}
            />
        )}
        <SystemVitals />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusTrackerModule />
            <DayProgressBarModule />
        </div>
        <ContentCard title="🧠 Wonky AI Assistant">
            <WonkyAIModule />
        </ContentCard>
        <ModuleLauncher />
      </div>
    </div>
  );
};

export default WilliamsDashboard;