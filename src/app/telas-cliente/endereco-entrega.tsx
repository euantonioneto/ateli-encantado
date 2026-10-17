import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CustomerProfile, useStore } from '../context/StoreContext';

export default function DeliveryAddressScreen() {
  const { customerProfile, updateCustomerProfile } = useStore();
  const [street, setStreet] = useState(customerProfile?.endereco ?? '');
  const [number, setNumber] = useState(customerProfile?.numero ?? '');
  const [neighborhood, setNeighborhood] = useState(customerProfile?.bairro ?? '');
  const [city, setCity] = useState(customerProfile?.cidade ?? '');
  const [zip, setZip] = useState(customerProfile?.cep ?? '');
  const [error, setError] = useState('');
  function save() {
    if (!street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !zip.trim()) { setError('Preencha todos os campos do endereço.'); return; }
    const profile: CustomerProfile = { nome: customerProfile?.nome ?? '', email: customerProfile?.email ?? '', telefone: customerProfile?.telefone ?? '', endereco: street.trim(), numero: number.trim(), bairro: neighborhood.trim(), cidade: city.trim(), cep: zip.trim() };
    updateCustomerProfile(profile);
    router.back();
  }
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹  Voltar</Text></TouchableOpacity><Text style={styles.title}>Endereço de entrega</Text><Text style={styles.subtitle}>Use este endereço para agilizar seus próximos pedidos.</Text>
    <Field label="Rua / Avenida" value={street} onChangeText={setStreet} /><View style={styles.row}><View style={{ flex: 1 }}><Field label="Número" value={number} onChangeText={setNumber} keyboardType="numeric" /></View><View style={{ flex: 1 }}><Field label="CEP" value={zip} onChangeText={setZip} keyboardType="numeric" /></View></View><Field label="Bairro" value={neighborhood} onChangeText={setNeighborhood} /><Field label="Cidade" value={city} onChangeText={setCity} />
    {!!error && <Text style={styles.error}>{error}</Text>}<TouchableOpacity onPress={save} style={styles.primary}><Text style={styles.primaryText}>Salvar endereço</Text></TouchableOpacity>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
function Field({ label, value, onChangeText, keyboardType = 'default' }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'numeric' }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} style={styles.input} /></View>; }
const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, content: { padding: 22, paddingBottom: 36 }, back: { color: '#514C65', marginBottom: 14, paddingVertical: 6 }, title: { color: '#17151D', fontSize: 25, fontWeight: '600' }, subtitle: { color: '#77727C', fontSize: 13, lineHeight: 18, marginTop: 6 }, field: { gap: 6, marginTop: 18 }, label: { color: '#5F5A68', fontSize: 12 }, input: { backgroundColor: '#F6F5F8', borderColor: '#E6E4EB', borderRadius: 14, borderWidth: 1, color: '#17151D', height: 48, paddingHorizontal: 13 }, row: { flexDirection: 'row', gap: 10 }, error: { color: '#B14747', fontSize: 12, marginTop: 12 }, primary: { alignItems: 'center', backgroundColor: '#151528', borderRadius: 22, marginTop: 24, padding: 15 }, primaryText: { color: '#FFF', fontSize: 13, fontWeight: '600' } });
