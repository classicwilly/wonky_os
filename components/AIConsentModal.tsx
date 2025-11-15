import React from 'react';

interface AIConsentModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    dontShowAgain: boolean;
    setDontShowAgain: (value: boolean) => void;
}

const AIConsentModal: React.FC<AIConsentModalProps> = ({ onConfirm, onCancel, dontShowAgain, setDontShowAgain }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-modal-title"
        >
            <div
                className="bg-card-dark rounded-lg shadow-2xl p-8 border border-gray-700 w-full max-w-lg m-4"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center mb-6">
                    <h2 id="consent-modal-title" className="text-3xl font-extrabold text-accent-blue">AI Feature Consent</h2>
                </header>
                
                <div className="space-y-4 text-text-light text-opacity-90">
                    <p>This feature uses generative AI to process your input. To provide a response, your prompt data will be sent to Google's servers.</p>
                    <p><strong>Data Privacy Notice:</strong> Please review your input and remove any sensitive or personal information before proceeding. Do not include anything you would not want a human reviewer to see.</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <label className="flex items-center text-sm">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="h-4 w-4 rounded bg-gray-700 text-accent-blue focus:ring-accent-blue"
                        />
                        <span className="ml-2">Don't show this again</span>
                    </label>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-700 text-text-light rounded-md hover:bg-gray-600 font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 font-semibold"
                    >
                        Acknowledge & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIConsentModal;
