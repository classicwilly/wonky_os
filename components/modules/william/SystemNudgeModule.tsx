

import React from 'react';

const themeClasses = {
    info: {
        gradient: 'from-accent-blue/20 to-accent-teal/20',
        border: 'border-accent-blue/50',
        title: 'text-accent-teal',
    },
    warning: {
        gradient: 'from-accent-warning/20 to-yellow-500/20',
        border: 'border-accent-warning/50',
        title: 'text-accent-warning',
    },
    reward: {
        gradient: 'from-accent-purple/20 to-pink-500/20',
        border: 'border-accent-purple/50',
        title: 'text-accent-purple',
    },
};

const SystemNudgeModule = ({ nudge, onDismiss }) => {
    const theme = themeClasses[nudge.theme] || themeClasses.info;

    return (
        <div className={`p-6 bg-gradient-to-r ${theme.gradient} rounded-lg shadow-lg border ${theme.border} flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse-slow`}>
            <div className="flex items-center gap-4 text-left w-full">
                <div className="text-4xl">{nudge.icon}</div>
                <div>
                    <h3 className={`text-2xl font-bold ${theme.title}`}>{nudge.title}</h3>
                    <p className="text-text-light text-opacity-90">
                        {nudge.message}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0">
                <button
                    onClick={nudge.onAction}
                    className="px-5 py-2 bg-accent-green text-background-dark font-semibold rounded-md hover:bg-green-500 transition-colors duration-200"
                >
                    {nudge.actionLabel}
                </button>
                <button
                    onClick={() => onDismiss(nudge.id)}
                    className="px-3 py-2 bg-gray-700 text-text-light rounded-md hover:bg-gray-600 transition-colors duration-200"
                    aria-label="Dismiss notification"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default SystemNudgeModule;