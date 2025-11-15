import React, { useState, useEffect } from 'react';

function getStorageValue(key, defaultValue) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            console.error('Error parsing JSON from localStorage for key:', key, error);
            return defaultValue;
        }
    }
  }
  return defaultValue;
}

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting localStorage for key:', key, error);
    }
  }, [key, value]);

  return [value, setValue];
}