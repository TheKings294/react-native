import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      {/* Map Placeholder - In a real app this would be <MapView /> */}
      <View style={styles.mapPlaceholder}>
        <Text>Map View (Placeholder)</Text>
        {/* Simulating the map background from screenshot */}
        <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Africa_map_blank.svg/1200px-Africa_map_blank.svg.png' }} 
            style={styles.mapImage} 
        />
      </View>

      {/* Floating Header Over Map */}
      <SafeAreaView style={styles.headerOverlay}>
         <View style={styles.headerContent}>
             <View style={styles.avatarPlaceholder}>
                 <FontAwesome name="user" size={20} color="#666" />
             </View>
             <View>
                 <Text style={styles.username}>@user.username</Text>
                 <Text style={styles.address}>1 adresse</Text>
             </View>
             <View style={{flex: 1}} />
             <TouchableOpacity>
                <FontAwesome name="question-circle-o" size={24} color="black" style={{marginRight: 15}} />
             </TouchableOpacity>
             <TouchableOpacity>
                <FontAwesome name="upload" size={24} color="black" />
             </TouchableOpacity>
         </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: { flex: 1, backgroundColor: '#A3CCFF', justifyContent: 'center', alignItems: 'center' },
  mapImage: { width: '100%', height: '100%', position: 'absolute', opacity: 0.5 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerContent: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', margin: 10, borderRadius: 20 },
  avatarPlaceholder: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 12 },
  address: { color: '#666', fontSize: 10 },
});
