import React from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';
import { ALL_CO_PARENTING_MODULES_CONFIG } from '../constants.tsx';
import ContentCard from './ContentCard.tsx';
import { ViewType } from '../types.tsx';

const CoParentingDashboard: React.FC = () => {
  const { appState, dispatch } = useAppState();
  const { coParentingDashboardModules, isModMode } = appState;

  const handleCustomizeDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'co-parenting-dashboard-builder' });
  };

  const enabledModules = coParentingDashboardModules
    .map(moduleId => ALL_CO_PARENTING_MODULES_CONFIG.find(m => m.id === moduleId))
    .filter(Boolean);

  const getGridColsClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    return 'grid-cols-1 md:grid-cols-2';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Co-Parenting Hub</h1>
        <p className="text-lg text-text-light text-opacity-80">
          A structured toolkit for low-friction, high-clarity communication and logistics. Facts, not feelings.
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
          if (!moduleConfig) return null;
          const ModuleComponent = moduleConfig.component;
          return (
            <ModuleComponent
              key={moduleConfig.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CoParentingDashboard;