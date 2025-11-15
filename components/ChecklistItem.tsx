
import React from 'react';
import { useAppState } from '../contexts/AppStateContext.js';

// FIX: Added a props interface to make optional props explicit, resolving type errors.
interface ChecklistItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  large?: boolean;
  gemAwardId?: string;
  gemRecipient?: 'willow' | 'sebastian';
  achievementAwardId?: string;
  isChecked?: boolean;
  onToggle?: (id: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, children, className = '', large = false, gemAwardId, gemRecipient, achievementAwardId, isChecked, onToggle }) => {
  const { appState, dispatch } = useAppState();
  
  const isControlled = isChecked !== undefined && onToggle !== undefined;
  const checked = isControlled ? isChecked : !!appState.checkedItems[id];
  const isActionable = id.startsWith('actionable:');

  const checkboxSize = large ? 'h-6 w-6' : 'h-5 w-5';
  const labelSize = large ? 'text-lg' : '';

  const handleChange = () => {
    if (isControlled && onToggle) {
      onToggle(id);
    } else {
      const isCheckingOn = !checked;
      dispatch({ type: 'TOGGLE_CHECKED', payload: id });
      
      if (isCheckingOn) {
        if (gemAwardId && gemRecipient) {
          dispatch({ type: 'ADD_GEM', payload: { id: gemAwardId, recipient: gemRecipient } });
        }
        if (achievementAwardId) {
          dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievementAwardId });
        }
      }
    }
  };
  
  const handleCreateTask = (e) => {
      e.stopPropagation();
      const taskTitle = typeof children === 'string' ? children.replace(/<[^>]*>?/gm, '') : 'New task from SOP';
      dispatch({
          type: 'ADD_TASK',
          payload: {
              title: `[SOP] ${taskTitle}`,
              priority: 'Medium',
              dueDate: new Date().toISOString().split('T')[0],
          }
      });
       dispatch({
            type: 'ADD_TOAST',
            payload: {
                id: `toast-task-${Date.now()}`,
                emoji: '✅',
                message: `Task added to matrix!`,
            }
        });
  };

  return (
    <li className={`flex items-start my-2 ${className}`}>
      <label htmlFor={id} className={`flex items-center cursor-pointer text-text-light text-opacity-90 hover:text-opacity-100 transition-opacity w-full ${labelSize}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className={`${checkboxSize} rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue focus:ring-offset-background-dark focus:ring-2 mr-4 flex-shrink-0`}
        />
        <span className={`${checked ? 'line-through text-text-light text-opacity-50' : ''} break-words flex-grow`}>{children}</span>
      </label>
       {isActionable && !checked && (
          <button 
            onClick={handleCreateTask}
            className="ml-4 px-2 py-1 bg-accent-green/20 text-accent-green text-xs font-semibold rounded hover:bg-accent-green/40 flex-shrink-0"
            aria-label={`Create task for: ${typeof children === 'string' ? children : 'this item'}`}
          >
            + Task
          </button>
      )}
    </li>
  );
};

export default ChecklistItem;