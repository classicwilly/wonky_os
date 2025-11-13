import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';
import { ViewType, PersonaType } from '../types.tsx';

interface HeaderProps {
  openResetModal: () => void;
}

interface NavItemProps {
  label: string;
  view: ViewType;
  // allowedPersonas?: PersonaType[]; // Removed: Filtering is handled by getNavItems
}

const NavItem: React.FC<NavItemProps> = ({ label, view }) => {
    const { appState, dispatch } = useAppState();
    const isActive = appState.view === view;

    // NavItems are now only rendered if they are relevant to the current persona
    // and if the current persona is not 'launcher' (handled by getNavItems)

    return (
        <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: view })}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                isActive ? 'bg-accent-blue text-background-dark' : 'text-text-light hover:bg-gray-700'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className="truncate">{label}</span>
        </button>
    );
};

interface DropdownMenuProps {
    openResetModal: () => void;
    onItemClick: (view: ViewType) => void;
    onSwitchDashboard: () => void; // New prop for switching dashboard
    onCustomizeWilliamDashboard?: () => void; // Optional prop for customizing William's dashboard
    onCustomizeWillowDashboard?: () => void; // Optional prop for customizing Willow's dashboard
    onCustomizeSebastianDashboard?: () => void; // Optional prop for customizing Sebastian's dashboard
    onCustomizeCoParentingDashboard?: () => void; // Optional prop for customizing Co-Parenting dashboard
    currentPersona: PersonaType;
    isModMode: boolean; // Pass isModMode to control customize button visibility
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ openResetModal, onItemClick, onSwitchDashboard, onCustomizeWilliamDashboard, onCustomizeWillowDashboard, onCustomizeSebastianDashboard, onCustomizeCoParentingDashboard, currentPersona, isModMode }) => {
    const systemItems: NavItemProps[] = [
        { label: 'SOP Vault', view: 'sop-vault' /* allowedPersonas removed */ },
        { label: 'Weekly Review', view: 'weekly-review' /* allowedPersonas removed */ },
        { label: 'System Integration', view: 'system-integration' /* allowedPersonas removed */ },
        { label: 'Manifesto', view: 'manifesto' /* allowedPersonas removed */ },
    ];

    // Explicitly filter system items by currentPersona here.
    const filteredSystemItems = systemItems.filter(item => {
      // Logic for system items that should always be available or are persona-specific
      // This is a simplified version; in a full app, you'd define `allowedPersonas` on `systemItems` or use a more complex mapping.
      if (item.view === 'sop-vault' || item.view === 'manifesto') return true; // Always visible
      if (currentPersona === 'william' && (item.view === 'weekly-review' || item.view === 'system-integration')) return true;
      return false;
    });

    return (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-card-dark rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 z-20">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {filteredSystemItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => onItemClick(item.view)}
                        className="block w-full text-left px-4 py-2 text-sm text-text-light hover:bg-gray-700"
                        role="menuitem"
                    >
                        {item.label}
                    </button>
                ))}
                {currentPersona === 'william' && isModMode && onCustomizeWilliamDashboard && (
                    <>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                            onClick={onCustomizeWilliamDashboard}
                            className="block w-full text-left px-4 py-2 text-sm text-accent-green hover:bg-gray-700"
                            role="menuitem"
                        >
                            Customize William's Dashboard
                        </button>
                    </>
                )}
                {currentPersona === 'willow' && isModMode && onCustomizeWillowDashboard && (
                    <>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                            onClick={onCustomizeWillowDashboard}
                            className="block w-full text-left px-4 py-2 text-sm text-accent-green hover:bg-gray-700"
                            role="menuitem"
                        >
                            Customize Willow's Dashboard
                        </button>
                    </>
                )}
                {currentPersona === 'sebastian' && isModMode && onCustomizeSebastianDashboard && (
                    <>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                            onClick={onCustomizeSebastianDashboard}
                            className="block w-full text-left px-4 py-2 text-sm text-accent-green hover:bg-gray-700"
                            role="menuitem"
                        >
                            Customize Bash's Dashboard
                        </button>
                    </>
                )}
                {currentPersona === 'co-parenting' && isModMode && onCustomizeCoParentingDashboard && (
                    <>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                            onClick={onCustomizeCoParentingDashboard}
                            className="block w-full text-left px-4 py-2 text-sm text-accent-green hover:bg-gray-700"
                            role="menuitem"
                        >
                            Customize Co-Parenting Dashboard
                        </button>
                    </>
                )}
                <div className="border-t border-gray-700 my-1"></div>
                <button
                    onClick={onSwitchDashboard}
                    className="block w-full text-left px-4 py-2 text-sm text-accent-blue hover:bg-gray-700"
                    role="menuitem"
                >
                    Switch Dashboard
                </button>
                <button
                    onClick={openResetModal}
                    className="block w-full text-left px-4 py-2 text-sm text-accent-blue hover:bg-gray-700"
                    role="menuitem"
                >
                    System Reset
                </button>
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ openResetModal }) => {
  const { appState, dispatch } = useAppState();
  const { isModMode, currentPersona, initialSetupComplete } = appState;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleModMode = () => {
    dispatch({ type: 'TOGGLE_MOD_MODE' });
  };
  
  const handleDropdownToggle = () => setDropdownOpen(prev => !prev);

  const handleDropdownItemClick = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
    setDropdownOpen(false);
  };

  const handleSwitchDashboard = () => {
    dispatch({ type: 'SET_PERSONA', payload: 'launcher' });
    setDropdownOpen(false);
  };

  const handleCustomizeWilliamDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'william-dashboard-builder' });
    setDropdownOpen(false);
  };

  const handleCustomizeWillowDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'willow-dashboard-builder' });
    setDropdownOpen(false);
  };

  const handleCustomizeSebastianDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'sebastian-dashboard-builder' });
    setDropdownOpen(false);
  };

  const handleCustomizeCoParentingDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'co-parenting-dashboard-builder' });
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) &&
        (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node))
        ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavItems = (isMobile: boolean): NavItemProps[] => {
    switch (currentPersona) {
      case 'william':
        return [
          { label: isMobile ? 'My Hub' : 'My Dashboard', view: 'williams-dashboard' },
          { label: isMobile ? 'Tracker' : 'All Checklists', view: 'all-checklists' },
          { label: isMobile ? 'SOP Vault' : 'SOP Vault', view: 'sop-vault' },
        ];
      case 'willow':
        return [
          { label: isMobile ? 'Willow\'s' : 'Willow\'s Dashboard', view: 'willows-dashboard' },
          { label: isMobile ? 'All Checklists' : 'All Checklists', view: 'all-checklists' },
          { label: isMobile ? 'SOP Vault' : 'SOP Vault', view: 'sop-vault' },
        ];
      case 'sebastian':
        return [
          { label: isMobile ? 'Bash\'s' : 'Bash\'s Dashboard', view: 'sebastians-dashboard' },
          { label: isMobile ? 'All Checklists' : 'All Checklists', view: 'all-checklists' },
          { label: 'SOP Vault', view: 'sop-vault' },
        ];
      case 'co-parenting':
        return [
          { label: isMobile ? 'Parenting' : 'Co-Parenting', view: 'co-parenting-dashboard' },
          { label: isMobile ? 'SOP Vault' : 'SOP Vault', view: 'sop-vault' },
        ];
      case 'launcher': // 'launcher' persona should not show navigation items
      default:
        return [];
    }
  };

  const desktopNavItems = getNavItems(false);
  const mobileNavItems = getNavItems(true);

  // Header is now completely hidden if initial setup is not complete
  if (!initialSetupComplete) {
    return null; 
  }

  return (
    <header className={`py-3 px-4 md:px-6 bg-card-dark shadow-md sticky top-0 z-20 border-b border-gray-700 transition-shadow no-print ${isModMode ? 'shadow-lg shadow-accent-blue/20' : ''}`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <button onClick={handleSwitchDashboard} className="text-xl md:text-2xl font-bold text-accent-teal flex-shrink-0" aria-label="Go to Dashboard Selection">
          🌱 Wonky Sprout OS
        </button>

        <nav className="hidden md:flex items-center gap-2 flex-wrap">
            {desktopNavItems.map(item => (
                <NavItem key={item.view} label={item.label} view={item.view} />
            ))}

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={handleDropdownToggle}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-1 ${
                        isDropdownOpen ? 'bg-gray-700' : 'text-text-light hover:bg-gray-700'
                    }`}
                    aria-expanded={isDropdownOpen}
                    aria-controls="header-dropdown-menu"
                >
                    System
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && <DropdownMenu 
                                        onItemClick={handleDropdownItemClick} 
                                        openResetModal={() => { setDropdownOpen(false); openResetModal(); }} 
                                        onSwitchDashboard={handleSwitchDashboard} 
                                        onCustomizeWilliamDashboard={currentPersona === 'william' ? handleCustomizeWilliamDashboard : undefined}
                                        onCustomizeWillowDashboard={currentPersona === 'willow' ? handleCustomizeWillowDashboard : undefined}
                                        onCustomizeSebastianDashboard={currentPersona === 'sebastian' ? handleCustomizeSebastianDashboard : undefined}
                                        onCustomizeCoParentingDashboard={currentPersona === 'co-parenting' ? handleCustomizeCoParentingDashboard : undefined}
                                        currentPersona={currentPersona}
                                        isModMode={isModMode} 
                                    />}
            </div>
        </nav>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`text-sm font-semibold hidden sm:inline ${isModMode ? 'text-accent-blue' : 'text-text-light'}`}>Mod Mode</span>
            <button
              role="switch"
              aria-checked={isModMode}
              onClick={handleToggleModMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-dark focus:ring-accent-blue ${
                isModMode ? 'bg-accent-blue' : 'bg-gray-600'
              }`}
              aria-label="Toggle Mod Mode"
            >
              <span
                aria-hidden="true"
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isModMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
        </div>
      </div>
       {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-700">
            {mobileNavItems.map(item => (
                <NavItem key={item.view} label={item.label} view={item.view} />
            ))}
            <div className="relative" ref={mobileDropdownRef}>
                <button
                    onClick={handleDropdownToggle}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-1 ${
                        isDropdownOpen ? 'bg-gray-700' : 'text-text-light hover:bg-gray-700'
                    }`}
                    aria-expanded={isDropdownOpen}
                    aria-controls="header-mobile-dropdown-menu"
                >
                    System
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && <DropdownMenu 
                                        onItemClick={handleDropdownItemClick} 
                                        openResetModal={() => { setDropdownOpen(false); openResetModal(); }} 
                                        onSwitchDashboard={handleSwitchDashboard} 
                                        onCustomizeWilliamDashboard={currentPersona === 'william' ? handleCustomizeWilliamDashboard : undefined}
                                        onCustomizeWillowDashboard={currentPersona === 'willow' ? handleCustomizeWillowDashboard : undefined}
                                        onCustomizeSebastianDashboard={currentPersona === 'sebastian' ? handleCustomizeSebastianDashboard : undefined}
                                        onCustomizeCoParentingDashboard={currentPersona === 'co-parenting' ? handleCustomizeCoParentingDashboard : undefined}
                                        currentPersona={currentPersona}
                                        isModMode={isModMode}
                                    />}
            </div>
        </nav>
    </header>
  );
};

export default Header;