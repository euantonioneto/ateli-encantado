import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useStore } from '../context/StoreContext';
import { Button, colors, Screen } from '../../components/admin/AdminUI';

export default function ProductSavedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useStore();
  const product = products.find((item) => item.id === id);
  return <Screen><View style={styles.center}><View style={styles.check}><Text style={styles.checkText}>✓</Text></View><Text style={styles.title}>Produto adicionado</Text><Text style={styles.message}>{product?.publicado ? 'O produto já está disponível no catálogo.' : 'O produto foi salvo como rascunho.'}</Text>
    <Button title="Voltar para produtos" onPress={() => router.replace('/telas-adm/Produtos')} /><View style={{ height: 10 }} /><Button title="Adicionar outro produto" secondary onPress={() => router.replace('/telas-adm/ProdutoFormulario')} /></View></Screen>;
}
const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', paddingTop: 80 }, check: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.pale, borderRadius: 35, height: 68, justifyContent: 'center', marginBottom: 20, width: 68 }, checkText: { color: colors.purple, fontSize: 30 }, title: { color: colors.ink, fontFamily: 'serif', fontSize: 23, textAlign: 'center' }, message: { color: colors.muted, fontSize: 12, lineHeight: 19, marginBottom: 26, marginTop: 9, textAlign: 'center' } });
