'use client';

import { useTheme } from '../../hooks/useTheme';
import { Theme } from '@/context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-on-surface">Theme:</span>
      <div className="relative">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="appearance-none bg-surface border border-outline text-on-surface px-3 py-2 pr-8 rounded-md-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer"
        >
          {themes.map(({ value, label, icon }) => (
            <option key={value} value={value}>
              {icon} {label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-on-surface-variant"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      
      {/* Display current resolved theme */}
      <div className="text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded-md-xs">
        {resolvedTheme === 'light' ? '☀️' : '🌙'} {resolvedTheme}
      </div>
    </div>
  );
}

/* Alternative: Toggle Button Style Theme Switcher */
export function ThemeToggle({ className = '' }: ThemeSwitcherProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-md-md bg-surface border border-outline-variant
        hover:bg-surface-variant hover:border-outline
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        transition-all duration-300 group
        ${className}
      `}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="w-5 h-5 flex items-center justify-center relative">
        {/* Light theme icon */}
        <svg
          className={`absolute w-4 h-4 transition-all duration-300 ${
            resolvedTheme === 'light' 
              ? 'opacity-100 rotate-0 scale-100 text-warning' 
              : 'opacity-0 -rotate-90 scale-50 text-on-surface-variant'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
        
        {/* Dark theme icon */}
        <svg
          className={`absolute w-4 h-4 transition-all duration-300 ${
            resolvedTheme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100 text-primary' 
              : 'opacity-0 rotate-90 scale-50 text-on-surface-variant'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
      
      {/* Tooltip indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-surface-variant text-on-surface-variant text-xs px-2 py-1 rounded-md-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {resolvedTheme === 'light' ? 'Switch to dark' : 'Switch to light'}
      </div>
    </button>
  );
}
