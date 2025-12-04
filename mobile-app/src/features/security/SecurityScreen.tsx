import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, Switch, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile, updateUserPassword } from "@/lib/api";

type PrivacySettings = {
  privateAccount: boolean;
};

const DEFAULT_PRIVACY: PrivacySettings = {
  privateAccount: false,
};

export default function SecurityScreen() {
  const { colors } = useTheme();
  const { user, token, setAuthData } = useAuth();

  const [privacy, setPrivacy] = useState<PrivacySettings>(DEFAULT_PRIVACY);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setPrivacy({
        privateAccount: user.isProfilePublic === false,
      });
    }
    setLoading(false);
  }, [user]);

  const togglePrivacy = async (key: keyof PrivacySettings, v: boolean) => {
    if (!token || !user) {
      Alert.alert("Erreur", "Utilisateur non authentifié.");
      return;
    }
    if (key !== "privateAccount") return;

    const nextPrivacy = { ...privacy, privateAccount: v };
    setPrivacy(nextPrivacy);
    setIsSavingPrivacy(true);
    try {
      const isProfilePublic = !v;
      await updateUserProfile({ isProfilePublic });
      await setAuthData(token, { ...user, isProfilePublic });
    } catch (e) {
      setPrivacy(privacy);
      const message = e instanceof Error ? e.message : "Impossible de mettre à jour.";
      Alert.alert("Erreur", message);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) {
      Alert.alert("Erreur", "Utilisateur non authentifié.");
      return;
    }
    if (!currentPwd.trim()) {
      Alert.alert("Erreur", "Merci de renseigner votre mot de passe actuel.");
      return;
    }
    try {
      if (newPwd.trim().length < 6) {
        Alert.alert(
          "Erreur",
          "Le nouveau mot de passe doit faire au moins 6 caractères."
        );
        return;
      }

      if (newPwd !== confirmPwd) {
        Alert.alert("Erreur", "La confirmation ne correspond pas.");
        return;
      }

      setIsSavingPassword(true);
      await updateUserPassword({ oldPassword: currentPwd, newPassword: newPwd });

      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setShowPasswordForm(false);

      Alert.alert("Succès", "Mot de passe mis à jour ");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Impossible de sauvegarder le mot de passe.";
      Alert.alert("Erreur", message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Sécurité</Text>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, opacity: 0.7 },
          ]}
        >
          Mot de passe
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, marginBottom: 16 },
          ]}
        >
          <Row
            label="Changer le mot de passe"
            desc="Modifier ton mot de passe"
            value={showPasswordForm}
            onChange={(v) => setShowPasswordForm(v)}
            colors={colors}
          />

          {showPasswordForm && (
            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="Mot de passe actuel"
                secureTextEntry
                value={currentPwd}
                onChangeText={setCurrentPwd}
                placeholderTextColor={colors.text + "99"}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
              />

              <TextInput
                placeholder="Nouveau mot de passe"
                secureTextEntry
                value={newPwd}
                onChangeText={setNewPwd}
                placeholderTextColor={colors.text + "99"}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
              />

              <TextInput
                placeholder="Confirmer le nouveau mot de passe"
                secureTextEntry
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                placeholderTextColor={colors.text + "99"}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
              />

              <TouchableOpacity
                onPress={handleChangePassword}
                style={[
                  styles.saveBtn,
                  { backgroundColor: isSavingPassword ? colors.border : colors.primary },
                ]}
                disabled={isSavingPassword}
              >
                {isSavingPassword ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    Enregistrer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, opacity: 0.7 },
          ]}
        >
          Confidentialité
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Row
            label="Compte privé"
            desc="Seuls tes abonnés voient ton contenu"
            value={privacy.privateAccount}
            onChange={(v) => togglePrivacy("privateAccount", v)}
            colors={colors}
          />
          {isSavingPrivacy && (
            <Text style={{ color: colors.text, opacity: 0.6, marginTop: 8 }}>
              Mise à jour...
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  desc,
  value,
  onChange,
  colors,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: any;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
        <Text style={{ color: colors.text, opacity: 0.6, fontSize: 12 }}>
          {desc}
        </Text>
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },

  title: { fontSize: 24, fontWeight: "800", marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: "800", marginBottom: 8 },

  card: { borderRadius: 14, padding: 12 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
  },

  saveBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
});
