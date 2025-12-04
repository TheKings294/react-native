import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useLanguage } from "@/providers/LanguageProvider";

type LangCode = "fr" | "en";
type Lang = { code: LangCode; label: string };

const LANGUAGES: Lang[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export default function LanguageScreen() {
  const { colors } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const selectLanguage = async (code: LangCode) => {
    try {
      await setLang(code);
      Alert.alert(t("settings.language"), t("common.saved"));
      router.back();
    } catch {
      Alert.alert("Erreur", "Impossible de sauvegarder la langue.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {t("settings.language")}
      </Text>

      <View>
        {LANGUAGES.map((item) => {
          const active = item.code === lang;

          return (
            <TouchableOpacity
              key={item.code}
              onPress={() => selectLanguage(item.code)}
              style={[
                styles.item,
                {
                  backgroundColor: colors.card,
                  borderColor: active ? colors.primary : colors.border,
                },
                active && styles.itemActive,
              ]}
            >
              <Text style={[styles.itemText, { color: colors.text }]}>
                {item.label}
              </Text>

              {active && (
                <Text style={[styles.check, { color: colors.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 16 },
  item: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemActive: { borderWidth: 2 },
  itemText: { fontSize: 16, fontWeight: "600" },
  check: { fontSize: 18, fontWeight: "800" },
});
