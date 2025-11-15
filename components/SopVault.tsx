import React from 'react';
import SopCard from './SopCard.tsx';
import { SOP_DATA } from '../constants.ts';
import { useAppState } from '../contexts/AppStateContext.tsx';
import LibraryView from './LibraryView.tsx';

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
            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => {
                        dispatch({ type: 'SET_NEW_SOP_TYPE', payload: 'template' });
                        dispatch({ type: 'SET_VIEW', payload: 'create-sop' });
                    }}
                    className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-purple-600 transition-colors duration-200 font-semibold flex items-center text-sm"
                    aria-label="Create a new SOP template"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Create New Template
                </button>
                <button
                    onClick={() => {
                        dispatch({ type: 'SET_NEW_SOP_TYPE', payload: 'protocol' });
                        dispatch({ type: 'SET_VIEW', payload: 'create-sop' });
                    }}
                    className="px-4 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold flex items-center text-sm"
                    aria-label="Create a new protocol"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Protocol
                </button>
            </div>
        }
    />
  );
};

export default SopVault;