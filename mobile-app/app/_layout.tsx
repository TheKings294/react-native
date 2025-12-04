import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeModeProvider, useThemeMode } from "@/providers/ThemeModeProvider";
import { LanguageProvider, useLanguage } from "@/providers/LanguageProvider"; // ✅ AJOUT

export const unstable_settings = {
  anchor: "(tabs)",
};

function NavigationRoot() {
  const { scheme } = useThemeMode();
  const { t } = useLanguage(); // ✅ AJOUT (pour header traduit)

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="roadbook" options={{ title: 'Roadbook' }} />
          <Stack.Screen name="settings" options={{ title: t("settings.title") }} />
          <Stack.Screen name="security" options={{ title: "Sécurité" }} />
          <Stack.Screen name="edit-profile" options={{ title: "Infos personnelles" }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
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
