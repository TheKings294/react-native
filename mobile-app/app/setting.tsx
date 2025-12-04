// app/(tabs)/settings.tsx
import React, { useMemo, useState } from "react";
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

type ItemProps = {
  label: string;
  description?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

const Item = ({ label, description, onPress, right, danger }: ItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.item,
        danger && styles.itemDanger,
        pressed && onPress && styles.itemPressed,
      ]}
      accessibilityRole={onPress ? "button" : "none"}
    >
      <View style={styles.itemLeft}>
        <Text style={[styles.itemLabel, danger && styles.itemLabelDanger]}>
          {label}
        </Text>
        {!!description && (
          <Text style={styles.itemDescription}>{description}</Text>
        )}
      </View>

      <View style={styles.itemRight}>
        {right ?? (onPress ? <Text style={styles.chevron}>›</Text> : null)}
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
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

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
        onPress: () => {
          // TODO: clear token / storage / store
          router.replace("/"); // retour accueil / auth selon ton flow
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Paramètres</Text>

      <Section title="Préférences">
        <Item
          label="Mode sombre"
          description="Réduit la luminosité de l’interface"
          right={<Switch value={darkMode} onValueChange={setDarkMode} />}
        />
        <Item
          label="Notifications"
          description="Activer ou désactiver les alertes"
          right={
            <Switch value={notifications} onValueChange={setNotifications} />
          }
        />
        <Item
          label="Langue"
          description="Français"
          onPress={() => comingSoon("Langue")}
        />
      </Section>

      <Section title="Compte">
        <Item
          label="Mon profil"
          description="Infos personnelles"
          onPress={() => router.push("/profile")} // ✅ route existe chez toi
        />
        <Item
          label="Sécurité"
          description="Mot de passe, confidentialité"
          onPress={() => comingSoon("Sécurité")}
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
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 120 }, // un peu plus bas pour éviter la tab bar

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    color: "#0f172a",
  },

  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  sectionCard: {
    backgroundColor: "#f8fafc",
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
    backgroundColor: "#ffffff",
  },
  itemPressed: { opacity: 0.65 },

  itemLeft: { flex: 1, paddingRight: 8 },
  itemLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  itemDescription: { fontSize: 13, color: "#6b7280", marginTop: 2 },

  itemRight: { justifyContent: "center", alignItems: "center" },
  chevron: { fontSize: 22, color: "#9ca3af", marginLeft: 8 },

  itemDanger: { backgroundColor: "#fff1f2" },
  itemLabelDanger: { color: "#b91c1c" },
});
