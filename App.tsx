import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './contexts/AppStateContext.tsx';
import Header from './components/Header.tsx';
import SystemResetModal from './components/SystemResetModal.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import WonkyAISetupGuide from './components/WonkyAISetupGuide.tsx'; 
import LiveChatModal from './components/LiveChatModal.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import { useCommandPalette } from './hooks/useCommandPalette.ts';
import ContextSwitchCaptureModal from './components/ContextSwitchCaptureModal.tsx';
import ContextSwitchRestoreModal from './components/ContextSwitchRestoreModal.tsx';
import { useAchievementEngine } from './hooks/useAchievementEngine.ts';
import ToastContainer from './components/ToastContainer.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';


// Import all view components
import WilliamsDashboard from './components/WilliamsDashboard.tsx';
import WillowsDashboard from './components/WillowsDashboard.tsx';
import SebastiansDashboard from './components/SebastiansDashboard.tsx';
import CoParentingDashboard from './components/CoParentingDashboard.tsx';
import SopVault from './components/SopVault.tsx';
import WeeklyReview from './components/WeeklyReview.tsx';
import ArchiveLog from './components/ArchiveLog.tsx';
import StrategicRoadmap from './components/StrategicRoadmap.tsx';
import DailyDebrief from './components/DailyDebrief.tsx';
import Manifesto from './components/Manifesto.tsx';
import UserSopView from './components/UserSopView.tsx';
import SopForm from './components/SopForm.tsx';
import AllChecklists from './components/AllChecklists.tsx';
import CoParentingDashboardBuilder from './components/CoParentingDashboardBuilder.tsx';
import WilliamDashboardBuilder from './components/WilliamDashboardBuilder.tsx';
import WillowsDashboardBuilder from './components/WillowsDashboardBuilder.tsx';
import SebastiansDashboardBuilder from './components/SebastiansDashboardBuilder.tsx';
import SystemInsights from './components/SystemInsights.tsx';
import GameMasterDashboard from './components/GameMasterDashboard.tsx';
import GardenView from './components/GardenView.tsx';
import CommandCenter from './components/CommandCenter.tsx';
import DailyReport from './components/DailyReport.tsx';
import { componentMap } from './components/componentMap.ts';
import ModuleViewWrapper from './components/ModuleViewWrapper.tsx';
import { ALL_WILLIAM_MODULES_CONFIG } from './constants.ts';
import { SOP_DATA } from './constants.ts';
import ProtocolView from './components/ProtocolView.tsx';
import GenericChecklistModule from './components/GenericChecklistModule.tsx';
import TechnicalManual from './components/TechnicalManual.tsx';
import DesignLanguageProtocol from './components/DesignLanguageProtocol.tsx';
import OperatingManual from './components/OperatingManual.tsx';
import DeploymentProtocol from './components/DeploymentProtocol.tsx';


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