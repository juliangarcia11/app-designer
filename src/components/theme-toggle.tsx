import { Button } from "./ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle - A component that allows users to toggle between light and dark themes
 *
 * @component
 * @example
 * ```tsx
 * import { ThemeToggle } from "@/components/theme-toggle";
 *
 * const App = () => (
 *   <div>
 *     <ThemeToggle />
 *     { Other components }
 *   </div>
 * );
 * ```
 *
 * @remarks
 * This component is positioned fixed at the bottom left corner of the viewport.
 * It will remain in place during scrolling, ensuring it's always accessible to users.
 *
 * The component uses the useTheme hook to access the current theme state and
 * to toggle between 'light' and 'dark' themes.
 *
 * @accessibility
 * - The button includes an aria-label that changes based on the current theme
 * - Icons (Sun/Moon) provide visual indication of the current theme and action
 */
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 100,
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};
