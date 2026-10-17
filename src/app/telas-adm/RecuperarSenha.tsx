import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field, Header } from '../../components/admin/AdminUI';

export default function RecoverPasswordScreen() {
  const [email, setEmail] = useState('');
  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets>
        <Header title="Recuperar senha" subtitle="Informe o e-mail usado para acessar sua conta." back />
        <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="Digite seu e-mail" keyboardType="email-address" />
        <Button title="Enviar link" disabled={!email.includes('@')} onPress={() => router.push({ pathname: '/telas-adm/EmailEnviado', params: { email } })} />
        <Text style={styles.back} onPress={() => router.back()}>Voltar para o login</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, keyboard: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', padding: 22 }, back: { color: '#625CDE', fontSize: 11, marginTop: 14, textAlign: 'center' } });
