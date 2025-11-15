import React from 'react';
import SopCard from './SopCard.js';
import { SOP_DATA } from '../constants.js';
import { useAppState } from '../contexts/AppStateContext.js';
import LibraryView from './LibraryView.js';

const SopVault = () => {
  const { appState, dispatch } = useAppState();
  const { modifiedSops, userSops, userSopTemplates } = appState;

  const allSops = React.useMemo(() => 
    [...SOP_DATA.map(sop => modifiedSops[sop.id] || sop), ...userSops],
    [modifiedSops, userSops]
  );
  
  return (
    <LibraryView
        title="SOP Vault: All Protocols"
        subtitle="The central library for every protocol in the Wonky Sprout OS. Find the system you need to execute."
        items={allSops}
        renderItem={(sop) => <SopCard sop={sop} />}
        searchKeys={['title', 'description', 'category']}
        headerActions={
            <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'create-sop' })}
                className="px-4 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold flex items-center text-sm"
                aria-label="Create a new protocol"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Protocol
            </button>
        }
    />
  );
};

export default SopVault;
