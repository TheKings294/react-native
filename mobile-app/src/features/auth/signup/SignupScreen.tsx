import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur SpotChat !</Text>
      <Text style={styles.subtitle}>Inscrivez-vous pour pouvoir créer votre carte et accédez aux contenus disponibles</Text>
      
      <TextInput placeholder="E-mail" style={styles.input} />
      
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/library')}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      
      <Text style={styles.or}>OU</Text>
      
      <TouchableOpacity style={styles.socialButton}>
        <View style={styles.socialContent}>
          <View style={styles.socialIconWrap}>
            <Image source={require('../../../../assets/images/icons/apple-icon.png')} style={styles.socialIcon} />
          </View>
          <Text style={styles.socialButtonText}>S'inscrire avec Apple</Text>
          <View style={styles.socialIconWrap} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialButton}>
        <View style={styles.socialContent}>
          <View style={styles.socialIconWrap}>
            <Image source={require('../../../../assets/images/icons/google-icon.png')} style={styles.socialIcon} />
          </View>
          <Text style={styles.socialButtonText}>S'inscrire avec Google</Text>
          <View style={styles.socialIconWrap} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#ddd', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { fontWeight: 'bold' },
  or: { textAlign: 'center', marginVertical: 10, color: '#999' },
  socialButton: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff' },
  socialButtonText: { flex: 1, fontWeight: '500', color: '#000', textAlign: 'center' },
  socialContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingLeft: 55 },
  socialIconWrap: { width: 28, alignItems: 'center' },
  socialIcon: { width: 20, height: 20, resizeMode: 'contain' },
  link: { textAlign: 'center', marginTop: 20, color: 'blue' },
});
