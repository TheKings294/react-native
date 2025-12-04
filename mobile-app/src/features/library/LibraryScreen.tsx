import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function LibraryScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.card }]}>
              <FontAwesome name="user" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>

          <View>
            <Text style={[styles.username, { color: colors.text }]}>
              @user.username
            </Text>
            <Text style={[styles.address, { color: colors.text, opacity: 0.6 }]}>
              1 adresse
            </Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
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
      </View>

      {/* Tabs */}
      <View
        style={[
          styles.tabContainer,
          { borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            styles.activeTab,
            { borderBottomColor: colors.primary },
          ]}
        >
          <Text style={[styles.tabTextActive, { color: colors.text }]}>
            Abonnements
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: colors.text, opacity: 0.6 }]}>
            Collaborations
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.card },
        ]}
      >
        <FontAwesome
          name="search"
          size={16}
          color={colors.text}
          style={[styles.searchIcon, { opacity: 0.5 }]}
        />
        <TextInput
          placeholder="Recherche..."
          placeholderTextColor={colors.text + "99"} // ~60% opacity
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <FontAwesome name="user" size={40} color={colors.text} />

            <View
              style={[
                styles.hashtagBubble,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.text,
                },
              ]}
            >
              <Text style={[styles.hashtagText, { color: colors.text }]}>#</Text>
            </View>
          </View>

          <Text style={[styles.emptyText, { color: colors.text, opacity: 0.8 }]}>
            Les cartes que vous suivez seront accessibles d'ici
          </Text>

          <TouchableOpacity
            style={[
              styles.addFriendButton,
              { backgroundColor: colors.card },
            ]}
          >
            <FontAwesome
              name="user-plus"
              size={16}
              color={colors.text}
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: colors.text }}>Ajouter des amis</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  username: { fontWeight: "bold" },
  address: { fontSize: 12 },
  headerIcons: { flexDirection: "row" },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: { flex: 1, padding: 15, alignItems: "center" },
  activeTab: { borderBottomWidth: 2 },
  tabText: {},
  tabTextActive: { fontWeight: "bold" },

  searchContainer: {
    flexDirection: "row",
    margin: 15,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1 },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyState: { alignItems: "center", marginTop: 50 },
  emptyIconContainer: { marginBottom: 20, alignItems: "center" },

  hashtagBubble: {
    position: "absolute",
    top: -10,
    right: -20,
    borderWidth: 2,
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  hashtagText: { fontWeight: "bold" },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    maxWidth: 250,
    marginBottom: 30,
  },
  addFriendButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
});
