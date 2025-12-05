import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoadBook } from '@/model/RaodBook';
import RoadBookList from '@/components/roadbook-list';
import { useTheme } from "@react-navigation/native";
import { useLanguage } from "@/providers/LanguageProvider";
import { getRoadbooks, RoadbookResponse } from "@/lib/api";

export default function LibraryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(1);
  const { user } = useAuth();
  const username = user?.username ? `@${user.username}` : '@inconnu';
  const displayName = user?.displayName || user?.username || 'Utilisateur';
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [roadBookList, setRoadBookList] = useState<RoadBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRoadbooks();
        if (!mounted) return;
        const mapped = data.map(mapRoadbookResponse);
        setRoadBookList(mapped);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : t("common.errorAuth");
        setError(msg || null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [t]);

  const mapRoadbookResponse = (rb: RoadbookResponse): RoadBook => ({
    id: rb.id,
    userId: rb.userId,
    title: rb.title,
    description: rb.description || '',
    coverImage: rb.coverImage || null,
    coverImageURL: rb.coverImage || null,
    startDate: rb.startDate ? new Date(rb.startDate) : null,
    endDate: rb.endDate ? new Date(rb.endDate) : null,
    countries: rb.countries || [],
    tags: rb.tags || [],
    isPublished: Boolean(rb.isPublished),
    isPublic: rb.isPublic ?? true,
    template: rb.template || undefined,
    theme: rb.theme || undefined,
    createdAt: rb.createdAt ? new Date(rb.createdAt) : null,
    updatedAt: rb.updatedAt ? new Date(rb.updatedAt) : null,
    viewCount: rb.viewCount ?? 0,
    favoriteCount: rb.favoriteCount ?? 0,
    places: [],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => router.push('/profile')}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.card }]}>
                     <FontAwesome name="user" size={24} color={colors.text} />
                </View>
            </TouchableOpacity>
            <View>
                <Text style={[styles.username, { color: colors.text }]}>{displayName}</Text>
                <Text style={[styles.address, { color: colors.text, opacity: 0.6 }]}>{username}</Text>
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
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, tab === 1 && styles.activeTab]} onPress={() => setTab(1)}>
            <Text style={tab === 1 ? [styles.tabTextActive, { color: colors.text }] : [styles.tabText, { color: colors.text, opacity: 0.6 }]}>{t("library.titleTab1")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 2 && styles.activeTab]} onPress={() => setTab(2)}>
            <Text style={tab === 2 ? [styles.tabTextActive, { color: colors.text }] : [styles.tabText, { color: colors.text, opacity: 0.6 }]}>{t("library.titleTab2")}</Text>
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
          placeholderTextColor={colors.text + "80"}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
          {isLoading ? (
            <Text style={{ color: colors.text }}>{t("common.loading")}</Text>
          ) : error ? (
            <Text style={{ color: colors.text }}>{error}</Text>
          ) : null}
          {roadBookList.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <FontAwesome name={tab === 1 ? "user" : "book"} size={40} color={colors.text} />
                <View style={styles.hashtagBubble}>
                  <Text style={[styles.hashtagText, { color: colors.text }]} >#</Text>
                </View>
              </View>
              <Text style={[styles.emptyText, { color: colors.text }]}>{t("library.emptyText")}</Text>
              <TouchableOpacity style={[styles.addFriendButton, { backgroundColor: colors.card }]}>
                <FontAwesome name="book" size={16} color={colors.text} style={{marginRight: 10}} />
                <Text style={{ color: colors.text }}>{t("add.createRoadbook")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <RoadBookList listRoadBook={roadBookList} />
          )}
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
