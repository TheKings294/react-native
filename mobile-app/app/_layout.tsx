import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from '@/context/AuthContext';
import { ThemeModeProvider, useThemeMode } from "@/providers/ThemeModeProvider";
import { LanguageProvider, useLanguage } from "@/providers/LanguageProvider";

export const unstable_settings = {
  anchor: "(tabs)",
};

function NavigationRoot() {
  const { scheme } = useThemeMode();
  const { t, lang } = useLanguage();

  return (
    <AuthProvider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack key={lang}>
          <Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="roadbook" options={{ title: 'Roadbook' }} />
          <Stack.Screen name="settings" options={{ title: lang === "en" ? "Settings" : t("settings.title") }} />
          <Stack.Screen name="security" options={{ title: lang === "en" ? "Security" : t("settings.security") }} />
          <Stack.Screen name="profile" options={{ title: lang === "en" ? "Profile" : "Profil" }} />
          <Stack.Screen
            name="edit-profile"
            options={{ title: t("profile.editProfile") }}
          />
          <Stack.Screen
            name="form-new-roadbook"
            options={{ title: "Roadbook" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <LanguageProvider>
        <NavigationRoot />
      </LanguageProvider>
    </ThemeModeProvider>
  );
}
