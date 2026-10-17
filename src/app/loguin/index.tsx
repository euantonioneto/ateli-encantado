import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginChoiceScreen() {
  return <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo/logo2.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Acesse sua conta</Text>
      <Text style={styles.subtitle}>Escolha como deseja entrar no Ateliê Encantado.</Text>
      <TouchableOpacity style={styles.primary} onPress={() => router.replace('/loguin/logar-cliente')}>
        <Text style={styles.primaryText}>Entrar como cliente</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={() => router.replace('/loguin/logar-adm')}>
        <Text style={styles.secondaryText}>Entrar como administrador</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#FFF', flex: 1 }, container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: { alignSelf: 'center', height: 140, marginBottom: 22, width: 170 }, title: { color: '#17151D', fontSize: 25, textAlign: 'center' },
  subtitle: { color: '#77727C', fontSize: 14, lineHeight: 21, marginBottom: 30, marginTop: 9, textAlign: 'center' },
  primary: { alignItems: 'center', backgroundColor: '#19182D', borderRadius: 24, height: 50, justifyContent: 'center' }, primaryText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  secondary: { alignItems: 'center', borderColor: '#DAD9E3', borderRadius: 24, borderWidth: 1, height: 50, justifyContent: 'center', marginTop: 12 }, secondaryText: { color: '#19182D', fontSize: 14, fontWeight: '600' },
});
