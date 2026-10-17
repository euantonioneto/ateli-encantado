import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../../data/admin';
import { Chip, colors, Header, Screen } from '../../components/admin/AdminUI';

const filters: Array<'Todos' | OrderStatus> = ['Todos', 'Pendente', 'Em produ\u00e7\u00e3o', 'Pronto', 'Entregue', 'Cancelado'];

export default function OrdersScreen() {
  const { orders, products } = useStore();
  const [filter, setFilter] = useState<string>('Todos');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => orders.filter((order) => {
    if (filter !== 'Todos' && order.status !== filter) return false;
    const productNames = [products.find((product) => product.id === order.productId)?.nome ?? '', ...(order.items ?? []).map((item) => products.find((product) => product.id === item.productId)?.nome ?? '')].join(' ');
    const searchable = `${order.id} ${order.customer} ${order.customerEmail ?? ''} ${productNames} ${order.status} ${order.paymentStatus}`.toLocaleLowerCase();
    return searchable.includes(query.trim().toLocaleLowerCase());
  }), [filter, orders, products, query]);
  return <Screen>
    <Header title="Pedidos" subtitle="Busque e acompanhe cada etapa do atendimento." />
    <TextInput value={query} onChangeText={setQuery} placeholder="Buscar cliente, pedido ou produto" placeholderTextColor={colors.muted} style={styles.search} />
    <View style={styles.filters}>{filters.map((item) => <Chip key={item} label={item === 'Pendente' ? 'Novos' : item} active={filter === item} onPress={() => setFilter(item)} />)}</View>
    {visible.map((order) => {
      const product = products.find((item) => item.id === order.productId);
      const itemSummary = order.items?.length ? order.items.map((item) => `${item.quantity}x ${products.find((entry) => entry.id === item.productId)?.nome ?? 'Produto'}`).join(', ') : product?.nome ?? 'Produto';
      return <TouchableOpacity key={order.id} onPress={() => router.push({ pathname: '/telas-adm/PedidoDetalhe', params: { id: order.id } })} style={styles.row}>
        <Image source={product?.imagem ?? require('@/assets/images/logo/logo2.png')} style={styles.image} resizeMode="contain" />
        <View style={{ flex: 1 }}><Text style={styles.name}>#{order.id} · {order.customer}</Text><Text numberOfLines={1} style={styles.meta}>{itemSummary}</Text><Text style={styles.meta}>{order.date} · {order.paymentStatus === 'Pendente' ? 'Pagamento pendente' : 'Pago'}</Text></View>
        <View style={{ alignItems: 'flex-end' }}><Text style={[styles.status, order.status === 'Cancelado' && { color: colors.red }]}>{order.status}</Text><Text style={styles.arrow}>R$ {order.price.toFixed(2).replace('.', ',')}</Text></View>
      </TouchableOpacity>;
    })}
    {!visible.length && <Text style={styles.empty}>{orders.length ? 'Nenhum pedido encontrado com esses filtros.' : 'Ainda nao ha pedidos.'}</Text>}
  </Screen>;
}

const styles = StyleSheet.create({
  search: { backgroundColor: '#FFF', borderColor: colors.line, borderRadius: 13, borderWidth: 1, color: colors.ink, fontSize: 12, marginBottom: 12, minHeight: 43, paddingHorizontal: 13 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 15 }, row: { alignItems: 'center', borderColor: colors.line, borderRadius: 17, borderWidth: 1, flexDirection: 'row', gap: 9, marginBottom: 10, minHeight: 82, padding: 10 },
  image: { backgroundColor: '#F5F4F8', borderRadius: 12, height: 55, width: 55 }, name: { color: colors.ink, fontSize: 11, fontWeight: '600' }, meta: { color: colors.muted, fontSize: 9, marginTop: 4 }, status: { color: colors.purple, fontSize: 9, textAlign: 'right' }, arrow: { color: colors.ink, fontSize: 10, fontWeight: '600', marginTop: 8 }, empty: { color: colors.muted, paddingVertical: 25, textAlign: 'center' },
});
