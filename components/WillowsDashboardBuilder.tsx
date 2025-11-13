import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';
import { ALL_WILLOW_MODULES_CONFIG } from '../constants.tsx';
import { WillowModuleKey } from '../types.tsx';
import ContentCard from './ContentCard.tsx';

const WillowsDashboardBuilder: React.FC = () => {
  const { appState, dispatch } = useAppState();
  const { willowDashboardModules } = appState;

  // Local state for changes before saving
  const [tempEnabledModules, setTempEnabledModules] = useState<WillowModuleKey[]>(willowDashboardModules);

  // Sync temp state with global state if global state changes (e.g., reset)
  useEffect(() => {
    setTempEnabledModules(willowDashboardModules);
  }, [willowDashboardModules]);

  const handleToggleModule = (moduleId: WillowModuleKey, enable: boolean) => {
    setTempEnabledModules(prev => {
      if (enable && !prev.includes(moduleId)) {
        return [...prev, moduleId];
      }
      if (!enable && prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      }
      return prev;
    });
  };

  const handleSave = () => {
    dispatch({ type: 'SET_WILLOW_DASHBOARD_MODULES', payload: tempEnabledModules });
    dispatch({ type: 'SET_VIEW', payload: 'willows-dashboard' }); // Navigate back to Willow's dashboard
  };

  const handleCancel = () => {
    // Revert to the current saved state and navigate back
    setTempEnabledModules(willowDashboardModules); // Revert local changes
    dispatch({ type: 'SET_VIEW', payload: 'willows-dashboard' }); // Navigate back to Willow's dashboard
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Customize Willow's Dashboard</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Select the modules you want active on Willow's dashboard. Toggle them on/off as needed.
        </p>
      </header>

      <div className="space-y-6">
        <ContentCard title="Checklist Modules" titleClassName="text-accent-green text-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_WILLOW_MODULES_CONFIG.filter(m => m.category === 'checklists').map(module => (
              <div key={module.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700">
                <div>
                  <h3 className="font-semibold text-accent-blue">{module.name}</h3>
                  <p className="text-sm text-text-light text-opacity-70">{module.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={tempEnabledModules.includes(module.id)}
                    onChange={(e) => handleToggleModule(module.id, e.target.checked)}
                  />
                  <div className={`w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-blue/50 ${
                    tempEnabledModules.includes(module.id) ? 'bg-accent-blue' : 'bg-gray-600'
                  } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard title="Reward Modules" titleClassName="text-accent-green text-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_WILLOW_MODULES_CONFIG.filter(m => m.category === 'rewards').map(module => (
              <div key={module.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700">
                <div>
                  <h3 className="font-semibold text-accent-blue">{module.name}</h3>
                  <p className="text-sm text-text-light text-opacity-70">{module.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={tempEnabledModules.includes(module.id)}
                    onChange={(e) => handleToggleModule(module.id, e.target.checked)}
                  />
                  <div className={`w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-blue/50 ${
                    tempEnabledModules.includes(module.id) ? 'bg-accent-blue' : 'bg-gray-600'
                  } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
            ))}
          </div>
        </ContentCard>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-700 text-text-light rounded-md hover:bg-gray-600 transition-colors duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-accent-green text-background-dark rounded-md hover:bg-green-600 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default WillowsDashboardBuilder;