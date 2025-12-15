"use client";

import { useTheme } from "./ThemeProvider";
import styles from "./ThemeSelector.module.css";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.container}>
      <label htmlFor="theme-select" className={styles.label}>
        Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as "dark" | "light" | "system")}
        className={styles.select}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}

