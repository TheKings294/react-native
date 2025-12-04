import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";

export default function MapScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const displayName = user?.displayName || user?.username || 'Utilisateur';
  const usernameLabel = user?.username ? `@${user.username}` : user?.email || "Profil";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
            coordinate={{ latitude: 47.9032, longitude: 1.9085 }}
            title={"Orléans"}
            description={"Location"}
         />
      </MapView>

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
              {displayName}
            </Text>
            <Text style={[styles.address, { color: colors.text, opacity: 0.6 }]}>
              {usernameLabel}
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
  map: { width: '100%', height: '100%' },
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
