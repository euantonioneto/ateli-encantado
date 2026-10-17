import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CustomerProfile, useStore } from '../context/StoreContext';

export default function AccountDetailsScreen() {
  const { customerProfile, updateCustomerProfile } = useStore();
  const [name, setName] = useState(customerProfile?.nome ?? '');
  const [email, setEmail] = useState(customerProfile?.email ?? '');
  const [phone, setPhone] = useState(customerProfile?.telefone ?? '');
  const [error, setError] = useState('');
  function save() {
    if (!name.trim() || !email.includes('@')) { setError('Informe seu nome e um e-mail válido.'); return; }
    const profile: CustomerProfile = { nome: name.trim(), email: email.trim(), telefone: phone.trim(), endereco: customerProfile?.endereco ?? '', cep: customerProfile?.cep ?? '', numero: customerProfile?.numero ?? '', bairro: customerProfile?.bairro ?? '', cidade: customerProfile?.cidade ?? '' };
    updateCustomerProfile(profile);
    router.back();
  }
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹  Voltar</Text></TouchableOpacity><Text style={styles.title}>Dados da conta</Text><Text style={styles.subtitle}>Atualize as informações do seu perfil.</Text>
    <Field label="Nome completo" value={name} onChangeText={setName} /><Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" /><Field label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
    {!!error && <Text style={styles.error}>{error}</Text>}<TouchableOpacity onPress={save} style={styles.primary}><Text style={styles.primaryText}>Salvar alterações</Text></TouchableOpacity>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
function Field({ label, value, onChangeText, keyboardType = 'default' }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'email-address' | 'phone-pad' }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'} style={styles.input} /></View>; }
const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, content: { padding: 22, paddingBottom: 36 }, back: { color: '#514C65', marginBottom: 14, paddingVertical: 6 }, title: { color: '#17151D', fontSize: 25, fontWeight: '600' }, subtitle: { color: '#77727C', fontSize: 13, marginTop: 6 }, field: { gap: 6, marginTop: 18 }, label: { color: '#5F5A68', fontSize: 12 }, input: { backgroundColor: '#F6F5F8', borderColor: '#E6E4EB', borderRadius: 14, borderWidth: 1, color: '#17151D', height: 48, paddingHorizontal: 13 }, error: { color: '#B14747', fontSize: 12, marginTop: 12 }, primary: { alignItems: 'center', backgroundColor: '#151528', borderRadius: 22, marginTop: 24, padding: 15 }, primaryText: { color: '#FFF', fontSize: 13, fontWeight: '600' } });
