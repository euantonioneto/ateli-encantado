import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../context/StoreContext';
import { Chip, colors, Header, Screen } from '../../components/admin/AdminUI';
import { useState } from 'react';

export default function ProductsScreen() {
  const { products } = useStore();
  const [filter, setFilter] = useState('Todos');
  const visible = products.filter((product) => filter === 'Todos' || (filter === 'Ativos' ? product.publicado : !product.publicado));
  return <Screen><Header title="Produtos" subtitle="Gerencie seus produtos e o catálogo." />
    <View style={styles.filters}>{['Todos', 'Ativos', 'Inativos'].map((item) => <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />)}</View>
    {visible.map((product) => <TouchableOpacity key={product.id} onPress={() => router.push({ pathname: '/telas-adm/ProdutoFormulario', params: { id: product.id } })} style={styles.card}>
      <Image source={product.imagem} style={styles.image} resizeMode="contain" />
      <View style={{ flex: 1 }}><Text style={styles.name}>{product.nome}</Text><Text style={styles.meta}>R$ {product.preco.toFixed(2).replace('.', ',')}</Text><Text style={styles.meta}>{product.publicado ? 'Disponível no catálogo' : 'Rascunho'}</Text></View>
      <Text style={[styles.status, !product.publicado && { color: colors.muted }]}>{product.publicado ? 'Ativo' : 'Inativo'}  ›</Text>
    </TouchableOpacity>)}
    {!visible.length && <Text style={styles.empty}>Nenhum produto cadastrado.</Text>}
    <TouchableOpacity onPress={() => router.push('/telas-adm/ProdutoFormulario')} style={styles.add}><Text style={styles.addText}>+  Adicionar produto</Text></TouchableOpacity>
  </Screen>;
}
const styles = StyleSheet.create({ filters: { flexDirection: 'row', gap: 8, marginBottom: 14 }, card: { alignItems: 'center', borderColor: colors.line, borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 10, marginBottom: 9, padding: 10 }, image: { backgroundColor: '#F5F4F8', borderRadius: 12, height: 57, width: 57 }, name: { color: colors.ink, fontSize: 12, fontWeight: '600' }, meta: { color: colors.muted, fontSize: 10, marginTop: 4 }, status: { color: colors.purple, fontSize: 9 }, empty: { color: colors.muted, padding: 20, textAlign: 'center' }, add: { alignItems: 'center', backgroundColor: colors.ink, borderRadius: 18, padding: 15 }, addText: { color: '#FFF', fontSize: 12, fontWeight: '600' } });
