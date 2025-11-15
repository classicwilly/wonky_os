
import React from 'react';

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface ModuleIconProps {
    iconPath: string;
    label: string;
    onClick: () => void;
}
const ModuleIcon: React.FC<ModuleIconProps> = ({ iconPath, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-3 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-accent-blue transition-colors text-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-accent-blue mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
            <span className="text-xs font-semibold text-text-light">{label}</span>
        </button>
    );
};

export default ModuleIcon;