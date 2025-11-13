import React from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';
import { ALL_WILLIAM_MODULES_CONFIG } from '../constants.tsx';
import ContentCard from './ContentCard.tsx'; // Assuming ContentCard is a general utility
import { useCurrentMode } from '../hooks/useCurrentMode.tsx'; // To provide context to child modules if needed
import { ViewType } from '../types.tsx'; // For setting view when customizing

const WilliamsDashboard: React.FC = () => {
  const { appState, dispatch } = useAppState();
  const { williamDashboardModules, isModMode } = appState;
  const currentMode = useCurrentMode(); // Pass to modules if they need it

  const handleCustomizeDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'william-dashboard-builder' });
  };

  const enabledModules = williamDashboardModules
    .map(moduleId => ALL_WILLIAM_MODULES_CONFIG.find(m => m.id === moduleId))
    .filter(Boolean); // Filter out any undefined modules if IDs don't match config

  const getGridColsClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    // More complex layouts could be added if needed, e.g., 2 large + 2 small
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; // Default for 4+ modules
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">William's Dashboard</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Your personalized operations center. Configure your view to optimize focus and execution.
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

      <div className={`grid gap-6 ${getGridColsClass(enabledModules.length)}`}>
        {enabledModules.map(moduleConfig => {
          if (!moduleConfig) return null; // Should not happen with filter(Boolean) but good for safety
          const ModuleComponent = moduleConfig.component;
          // Dynamically render the component. Pass props if needed.
          return (
            <ModuleComponent 
              key={moduleConfig.id} 
              currentMode={currentMode} // Example: passing currentMode to modules that need it
            />
          );
        })}
      </div>
    </div>
  );
};

export default WilliamsDashboard;