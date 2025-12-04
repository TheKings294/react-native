import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '@/lib/api';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !username || !password) {
      setError('E-mail, nom d’utilisateur et mot de passe sont requis.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        email: email.trim(),
        username: username.trim(),
        password,
        displayName: displayName || undefined,
        isProfilePublic: true,
      });
      setSuccess('Inscription réussie ! Vous pouvez vous connecter.');
      setTimeout(() => router.replace('/(auth)/login'), 700);
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
      <Text style={styles.title}>Bienvenue sur SpotChat !</Text>
      <Text style={styles.subtitle}>Inscrivez-vous pour pouvoir créer votre carte et accédez aux contenus disponibles</Text>
      
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
        placeholder="Nom d’utilisateur"
        placeholderTextColor="#000"
        style={styles.input}
        value={username}
        autoCapitalize="none"
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#000"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Nom à afficher (optionnel)"
        placeholderTextColor="#000"
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSignup} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
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
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 16, resizeMode: 'cover', borderRadius: 40, overflow: 'hidden', marginTop: -20,},
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#ddd', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontWeight: 'bold' },
  or: { textAlign: 'center', marginVertical: 10, color: '#999' },
  socialButton: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff' },
  socialButtonText: { flex: 1, fontWeight: '500', color: '#000', textAlign: 'center' },
  socialContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingLeft: 55 },
  socialIconWrap: { width: 28, alignItems: 'center' },
  socialIcon: { width: 20, height: 20, resizeMode: 'contain' },
  link: { textAlign: 'center', marginTop: 20, color: 'blue' },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  success: { color: 'green', textAlign: 'center', marginBottom: 10 },
});
