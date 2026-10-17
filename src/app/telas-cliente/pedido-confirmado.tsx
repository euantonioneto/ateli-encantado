import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SafeAreaView style={styles.safe}><View style={styles.content}>
    <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
    <Text style={styles.title}>Pedido confirmado</Text>
    <Text style={styles.description}>Seu pedido #{id} foi registrado e já pode ser acompanhado em Meus pedidos.</Text>
    <TouchableOpacity style={styles.primary} onPress={() => router.replace('/telas-cliente/meus-pedidos')}><Text style={styles.primaryText}>Acompanhar pedido</Text></TouchableOpacity>
    <TouchableOpacity style={styles.secondary} onPress={() => router.replace('/telas-cliente/home')}><Text style={styles.secondaryText}>Voltar ao catálogo</Text></TouchableOpacity>
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, content: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 26 }, check: { alignItems: 'center', backgroundColor: '#E9E8FA', borderRadius: 38, height: 76, justifyContent: 'center', width: 76 }, checkText: { color: '#5146C8', fontSize: 34 }, title: { color: '#17151D', fontSize: 25, fontWeight: '600', marginTop: 22 }, description: { color: '#77727C', fontSize: 14, lineHeight: 21, marginTop: 10, textAlign: 'center' }, primary: { alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#151528', borderRadius: 22, marginTop: 26, padding: 15 }, primaryText: { color: '#FFF', fontSize: 13, fontWeight: '600' }, secondary: { alignItems: 'center', alignSelf: 'stretch', borderColor: '#E4E2EA', borderRadius: 22, borderWidth: 1, marginTop: 10, padding: 14 }, secondaryText: { color: '#514C65', fontSize: 13 } });
