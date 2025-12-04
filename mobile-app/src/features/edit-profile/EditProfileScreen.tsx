import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/api";

type UserProfile = {
  displayName: string;
  username: string;
  bio: string;
  email: string;
};

const DEFAULT_PROFILE: UserProfile = {
  displayName: "",
  username: "",
  bio: "",
  email: "",
};

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, token, setAuthData } = useAuth();

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        displayName: user.displayName || "",
        username: user.username || "",
        bio: user.bio || "",
        email: user.email || "",
      });
    }
    setLoading(false);
  }, [user]);

  const updateField = (key: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = useMemo(() => {
    if (!profile.username.trim()) return false;
    return true;
  }, [profile]);

  const saveProfile = async () => {
    if (!isValid) {
      Alert.alert("Erreur", "Le nom d'utilisateur est obligatoire.");
      return;
    }
    if (!token || !user) {
      Alert.alert("Erreur", "Utilisateur non authentifié.");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserProfile({
        username: profile.username.trim(),
        displayName: profile.displayName.trim() || null,
        bio: profile.bio.trim() || null,
      });

      const nextUser = {
        ...user,
        username: profile.username.trim(),
        displayName: profile.displayName.trim() || null,
        bio: profile.bio.trim() || null,
      };
      await setAuthData(token, nextUser);

      Alert.alert("Succès", "Profil mis à jour avec succès");

      router.back();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Impossible de sauvegarder.";
      Alert.alert("Erreur", message);
    } finally {
      setIsSaving(false);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Infos personnelles
        </Text>

        {/* Avatar */}
        <View style={[styles.avatarBox, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text, fontSize: 40 }}>👤</Text>
          <TouchableOpacity onPress={() => Alert.alert("Info", "Cette fonction sera ajoutée plus tard.")}>
            <Text style={[styles.changePhoto, { color: colors.primary }]}>
              Changer la photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Champs */}
        <View style={styles.form}>
          <Label text="Nom complet" color={colors.text} />
          <TextInput
            value={profile.displayName}
            onChangeText={(v) => updateField("displayName", v)}
            placeholder="Ex: John Doe"
            placeholderTextColor={colors.text + "88"}
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            ]}
          />

          <Label text="Username" color={colors.text} />
          <TextInput
            value={profile.username}
            onChangeText={(v) => updateField("username", v)}
            placeholder="@JohnDoe11"
            placeholderTextColor={colors.text + "88"}
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            ]}
          />

          <Label text="Bio" color={colors.text} />
          <TextInput
            value={profile.bio}
            onChangeText={(v) => updateField("bio", v)}
            placeholder="Ajoute une bio..."
            placeholderTextColor={colors.text + "88"}
            multiline
            style={[
              styles.input,
              styles.bioInput,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            ]}
          />

          <Label text="Email" color={colors.text} />
          <TextInput
            value={profile.email}
            editable={false}
            placeholder="exemple@gmail.com"
            placeholderTextColor={colors.text + "88"}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, opacity: 0.6 },
            ]}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={saveProfile}
          style={[
            styles.saveButton,
            { backgroundColor: isValid ? colors.primary : colors.border },
          ]}
          disabled={!isValid || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.saveText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ text, color }: { text: string; color: string }) {
  return <Text style={[styles.label, { color }]}>{text}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
  },

  avatarBox: {
    alignItems: "center",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
  },
  changePhoto: {
    marginTop: 8,
    fontWeight: "700",
  },

  form: { gap: 8 },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },

  bioInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  saveButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    fontWeight: "800",
    fontSize: 16,
    color: "black",
  },
});
