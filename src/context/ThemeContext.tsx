'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme types based on Material Design principles
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Function to get system preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Function to resolve theme (system -> actual theme)
  const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Apply theme to HTML element and localStorage
  const applyTheme = (newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    
    // Update CSS classes on HTML element
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(resolved);
      
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
    }
    
    setThemeState(newTheme);
    setResolvedTheme(resolved);
  };

  // Public function to set theme
  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  // Toggle between light and dark (ignores system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || defaultTheme;
    
    applyTheme(initialTheme);

    // Listen for system theme changes when using 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const newResolved = getSystemTheme();
        setResolvedTheme(newResolved);
        
        // Update HTML class
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, defaultTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
