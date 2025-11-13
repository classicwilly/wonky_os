import React, { useState, useEffect } from 'react';
import { OperatingMode, useCurrentMode } from '../../hooks/useCurrentMode.tsx';
import { ViewType } from '../../types.tsx';
import ContentCard from '../ContentCard.tsx';
import TextInputItem from '../TextInputItem.tsx';
import { useAppState } from '../../contexts/AppStateContext.tsx';
import { ALL_CHECKLIST_DATA } from '../../checklist-data.tsx';


// This component now represents the core configurable section of William's dashboard
// It no longer contains DayProgressBar, StatusTracker, KidsTracker, WonkyAI, AchievementTracker
// as those are now individual configurable modules.

const WilliamCoreDashboardModule: React.FC = () => {
  const { dispatch } = useAppState();
  const currentMode = useCurrentMode(); // Get current mode directly here
  
  const setView = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };
  
  const isSoloMode = currentMode === 'Solo Execution';
  const soloSchedule = ALL_CHECKLIST_DATA.find(s => s.sourceDocument === 'Solo Execution Mode Protocol' && s.id === 'sem-daily')?.items;
  const familySchedule = ALL_CHECKLIST_DATA.find(s => s.sourceDocument === 'Family Structure Mode Protocol' && s.id === 'fsm-saturday')?.items;

  // Simplified schedule data for current task display
  const schedule = isSoloMode ? [
      { hour: 6, task: "FDP Active (Water, Pills)" },
      { hour: 7, task: "Planning & Filing" },
      { hour: 8, task: "Core Work Block 1" },
      { hour: 12, task: "Lunch & Reset" },
      { hour: 13, task: "Core Work Block 2" },
      { hour: 15, task: "Movement Protocol" },
      { hour: 17, task: "Dinner & Wind Down" },
      { hour: 22, task: "FDP Active (Sleep Prep)" },
  ] : [
      { hour: 7, task: "Personal Morning / FDP" },
      { hour: 9, task: "Shared Breakfast" },
      { hour: 10, task: "Structured Activity Block" },
      { hour: 12, task: "Lunch" },
      { hour: 13, task: "Quiet Time Protocol" },
      { hour: 15, task: "Structured Interest Block" },
      { hour: 17, task: "Dinner" },
      { hour: 20, task: "Bedtime Routine" },
  ];
  
  const now = new Date();
  const currentHour = now.getHours();

  const getCurrentTask = () => {
    if (currentHour < 6) return "System Offline (Sleep)";
    let activeTask = "Transitioning...";
    for (const event of schedule) {
        if (currentHour >= event.hour) {
            activeTask = event.task;
        } else {
            break;
        }
    }
    return activeTask;
  };

  const currentTask = getCurrentTask();
  const workflowViewId = isSoloMode ? 'solo-execution-mode' : 'family-structure-mode';

  return (
    // Removed the max-w-5xl mx-auto container, as it will be managed by the parent WilliamsDashboard
    <div>
       {/* Removed the header as it will be managed by the parent WilliamsDashboard */}

      <div className="flex flex-col gap-6">
        {/* System Status & Critical Info */}
        <ContentCard title="System Status" showHeader={false}>
            <div className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg bg-gray-800 gap-4">
                <div className="text-center md:text-left">
                    <p className="text-sm text-accent-blue font-semibold">CURRENT MODE</p>
                    <p className="text-2xl font-bold">{currentMode}</p>
                </div>
                 <div className="text-center md:text-right">
                    <p className="text-sm text-accent-green font-semibold">CURRENT TASK</p>
                    <p className="text-2xl font-bold break-words">{currentTask}</p>
                </div>
            </div>
          </ContentCard>
        
        {/* Row 2: Launchpad & Critical Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <ContentCard title="🚀 Workspace Launchpad">
              <div className="grid grid-cols-2 gap-3">
                  <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Gmail</a>
                  <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Calendar</a>
                  <a href="https://keep.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Keep</a>
                  <a href="https://tasks.google.com/embed/canvas" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Tasks</a>
                  <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors col-span-2">NotebookLM</a>
              </div>
               <button onClick={() => setView(workflowViewId)} className="mt-4 w-full p-3 bg-accent-green bg-opacity-20 text-accent-green rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">
                  View Current Workflow SOP
               </button>
          </ContentCard>
          <ContentCard title="🎯 Critical Tasks (Today)">
              <div className="space-y-3 h-full flex flex-col justify-around">
                  <TextInputItem id="cc-task-1" label="1." placeholder="Define primary objective..." />
                  <TextInputItem id="cc-task-2" label="2." placeholder="Define secondary objective..." />
                  <TextInputItem id="cc-task-3" label="3." placeholder="Define tertiary objective..." />
              </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
};

export default WilliamCoreDashboardModule;