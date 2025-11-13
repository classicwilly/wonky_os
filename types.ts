// Fix: Added React import for React.FC type definitions
import React from 'react';
export type ViewType = 
  'sop-vault' |
  'weekly-review' |
  'manifesto' |
  'foundational-protocols' | 
  'family-structure-mode' |
  'classic-willy-protocol' | 
  'context-switching' | 
  'executive-dysfunction' | 
  'sensory-overload' |
  'life-maintenance-protocol' |
  'morning-transition-protocol' |
  'personal-hygiene-protocol' |
  'bubble-shield-protocol' |
  'command-center-setup' |
  'pixel-fold-setup' |
  'accessibility-safety' |
  'create-sop' |
  'system-integration' |
  'co-parenting-dashboard' |
  'co-parenting-dashboard-builder' |
  'all-checklists' |
  'williams-dashboard' |
  'dashboard-launcher' |
  'solo-execution-mode' |
  'headphone-controller-ipi' |
  'william-dashboard-builder' |
  'willows-dashboard' |
  'willow-dashboard-builder' |
  'sebastians-dashboard' |
  'sebastian-dashboard-builder' |
  'wonky-ai-setup-guide'; // New view type for initial setup guide

export type SopSubCategory = 'foundational' | 'mode' | 'maintenance' | 'hardware' | 'meta' | 'kids' | 'ipi';

export type PersonaType = 'launcher' | 'william' | 'willow' | 'sebastian' | 'co-parenting';

// Fix: Defined Sop interface here to break circular dependency with constants.ts
export interface Sop {
  id: string;
  category: string;
  subCategory?: SopSubCategory;
  viewId?: ViewType;
  title: string;
  description: string;
  steps?: string[];
  cues?: string[];
}

export type Mood = 'Focused' | 'Calm' | 'Overwhelmed' | null;
export type Energy = 'High' | 'Medium' | 'Low' | null;
export type KidLocation = "At Mom's" | "With Me" | "School/Other" | null;

export interface CollectedGems {
  willow: string[];
  sebastian: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  type: 'appointment' | 'school' | 'handoff' | 'other';
}

// New types for dashboard modules (William)
export type ModuleKey = 
  'william-core-dashboard-module' |
  'day-progress-bar-module' |
  'status-tracker-module' |
  'essentials-tracker-module' |
  'kids-tracker-module' |
  'wonky-ai-module' |
  'achievement-tracker-module' |
  'active-sops-module' | // New module for displaying selected SOPs
  'active-sops-selector-module'; // New module for selecting active SOPs

export interface ModuleConfig {
  id: ModuleKey;
  name: string;
  description: string;
  component: React.FC<any>; // Component type, 'any' for flexibility but better to define specific props
  defaultEnabled: boolean;
  category: 'core' | 'trackers' | 'utilities' | 'content' | 'selection'; // Added 'content' and 'selection'
}

// New types for dashboard modules (Willow)
export type WillowModuleKey = 
  'willow-checklist-module' |
  'willow-gem-collector-module';

export interface WillowModuleConfig {
  id: WillowModuleKey;
  name: string;
  description: string;
  component: React.FC<any>; 
  defaultEnabled: boolean;
  category: 'checklists' | 'rewards';
}

// New types for dashboard modules (Sebastian)
export type SebastianModuleKey = 
  'sebastian-checklist-module' |
  'sebastian-gem-collector-module';

export interface SebastianModuleConfig {
  id: SebastianModuleKey;
  name: string;
  description: string;
  component: React.FC<any>; 
  defaultEnabled: boolean;
  category: 'checklists' | 'rewards';
}

// New types for dashboard modules (Co-Parenting)
export type CoParentingModuleKey = 
  'ai-communication-coach-module' |
  'shared-calendar-module';

export interface CoParentingModuleConfig {
  id: CoParentingModuleKey;
  name: string;
  description: string;
  component: React.FC<any>; 
  defaultEnabled: boolean;
  category: 'communication' | 'scheduling';
}

export interface AppState {
  view: ViewType;
  checkedItems: { [key: string]: boolean };
  textInputs: { [key: string]: string };
  statusMood: Mood;
  statusEnergy: Energy;
  kidsWillowLocation: KidLocation;
  kidsSebastianLocation: KidLocation;
  collectedGems: CollectedGems;
  collectedAchievements: string[];
  userSops: Sop[];
  modifiedSops: { [id: string]: Sop };
  isModMode: boolean;
  calendarEvents: CalendarEvent[];
  currentPersona: PersonaType; // New field to track the active persona dashboard
  williamDashboardModules: ModuleKey[]; // Array of module IDs currently enabled for William's dashboard
  willowDashboardModules: WillowModuleKey[]; // Array of module IDs currently enabled for Willow's dashboard
  sebastianDashboardModules: SebastianModuleKey[]; // Array of module IDs currently enabled for Sebastian's dashboard
  coParentingDashboardModules: CoParentingModuleKey[]; // Array of module IDs currently enabled for Co-Parenting dashboard
  initialSetupComplete: boolean; // Tracks if the initial setup guide has been completed
  activeSops: string[]; // Stores IDs of SOPs selected by William to display on his dashboard
}

export type Action =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'TOGGLE_CHECKED'; payload: string }
  | { type: 'SET_TEXT_INPUT'; payload: { id: string; value: string } }
  | { type: 'SET_MOOD'; payload: Mood }
  | { type: 'SET_ENERGY'; payload: Energy }
  | { type: 'SET_KID_LOCATION'; payload: { kid: 'willow' | 'sebastian'; location: KidLocation } }
  | { type: 'ADD_GEM'; payload: { id: string; recipient: 'willow' | 'sebastian' } }
  | { type: 'ADD_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_SOP'; payload: Sop }
  | { type: 'UPDATE_SOP'; payload: Sop }
  | { type: 'RESET_SOP'; payload: string }
  | { type: 'TOGGLE_MOD_MODE' }
  | { type: 'ADD_CALENDAR_EVENT'; payload: Omit<CalendarEvent, 'id'> }
  | { type: 'REMOVE_CALENDAR_EVENT'; payload: string }
  | { type: 'RESET_CHECKLISTS_AND_INPUTS' }
  | { type: 'RESET_REWARDS' }
  | { type: 'SET_PERSONA'; payload: PersonaType }
  | { type: 'SET_WILL_DASHBOARD_MODULES'; payload: ModuleKey[] }
  | { type: 'SET_WILLOW_DASHBOARD_MODULES'; payload: WillowModuleKey[] }
  | { type: 'SET_SEBASTIAN_DASHBOARD_MODULES'; payload: SebastianModuleKey[] }
  | { type: 'SET_CO_PARENTING_DASHBOARD_MODULES'; payload: CoParentingModuleKey[] }
  | { type: 'SET_INITIAL_SETUP_COMPLETE'; payload: boolean } // Action to mark setup as complete
  | { type: 'SET_ACTIVE_SOPS'; payload: string[] }; // Action to update active SOPs