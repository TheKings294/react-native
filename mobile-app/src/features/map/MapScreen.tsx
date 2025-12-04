import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useLanguage } from "@/providers/LanguageProvider";

export default function MapScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={{ color: colors.text }}>
          {t("map.placeholder")}
        </Text>

        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Africa_map_blank.svg/1200px-Africa_map_blank.svg.png",
          }}
          style={styles.mapImage}
        />
      </View>

      {/* Floating Header Over Map */}
      <SafeAreaView style={styles.headerOverlay}>
        <View style={[styles.headerContent, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: colors.background },
            ]}
          >
            <FontAwesome name="user" size={20} color={colors.text} />
          </View>

          <View>
            <Text style={[styles.username, { color: colors.text }]}>
              @user.username
            </Text>
            <Text style={[styles.address, { color: colors.text, opacity: 0.6 }]}>
              1 adresse
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity>
            <FontAwesome
              name="question-circle-o"
              size={24}
              color={colors.text}
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <FontAwesome name="upload" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#A3CCFF",
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.5,
  },

  headerOverlay: { position: "absolute", top: 0, left: 0, right: 0 },
  headerContent: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    margin: 10,
    borderRadius: 20,
    opacity: 0.9,
  },

  avatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  username: { fontWeight: "bold", fontSize: 12 },
  address: { fontSize: 10 },
});
