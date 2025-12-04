import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoadBook } from '@/model/RaodBook';
import RoadBookList from '@/components/roadbook-list';

export default function LibraryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(1);
  const { user } = useAuth();
  const username = user?.username ? `@${user.username}` : '@inconnu';
  const displayName = user?.displayName || user?.username || 'Utilisateur';
  const [roadBookList, setRoadBookList] = useState<RoadBook[]>([
      {
          id: 1,
          userId: 1,
          title: "Hello",
          description: "Hello",
          coverImageURL: "https://picsum.photos/200/300",
          startDate: new Date("2025-11-29"),
          endDate: new Date("2025-12-29"),
          countries: [
              "France",
              "Angleterre"
          ],
          tags: [
              "Van",
              "Wine",
          ],
          isPublished: false,
          isPublic: false,
          theme: [
              "New",
              "FavoritePlace",
          ],
          createdAt: new Date("2025-11-29"),
          updatedAt: new Date("2025-11-29"),
          viewCount: 1,
          favoriteCount: 0,
          places: []
      },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => router.push('/profile')}>
                <View style={styles.avatarPlaceholder}>
                     <FontAwesome name="user" size={24} color="#666" />
                </View>
            </TouchableOpacity>
            <View>
                <Text style={styles.username}>{displayName}</Text>
                <Text style={styles.address}>{username}</Text>
            </View>
        </View>
        <View style={styles.headerIcons}>
             <TouchableOpacity>
                <FontAwesome name="question-circle-o" size={24} color="black" style={{marginRight: 15}} />
             </TouchableOpacity>
             <TouchableOpacity>
                <FontAwesome name="upload" size={24} color="black" />
             </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, tab === 1 && styles.activeTab]} onPress={() => setTab(1)}>
            <Text style={tab === 1 ? styles.tabTextActive : styles.tabText}>Abonnements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 2 && styles.activeTab]} onPress={() => setTab(2)}>
            <Text style={tab === 2 ? styles.tabTextActive : styles.tabText}>Mes roadBooks</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#999" style={styles.searchIcon} />
        <TextInput placeholder="Recherche..." style={styles.searchInput} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
          {
              tab === 1 ?
                  <View style={styles.emptyState}>
                      <View style={styles.emptyIconContainer}>
                          <FontAwesome name="user" size={40} color="black" />
                          <View style={styles.hashtagBubble}>
                              <Text style={styles.hashtagText}>#</Text>
                          </View>
                      </View>
                      <Text style={styles.emptyText}>Les cartes que vous suivez seront accessibles d ici</Text>

                      <TouchableOpacity style={styles.addFriendButton}>
                          <FontAwesome name="user-plus" size={16} color="black" style={{marginRight: 10}} />
                          <Text>Ajouter des amis</Text>
                      </TouchableOpacity>
                  </View>
                  :
                  <View style={styles.emptyState}>
                      {
                          roadBookList.length === 0 ?
                              <>
                                  <View style={styles.emptyIconContainer}>
                                      <FontAwesome name="book" size={40} color="black" />
                                      <View style={styles.hashtagBubble}>
                                          <Text style={styles.hashtagText}>#</Text>
                                      </View>
                                  </View>
                                  <Text style={styles.emptyText}>Vos roads books se retrouve ici</Text>

                                  <TouchableOpacity style={styles.addFriendButton}>
                                      <FontAwesome name="book" size={16} color="black" style={{marginRight: 10}} />
                                      <Text>Crée un road book</Text>
                                  </TouchableOpacity>
                              </>
                              :
                              <>
                                  <RoadBookList listRoadBook={roadBookList} />
                              </>
                      }
                  </View>
          }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  username: { fontWeight: 'bold' },
  address: { color: '#666', fontSize: 12 },
  headerIcons: { flexDirection: 'row' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#000' },
  tabText: { color: '#666' },
  tabTextActive: { fontWeight: 'bold', color: '#000' },
  searchContainer: { flexDirection: 'row', margin: 15, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10, alignItems: 'center' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }, // Padding for bottom tab
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyIconContainer: { marginBottom: 20, alignItems: 'center' },
  hashtagBubble: { position: 'absolute', top: -10, right: -20, backgroundColor: '#fff', borderWidth: 2, borderColor: '#000', borderRadius: 10, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  hashtagText: { fontWeight: 'bold' },
  emptyText: { textAlign: 'center', fontSize: 16, maxWidth: 250, marginBottom: 30 },
  addFriendButton: { flexDirection: 'row', backgroundColor: '#eee', padding: 10, borderRadius: 20, alignItems: 'center' },
});
