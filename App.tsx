import React, { useState } from 'react';
import LifeMaintenanceProtocol from './components/LifeMaintenanceProtocol.tsx';
import MorningTransitionProtocol from './components/MorningTransitionProtocol.tsx';
import PersonalHygieneProtocol from './components/PersonalHygieneProtocol.tsx';
import SoloExecutionModeProtocol from './components/SoloExecutionModeProtocol.tsx';
import CommandCenterSetupSop from './components/CommandCenterSetupSop.tsx';
import PixelFoldSetupSop from './components/PixelFoldSetupSop.tsx';
import AccessibilitySafetyProtocol from './components/AccessibilitySafetyProtocol.tsx';
import BubbleShieldProtocol from './components/BubbleShieldProtocol.tsx';
import Manifesto from './components/Manifesto.tsx';
import HeadphoneControllerIpi from './components/HeadphoneControllerIpi.tsx';
import { useCurrentMode } from './hooks/useCurrentMode.tsx';
import { AppStateProvider, useAppState } from './contexts/AppStateContext.tsx';
import Header from './components/Header.tsx';
import SopForm from './components/SopForm.tsx';
import SystemIntegrationGuide from './components/SystemIntegrationGuide.tsx';
import AllChecklists from './components/AllChecklists.tsx';
import CoParentingDashboard from './components/CoParentingDashboard.tsx'; // Renamed and refactored
import CoParentingDashboardBuilder from './components/CoParentingDashboardBuilder.tsx'; // New import for Co-Parenting dashboard builder
import SystemResetModal from './components/SystemResetModal.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import DashboardLauncher from './components/DashboardLauncher.tsx';
import WilliamsDashboard from './components/WilliamsDashboard.tsx'; // New import for William's main dashboard
import WilliamDashboardBuilder from './components/WilliamDashboardBuilder.tsx'; // New import for William's dashboard builder
import WillowsDashboard from './components/WillowsDashboard.tsx'; // New import for Willow's main dashboard (renamed)
import WillowsDashboardBuilder from './components/WillowsDashboardBuilder.tsx'; // New import for Willow's dashboard builder
import SopVault from './components/SopVault.tsx';
import WeeklyReview from './components/WeeklyReview.tsx';
import FoundationalProtocols from './components/FoundationalProtocols.tsx';
import FamilyStructureModeProtocol from './components/FamilyStructureModeProtocol.tsx';
import ClassicWillyProtocol from './components/ClassicWillyProtocol.tsx';
import ContextSwitchingProtocol from './components/ContextSwitchingProtocol.tsx';
import ExecutiveDysfunctionProtocol from './components/ExecutiveDysfunctionProtocol.tsx';
import SensoryOverloadProtocol from './components/SensoryOverloadProtocol.tsx';
import SebastiansDashboard from './components/SebastiansDashboard.tsx'; // New import for Sebastian's main dashboard (renamed)
import SebastiansDashboardBuilder from './components/SebastiansDashboardBuilder.tsx'; // New import for Sebastian's dashboard builder
import WonkyAISetupGuide from './components/WonkyAISetupGuide.tsx'; // New import for the initial setup guide


const AppContent: React.FC = () => {
  const { appState, dispatch } = useAppState();
  const currentMode = useCurrentMode(); // Keep for child components that might need it
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  // Content for each view type
  const renderView = () => {
    // If setup is not complete, ONLY render the setup guide.
    // This is the top-level control for mandatory onboarding.
    if (!appState.initialSetupComplete) {
      return <WonkyAISetupGuide />;
    }

    // Once setup is complete, render based on the current view state.
    switch (appState.view) {
      case 'dashboard-launcher':
        return <DashboardLauncher />;
      case 'williams-dashboard':
        return <WilliamsDashboard />;
      case 'william-dashboard-builder':
        return <WilliamDashboardBuilder />;
      case 'willows-dashboard':
        return <WillowsDashboard />;
      case 'willow-dashboard-builder':
        return <WillowsDashboardBuilder />;
      case 'sebastians-dashboard':
        return <SebastiansDashboard />;
      case 'sebastian-dashboard-builder':
        return <SebastiansDashboardBuilder />;
      case 'co-parenting-dashboard':
        return <CoParentingDashboard />;
      case 'co-parenting-dashboard-builder':
        return <CoParentingDashboardBuilder />;
      case 'sop-vault':
        return <SopVault />;
      case 'weekly-review':
        return <WeeklyReview />;
      case 'manifesto':
        return <Manifesto />;
      case 'foundational-protocols':
        return <FoundationalProtocols />;
      case 'family-structure-mode':
        return <FamilyStructureModeProtocol />;
      case 'solo-execution-mode':
        return <SoloExecutionModeProtocol />;
      case 'classic-willy-protocol':
        return <ClassicWillyProtocol />;
      case 'context-switching':
        return <ContextSwitchingProtocol />;
      case 'executive-dysfunction':
        return <ExecutiveDysfunctionProtocol />;
      case 'sensory-overload':
        return <SensoryOverloadProtocol />;
      case 'life-maintenance-protocol':
        return <LifeMaintenanceProtocol />;
      case 'morning-transition-protocol':
        return <MorningTransitionProtocol />;
      case 'personal-hygiene-protocol':
        return <PersonalHygieneProtocol />;
      case 'bubble-shield-protocol':
        return <BubbleShieldProtocol />;
      case 'command-center-setup':
        return <CommandCenterSetupSop />;
      case 'pixel-fold-setup':
        return <PixelFoldSetupSop />;
      case 'accessibility-safety':
        return <AccessibilitySafetyProtocol />;
      case 'create-sop':
        return <SopForm />;
      case 'system-integration':
        return <SystemIntegrationGuide />;
      case 'all-checklists':
        return <AllChecklists />;
      case 'headphone-controller-ipi':
        return <HeadphoneControllerIpi />;
      default:
        // Default to the DashboardLauncher if an unhandled view is somehow active
        // This acts as a safe fallback once initial setup is complete
        return <DashboardLauncher />;
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-light flex flex-col">
      <Header openResetModal={() => setResetModalOpen(true)} />
      <main id="main-content" className="flex-grow container mx-auto px-4 py-8 md:px-6 relative">
        {renderView()}
      </main>
      <SystemResetModal isOpen={isResetModalOpen} onClose={() => setResetModalOpen(false)} />
      <ScrollToTopButton />
    </div>
  );
};

const App: React.FC = () => (
  <AppStateProvider>
    <AppContent />
  </AppStateProvider>
);

export default App;