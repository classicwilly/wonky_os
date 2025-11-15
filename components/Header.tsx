

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../contexts/AppStateContext.js';
import { auth } from '../firebase.js';



const NavItem = ({ label, view }) => {
    const { appState, dispatch } = useAppState();
    const isActive = appState?.view === view;

    const handleClick = () => {
        dispatch({ type: 'SET_VIEW', payload: view });
    };

    return (
        <button
            onClick={handleClick}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                isActive ? 'bg-accent-blue text-background-dark' : 'text-text-light hover:bg-gray-700'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className="truncate">{label}</span>
        </button>
    );
};





const DropdownMenu = ({ items, onItemClick }) => (
    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-card-dark rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 z-20">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {items.map(item => {
                if (item.type === 'separator') {
                    return <div key={item.id} className="border-t border-gray-700 my-1"></div>;
                }
                return (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${item.className || 'text-text-light'}`}
                        role="menuitem"
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    </div>
);

const navItemConfig = {
    william: {
        desktop: [ { label: 'Ops Control', view: 'operations-control' }, { label: 'All Checklists', view: 'all-checklists' }, { label: 'SOP Vault', view: 'sop-vault' } ],
        mobile: [ { label: 'Ops Control', view: 'operations-control' }, { label: 'Tracker', view: 'all-checklists' }, { label: 'SOPs', view: 'sop-vault' } ],
    },
    willow: {
        desktop: [ { label: "Willow's Sprout", view: 'willows-dashboard' }, { label: 'All Checklists', view: 'all-checklists' }, { label: 'SOP Vault', view: 'sop-vault' } ],
        mobile: [ { label: "Willow's", view: 'willows-dashboard' }, { label: 'Tracker', view: 'all-checklists' }, { label: 'SOPs', view: 'sop-vault' } ],
    },
    sebastian: {
        desktop: [ { label: "Bash's Sprout", view: 'sebastians-dashboard' }, { label: 'All Checklists', view: 'all-checklists' }, { label: 'SOP Vault', view: 'sop-vault' } ],
        mobile: [ { label: "Bash's", view: 'sebastians-dashboard' }, { label: 'Tracker', view: 'all-checklists' }, { label: 'SOPs', view: 'sop-vault' } ],
    },
    'co-parenting': {
        desktop: [ { label: 'Co-Parenting', view: 'co-parenting-dashboard' }, { label: 'SOP Vault', view: 'sop-vault' } ],
        mobile: [ { label: 'Parenting', view: 'co-parenting-dashboard' }, { label: 'SOPs', view: 'sop-vault' } ],
    },
};

const Header = ({ openResetModal }) => {
  const { appState, dispatch } = useAppState();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  if (!appState) return null; // Don't render header if no user is logged in

  const { isModMode, dashboardType } = appState;

  const handleToggleModMode = () => dispatch({ type: 'TOGGLE_MOD_MODE' });
  
  const handleDropdownToggle = () => setDropdownOpen(prev => !prev);

  const handleDropdownItemClick = (item) => {
      if (item.type === 'view' && item.view) {
          dispatch({ type: 'SET_VIEW', payload: item.view });
      } else if (item.type === 'action' && item.action) {
          item.action();
      }
      setDropdownOpen(false);
  };
  
  const handleLogout = () => auth.signOut();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const allDropdownItems = [
      { id: 'manifesto', label: 'Manifesto (The "Bible")', type: 'view', view: 'manifesto', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
      { id: 'operating-manual', label: 'Operating Manual', type: 'view', view: 'operating-manual', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
      { id: 'sep-docs', label: '', type: 'separator', allowedDashboardTypes: ['william'] },
      { id: 'garden-view', label: 'Garden View', type: 'view', view: 'garden-view', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
      { id: 'command-center', label: 'Command Center', type: 'view', view: 'command-center', allowedDashboardTypes: ['william'] },
      { id: 'game-master', label: 'Game Master Hub', type: 'view', view: 'game-master-dashboard', allowedDashboardTypes: ['william'] },
      { id: 'strategic-roadmap', label: 'Strategic Roadmap', type: 'view', view: 'strategic-roadmap', allowedDashboardTypes: ['william'] },
      { id: 'archive-log', label: 'Archive Log', type: 'view', view: 'archive-log', allowedDashboardTypes: ['william'] },
      { id: 'system-insights', label: 'System Insights', type: 'view', view: 'system-insights', allowedDashboardTypes: ['william'] },
      { id: 'sep-reviews', label: '', type: 'separator', allowedDashboardTypes: ['william'] },
      { id: 'daily-debrief', label: 'Daily Debrief', type: 'view', view: 'daily-debrief', allowedDashboardTypes: ['william'] },
      { id: 'weekly-review', label: 'Weekly Review', type: 'view', view: 'weekly-review', allowedDashboardTypes: ['william'] },
      { id: 'sep-manuals', label: '', type: 'separator', allowedDashboardTypes: ['william'] },
      { id: 'tech-manual', label: 'Technical Manual', type: 'view', view: 'technical-manual', allowedDashboardTypes: ['william'] },
      { id: 'design-lang', label: 'Design Language Protocol', type: 'view', view: 'design-language-protocol', allowedDashboardTypes: ['william'] },
      { id: 'deployment', label: 'Firebase Deployment Protocol', type: 'view', view: 'deployment-protocol', allowedDashboardTypes: ['william'] },
      { id: 'dev-compliance', label: 'Developer Compliance Protocol', type: 'view', view: 'developer-compliance-protocol', allowedDashboardTypes: ['william'] },
      { id: 'sep-safety', label: '', type: 'separator', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting']},
      { id: 'ai-safety', label: 'AI Safety Protocol', type: 'view', view: 'ai-safety-protocol', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
      { id: 'sep-print', label: '', type: 'separator', allowedDashboardTypes: ['william'] },
      { id: 'print-daily-report', label: 'Print Daily Report', type: 'view', view: 'daily-report', allowedDashboardTypes: ['william'] },
      { id: 'sep1', label: '', type: 'separator', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
      { id: 'customize-william', label: "Customize My Dashboard", type: 'view', view: 'william-dashboard-builder', modModeOnly: true, allowedDashboardTypes: ['william'], className: 'text-accent-green' },
      { id: 'customize-willow', label: "Customize Willow's Dashboard", type: 'view', view: 'willow-dashboard-builder', modModeOnly: true, allowedDashboardTypes: ['willow'], className: 'text-accent-green' },
      { id: 'customize-sebastian', label: "Customize Bash's Dashboard", type: 'view', view: 'sebastian-dashboard-builder', modModeOnly: true, allowedDashboardTypes: ['sebastian'], className: 'text-accent-green' },
      { id: 'customize-coparenting', label: 'Customize Co-Parenting Hub', type: 'view', view: 'co-parenting-dashboard-builder', modModeOnly: true, allowedDashboardTypes: ['co-parenting'], className: 'text-accent-green' },
      { id: 'sep2', label: '', type: 'separator', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
      { id: 'logout', label: 'Logout', type: 'action', action: handleLogout, className: 'text-accent-blue', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
      { id: 'system-reset', label: 'System Management', type: 'action', action: openResetModal, className: 'text-accent-blue', allowedDashboardTypes: ['william', 'willow', 'sebastian', 'co-parenting'] },
  ];
  
  const visibleDropdownItems = allDropdownItems.filter(item => 
      item.allowedDashboardTypes.includes(dashboardType) &&
      (!item.modModeOnly || (item.modModeOnly && isModMode))
  );

  const navItems = navItemConfig[dashboardType] || { desktop: [], mobile: [] };

  return (
    <header ref={dropdownRef} className={`py-3 px-4 md:px-6 bg-card-dark shadow-md sticky top-0 z-20 border-b border-gray-700 transition-shadow no-print ${isModMode ? 'shadow-lg shadow-accent-blue/20' : ''}`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'garden-view' })} className="text-xl md:text-2xl font-bold text-accent-teal flex-shrink-0" aria-label="Return to Garden View">
          🌱 Wonky Sprout OS
        </button>

        <nav className="hidden md:flex items-center gap-2 flex-wrap">
            {navItems.desktop.map(item => <NavItem key={item.view} {...item} />)}
            <div className="relative">
                <button onClick={handleDropdownToggle} className={`px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 ${isDropdownOpen ? 'bg-gray-700' : 'text-text-light hover:bg-gray-700'}`}>
                    System
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && <DropdownMenu items={visibleDropdownItems} onItemClick={handleDropdownItemClick} />}
            </div>
        </nav>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`text-sm font-semibold hidden sm:inline ${isModMode ? 'text-accent-blue' : 'text-text-light'}`}>Mod Mode</span>
            <button role="switch" aria-checked={isModMode} onClick={handleToggleModMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isModMode ? 'bg-accent-blue' : 'bg-gray-600'}`}>
              <span aria-hidden="true" className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isModMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
      </div>
      <nav className="md:hidden flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-700">
            {navItems.mobile.map(item => <NavItem key={item.view} {...item} />)}
            <div className="relative">
                <button onClick={handleDropdownToggle} className={`px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 ${isDropdownOpen ? 'bg-gray-700' : 'text-text-light hover:bg-gray-700'}`}>
                    System
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && <DropdownMenu items={visibleDropdownItems} onItemClick={handleDropdownItemClick} />}
            </div>
        </nav>
    </header>
  );
};

export default Header;