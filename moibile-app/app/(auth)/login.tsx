import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bon retour !</Text>
      <Text style={styles.subtitle}>Choisissez la méthode que vous avez utilisé lors de la création de votre compte</Text>
      
      <TextInput placeholder="E-mail" style={styles.input} />
      
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/library')}>
        <Text style={styles.buttonText}>Se connecter par e-mail</Text>
      </TouchableOpacity>
      
      <Text style={styles.or}>OU</Text>
      
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877F2' }]}>
        <Text style={styles.socialButtonText}>S'inscrire avec Facebook</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>S'inscrire avec Apple</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>S'inscrire avec Google</Text>
      </TouchableOpacity>

       <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
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
  socialButtonText: { fontWeight: '500' },
  link: { textAlign: 'center', marginTop: 20, color: 'blue' },
});
