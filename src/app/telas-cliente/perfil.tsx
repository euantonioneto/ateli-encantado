import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../context/StoreContext';



export default function ProfileScreen() {
  const { customerProfile } = useStore();

  if (customerProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.profileTitle}>Meu perfil</Text>
          <View style={styles.profileCard}>
            <ProfileInfo label="Nome" value={customerProfile.nome} />
            <ProfileInfo label="E-mail" value={customerProfile.email} />
            <ProfileInfo label="Telefone" value={customerProfile.telefone} />
            <ProfileInfo label="Endereço" value={`${customerProfile.endereco}, ${customerProfile.numero}`} />
            <ProfileInfo label="Bairro / Cidade" value={`${customerProfile.bairro} - ${customerProfile.cidade}`} />
            <ProfileInfo label="CEP" value={customerProfile.cep} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
  <View style={styles.container}>
    <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} />

    <View style={styles.actions}>
      <TouchableOpacity
    style={styles.button}
    onPress={() => router.push('/loguin/cadastro')}>
    <Text style={styles.buttonText}>Cadastrar</Text>
  </TouchableOpacity>

      <TouchableOpacity
    style={styles.button}
    onPress={() => router.push('/loguin/logar-cliente')}>
    <Text style={styles.buttonText}>Logar</Text>
  </TouchableOpacity>
    </View>

  </View>
</SafeAreaView>
  );
}

function ProfileInfo({ label, value }: { label: string; value: string }) {
  return <View style={styles.profileInfo}>
    <Text style={styles.profileLabel}>{label}</Text>
    <Text style={styles.profileValue}>{value}</Text>
  </View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

container: {
  flex: 1,
  paddingHorizontal: 22,
  justifyContent: 'center',
},

logo: {
  width: 100,
  height: 100,
  position: 'absolute',
  top: 30,
  left:22,
},

actions: {
  gap: 14,
  paddingBottom: 30,
},

profileTitle: {
  color: '#090909',
  fontSize: 25,
  marginBottom: 22,
  marginTop: 140,
  textAlign: 'center',
},

profileCard: {
  backgroundColor: '#DDDDDD',
  borderRadius: 20,
  paddingHorizontal: 20,
  paddingVertical: 8,
},

profileInfo: {
  borderBottomColor: '#A7A7A7',
  borderBottomWidth: StyleSheet.hairlineWidth,
  paddingVertical: 10,
},

profileLabel: {
  color: '#555555',
  fontSize: 12,
},

profileValue: {
  color: '#090909',
  fontSize: 16,
  marginTop: 2,
},

button: {
  backgroundColor: '#DDDDDD',
  borderRadius: 24,
  alignItems: 'center',
  paddingVertical: 10,
},

exitButton: {
  backgroundColor: '#DDDDDD',
  borderRadius: 24,
  alignItems: 'center',
  paddingVertical: 10,
  marginBottom: 20,
},

buttonText: {
  fontSize: 18,
  color: '#090909',
},
});
