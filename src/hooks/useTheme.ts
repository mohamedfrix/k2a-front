'use client';

import { useTheme } from '@/context/ThemeContext';

// Re-export for convenience
export { useTheme };

// Additional utility hooks for theme management

/**
 * Hook that returns true if current theme is dark
 */
export function useIsDark(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
}

/**
 * Hook that returns true if current theme is light
 */
export function useIsLight(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'light';
}

/**
 * Hook that returns theme-aware CSS classes
 * Useful for conditional styling
 */
export function useThemeClasses(lightClass: string, darkClass: string): string {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'light' ? lightClass : darkClass;
}
