


import React from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';

const SopCard = ({ sop, isTemplate = false }) => {
  const { appState, dispatch } = useAppState();
  const isUserSop = sop.category.includes('USER');

  const handleNavigate = () => {
    if (sop.viewId) {
      dispatch({ type: 'SET_VIEW', payload: sop.viewId });
    } else if (isUserSop && sop.isPageView) {
      dispatch({ type: 'SET_ACTIVE_USER_SOP_ID', payload: sop.id });
      dispatch({ type: 'SET_VIEW', payload: 'user-sop-view' });
    }
  };

  const handleUseTemplate = () => {
    dispatch({ type: 'SET_ACTIVE_SOP_TEMPLATE', payload: sop });
    dispatch({ type: 'SET_VIEW', payload: 'create-sop' });
  };

  const handleEdit = () => {
    dispatch({ type: 'SET_EDITING_SOP_ID', payload: sop.id });
    dispatch({ type: 'SET_VIEW', payload: 'create-sop' });
  };

  const handleDelete = () => {
    const itemType = isTemplate ? 'template' : 'protocol';
    if (window.confirm(`Are you sure you want to permanently delete the ${itemType} "${sop.title}"? This cannot be undone.`)) {
      if (isTemplate) {
        dispatch({ type: 'DELETE_SOP_TEMPLATE', payload: sop.id });
      } else {
        dispatch({ type: 'DELETE_USER_SOP', payload: sop.id });
      }
    }
  };
  
  const canNavigate = sop.viewId || (isUserSop && sop.isPageView);

  const cardContent = (
    <>
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold text-accent-green mb-3 break-words">
          {sop.title}
        </h2>
        <p className="text-text-light text-opacity-80 leading-relaxed">
          {sop.description}
        </p>
      </div>
       {appState.isModMode && (
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end gap-2">
          {!isTemplate && (
            <button 
              onClick={handleEdit}
              className="px-4 py-2 text-sm bg-accent-blue text-background-dark font-semibold rounded-md hover:bg-blue-400 transition-colors"
            >
              Edit
            </button>
          )}
          {isTemplate && <p className="text-xs text-gray-500 italic flex-grow text-left self-center">Templates cannot be edited.</p>}
          {(isUserSop || isTemplate) && (
            <button 
              onClick={handleDelete}
              className="px-4 py-2 text-sm bg-red-800 bg-opacity-50 text-red-300 font-semibold rounded-md hover:bg-opacity-80 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </>
  );
  
  if (isTemplate) {
    return (
      <button
        onClick={handleUseTemplate}
        className="bg-card-dark rounded-lg shadow-md p-6 border border-gray-700 hover:border-accent-purple transition-colors duration-200 ease-in-out transform hover:scale-[1.01] flex flex-col text-left w-full"
        aria-label={`Use template: ${sop.title}`}
      >
        {cardContent}
      </button>
    );
  }
  
  if (canNavigate) {
    return (
      <button
        onClick={handleNavigate}
        className="bg-card-dark rounded-lg shadow-md p-6 border border-gray-700 hover:border-accent-teal transition-colors duration-200 ease-in-out transform hover:scale-[1.01] flex flex-col text-left w-full"
        aria-label={`View details for ${sop.title}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="bg-card-dark rounded-lg shadow-md p-6 border border-gray-700 flex flex-col h-full">
      {cardContent}
    </div>
  );
};

export default SopCard;