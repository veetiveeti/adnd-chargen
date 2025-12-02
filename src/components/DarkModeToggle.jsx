import React, { useState, useEffect } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    // Check system preference if no saved preference
    if (saved === null) {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return saved === 'true';
  });

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    // Save preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Brightness7Icon style={{ fontSize: '1.5rem' }} />
      ) : (
        <Brightness4Icon style={{ fontSize: '1.5rem' }} />
      )}
    </button>
  );
};

export default DarkModeToggle;

