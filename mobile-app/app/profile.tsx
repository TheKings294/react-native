import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerText}>@Mourad9101 v</Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <FontAwesome
              name="user-plus"
              size={20}
              color="black"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>

          {/* ✅ Icône Settings cliquable */}
          <TouchableOpacity onPress={() => router.push("/setting")}>
            <FontAwesome name="cog" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarLarge}>
          <FontAwesome name="user" size={50} color="#666" />
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Lieux</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Abonnements</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.name}>Mourad</Text>
        <Text style={styles.bioPlaceholder}>
          Ajoutez une bio pour en dire plus sur vous
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Modifier mon profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Partager ma carte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
  headerText: { fontWeight: 'bold', fontSize: 16 },
  headerIcons: { flexDirection: 'row' },
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stats: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { fontSize: 12, color: '#666' },
  bioSection: { paddingHorizontal: 20, marginBottom: 20 },
  name: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  bioPlaceholder: { color: '#666' },
  actionButtons: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  button: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { fontWeight: '500' },
});
