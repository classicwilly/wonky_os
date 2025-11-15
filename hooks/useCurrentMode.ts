
import { useState, useEffect } from 'react';


export function useCurrentMode() {
  const [currentMode, setCurrentMode] = useState(getModeForDate(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMode(getModeForDate(new Date()));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return currentMode;
}

// FIX: Exported getModeForDate to be used in SharedCalendar.tsx.
export function getModeForDate(date) {
  const day = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const hour = date.getHours();

  // Friday 4 PM (16:00) -> Monday 6 PM (18:00) is Family Structure Mode
  if (day === 5 && hour >= 16) { // Friday after 4 PM
    return 'Family Structure';
  }
  if (day === 6 || day === 0) { // Saturday or Sunday
    return 'Family Structure';
  }
  if (day === 1 && hour < 18) { // Monday before 6 PM
    return 'Family Structure';
  }

  // All other times are Solo Execution Mode
  return 'Solo Execution';
}