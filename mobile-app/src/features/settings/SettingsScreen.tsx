import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { useThemeMode } from "@/providers/ThemeModeProvider";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/providers/LanguageProvider";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type ItemProps = {label: string;
  description?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

const Item = ({ label, description, onPress, right, danger }: ItemProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: danger ? "#fff1f2" : colors.card },
        pressed && onPress && styles.itemPressed,
      ]}
      accessibilityRole={onPress ? "button" : "none"}
    >
      <View style={styles.itemLeft}>
        <Text
          style={[
            styles.itemLabel,
            { color: danger ? "#b91c1c" : colors.text },
          ]}
        >
          {label}
        </Text>

        {!!description && (
          <Text
            style={[
              styles.itemDescription,
              { color: colors.text, opacity: 0.6 },
            ]}
          >
            {description}
          </Text>
        )}
      </View>

      <View style={styles.itemRight}>
        {right ? (
          right
        ) : onPress ? (
          <Text style={[styles.chevron, { color: colors.text, opacity: 0.5 }]}>
            ›
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text, opacity: 0.6 }]}>
        {title}
      </Text>

      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const { lang, t } = useLanguage();

  // Dark mode global
  const { mode, setMode } = useThemeMode();
  const darkMode = mode === "dark";

  // Notifications mock + persistance
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // ✅ Charge notifications au montage
  useEffect(() => {
    (async () => {
      const savedNotif = await AsyncStorage.getItem("notificationsEnabled");
      if (savedNotif !== null) {
        setNotificationsEnabled(savedNotif === "true");
      }
    })();
  }, []);

  const languageLabel = useMemo(() => {
    if (lang === "en") return "English";
    return "Français";
  }, [lang]);

  const toggleNotifications = async (value: boolean) => {
    const isExpoGo = Constants.appOwnership === "expo";

    if (value && isExpoGo) {
      Alert.alert(
        "Expo Go",
        "Les notifications push ne fonctionnent pas sur Expo Go Android (SDK 53+). On garde le switch pour simuler."
      );
    }

    setNotificationsEnabled(value);
    await AsyncStorage.setItem("notificationsEnabled", String(value));
  };

  const versionText = useMemo(() => {
    return Platform.OS === "ios" ? "iOS" : "Android";
  }, []);

  const comingSoon = (title: string) =>
    Alert.alert(title, t("common.comingSoon"));

  const confirmLogout = () => {
    Alert.alert(t("settings.logout"), t("settings.logoutConfirm") || t("settings.logout"), [
      { text: t("common.cancel") || "Cancel", style: "cancel" },
      {
        text: t("settings.logout"),
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>{t("settings.title")}</Text>

      <Section title={t("settings.preferences")}>
        <Item
          label={t("settings.darkMode")}
          description={t("settings.darkModeDesc") || ""}
          right={
            <Switch
              value={darkMode}
              onValueChange={(v) => setMode(v ? "dark" : "light")}
            />
          }
        />

        <Item
          label={t("settings.notifications")}
          description={t("settings.notificationsDesc") || ""}
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          }
        />

        <Item
          label={t("settings.language")}
          description={languageLabel}
          onPress={() => router.push("/language")}
        />
      </Section>

      <Section title={t("settings.account")}>
        <Item
          label={t("settings.myProfile")}
          description={t("settings.profileInfo") || ""}
          onPress={() => router.push("/edit-profile")}
        />

        <Item
          label={t("settings.security")}
          description={t("settings.securityDesc") || ""}
          onPress={() => router.push("/security")}
        />

      </Section>

      <Section title={t("settings.support") || "Support"}>
        <Item label={t("settings.help") || "Help & FAQ"} onPress={() => comingSoon(t("settings.help") || "Help & FAQ")} />
        <Item
          label={t("settings.about") || "About"}
          description={`${t("settings.about") || "About"} • ${versionText}`}
          onPress={() => comingSoon(t("settings.about") || "About")}
        />
      </Section>

      <Section title={t("settings.actions") || "Actions"}>
        <Item label={t("settings.logout")} danger onPress={confirmLogout} />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },

  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  sectionCard: {
    borderRadius: 16,
    paddingVertical: 4,
  },

  item: {
    minHeight: 56,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    marginHorizontal: 6,
    marginVertical: 4,
  },
  itemPressed: { opacity: 0.65 },

  itemLeft: { flex: 1, paddingRight: 8 },
  itemLabel: { fontSize: 16, fontWeight: "600" },
  itemDescription: { fontSize: 13, marginTop: 2 },

  itemRight: { justifyContent: "center", alignItems: "center" },
  chevron: { fontSize: 22, marginLeft: 8 },
});
