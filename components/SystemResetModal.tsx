

import React, { useState, useRef } from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';

import ImportConfirmationModal from './ImportConfirmationModal.tsx';



const SystemResetModal = ({ isOpen, onClose }) => {
    const { appState, dispatch } = useAppState();
    const [confirmation, setConfirmation] = useState(null);
    const [isImportConfirmOpen, setImportConfirmOpen] = useState(false);
    const [fileToImport, setFileToImport] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) {
        return null;
    }

    const handleAction = (actionType) => {
        dispatch({ type: actionType });
        setConfirmation(null);
        onClose();
    };
    
    const handleExport = () => {
        if (!appState) return;
        const dataStr = JSON.stringify(appState, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `wonky-sprout-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        onClose();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileToImport(file);
            setImportConfirmOpen(true);
        }
        // Reset file input to allow re-importing the same file
        event.target.value = '';
    };

    const handleConfirmImport = () => {
        if (!fileToImport) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable text.");
                }
                const importedState = JSON.parse(text);

                // Basic validation to ensure it looks like our state object
                if (typeof importedState === 'object' && importedState !== null && 'dashboardType' in importedState && 'view' in importedState) {
                    dispatch({ type: 'IMPORT_STATE', payload: importedState });
                    setImportConfirmOpen(false);
                    onClose();
                    // Force a reload to ensure all components re-initialize with the new state
                    setTimeout(() => window.location.reload(), 100);
                } else {
                    throw new Error("Invalid state file format. Missing required keys.");
                }
            } catch (error) {
                alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setImportConfirmOpen(false);
                setFileToImport(null);
            }
        };
        reader.readAsText(fileToImport);
    };

    const ConfirmationDialog = ({ type, onConfirm }) => (
        <div className="p-4 bg-red-900/30 rounded-lg border border-red-700">
            <p className="font-bold text-red-400">Confirm Reset</p>
            <p className="text-sm text-red-300 mt-1">This action is permanent and cannot be undone.</p>
            <div className="flex justify-end space-x-2 mt-3">
                <button onClick={() => setConfirmation(null)} className="px-4 py-2 bg-gray-600 text-text-light rounded-md">
                    Cancel
                </button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors">
                    Confirm Reset
                </button>
            </div>
        </div>
    );

    const ResetButton = ({ type, title, description }) => (
        <button
            onClick={() => setConfirmation(type)}
            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
        >
            <h3 className="font-bold text-accent-blue">{title}</h3>
            <p className="text-sm text-text-light text-opacity-70 mt-1">{description}</p>
        </button>
    );

    return (
        <>
            <ImportConfirmationModal
                isOpen={isImportConfirmOpen}
                onConfirm={handleConfirmImport}
                onCancel={() => setImportConfirmOpen(false)}
            />
            <div
                className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="reset-modal-title"
            >
                <div
                    className="bg-card-dark rounded-lg shadow-2xl p-8 border border-gray-700 w-full max-w-lg m-4"
                    onClick={e => e.stopPropagation()}
                >
                    <header className="flex justify-between items-center mb-6">
                        <h2 id="reset-modal-title" className="text-3xl font-extrabold text-accent-teal">System Management</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                    </header>
                    
                    <h3 className="text-xl font-bold text-accent-green mb-4">Data Management</h3>
                     <p className="text-text-light text-opacity-80 mb-4">
                        Export your entire OS state for backup, or import a previous backup to restore your system.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={handleExport}
                            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                        >
                            <h3 className="font-bold text-accent-blue">Export Data</h3>
                            <p className="text-sm text-text-light text-opacity-70 mt-1">Save a JSON backup of your entire app state.</p>
                        </button>
                         <button
                            onClick={handleImportClick}
                            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                        >
                            <h3 className="font-bold text-accent-warning">Import Data</h3>
                            <p className="text-sm text-text-light text-opacity-70 mt-1">Restore from a backup. This will overwrite all current data.</p>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json,application/json"
                            className="hidden"
                        />
                    </div>

                    <div className="border-t border-gray-600 my-6"></div>

                    <h3 className="text-xl font-bold text-accent-green mb-4">System State Reset</h3>
                    <p className="text-text-light text-opacity-80 mb-6">
                        Execute a system state reset. This action clears saved progress in your browser. User-created SOPs will NOT be deleted.
                    </p>
                    <div className="space-y-4">
                        {confirmation === 'checklists'
                            ? <ConfirmationDialog type="checklists" onConfirm={() => handleAction('RESET_CHECKLISTS_AND_INPUTS')} />
                            : <ResetButton type="checklists" title="Reset All Checklists & Inputs" description="Clears all ticked checkboxes and text fields. Use for a daily/weekly fresh start." />
                        }
                        {confirmation === 'rewards'
                            ? <ConfirmationDialog type="rewards" onConfirm={() => handleAction('RESET_REWARDS')} />
                            : <ResetButton type="rewards" title="Reset All Rewards & Achievements" description="Clears collected gems and achievements. Use to restart the reward cycle." />
                        }
                         <div className="border-t border-gray-700 my-2"></div>
                        {confirmation === 'financial'
                            ? <ConfirmationDialog type="financial" onConfirm={() => handleAction('RESET_FINANCIAL_DATA')} />
                            : <ResetButton type="financial" title="Reset Financial Data" description="Permanently deletes all logged expenses and resets all budgets to zero." />
                        }
                        {confirmation === 'knowledge'
                            ? <ConfirmationDialog type="knowledge" onConfirm={() => handleAction('RESET_KNOWLEDGE_VAULT')} />
                            : <ResetButton type="knowledge" title="Reset Knowledge Vault" description="Permanently deletes all entries in the Knowledge Capture Vault." />
                        }
                        {confirmation === 'braindump'
                            ? <ConfirmationDialog type="braindump" onConfirm={() => handleAction('RESET_BRAIN_DUMP')} />
                            : <ResetButton type="braindump" title="Clear Brain Dump" description="Empties all text from the Brain Dump module." />
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default SystemResetModal;