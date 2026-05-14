"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'pink';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('nh-theme') as Theme;
    if (saved === 'pink' || saved === 'dark') {
      setTheme(saved);
      applyTheme(saved);
    }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'pink') {
      root.classList.remove('dark');
      root.classList.add('theme-pink');
    } else {
      root.classList.remove('theme-pink');
      root.classList.add('dark');
    }
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'pink' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('nh-theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
