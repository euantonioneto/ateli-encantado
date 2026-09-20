import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';


export default function LoginAdmScreen() {
     const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function entrarComoAdmin() {
    if (email === 'adm@gmail.com' && senha === 'Adm') {
      router.replace('/telas-adm/Dashboard');
      return;
    }

    Alert.alert(
      'Dados inválidos',
      'E-mail ou senha de administrador incorretos.'
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login administrativo</Text>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            />

            <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            />
        </View>

        <TouchableOpacity
        style={styles.button}
        onPress={entrarComoAdmin}>
        <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>


        <TouchableOpacity 
        style={styles.adminButton}
            onPress={() => router.push('/loguin/logar-cliente')}>
          <Text style={styles.adminText}>Acessar como cliente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'center',
  },

  logo: {
    width: 150,
    height: 130,
    alignSelf: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 24,
    color: '#090909',
    textAlign: 'center',
    marginBottom: 24,
  },

  form: {
    gap: 8,
    marginBottom: 28,
  },

  label: {
    color: '#090909',
    fontSize: 14,
  },

  input: {
    backgroundColor: '#DDDDDD',
    borderRadius: 22,
    height: 48,
    paddingHorizontal: 18,
  },

  button: {
    backgroundColor: '#DDDDDD',
    borderRadius: 22,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#090909',
    fontSize: 15,
  },

  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },

  line: {
    backgroundColor: '#A7A7A7',
    flex: 1,
    height: 1,
  },

  dividerText: {
    color: '#555555',
    fontSize: 13,
  },

  adminButton: {
    alignItems: 'center',
    marginTop: 28,
  },

  adminText: {
    color: '#090909',
    fontSize: 14,
  },
});