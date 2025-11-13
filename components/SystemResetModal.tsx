import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';

interface SystemResetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SystemResetModal: React.FC<SystemResetModalProps> = ({ isOpen, onClose }) => {
    const { dispatch } = useAppState();
    const [confirmation, setConfirmation] = useState<'checklists' | 'rewards' | null>(null);

    if (!isOpen) {
        return null;
    }

    const handleResetChecklists = () => {
        dispatch({ type: 'RESET_CHECKLISTS_AND_INPUTS' });
        setConfirmation(null);
        onClose();
    };

    const handleResetRewards = () => {
        dispatch({ type: 'RESET_REWARDS' });
        setConfirmation(null);
        onClose();
    };

    return (
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
                    <h2 id="reset-modal-title" className="text-3xl font-extrabold text-accent-teal">System Reset Protocol</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </header>
                
                <p className="text-text-light text-opacity-80 mb-6">
                    Execute a system state reset. This action clears saved progress in your browser. User-created SOPs will NOT be deleted.
                </p>

                <div className="space-y-4">
                    {confirmation !== 'checklists' ? (
                        <button 
                            onClick={() => setConfirmation('checklists')}
                            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                        >
                            <h3 className="font-bold text-accent-blue">Reset All Checklists & Inputs</h3>
                            <p className="text-sm text-text-light text-opacity-70 mt-1">Clears all ticked checkboxes and text fields across the entire OS. Use this for a daily or weekly fresh start.</p>
                        </button>
                    ) : (
                        <div className="p-4 bg-red-900/30 rounded-lg border border-red-700">
                             <p className="font-bold text-red-400">Confirm Reset</p>
                             <p className="text-sm text-red-300 mb-3">This will uncheck all boxes and clear all text inputs. This cannot be undone.</p>
                             <div className="flex gap-4">
                                <button onClick={handleResetChecklists} className="flex-grow p-2 bg-red-600 text-white font-bold rounded">Confirm Reset</button>
                                <button onClick={() => setConfirmation(null)} className="flex-grow p-2 bg-gray-600 text-white rounded">Cancel</button>
                             </div>
                        </div>
                    )}

                    {confirmation !== 'rewards' ? (
                        <button 
                            onClick={() => setConfirmation('rewards')}
                            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                        >
                            <h3 className="font-bold text-accent-blue">Reset All Rewards</h3>
                            <p className="text-sm text-text-light text-opacity-70 mt-1">Resets all collected Gems and Achievements for both kids and adults. Use for a new reward cycle.</p>
                        </button>
                     ) : (
                        <div className="p-4 bg-red-900/30 rounded-lg border border-red-700">
                             <p className="font-bold text-red-400">Confirm Reset</p>
                             <p className="text-sm text-red-300 mb-3">This will clear all Gems and Achievements. This cannot be undone.</p>
                             <div className="flex gap-4">
                                <button onClick={handleResetRewards} className="flex-grow p-2 bg-red-600 text-white font-bold rounded">Confirm Reset</button>
                                <button onClick={() => setConfirmation(null)} className="flex-grow p-2 bg-gray-600 text-white rounded">Cancel</button>
                             </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-right">
                     <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-text-light rounded-md hover:bg-gray-500 transition-colors font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemResetModal;