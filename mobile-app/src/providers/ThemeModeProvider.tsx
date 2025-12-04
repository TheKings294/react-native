import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  mode: ThemeMode;
  scheme: ColorSchemeName; // "light" | "dark"
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode doit être utilisé dans ThemeModeProvider");
  }
  return ctx;
};

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [scheme, setScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // 1) Charger le mode sauvegardé
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("themeMode");
      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);
      }
    })();
  }, []);

  // 2) Si mode=system, écouter les changements système
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === "system") setScheme(colorScheme);
    });
    return () => sub.remove();
  }, [mode]);

  // 3) Appliquer le mode -> scheme + sauvegarder
  useEffect(() => {
    if (mode === "system") {
      setScheme(Appearance.getColorScheme());
    } else {
      setScheme(mode);
    }
    AsyncStorage.setItem("themeMode", mode);
  }, [mode]);

  const setMode = (m: ThemeMode) => setModeState(m);

  return (
    <ThemeContext.Provider value={{ mode, scheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
