import React from 'react';
import { useAppState } from '../contexts/AppStateContext.js';

const ModuleViewWrapper = ({ title, children }) => {
    const { dispatch } = useAppState();

    const handleBack = () => {
        dispatch({ type: 'SET_VIEW', payload: 'operations-control' });
    };

    return (
        <div>
            <header className="mb-8 flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-700 text-text-light rounded-md hover:bg-gray-600 transition-colors duration-200 font-semibold"
                >
                    &larr; Back to Ops Control
                </button>
                <h1 className="text-3xl font-bold text-accent-teal">{title}</h1>
            </header>
            <div className="max-w-5xl mx-auto">
                {children}
            </div>
        </div>
    );
};

export default ModuleViewWrapper;
