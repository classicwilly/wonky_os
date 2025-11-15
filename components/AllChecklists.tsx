import React from 'react';
import { ALL_CHECKLIST_DATA } from '../checklist-data.js';
import LibraryView from './LibraryView.js';
import ChecklistCard from './ChecklistCard.js';

const AllChecklists = () => {
    const allChecklistSections = ALL_CHECKLIST_DATA.flatMap(protocol => 
        protocol.subSections ? protocol.subSections.map(s => ({...s, parentTitle: protocol.title})) : [{...protocol, parentTitle: protocol.title}]
    );

    const handlePrint = () => {
        // A more targeted print might be needed for this new view
        window.print();
    };

    return (
        <LibraryView
            title="Master Checklist Control"
            subtitle="An aggregated, searchable view of every checklist section across the Wonky Sprout OS."
            items={allChecklistSections}
            renderItem={(item) => <ChecklistCard section={item} />}
            searchKeys={['title', 'parentTitle']}
            headerActions={
                <button
                    onClick={handlePrint}
                    className="no-print px-4 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold flex items-center text-sm"
                    aria-label="Print all checklists"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Print
                </button>
            }
        />
    );
};

export default AllChecklists;