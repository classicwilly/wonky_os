


import React from 'react';
import { useAppState } from '../contexts/AppStateContext.js';



const TextInputItem = ({ id, label, placeholder, type = 'text' }) => {
    const { appState, dispatch } = useAppState();
    const value = appState.textInputs[id] || '';

    const handleChange = (e) => {
        dispatch({ type: 'SET_TEXT_INPUT', payload: { id, value: e.target.value } });
    };

    return (
        <div className="flex items-center gap-2 w-full">
            <label htmlFor={id} className="text-text-light text-opacity-90 flex-shrink-0">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full"
            />
        </div>
    );
};

export default TextInputItem;
