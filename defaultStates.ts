import { ALL_WILLIAM_MODULES_CONFIG, ALL_WILLOW_MODULES_CONFIG, ALL_SEBASTIAN_MODULES_CONFIG, ALL_CO_PARENTING_MODULES_CONFIG } from './constants.js';

const today = new Date();
const todayYMD = today.toISOString().split('T')[0];
const handoffTime = new Date(today);
handoffTime.setHours(16, 0, 0, 0);

// This is the default state for a *new* user.
export const defaultUserState = {
  view: 'garden-view', // This will be overwritten by dashboardType
  dashboardType: 'william',
  checkedItems: {},
  textInputs: {},
  statusMood: 'Overwhelmed',
  statusEnergy: 'Low',
  kidsWillowLocation: 'School/Other',
  kidsSebastianLocation: 'School/Other',
  collectedGems: { willow: [], sebastian: [] },
  collectedAchievements: {},
  userSops: [],
  userSopTemplates: [],
  modifiedSops: {},
  isModMode: false,
  calendarEvents: [
    { id: 'default-event-1', title: 'Kids Arrive (Handoff)', date: handoffTime.toISOString(), type: 'handoff' }
  ],
  williamDashboardModules: ALL_WILLIAM_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  willowDashboardModules: ALL_WILLOW_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  sebastianDashboardModules: ALL_SEBASTIAN_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  coParentingDashboardModules: ALL_CO_PARENTING_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  initialSetupComplete: false, // Start as false for new users
  activeSops: [],
  activeUserSopId: null,
  activeSopTemplate: null,
  newSopType: null,
  brainDumpText: '...and do all the other shit.',
  sensoryState: { sound: null, sight: null, touch: null },
  familyLogEntries: [],
  generatedSopDraft: null,
  quickReferenceEntries: [],
  habitTracker: { habits: [], log: {} },
  expenses: [],
  knowledgeVaultEntries: [],
  recurringTasks: [],
  tasks: [
    { id: 'task-xbox', title: "Fix Bash's Xbox", status: 'todo', dueDate: todayYMD, priority: 'High', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
    { id: 'task-kitchen', title: "Perform daily kitchen maintenance (5 min)", status: 'todo', dueDate: todayYMD, priority: 'High', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
    { id: 'task-bathroom', title: "Perform daily bathroom maintenance (5 min)", status: 'todo', dueDate: todayYMD, priority: 'High', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
    { id: 'task-car', title: "Progress on Willow's car", status: 'todo', dueDate: todayYMD, priority: 'Medium', projectId: 'proj-willow-car', createdAt: new Date().toISOString(), completedAt: null },
    { id: 'task-living', title: "Perform daily living space maintenance (5 min)", status: 'todo', dueDate: todayYMD, priority: 'Medium', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
  ],
  financialBudgets: { 'Housing': 0, 'Utilities': 0, 'Groceries': 0, 'Transport': 0, 'Health': 0, 'Kids': 0, 'Personal': 0, 'Other': 0, 'School': 0 },
  pomodoroState: { mode: 'work', timeLeft: 25 * 60, isActive: false, taskId: null, workSessionsCompleted: 0 },
  acknowledgedRewards: { willow: [], sebastian: [] },
  redeemedRewards: { willow: [], sebastian: [] },
  acknowledgedRedemptions: { willow: [], sebastian: [] },
  parentalAlerts: [],
  editingSopId: null,
  quests: [],
  fulfillmentLog: [],
  objectives: [
    { id: 'obj-willow-car', title: "Restore Willow's Power Wheels Car", createdAt: new Date().toISOString() }
  ],
  projects: [
    { id: 'proj-willow-car', title: "Willow's Car Restoration", objectiveId: 'obj-willow-car', createdAt: new Date().toISOString() }
  ],
  recentlyCompletedProjectIds: [],
  isFocusModeActive: false,
  focusModeTaskId: null,
  snoozedTaskIds: [],
  isTriageModeActive: false,
  triageTaskId: null,
  childProfiles: {
    willow: { allergies: '', medications: '', emergencyContacts: '', schoolInfo: '' },
    sebastian: { allergies: '', medications: '', emergencyContacts: '', schoolInfo: '' },
  },
  sharedExpenses: [],
  savedContext: null,
  isContextCaptureModalOpen: false,
  isContextRestoreModalOpen: false,
  toastNotifications: [],
  chatMessages: [],
  dismissedNudges: [],
};