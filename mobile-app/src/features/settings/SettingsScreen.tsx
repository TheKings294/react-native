import React, { useMemo, useState, useEffect, useCallback } from "react";
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
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useTheme } from "@react-navigation/native";
import { useThemeMode } from "@/providers/ThemeModeProvider";
import { useAuth } from "@/context/AuthContext";

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
  const params = useLocalSearchParams(); // ✅ récupère ?lang=en etc.
  const { logout } = useAuth();

  // Dark mode global
  const { mode, setMode } = useThemeMode();
  const darkMode = mode === "dark";

  // Notifications mock + persistance
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Langue affichée
  const [languageLabel, setLanguageLabel] = useState("Français");

  // ✅ Charge notifications au montage
  useEffect(() => {
    (async () => {
      const savedNotif = await AsyncStorage.getItem("notificationsEnabled");
      if (savedNotif !== null) {
        setNotificationsEnabled(savedNotif === "true");
      }
    })();
  }, []);

  // ✅ Fonction solide pour charger la langue
  const loadLanguage = useCallback(async () => {
    const savedLang = await AsyncStorage.getItem("appLanguage");
    if (savedLang === "en") setLanguageLabel("English");
    else if (savedLang === "ar") setLanguageLabel("العربية");
    else setLanguageLabel("Français");
  }, []);

  // ✅ Charge langue au montage
  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  // ✅ Recharge langue quand tu reviens sur Settings
  useFocusEffect(
    useCallback(() => {
      loadLanguage();
    }, [loadLanguage])
  );

  // ✅ Refresh forcé si LanguageScreen renvoie un param
  useEffect(() => {
    const lang = params?.lang;
    if (lang === "en") setLanguageLabel("English");
    else if (lang === "ar") setLanguageLabel("العربية");
    else if (lang === "fr") setLanguageLabel("Français");
  }, [params?.lang]);

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
    Alert.alert(title, "Cette fonctionnalité arrive bientôt 😉");

  const confirmLogout = () => {
    Alert.alert("Déconnexion", "Tu es sûr de vouloir te déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
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
      <Text style={[styles.title, { color: colors.text }]}>Paramètres</Text>

      <Section title="Préférences">
        <Item
          label="Mode sombre"
          description="Réduit la luminosité de l’interface"
          right={
            <Switch
              value={darkMode}
              onValueChange={(v) => setMode(v ? "dark" : "light")}
            />
          }
        />

        <Item
          label="Notifications"
          description="Activer ou désactiver les alertes"
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          }
        />

        <Item
          label="Langue"
          description={languageLabel}
          onPress={() => router.push("/language")}
        />
      </Section>

      <Section title="Compte">
        <Item
          label="Mon profil"
          description="Infos personnelles"
          onPress={() => router.push("/edit-profile")}
        />

        <Item
          label="Sécurité"
          description="Mot de passe, confidentialité"
          onPress={() => router.push("/security")}
        />

      </Section>

      <Section title="Support">
        <Item label="Aide & FAQ" onPress={() => comingSoon("Aide & FAQ")} />
        <Item
          label="À propos"
          description={`Version app • ${versionText}`}
          onPress={() => comingSoon("À propos")}
        />
      </Section>

      <Section title="Actions">
        <Item label="Se déconnecter" danger onPress={confirmLogout} />
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
