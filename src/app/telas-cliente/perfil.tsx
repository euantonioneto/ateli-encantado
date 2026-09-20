import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, router } from 'expo-router';
import { useStore } from '../context/StoreContext';



export default function ProfileScreen() {
  const { customerProfile } = useStore();

  if (customerProfile) {
    const primeiroNome = customerProfile.nome.split(' ')[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loggedContainer}>
        <Image
          source={require('@/assets/images/logo/logo.png')}
          style={styles.loggedLogo}
          resizeMode="contain"
        />

        <Text style={styles.profileTitle}>perfil</Text>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {primeiroNome.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={styles.userName}>{customerProfile.nome}</Text>
            <Text style={styles.userEmail}>{customerProfile.email}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <MenuItem texto="dados da conta" />
          <MenuItem texto="endereço de entrega" />
          <MenuItem texto="meus pedidos" />
          <MenuItem texto="conversar com o vendedor" />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  }
  function MenuItem({ texto }: { texto: string }) {
  let rota: Href = '/telas-cliente/dados-conta';

  if (texto.includes('entrega')) rota = '/telas-cliente/endereco-entrega';
  if (texto.includes('pedidos')) rota = '/telas-cliente/meus-pedidos';
  if (texto.includes('vendedor')) rota = '/telas-cliente/conversar-vendedor';

  return (
    <TouchableOpacity style={styles.menuItem} onPress={() => router.push(rota)}>
      <Text style={styles.menuText}>{texto}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
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

loggedContainer: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 24,
},

loggedLogo: {
  width: 105,
  height: 82,
  alignSelf: 'center',
  marginTop: 8,
},

userCard: {
  alignItems: 'center',
  backgroundColor: '#F8F8F8',
  borderColor: '#EEEEEE',
  borderRadius: 26,
  borderWidth: 1,
  flexDirection: 'row',
  gap: 14,
  minHeight: 86,
  paddingHorizontal: 16,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
},

avatar: {
  alignItems: 'center',
  backgroundColor: '#D9D9D9',
  borderColor: '#FFFFFF',
  borderRadius: 29,
  borderWidth: 3,
  height: 58,
  justifyContent: 'center',
  width: 58,
},

avatarText: {
  color: '#090909',
  fontSize: 22,
  fontWeight: '600',
},

userName: {
  color: '#090909',
  fontSize: 15,
  fontWeight: '600',
},

userEmail: {
  color: '#777777',
  fontSize: 11,
  marginTop: 3,
},

menu: {
  gap: 9,
  marginTop: 26,
},

menuItem: {
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderColor: '#E9E9E9',
  borderRadius: 22,
  borderWidth: 1,
  flexDirection: 'row',
  height: 40,
  justifyContent: 'space-between',
  paddingHorizontal: 16,
},

menuText: {
  color: '#222222',
  fontSize: 12,
},

arrow: {
  color: '#8D8D8D',
  fontSize: 22,
  lineHeight: 22,
},

logoutButton: {
  alignItems: 'center',
  borderColor: '#E9E9E9',
  borderRadius: 22,
  borderWidth: 1,
  height: 42,
  justifyContent: 'center',
  marginTop: 'auto',
  marginBottom: 20,
},

logoutText: {
  color: '#E84A4A',
  fontSize: 12,
},
});
