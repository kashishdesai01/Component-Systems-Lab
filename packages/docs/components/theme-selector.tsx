'use client';
import { useEffect, useState } from 'react';
type Theme = 'light' | 'dark' | 'high-contrast';
export function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('csl-theme');
      if (saved === 'light' || saved === 'dark' || saved === 'high-contrast') {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
      }
    } catch {
      /* Storage is optional. */
    }
  }, []);
  return (
    <label className="theme-selector">
      <span className="sr-only">Color theme</span>
      <select
        value={theme}
        onChange={(event) => {
          const next = event.target.value as Theme;
          setTheme(next);
          document.documentElement.dataset.theme = next;
          try {
            localStorage.setItem('csl-theme', next);
          } catch {
            /* Storage is optional. */
          }
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="high-contrast">High contrast</option>
      </select>
    </label>
  );
}
