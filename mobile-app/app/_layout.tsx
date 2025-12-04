import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeModeProvider, useThemeMode } from "@/providers/ThemeModeProvider";
import { LanguageProvider, useLanguage } from "@/providers/LanguageProvider"; // ✅ AJOUT

export const unstable_settings = {
  anchor: "(tabs)",
};

function NavigationRoot() {
  const { scheme } = useThemeMode();
  const { t } = useLanguage(); // ✅ AJOUT (pour header traduit)

  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* ✅ titre traduit */}
        <Stack.Screen
          name="settings"
          options={{ title: t("settings.title") }}
        />

        <Stack.Screen
          name="security" 
          options={{ title: "Sécurité" }} 
        />
        
        <Stack.Screen
          name="edit-profile"
          options={{ title: "Infos personnelles" }} // ou t("profile.editTitle") plus tard
        />


        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />

      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      {/* ✅ PROVIDER LANGUE GLOBAL */}
      <LanguageProvider>
        <NavigationRoot />
      </LanguageProvider>
    </ThemeModeProvider>
  );
}
