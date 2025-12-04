import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from "@react-navigation/native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const username = user?.username ? `@${user.username}` : '@inconnu';
  const displayName = user?.displayName || user?.username || 'Utilisateur';
  const bioText = user?.bio || "Ajoutez une bio pour en dire plus sur vous";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()}>
             <Text style={styles.headerText}>{username}</Text>
         </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <FontAwesome
              name="user-plus"
              size={20}
              color={colors.text}
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/settings")}>
            <FontAwesome name="cog" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileSection}>
        <View style={[styles.avatarLarge, { backgroundColor: colors.card }]}>
          <FontAwesome name="user" size={50} color={colors.text} />
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.text, opacity: 0.6 }]}>
              Lieux
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.text, opacity: 0.6 }]}>
              Abonnements
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.text, opacity: 0.6 }]}>
              Abonnés
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bioSection}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.bioPlaceholder}>{bioText}</Text>
          {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card }]}>
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Modifier mon profil
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
      </View>

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
  headerText: { fontWeight: "bold", fontSize: 16 },
  headerIcons: { flexDirection: "row" },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },

  stats: { flexDirection: "row", flex: 1, justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontWeight: "bold", fontSize: 16 },
  statLabel: { fontSize: 12 },

  bioSection: { paddingHorizontal: 20, marginBottom: 20 },
  name: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  bioPlaceholder: { color: '#666' },
  email: { color: '#666', marginTop: 4 },
  actionButtons: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  button: { flex: 1, backgroundColor: '#eee', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { fontWeight: '500' },
  logoutContainer: { paddingHorizontal: 20, marginTop: 30 },
  logoutButton: { backgroundColor: '#ddd', padding: 12, borderRadius: 8, alignItems: 'center' },
  logoutText: { fontWeight: '600' },
});
