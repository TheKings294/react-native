import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuthData } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Merci de renseigner votre e-mail et mot de passe.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login(email.trim(), password);
      if (!response.user?.token) {
        throw new Error('Token manquant dans la réponse du serveur.');
      }
      await setAuthData(response.user.token, response.user);
      router.replace('/(tabs)/library');
    } catch (e) {
      const message = e instanceof Error ? e.message : "Une erreur s'est produite.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../../assets/images/icons/spotchat-icon.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Bon retour !</Text>
      <Text style={styles.subtitle}>Choisissez la méthode que vous avez utilisé lors de la création de votre compte</Text>
      
      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#000"
        style={styles.input}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#000"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleLogin} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Se connecter par e-mail</Text>}
      </TouchableOpacity>
      
      <Text style={styles.or}>OU</Text>
      
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877F2' }]}>
        <View style={styles.socialContent}>
          <View style={styles.socialIconWrap}>
            <Image source={require('../../../../assets/images/icons/facebook-icon.png')} style={styles.socialIcon} />
          </View>
          <Text style={[styles.socialButtonText, styles.socialTextLight]}>S'inscrire avec Facebook</Text>
          <View style={styles.socialIconWrap} />
        </View>
      </TouchableOpacity>
      
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

       <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 16, resizeMode: 'cover', borderRadius: 40, overflow: 'hidden', marginTop: -20,},
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#ddd', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { fontWeight: 'bold' },
  buttonDisabled: { opacity: 0.6 },
  or: { textAlign: 'center', marginVertical: 10, color: '#999' },
  socialButton: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff' },
  socialButtonText: { flex: 1, fontWeight: '500', color: '#000', textAlign: 'center' },
  socialTextLight: { color: '#fff' },
  socialContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingLeft: 55 },
  socialIconWrap: { width: 28, alignItems: 'center' },
  socialIcon: { width: 20, height: 20, resizeMode: 'contain' },
  link: { textAlign: 'center', marginTop: 20, color: 'blue' },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
