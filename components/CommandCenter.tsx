

import React, { useMemo } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import ContentCard from './ContentCard';


const toYMD = (date) => date.toISOString().split('T')[0];

const CommandCenter = () => {
    const { appState, dispatch } = useAppState();
    const {
        statusMood, statusEnergy, sensoryState, tasks, brainDumpText,
        objectives, projects, knowledgeVaultEntries, parentalAlerts, redeemedRewards, acknowledgedRedemptions
    } = appState;

    const healthData = useMemo(() => {
        let score = 100;
        if (statusMood === 'Overwhelmed') score -= 20;
        if (statusEnergy === 'Low') score -= 20;
        const overstimulatedSenses = Object.values(sensoryState).filter(s => s === 'Over').length;
        score -= overstimulatedSenses * 10;
        return { score: Math.max(0, score), overstimulatedSenses };
    }, [statusMood, statusEnergy, sensoryState]);

    const missionData = useMemo(() => {
        const todayStr = toYMD(new Date());
        const criticalTasks = tasks
            .filter(t => t.status === 'todo' && t.dueDate === todayStr && t.priority === 'High')
            .slice(0, 3);
        
        const weeklyReviews = knowledgeVaultEntries
            .filter(e => e.tags.includes('weekly-review'))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        let weeklyFocus = "Not set for this week.";
        if (weeklyReviews.length > 0) {
            const match = weeklyReviews[0].content.match(/(?:focus|objective):\s*(.*)/i);
            if (match) weeklyFocus = match[1];
        }
        
        return { criticalTasks, weeklyFocus };
    }, [tasks, knowledgeVaultEntries]);

    const strategicData = useMemo(() => {
        const activeObjectives = objectives.filter(o => !o.isArchived);
        const projectsWithProgress = activeObjectives.flatMap(obj => 
            projects.filter(p => p.objectiveId === obj.id && !p.isArchived)
        ).map(proj => {
            const linkedTasks = tasks.filter(t => t.projectId === proj.id);
            const completed = linkedTasks.filter(t => t.status === 'done').length;
            const progress = linkedTasks.length > 0 ? (completed / linkedTasks.length) * 100 : 0;
            return { ...proj, progress };
        });
        
        return { activeObjectives, projectsWithProgress };
    }, [objectives, projects, tasks]);

    const intelData = useMemo(() => {
        const inboxTasks = tasks.filter(t => t.status === 'todo' && !t.dueDate);
        const inboxTaskCount = inboxTasks.length;
        const brainDumpWordCount = brainDumpText.trim().split(/\s+/).filter(Boolean).length;
        
        const pendingAlerts = parentalAlerts.filter(a => a.status === 'pending').length;

        const pendingRedemptions = (['willow', 'sebastian']).reduce((count, persona) => {
            const redeemed = redeemedRewards[persona] || [];
            const acknowledged = acknowledgedRedemptions[persona] || [];
            return count + redeemed.filter(r => !acknowledged.includes(r)).length;
        }, 0);

        return { inboxTaskCount, inboxTasks, brainDumpWordCount, pendingAlerts, pendingRedemptions };
    }, [tasks, brainDumpText, parentalAlerts, redeemedRewards, acknowledgedRedemptions]);

    // FIX: Made moduleId optional to handle calls with only a view.
    const navigateTo = (view: string, moduleId?: string) => {
        dispatch({ type: 'SET_VIEW', payload: view });
        if (moduleId) {
            setTimeout(() => {
                document.getElementById(moduleId)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };
    
    // FIX: Made moduleId and children optional to handle calls with only a view.
    const QuickLink = ({ view, moduleId, children }: { view: string, moduleId?: string, children?: React.ReactNode }) => (
        <button onClick={() => navigateTo(view, moduleId)} className="text-xs text-accent-blue hover:underline font-semibold">
            {children} &rarr;
        </button>
    );
    
    const handleTriageNext = () => {
        const oldestInboxTask = intelData.inboxTasks.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
        if (oldestInboxTask) {
            dispatch({ type: 'UPDATE_TASK', payload: { id: oldestInboxTask.id, dueDate: toYMD(new Date()) } });
        }
    };
    
    const handleLaunchFocus = () => {
        const firstTask = tasks.find(t => t.dueDate === toYMD(new Date()) && t.status === 'todo');
        dispatch({ type: 'START_FOCUS_MODE', payload: { firstTaskId: firstTask ? firstTask.id : null } });
    };

    return (
        <div>
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Command Center</h1>
                <p className="text-lg text-text-light text-opacity-80">A high-level overview of the entire OS. Your first stop for daily orientation.</p>
                 <button onClick={() => navigateTo('daily-report')} className="mt-4 px-5 py-2 bg-accent-blue text-background-dark font-semibold rounded-md hover:bg-blue-400 transition-colors duration-200 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                    Print Today's Mission
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-6">
                    <ContentCard title="🌡️ System Vitals">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                <span>Sprout Health Score:</span>
                                <span className={`font-bold ${healthData.score > 80 ? 'text-accent-green' : healthData.score < 40 ? 'text-accent-warning' : 'text-accent-blue'}`}>{healthData.score}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                <span>Mood / Energy:</span>
                                <span className="font-semibold">{statusMood || 'N/A'} / {statusEnergy || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                <span>Sensory State:</span>
                                <span className={healthData.overstimulatedSenses > 0 ? 'text-accent-warning font-bold' : ''}>
                                    {healthData.overstimulatedSenses > 0 ? `${healthData.overstimulatedSenses} sense(s) overstimulated` : 'Nominal'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right mt-3 flex justify-between items-center">
                            {healthData.score < 50 && (
                                <button onClick={() => navigateTo('system-insights')} className="text-xs px-2 py-1 bg-accent-warning text-background-dark font-semibold rounded">Run System Diagnostic</button>
                            )}
                            <div className="flex-grow"></div>
                            <QuickLink view="williams-dashboard">Jump to Dashboard</QuickLink>
                        </div>
                    </ContentCard>

                    <ContentCard title="🗺️ Strategic Vector">
                        <div className="space-y-3">
                            {strategicData.activeObjectives.map(obj => (
                                <div key={obj.id}>
                                    <h4 className="font-bold text-accent-green">🎯 {obj.title}</h4>
                                    <div className="pl-4 space-y-2 mt-1">
                                        {strategicData.projectsWithProgress.filter(p => p.objectiveId === obj.id).map(proj => (
                                             <div key={proj.id}>
                                                <p className="text-sm">{proj.title}</p>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-accent-blue h-1.5 rounded-full" style={{width: `${proj.progress}%`}}></div></div>
                                             </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="text-right mt-3"><QuickLink view="strategic-roadmap">Jump to Roadmap</QuickLink></div>
                    </ContentCard>
                </div>
                {/* Column 2 */}
                <div className="space-y-6">
                     <ContentCard title="🚀 Mission Critical">
                        <div>
                            <h4 className="font-bold text-accent-blue mb-2">This Week's Focus:</h4>
                            <p className="p-2 bg-gray-800 rounded italic">"{missionData.weeklyFocus}"</p>
                            <div className="text-right mt-1"><QuickLink view="weekly-review">Jump to Weekly Review</QuickLink></div>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-bold text-accent-blue mb-2">Top 3 Critical Tasks for Today:</h4>
                             <ul className="list-none space-y-2">
                                {missionData.criticalTasks.length > 0 ? missionData.criticalTasks.map(task => (
                                    <li key={task.id} className="p-2 bg-gray-800 rounded">✅ {task.title}</li>
                                )) : <p className="text-sm text-gray-500 italic">No high-priority tasks scheduled for today.</p>}
                            </ul>
                        </div>
                         <div className="mt-3 flex justify-between items-center">
                             <button onClick={handleLaunchFocus} className="text-xs px-2 py-1 bg-accent-teal text-background-dark font-semibold rounded">Launch Focus Mode</button>
                            <QuickLink view="williams-dashboard" moduleId="module-task-matrix-module">Jump to Task Matrix</QuickLink>
                        </div>
                    </ContentCard>

                    <ContentCard title="📥 Incoming Intel">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                <span>Unprocessed Task Inbox:</span>
                                <span className={`font-bold ${intelData.inboxTaskCount > 0 ? 'text-accent-warning' : 'text-accent-green'}`}>{intelData.inboxTaskCount} items</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                <span>Brain Dump Status:</span>
                                <span className={`font-semibold ${intelData.brainDumpWordCount > 10 ? 'text-accent-warning' : 'text-accent-green'}`}>{intelData.brainDumpWordCount > 0 ? `${intelData.brainDumpWordCount} words` : 'Empty'}</span>
                            </div>
                             <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                <span>Parental Alerts:</span>
                                <span className={`font-bold ${intelData.pendingAlerts > 0 ? 'text-accent-warning animate-pulse' : 'text-accent-green'}`}>{intelData.pendingAlerts} pending</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                <span>Pending Reward Redemptions:</span>
                                <span className={`font-bold ${intelData.pendingRedemptions > 0 ? 'text-accent-warning' : 'text-accent-green'}`}>{intelData.pendingRedemptions} pending</span>
                            </div>
                        </div>
                         <div className="mt-3 flex justify-between items-center">
                             <button onClick={handleTriageNext} disabled={intelData.inboxTaskCount === 0} className="text-xs px-2 py-1 bg-yellow-500 text-background-dark font-semibold rounded disabled:bg-gray-600">Triage Next Item</button>
                            <QuickLink view="game-master-dashboard">Jump to Game Master Hub</QuickLink>
                        </div>
                    </ContentCard>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;