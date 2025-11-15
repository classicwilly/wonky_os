import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { auth, db } from '../firebase.js';
import { defaultUserState } from '../defaultStates.ts'; // Import from new file

const toYMD = (date) => date.toISOString().split('T')[0];
const timePresets = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};


function recalculateStreaks(habitId, log) {
    const dates = Object.keys(log).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let currentStreak = 0, longestStreak = 0, tempStreak = 0;
    
    // Calculate current streak from today or yesterday backwards
    const today = new Date();
    let streakContinues = true;
    let dateToCheck = new Date(today);
    if (!log[toYMD(today)]?.includes(habitId)) {
        dateToCheck.setDate(dateToCheck.getDate() - 1);
    }
    while (streakContinues) {
        const dateStr = toYMD(dateToCheck);
        if (log[dateStr]?.includes(habitId)) {
            currentStreak++;
            dateToCheck.setDate(dateToCheck.getDate() - 1);
        } else {
            streakContinues = false;
        }
    }
    // Calculate longest streak across all history
    if (dates.length > 0) {
        let lastDate = new Date(dates[0]);
        for (const dateStr of dates) {
            if (log[dateStr]?.includes(habitId)) {
                const currentDate = new Date(dateStr);
                const diffDays = (lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
                if (diffDays <= 1) tempStreak++; else tempStreak = 1;
                if (tempStreak > longestStreak) longestStreak = tempStreak;
                lastDate = currentDate;
            }
        }
    }
    return { currentStreak, longestStreak };
}


function userReducer(state, action) {
    const newState = { ...state }; // Create a shallow copy
    switch (action.type) {
        case 'SET_VIEW': newState.view = action.payload; break;
        case 'TOGGLE_CHECKED': newState.checkedItems = { ...newState.checkedItems, [action.payload]: !newState.checkedItems[action.payload] }; break;
        case 'SET_TEXT_INPUT': newState.textInputs = { ...newState.textInputs, [action.payload.id]: action.payload.value }; break;
        case 'SET_MOOD': newState.statusMood = action.payload; break;
        case 'SET_ENERGY': newState.statusEnergy = action.payload; break;
        case 'SET_KID_LOCATION': if (action.payload.kid === 'willow') newState.kidsWillowLocation = action.payload.location; else newState.kidsSebastianLocation = action.payload.location; break;
        case 'ADD_GEM': if (!newState.collectedGems[action.payload.recipient].includes(action.payload.id)) { newState.collectedGems = { ...newState.collectedGems, [action.payload.recipient]: [...newState.collectedGems[action.payload.recipient], action.payload.id]}; } break;
        case 'REMOVE_GEM': newState.collectedGems = { ...newState.collectedGems, [action.payload.recipient]: newState.collectedGems[action.payload.recipient].filter(gemId => gemId !== action.payload.id) }; break;
        case 'ADD_ACHIEVEMENT':
            if (!newState.collectedAchievements[action.payload]) {
                newState.collectedAchievements = {
                    ...newState.collectedAchievements,
                    [action.payload]: { unlockedAt: new Date().toISOString() }
                };
            }
            break;
        case 'ADD_SOP': newState.userSops = [...newState.userSops, action.payload]; break;
        case 'UPDATE_SOP': newState.modifiedSops = { ...newState.modifiedSops, [action.payload.id]: action.payload }; break;
        case 'RESET_SOP': const { [action.payload]: _, ...rest } = newState.modifiedSops; newState.modifiedSops = rest; break;
        case 'TOGGLE_MOD_MODE': newState.isModMode = !newState.isModMode; break;
        case 'ADD_CALENDAR_EVENT': newState.calendarEvents = [...newState.calendarEvents, { ...action.payload, id: String(Date.now()) }]; break;
        case 'REMOVE_CALENDAR_EVENT': newState.calendarEvents = newState.calendarEvents.filter(e => e.id !== action.payload); break;
        case 'RESET_CHECKLISTS_AND_INPUTS': newState.checkedItems = {}; newState.textInputs = {}; break;
        case 'RESET_REWARDS': newState.collectedGems = { willow: [], sebastian: [] }; newState.collectedAchievements = {}; newState.acknowledgedRewards = { willow: [], sebastian: [] }; break;
        case 'SET_WILL_DASHBOARD_MODULES': newState.williamDashboardModules = action.payload; break;
        case 'SET_WILLOW_DASHBOARD_MODULES': newState.willowDashboardModules = action.payload; break;
        case 'SET_SEBASTIAN_DASHBOARD_MODULES': newState.sebastianDashboardModules = action.payload; break;
        case 'SET_CO_PARENTING_DASHBOARD_MODULES': newState.coParentingDashboardModules = action.payload; break;
        case 'SET_INITIAL_SETUP_COMPLETE': newState.initialSetupComplete = action.payload; break;
        case 'SET_ACTIVE_SOPS': newState.activeSops = action.payload; break;
        case 'SET_ACTIVE_USER_SOP_ID': newState.activeUserSopId = action.payload; break;
        case 'SET_BRAIN_DUMP': newState.brainDumpText = action.payload; break;
        case 'SET_SENSORY_STATE': newState.sensoryState = { ...newState.sensoryState, [action.payload.sense]: action.payload.value === newState.sensoryState[action.payload.sense] ? null : action.payload.value }; break;
        case 'ADD_FAMILY_LOG_ENTRY': newState.familyLogEntries = [{ ...action.payload, id: String(Date.now()), timestamp: new Date().toISOString() }, ...newState.familyLogEntries]; break;
        case 'REMOVE_FAMILY_LOG_ENTRY': newState.familyLogEntries = newState.familyLogEntries.filter(e => e.id !== action.payload); break;
        case 'SET_GENERATED_SOP_DRAFT': newState.generatedSopDraft = action.payload; break;
        case 'ADD_QUICK_REFERENCE_ENTRY': newState.quickReferenceEntries = [...newState.quickReferenceEntries, { ...action.payload, id: String(Date.now()) }]; break;
        case 'REMOVE_QUICK_REFERENCE_ENTRY': newState.quickReferenceEntries = newState.quickReferenceEntries.filter(e => e.id !== action.payload); break;
        case 'ADD_HABIT': const newHabit = { id: String(Date.now()), name: action.payload, currentStreak: 0, longestStreak: 0 }; newState.habitTracker = { ...newState.habitTracker, habits: [...newState.habitTracker.habits, newHabit] }; break;
        case 'REMOVE_HABIT': const habits = newState.habitTracker.habits.filter(h => h.id !== action.payload); const newLogHabit = { ...newState.habitTracker.log }; Object.keys(newLogHabit).forEach(date => { newLogHabit[date] = newLogHabit[date].filter(id => id !== action.payload); }); newState.habitTracker = { habits, log: newLogHabit }; break;
        case 'TOGGLE_HABIT_LOG': { const { habitId, date } = action.payload; const newLog = { ...newState.habitTracker.log }; const dateLog = newLog[date] || []; if (dateLog.includes(habitId)) { newLog[date] = dateLog.filter(id => id !== habitId); } else { newLog[date] = [...dateLog, habitId]; } const newHabits = newState.habitTracker.habits.map(habit => { if (habit.id === habitId) { 
const { currentStreak, longestStreak } = recalculateStreaks(habitId, newLog); return { ...habit, currentStreak, longestStreak: Math.max(habit.longestStreak, longestStreak) }; } return habit; }); newState.habitTracker = { habits: newHabits, log: newLog }; break; }
        case 'ADD_EXPENSE': const newExpense = { ...action.payload, id: String(Date.now()), date: new Date().toISOString() }; newState.expenses = [newExpense, ...newState.expenses]; break;
        case 'REMOVE_EXPENSE': newState.expenses = newState.expenses.filter(e => e.id !== action.payload); break;
        case 'ADD_KNOWLEDGE_ENTRY': const newEntry = { ...action.payload, id: String(Date.now()), timestamp: new Date().toISOString() }; newState.knowledgeVaultEntries = [newEntry, ...newState.knowledgeVaultEntries]; break;
        case 'UPDATE_KNOWLEDGE_ENTRY': newState.knowledgeVaultEntries = newState.knowledgeVaultEntries.map(e => e.id === action.payload.id ? action.payload : e); break;
        case 'REMOVE_KNOWLEDGE_ENTRY': newState.knowledgeVaultEntries = newState.knowledgeVaultEntries.filter(e => e.id !== action.payload); break;
        case 'ARCHIVE_KNOWLEDGE_ENTRY': newState.knowledgeVaultEntries = newState.knowledgeVaultEntries.map(e => e.id === action.payload ? { ...e, isArchived: true } : e); break;
        case 'UNARCHIVE_KNOWLEDGE_ENTRY': newState.knowledgeVaultEntries = newState.knowledgeVaultEntries.map(e => e.id === action.payload ? { ...e, isArchived: false } : e); break;
        case 'ADD_RECURRING_TASK': const newRecurringTask = { ...action.payload, id: String(Date.now()), lastCompletedDate: null }; newState.recurringTasks = [...newState.recurringTasks, newRecurringTask]; break;
        case 'REMOVE_RECURRING_TASK': newState.recurringTasks = newState.recurringTasks.filter(t => t.id !== action.payload); break;
        case 'COMPLETE_RECURRING_TASK': newState.recurringTasks = newState.recurringTasks.map(t => t.id === action.payload ? { ...t, lastCompletedDate: new Date().toISOString().split('T')[0] } : t); break;
        case 'ADD_TASK':
            const newTask = {
                id: 'id' in action.payload && action.payload.id ? action.payload.id : String(Date.now()),
                createdAt: new Date().toISOString(),
                completedAt: null,
                dueDate: null,
                priority: 'Medium',
                ...action.payload,
                status: 'todo', // This will override any status from payload
            };
            newState.tasks = [newTask, ...newState.tasks];
            break;
        case 'UPDATE_TASK': 
            newState.tasks = newState.tasks.map(t => {
                if (t.id === action.payload.id) {
                    const updatedTask = { ...t, ...action.payload };
                    if (action.payload.status && t.status !== action.payload.status) {
                        updatedTask.completedAt = action.payload.status === 'done' ? new Date().toISOString() : null;
                    }
                    return updatedTask;
                }
                return t;
            });
            // Check for project completion
            const changedTask = newState.tasks.find(t => t.id === action.payload.id);
            if (changedTask?.status === 'done' && changedTask.projectId) {
                const allProjectTasks = newState.tasks.filter(t => t.projectId === changedTask.projectId);
                const areAllDone = allProjectTasks.every(t => t.status === 'done');
                if (areAllDone) {
                    newState.recentlyCompletedProjectIds = [...newState.recentlyCompletedProjectIds, changedTask.projectId];
                }
            }
            break;
        case 'DELETE_TASK': newState.tasks = newState.tasks.filter(t => t.id !== action.payload); break;
        case 'SET_FINANCIAL_BUDGET': newState.financialBudgets = { ...newState.financialBudgets, [action.payload.category]: action.payload.amount }; break;
        case 'POMODORO_SET_MODE': const newTime = timePresets[action.payload]; newState.pomodoroState = { ...newState.pomodoroState, mode: action.payload, timeLeft: newTime, isActive: false }; break;
        case 'POMODORO_TOGGLE': newState.pomodoroState = { ...newState.pomodoroState, isActive: !newState.pomodoroState.isActive }; break;
        case 'POMODORO_RESET': const resetTime = timePresets[newState.pomodoroState.mode]; newState.pomodoroState = { ...newState.pomodoroState, timeLeft: resetTime, isActive: false, taskId: null, workSessionsCompleted: 0 }; break;
        case 'POMODORO_TICK': if (newState.pomodoroState.timeLeft > 0) { newState.pomodoroState = { ...newState.pomodoroState, timeLeft: newState.pomodoroState.timeLeft - 1 }; } else { newState.pomodoroState = { ...newState.pomodoroState, isActive: false }; } break;
        case 'POMODORO_SET_TASK_ID': newState.pomodoroState = { ...newState.pomodoroState, taskId: action.payload.taskId }; break;
        case 'POMODORO_FINISH_SESSION_AND_START_BREAK': {
            const sessions = newState.pomodoroState.workSessionsCompleted + 1;
            const newMode = sessions > 0 && sessions % 4 === 0 ? 'longBreak' : 'shortBreak';
            const newTime = timePresets[newMode];
            newState.pomodoroState = { ...newState.pomodoroState, mode: newMode, timeLeft: newTime, isActive: true, workSessionsCompleted: sessions };
            break;
        }
        case 'POMODORO_COMPLETE_TASK_AND_START_NEXT': {
            const { taskId } = newState.pomodoroState;
            if (!taskId) break;

            // Mark current task as complete
            if (taskId.startsWith('recurring-')) {
                const recurringId = taskId.replace('recurring-', '');
                newState.recurringTasks = newState.recurringTasks.map(t => t.id === recurringId ? { ...t, lastCompletedDate: toYMD(new Date()) } : t);
            } else {
                newState.tasks = newState.tasks.map(t => t.id === taskId ? { ...t, status: 'done', completedAt: new Date().toISOString() } : t);
            }

            // --- Find next task logic (duplicated from TaskMatrixModule for reducer purity) ---
            const todayStr = toYMD(new Date());
            const today = new Date(); today.setHours(0, 0, 0, 0);
            
            const todaysCalEvents = newState.calendarEvents.filter(event => toYMD(new Date(event.date)) === todayStr).map(e => ({ ...e, itemType: 'event' }));
            
            const dueRecurring = newState.recurringTasks.filter(task => {
                const lastEventDate = task.lastCompletedDate ? new Date(task.lastCompletedDate) : new Date(task.startDate);
                const dueDate = addDays(lastEventDate, task.frequencyDays);
                return Math.round((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) <= 0;
            }).map(task => ({ ...task, id: `recurring-${task.id}`, status: 'todo', dueDate: todayStr, priority: 'Medium', createdAt: task.startDate, completedAt: null, itemType: 'recurring' }));
            
            const todayT = newState.tasks.filter(t => t.status === 'todo' && t.dueDate === todayStr).map(t => ({ ...t, itemType: 'task' }));

            const fullAgenda = [...todaysCalEvents, ...dueRecurring, ...todayT].sort((a, b) => {
                const timeA = a.itemType === 'event' ? new Date(a.date).getTime() : Infinity;
                const timeB = b.itemType === 'event' ? new Date(b.date).getTime() : Infinity;
                if (timeA !== timeB) return timeA - timeB;
                const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
                const priorityA = 'priority' in a ? priorityOrder[(a).priority] : 4;
                const priorityB = 'priority' in b ? priorityOrder[(b).priority] : 4;
                return priorityA - priorityB;
            });

            const currentIndex = fullAgenda.findIndex(item => item.id === taskId);
            let nextTask = null;
            // Find next task that is not the one just completed, and not an event, and not snoozed
            for (let i = 0; i < fullAgenda.length; i++) {
                const item = fullAgenda[i];
                if (item.itemType !== 'event' && item.id !== taskId && !(newState.tasks.find(t=>t.id === item.id)?.status === 'done') && !newState.snoozedTaskIds.includes(item.id)) {
                   if(i > currentIndex) { // Prioritize tasks after the current one
                     nextTask = item;
                     break;
                   }
                   if(!nextTask) nextTask = item; // Fallback to the first available task
                }
            }
             // --- End of find next task logic ---

            if (nextTask) {
                newState.pomodoroState = { ...newState.pomodoroState, mode: 'work', timeLeft: timePresets.work, isActive: true, taskId: nextTask.id };
            } else {
                newState.pomodoroState = { ...newState.pomodoroState, mode: 'work', timeLeft: timePresets.work, isActive: false, taskId: null };
            }
            break;
        }
        case 'ACKNOWLEDGE_REWARD': const { persona, threshold } = action.payload; if (!newState.acknowledgedRewards[persona].includes(threshold)) { newState.acknowledgedRewards[persona] = [...newState.acknowledgedRewards[persona], threshold]; } break;
        case 'REDEEM_REWARD': const { persona: redeemPersona, threshold: redeemThreshold } = action.payload; if (!newState.redeemedRewards[redeemPersona].includes(redeemThreshold)) { newState.redeemedRewards[redeemPersona] = [...newState.redeemedRewards[redeemPersona], redeemThreshold]; } break;
        case 'ACKNOWLEDGE_REDEMPTION':
            const { persona: ackPersona, threshold: ackThreshold, notes, rewardTitle } = action.payload;
            // Acknowledge the redemption
            if (!newState.acknowledgedRedemptions[ackPersona].includes(ackThreshold)) {
                newState.acknowledgedRedemptions[ackPersona] = [...newState.acknowledgedRedemptions[ackPersona], ackThreshold];
            }
            // Add to fulfillment log
            const newFulfillmentEntry = {
                id: String(Date.now()),
                persona: ackPersona,
                rewardTitle,
                fulfilledAt: new Date().toISOString(),
                notes,
            };
            newState.fulfillmentLog = [newFulfillmentEntry, ...newState.fulfillmentLog];
            break;
        case 'SEND_PARENTAL_ALERT': const newAlert = { ...action.payload, id: String(Date.now()), timestamp: new Date().toISOString(), status: 'pending' }; newState.parentalAlerts = [newAlert, ...newState.parentalAlerts]; break;
        case 'ACKNOWLEDGE_PARENTAL_ALERT': newState.parentalAlerts = newState.parentalAlerts.map(a => a.id === action.payload ? { ...a, status: 'acknowledged' } : a); break;
        case 'RESET_FINANCIAL_DATA':
            newState.expenses = [];
            newState.financialBudgets = { ...defaultUserState.financialBudgets };
            break;
        case 'RESET_KNOWLEDGE_VAULT': newState.knowledgeVaultEntries = []; break;
        case 'RESET_BRAIN_DUMP': newState.brainDumpText = ''; break;
        case 'SET_EDITING_SOP_ID': newState.editingSopId = action.payload; break;
        case 'UPDATE_USER_SOP': newState.userSops = newState.userSops.map(s => s.id === action.payload.id ? action.payload : s); break;
        case 'DELETE_USER_SOP': newState.userSops = newState.userSops.filter(s => s.id !== action.payload); break;
        case 'ADD_SOP_TEMPLATE': newState.userSopTemplates = [...newState.userSopTemplates, action.payload]; break;
        case 'DELETE_SOP_TEMPLATE': newState.userSopTemplates = newState.userSopTemplates.filter(t => t.id !== action.payload); break;
        case 'SET_ACTIVE_SOP_TEMPLATE': newState.activeSopTemplate = action.payload; break;
        case 'SET_NEW_SOP_TYPE': newState.newSopType = action.payload; break;
        case 'RESET_CHILD_REWARDS': const { persona: resetPersona } = action.payload; newState.collectedGems = {...newState.collectedGems, [resetPersona]: []}; newState.redeemedRewards = {...newState.redeemedRewards, [resetPersona]: []}; newState.acknowledgedRedemptions = {...newState.acknowledgedRedemptions, [resetPersona]: []}; newState.fulfillmentLog = newState.fulfillmentLog.filter(f => f.persona !== resetPersona); break;
        case 'ADD_QUEST': 
            const newQuest = { 
                ...action.payload, 
                id: String(Date.now()), 
                status: 'active',
                steps: action.payload.steps.map((stepLabel, index) => ({
                    id: `step-${index}-${Date.now()}`,
                    label: stepLabel,
                    completed: false,
                }))
            };
            newState.quests = [...newState.quests, newQuest]; 
            break;
        case 'DELETE_QUEST': 
            newState.quests = newState.quests.filter(q => q.id !== action.payload); 
            break;
        case 'TOGGLE_QUEST_STEP':
            newState.quests = newState.quests.map(quest => {
                if (quest.id === action.payload.questId) {
                    return {
                        ...quest,
                        steps: quest.steps.map(step => {
                            if (step.id === action.payload.stepId) {
                                return { ...step, completed: !step.completed };
                            }
                            return step;
                        })
                    };
                }
                return quest;
            });
            break;
        case 'UPDATE_QUEST_STATUS':
            let questToUpdate;
            newState.quests = newState.quests.map(quest => {
                if (quest.id === action.payload.questId) {
                    questToUpdate = { ...quest, status: action.payload.status };
                    return questToUpdate;
                }
                return quest;
            });

            if (questToUpdate && action.payload.status === 'complete') {
                const { gemRewardId, assignedTo } = questToUpdate;
                if (gemRewardId) {
                    const recipients = assignedTo === 'both' ? ['willow', 'sebastian'] : [assignedTo];
                    
                    recipients.forEach((recipient) => {
                        if (!newState.collectedGems[recipient].includes(gemRewardId)) {
                             newState.collectedGems = { ...newState.collectedGems, [recipient]: [...newState.collectedGems[recipient], gemRewardId]};
                        }
                    });
                }
            }
            break;
        case 'START_FOCUS_MODE':
            newState.isFocusModeActive = true;
            newState.focusModeTaskId = action.payload.firstTaskId;
            newState.snoozedTaskIds = [];
            break;
        case 'STOP_FOCUS_MODE':
            newState.isFocusModeActive = false;
            newState.focusModeTaskId = null;
            newState.snoozedTaskIds = [];
            break;
        case 'SET_FOCUS_TASK':
            newState.focusModeTaskId = action.payload.taskId;
            break;
        case 'SNOOZE_TASK':
            if (!newState.snoozedTaskIds.includes(action.payload.taskId)) {
                newState.snoozedTaskIds = [...newState.snoozedTaskIds, action.payload.taskId];
            }
            break;
        case 'START_TRIAGE_MODE':
            newState.isTriageModeActive = true;
            newState.triageTaskId = action.payload.firstTaskId;
            break;
        case 'STOP_TRIAGE_MODE':
            newState.isTriageModeActive = false;
            newState.triageTaskId = null;
            break;
        case 'SET_TRIAGE_TASK':
            newState.triageTaskId = action.payload.taskId;
            break;
        case 'ADD_OBJECTIVE':
            const newObjective = { id: String(Date.now()), title: action.payload.title, createdAt: new Date().toISOString() };
            newState.objectives = [...newState.objectives, newObjective];
            break;
        case 'UPDATE_OBJECTIVE':
            newState.objectives = newState.objectives.map(o => o.id === action.payload.id ? action.payload : o);
            break;
        case 'DELETE_OBJECTIVE':
            const projectsToDelete = newState.projects.filter(p => p.objectiveId === action.payload).map(p => p.id);
            newState.objectives = newState.objectives.filter(o => o.id !== action.payload);
            newState.projects = newState.projects.filter(p => p.objectiveId !== action.payload);
            newState.tasks = newState.tasks.map(t => projectsToDelete.includes(t.projectId || '') ? { ...t, projectId: undefined } : t);
            break;
        case 'ARCHIVE_OBJECTIVE':
            newState.objectives = newState.objectives.map(o => o.id === action.payload ? { ...o, isArchived: true } : o);
            break;
        case 'UNARCHIVE_OBJECTIVE':
            newState.objectives = newState.objectives.map(o => o.id === action.payload ? { ...o, isArchived: false } : o);
            break;
        case 'ADD_PROJECT':
            const newProject = { 
                id: String(Date.now()), 
                title: action.payload.title, 
                objectiveId: action.payload.objectiveId, 
                createdAt: new Date().toISOString(),
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,
            };
            newState.projects = [...newState.projects, newProject];
            break;
        case 'UPDATE_PROJECT':
            newState.projects = newState.projects.map(p => p.id === action.payload.id ? action.payload : p);
            break;
        case 'DELETE_PROJECT':
            newState.projects = newState.projects.filter(p => p.id !== action.payload);
            newState.tasks = newState.tasks.map(t => t.projectId === action.payload ? { ...t, projectId: undefined } : t);
            break;
        case 'ARCHIVE_PROJECT':
            newState.projects = newState.projects.map(p => p.id === action.payload ? { ...p, isArchived: true } : p);
            break;
        case 'UNARCHIVE_PROJECT':
            newState.projects = newState.projects.map(p => p.id === action.payload ? { ...p, isArchived: false } : p);
            break;
        case 'ACKNOWLEDGE_PROJECT_COMPLETION':
            newState.recentlyCompletedProjectIds = newState.recentlyCompletedProjectIds.filter(id => id !== action.payload);
            break;
        case 'UPDATE_CHILD_PROFILE':
            newState.childProfiles = {
                ...newState.childProfiles,
                [action.payload.persona]: {
                    ...newState.childProfiles[action.payload.persona],
                    ...action.payload.profileData,
                }
            };
            break;
        case 'ADD_SHARED_EXPENSE':
            const newSharedExpense = { ...action.payload, id: String(Date.now()), date: new Date().toISOString(), status: 'pending' };
            newState.sharedExpenses = [newSharedExpense, ...newState.sharedExpenses];
            break;
        case 'UPDATE_SHARED_EXPENSE_STATUS':
            newState.sharedExpenses = newState.sharedExpenses.map(exp => 
                exp.id === action.payload.id ? { ...exp, status: action.payload.status } : exp
            );
            break;
        case 'SAVE_CONTEXT':
            newState.savedContext = { ...action.payload, timestamp: new Date().toISOString() };
            break;
        case 'CLEAR_CONTEXT':
            newState.savedContext = null;
            break;
        case 'SET_CONTEXT_CAPTURE_MODAL_OPEN':
            newState.isContextCaptureModalOpen = action.payload;
            break;
        case 'SET_CONTEXT_RESTORE_MODAL_OPEN':
            newState.isContextRestoreModalOpen = action.payload;
            break;
        case 'ADD_TOAST':
            newState.toastNotifications = [...newState.toastNotifications, action.payload];
            break;
        case 'REMOVE_TOAST':
            newState.toastNotifications = newState.toastNotifications.filter(t => t.id !== action.payload);
            break;
        case 'ADD_CHAT_MESSAGE':
            const newChatMessage = { ...action.payload, id: String(Date.now()), timestamp: new Date().toISOString() };
            newState.chatMessages = [...newState.chatMessages, newChatMessage];
            break;
        case 'IMPORT_STATE':
            // Ensure dismissedNudges is an array, providing a fallback if the imported state is older
            const importedState = { ...action.payload, dismissedNudges: Array.isArray(action.payload.dismissedNudges) ? action.payload.dismissedNudges : [] };
            return importedState;
        case 'DISMISS_NUDGE':
            if (!newState.dismissedNudges.includes(action.payload)) {
                newState.dismissedNudges = [...newState.dismissedNudges, action.payload];
            }
            break;
        
        default:
             console.warn("Unhandled user-dispatched action:", action);
             break;
    }
    return newState;
}



const AppStateContext = createContext(undefined);

export const AppStateProvider = ({ children }) => {
  const [authUser, setAuthUser] = React.useState(undefined);
  const [appState, setAppState] = React.useState(null);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setAuthUser(user ? { uid: user.uid, email: user.email } : null);
        if (!user) {
            setAppState(null);
        }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to data changes for the logged-in user
  useEffect(() => {
    if (authUser) {
      const unsubscribe = db.onSnapshot(authUser.uid, (userState) => {
        setAppState(userState);
      });
      return () => unsubscribe();
    }
  }, [authUser]);

  // Create a dispatch function that writes to the database
  const dispatchWrapper = (action) => {
    if (authUser && appState) {
      const newState = userReducer(appState, action);
      // Asynchronously update the database, the UI will update via the onSnapshot listener
      db.setDoc(authUser.uid, newState).catch(console.error);
    }
  };

  const contextValue = { authUser, appState, dispatch: dispatchWrapper };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};