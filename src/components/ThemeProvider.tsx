"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    let effectiveTheme: "dark" | "light";

    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      effectiveTheme = theme;
    }

    setResolvedTheme(effectiveTheme);

    // Apply theme to document
    const htmlElement = document.documentElement;
    if (effectiveTheme === "dark") {
      htmlElement.classList.add("dark");
      htmlElement.classList.remove("light");
      htmlElement.style.colorScheme = "dark";
    } else {
      htmlElement.classList.add("light");
      htmlElement.classList.remove("dark");
      htmlElement.style.colorScheme = "light";
    }

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Listen to system theme changes
  useEffect(() => {
    if (theme !== "system" || !mounted) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light");
      const htmlElement = document.documentElement;
      if (e.matches) {
        htmlElement.classList.add("dark");
        htmlElement.classList.remove("light");
        htmlElement.style.colorScheme = "dark";
      } else {
        htmlElement.classList.add("light");
        htmlElement.classList.remove("dark");
        htmlElement.style.colorScheme = "light";
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
