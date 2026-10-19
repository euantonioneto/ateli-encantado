import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';


export default function LoginClienteScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function entrarComoCliente() {
    if (!email.trim() || !senha) {
      Alert.alert(
        'Preencha seus dados',
        'Informe seu e-mail e sua senha para continuar.'
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        Alert.alert('Não foi possível entrar', error.message);
        return;
      }

      if (data.user.app_metadata?.role === 'admin' || data.user.app_metadata?.role === 'adm') {
        await supabase.auth.signOut();
        Alert.alert('Conta administrativa', 'Entre pela opção de acesso administrativo.');
        return;
      }

      router.replace('/telas-cliente/home');
    } catch {
      Alert.alert(
        'Falha de conexão',
        'Verifique sua internet e tente novamente.'
      );
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
       <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets>
        <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo/logo2.png')}
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
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
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
        onPress={entrarComoCliente}>
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
        <TouchableOpacity style={styles.adminButton} onPress={() => router.replace('/loguin')}>
          <Text style={styles.adminText}>Escolher outro tipo de acesso</Text>
        </TouchableOpacity>
        </View>
       </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 24 },

  container: {
    paddingHorizontal: 26,
    flexGrow: 1,
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
