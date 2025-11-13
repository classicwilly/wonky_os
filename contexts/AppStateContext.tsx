import React, { createContext, useContext, ReactNode, useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.tsx';
import { AppState, Action, ViewType, Mood, Energy, KidLocation, Sop, CalendarEvent, PersonaType, ModuleKey, WillowModuleKey, SebastianModuleKey, CoParentingModuleKey } from '../types.tsx';
import { SOP_DATA, ALL_WILLIAM_MODULES_CONFIG, ALL_WILLOW_MODULES_CONFIG, ALL_SEBASTIAN_MODULES_CONFIG, ALL_CO_PARENTING_MODULES_CONFIG } from '../constants.tsx';

const defaultState: AppState = {
  view: 'dashboard-launcher',
  checkedItems: {},
  textInputs: {},
  statusMood: null,
  statusEnergy: null,
  kidsWillowLocation: null,
  kidsSebastianLocation: null,
  collectedGems: {
    willow: [],
    sebastian: [],
  },
  collectedAchievements: [],
  userSops: [],
  modifiedSops: {},
  isModMode: false,
  calendarEvents: [],
  currentPersona: 'launcher', // Initialize to 'launcher' to show selection screen
  williamDashboardModules: ALL_WILLIAM_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id), // Default enabled modules for William
  willowDashboardModules: ALL_WILLOW_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id), // Default enabled modules for Willow
  sebastianDashboardModules: ALL_SEBASTIAN_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id), // Default enabled modules for Sebastian
  coParentingDashboardModules: ALL_CO_PARENTING_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id), // Default enabled modules for Co-Parenting
  // FIX: Added missing properties to defaultState.
  initialSetupComplete: false, // Tracks if the initial setup guide has been completed
  activeSops: [], // Stores IDs of SOPs selected by William to display on his dashboard
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'TOGGLE_CHECKED':
      return {
        ...state,
        checkedItems: {
          ...state.checkedItems,
          [action.payload]: !state.checkedItems[action.payload],
        },
      };
    case 'SET_TEXT_INPUT':
      return {
        ...state,
        textInputs: {
          ...state.textInputs,
          [action.payload.id]: action.payload.value,
        },
      };
    case 'SET_MOOD':
      return { ...state, statusMood: action.payload };
    case 'SET_ENERGY':
      return { ...state, statusEnergy: action.payload };
    case 'SET_KID_LOCATION':
      if (action.payload.kid === 'willow') {
        return { ...state, kidsWillowLocation: action.payload.location };
      }
      return { ...state, kidsSebastianLocation: action.payload.location };
    case 'ADD_GEM':
      const { id, recipient } = action.payload;
      const currentGems = state.collectedGems[recipient] || [];
      if (currentGems.includes(id)) return state;
      return {
        ...state,
        collectedGems: {
          ...state.collectedGems,
          [recipient]: [...currentGems, id],
        },
      };
    case 'ADD_ACHIEVEMENT':
      if (state.collectedAchievements.includes(action.payload)) return state;
      return {
        ...state,
        collectedAchievements: [...state.collectedAchievements, action.payload],
      };
    case 'ADD_SOP':
      return { ...state, userSops: [...state.userSops, action.payload] };
    case 'UPDATE_SOP':
      return {
        ...state,
        modifiedSops: { ...state.modifiedSops, [action.payload.id]: action.payload },
      };
    case 'RESET_SOP':
      const newModifiedSops = { ...state.modifiedSops };
      delete newModifiedSops[action.payload];
      return { ...state, modifiedSops: newModifiedSops };
    case 'TOGGLE_MOD_MODE':
      return { ...state, isModMode: !state.isModMode };
    case 'ADD_CALENDAR_EVENT':
      const newEvent: CalendarEvent = { ...action.payload, id: String(Date.now()) };
      return {
        ...state,
        calendarEvents: [...state.calendarEvents, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      };
    case 'REMOVE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.filter(event => event.id !== action.payload),
      };
    case 'RESET_CHECKLISTS_AND_INPUTS':
      return { ...state, checkedItems: {}, textInputs: {} };
    case 'RESET_REWARDS':
      return { ...state, collectedGems: { willow: [], sebastian: [] }, collectedAchievements: [] };
    case 'SET_PERSONA': // New action to set the current persona
      // When switching personas, reset the view to a default for that persona.
      // For 'launcher', default view is 'dashboard-launcher'.
      // For specific personas, can have a default view (e.g., 'command-center' for william)
      let defaultViewForPersona: ViewType;
      switch(action.payload) {
        case 'william': defaultViewForPersona = 'williams-dashboard'; break; // Changed to williams-dashboard
        case 'willow': defaultViewForPersona = 'willows-dashboard'; break; // Changed to willows-dashboard
        case 'sebastian': defaultViewForPersona = 'sebastians-dashboard'; break; // Changed to sebastians-dashboard
        case 'co-parenting': defaultViewForPersona = 'co-parenting-dashboard'; break; // Changed to co-parenting-dashboard
        case 'launcher':
        default: defaultViewForPersona = 'dashboard-launcher'; break;
      }
      return { ...state, currentPersona: action.payload, view: defaultViewForPersona };
    case 'SET_WILL_DASHBOARD_MODULES':
      return { ...state, williamDashboardModules: action.payload };
    case 'SET_WILLOW_DASHBOARD_MODULES': // New action for Willow's modules
      return { ...state, willowDashboardModules: action.payload };
    case 'SET_SEBASTIAN_DASHBOARD_MODULES': // New action for Sebastian's modules
      return { ...state, sebastianDashboardModules: action.payload };
    case 'SET_CO_PARENTING_DASHBOARD_MODULES': // New action for Co-Parenting modules
      return { ...state, coParentingDashboardModules: action.payload };
    case 'SET_INITIAL_SETUP_COMPLETE': // Action to mark setup as complete
      return { ...state, initialSetupComplete: action.payload };
    case 'SET_ACTIVE_SOPS': // Action to update active SOPs
      return { ...state, activeSops: action.payload };
    default:
      return state;
  }
}

interface AppStateContextType {
  appState: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedState, setStoredState] = useLocalStorage<AppState>('wonky-sprout-os-state', defaultState);
  
  const reducerWithLocalStorage = (state: AppState, action: Action) => {
    const newState = appReducer(state, action);
    setStoredState(newState);
    return newState;
  };
  
  const [appState, dispatch] = useReducer(reducerWithLocalStorage, storedState);

  return (
    <AppStateContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};