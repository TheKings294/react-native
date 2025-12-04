import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import {Section} from "@/components/ui/section_ui";
import {Item} from "@/components/ui/item_ui";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/context/AuthContext";

export default function LibraryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  const displayName = user?.displayName || user?.username || "Utilisateur";
  const usernameLabel = user?.username ? `@${user.username}` : user?.email || "Profil";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.card },
              ]}
            >
              <FontAwesome name="user" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>

          <View>
            <Text style={[styles.username, { color: colors.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.address, { color: colors.text, opacity: 0.6 }]}>
              {usernameLabel}
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

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View>
            <Section
            title={"Creation"}>
                <Item label={"RoadBook"} description={"Creation d'un roadbook"}
                      onPress={() => router.push("/form-new-roadbook")} />
                <Item label={"Point"} description={"Creation d'un lieux"} />
            </Section>
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
    marginHorizontal: 15,
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
