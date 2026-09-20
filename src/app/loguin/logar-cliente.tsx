import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function LoginClienteScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Logar</Text>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
        style={styles.button}
        onPress={() => router.replace('/telas-cliente')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/loguin/cadastro')}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.adminButton}
            onPress={() => router.push('/loguin/logar-adm')}>
          <Text style={styles.adminText}>Acessar como adm</Text>
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
