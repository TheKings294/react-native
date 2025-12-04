import React, { useEffect, useMemo, useState } from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type UserProfile = {
  name: string;
  username: string;
  bio: string;
  email: string;
  phone: string;
};

const STORAGE_KEY = "userProfile";

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  username: "",
  bio: "",
  email: "",
  phone: "",
};

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setProfile(JSON.parse(saved));
        }
      } catch (e) {
        console.log("Erreur chargement profil", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateField = (key: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = useMemo(() => {
    if (!profile.name.trim()) return false;
    if (!profile.username.trim()) return false;
    return true;
  }, [profile]);

  const saveProfile = async () => {
    if (!isValid) {
      Alert.alert("Erreur", "Nom et username sont obligatoires.");
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      Alert.alert("Succès", "Profil mis à jour avec succès");

      router.back();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de sauvegarder.");
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

        {/* Avatar placeholder */}
        <View style={[styles.avatarBox, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text, fontSize: 40 }}>👤</Text>
          <TouchableOpacity
            onPress={() => Alert.alert("Photo", "On fera ça plus tard 😉")}
          >
            <Text style={[styles.changePhoto, { color: colors.primary }]}>
              Changer la photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Champs */}
        <View style={styles.form}>
          <Label text="Nom complet" color={colors.text} />
          <TextInput
            value={profile.name}
            onChangeText={(v) => updateField("name", v)}
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
            onChangeText={(v) => updateField("email", v)}
            placeholder="exemple@gmail.com"
            placeholderTextColor={colors.text + "88"}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            ]}
          />

          <Label text="Téléphone" color={colors.text} />
          <TextInput
            value={profile.phone}
            onChangeText={(v) => updateField("phone", v)}
            placeholder="+33"
            placeholderTextColor={colors.text + "88"}
            keyboardType="phone-pad"
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
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
          disabled={!isValid}
        >
          <Text style={styles.saveText}>Enregistrer</Text>
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
