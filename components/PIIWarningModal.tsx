

import React from 'react';


const PIIWarningModal = ({ isOpen, onCancel, onConfirm, matches }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pii-warning-title"
        >
            <div
                className="bg-card-dark rounded-lg shadow-2xl p-8 border border-accent-warning w-full max-w-lg m-4"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center mb-6">
                    <h2 id="pii-warning-title" className="text-3xl font-extrabold text-accent-warning">Data Privacy Warning</h2>
                </header>

                <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-700">
                    <p className="font-bold text-yellow-300 text-lg">Potential Sensitive Data Detected!</p>
                    <p className="text-yellow-300 mt-2 text-sm">
                        Our scanner found the following potentially sensitive information in your prompt. For your privacy, we recommend removing it before sending to the AI.
                    </p>
                    <ul className="list-disc list-inside mt-3 text-sm text-yellow-200 space-y-1 max-h-40 overflow-y-auto">
                        {matches.map((match, index) => (
                            <li key={index}><strong>{match.type}:</strong> "{match.value}"</li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-700 text-text-light rounded-md hover:bg-gray-600 transition-colors duration-200 font-semibold"
                    >
                        Edit Prompt
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 bg-yellow-700 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 font-semibold"
                    >
                        Send Anyway
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PIIWarningModal;