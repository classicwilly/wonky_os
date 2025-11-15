import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './contexts/AppStateContext';
import Header from './components/Header';
import SystemResetModal from './components/SystemResetModal';
import ScrollToTopButton from './components/ScrollToTopButton';
import AuthScreen from './components/AuthScreen';
import WonkyAISetupGuide from './components/WonkyAISetupGuide'; 
import LiveChatModal from './components/LiveChatModal';
import CommandPalette from './components/CommandPalette';
import { useCommandPalette } from './hooks/useCommandPalette';
import ContextSwitchCaptureModal from './components/ContextSwitchCaptureModal';
import ContextSwitchRestoreModal from './components/ContextSwitchRestoreModal';
import { useAchievementEngine } from './hooks/useAchievementEngine';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';


// Import all view components
import WilliamsDashboard from './components/WilliamsDashboard';
import WillowsDashboard from './components/WillowsDashboard';
import SebastiansDashboard from './components/SebastiansDashboard';
import CoParentingDashboard from './components/CoParentingDashboard';
import SopVault from './components/SopVault';
import WeeklyReview from './components/WeeklyReview';
import ArchiveLog from './components/ArchiveLog';
import StrategicRoadmap from './components/StrategicRoadmap';
import DailyDebrief from './components/DailyDebrief';
import Manifesto from './components/Manifesto';
import UserSopView from './components/UserSopView';
import SopForm from './components/SopForm';
import AllChecklists from './components/AllChecklists';
import CoParentingDashboardBuilder from './components/CoParentingDashboardBuilder';
import WilliamDashboardBuilder from './components/WilliamDashboardBuilder';
import WillowsDashboardBuilder from './components/WillowsDashboardBuilder';
import SebastiansDashboardBuilder from './components/SebastiansDashboardBuilder';
import SystemInsights from './components/SystemInsights';
import GameMasterDashboard from './components/GameMasterDashboard';
import GardenView from './components/GardenView';
import CommandCenter from './components/CommandCenter';
import DailyReport from './components/DailyReport';
import { componentMap } from './components/componentMap';
import ModuleViewWrapper from './components/ModuleViewWrapper';
import { ALL_WILLIAM_MODULES_CONFIG } from './constants';
import { SOP_DATA } from './constants';
import ProtocolView from './components/ProtocolView';
import GenericChecklistModule from './components/GenericChecklistModule';
import TechnicalManual from './components/TechnicalManual';
import DesignLanguageProtocol from './components/DesignLanguageProtocol';
import OperatingManual from './components/OperatingManual';
import DeploymentProtocol from './components/DeploymentProtocol';


const AppContent = () => {
  const { appState } = useAppState();
  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [isLiveChatOpen, setLiveChatOpen] = useState(false);
  
  // Command Palette Hook
  const { commandPaletteProps } = useCommandPalette();
  
  // Achievement Engine Hook
  useAchievementEngine();

  // If initial setup is not complete, show the guide.
  if (!appState.initialSetupComplete) {
    return <WonkyAISetupGuide />;
  }

  const renderView = () => {
    const { view } = appState;
    
    const viewMap = {
        'garden-view': <GardenView />,
        'operations-control': <WilliamsDashboard />,
        'willows-dashboard': <WillowsDashboard />,
        'sebastians-dashboard': <SebastiansDashboard />,
        'co-parenting-dashboard': <CoParentingDashboard />,
        'game-master-dashboard': <GameMasterDashboard />,
        'sop-vault': <SopVault />,
        'weekly-review': <WeeklyReview />,
        'archive-log': <ArchiveLog />,
        'strategic-roadmap': <StrategicRoadmap />,
        'daily-debrief': <DailyDebrief />,
        'command-center': <CommandCenter />,
        'daily-report': <DailyReport />,
        'all-checklists': <AllChecklists />,
        'system-insights': <SystemInsights />,
        'create-sop': <SopForm />,
        'william-dashboard-builder': <WilliamDashboardBuilder />,
        'willow-dashboard-builder': <WillowsDashboardBuilder />,
        'sebastian-dashboard-builder': <SebastiansDashboardBuilder />,
        'co-parenting-dashboard-builder': <CoParentingDashboardBuilder />,
        'user-sop-view': <UserSopView />,
        'manifesto': <Manifesto />,
        'technical-manual': <TechnicalManual />,
        'design-language-protocol': <DesignLanguageProtocol />,
        'operating-manual': <OperatingManual />,
        'deployment-protocol': <DeploymentProtocol />,
    };

    // Dynamically add all SOP/Protocol views
    SOP_DATA.forEach(sop => {
        // Find the component that already renders this protocol
        const ProtocolComponent = (props) => <ProtocolView sourceDocument={sop.title} {...props} />;
        viewMap[sop.viewId] = <ProtocolComponent />;
    });

    // Add module views dynamically
    ALL_WILLIAM_MODULES_CONFIG.forEach(module => {
        const isChecklistModule = module.id.startsWith('checklist-module-');
        
        let ModuleComponent;
        let props = {};

        if (isChecklistModule) {
            ModuleComponent = GenericChecklistModule;
            // Extract source document from module name "Checklist: Life Maintenance Protocol" -> "Life Maintenance Protocol"
            const sourceDocument = module.name.replace('Checklist: ', '');
            props = { sourceDocument };
        } else {
            ModuleComponent = componentMap[module.id];
        }

        if (ModuleComponent) {
            viewMap[`view-${module.id}`] = (
                <ModuleViewWrapper title={module.name}>
                    <ModuleComponent {...props} />
                </ModuleViewWrapper>
            );
        }
    });

    const component = viewMap[view];
    if (component) return component;
    
    // Default Fallback to Garden View
    return <GardenView />;
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-light flex flex-col">
      <Header openResetModal={() => setResetModalOpen(true)} />
      <main id="main-content" className="flex-grow container mx-auto px-4 py-8 md:px-6 relative">
        {renderView()}
      </main>
      <SystemResetModal isOpen={isResetModalOpen} onClose={() => setResetModalOpen(false)} />
      <ScrollToTopButton />
      {isLiveChatOpen && <LiveChatModal onClose={() => setLiveChatOpen(false)} />}
      <CommandPalette {...commandPaletteProps} />
      {appState.isContextCaptureModalOpen && <ContextSwitchCaptureModal />}
      {appState.isContextRestoreModalOpen && <ContextSwitchRestoreModal />}
      <ToastContainer />
      {appState.dashboardType === 'william' && (
          <button
            onClick={() => setLiveChatOpen(true)}
            className="fixed bottom-6 right-20 z-30 no-print bg-accent-green text-background-dark p-4 rounded-full shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-accent-green transition-transform hover:scale-110"
            aria-label="Open Live Chat AI"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-1.293 1.293a1 1 0 001.414 1.414L6 12.414V13a6 6 0 006 6 6 6 0 006-6v-1.586l2.293-2.293a1 1 0 00-1.414-1.414L14 11.414V8a6 6 0 00-4-5.658V2a1 1 0 10-2 0v.342A5.963 5.963 0 0010 2z" />
              </svg>
          </button>
      )}
    </div>
  );
};

const Root = () => {
  const { authUser, appState } = useAppState();

  // Auth state is loading
  if (authUser === undefined) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  // User is logged in, but their state hasn't loaded from DB yet
  if (authUser && !appState) {
    return <LoadingSpinner message="Loading Sprout OS..." />;
  }
  
  // User is logged in and state is loaded
  if (authUser && appState) {
    return <AppContent />;
  }

  // No user, show login
  return <AuthScreen />;
};

const App = () => (
  <AppStateProvider>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </AppStateProvider>
);

export default App;