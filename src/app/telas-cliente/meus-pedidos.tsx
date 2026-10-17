import { Href, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function MeusPedidosScreen() {
  const { orders, customerProfile, products } = useStore();
  const customerOrders = orders.filter((order) =>
    (Boolean(customerProfile?.email) && order.customerEmail?.toLowerCase() === customerProfile?.email.toLowerCase())
    || order.customer === (customerProfile?.nome ?? 'Cliente'));

  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹  Voltar ao perfil</Text></TouchableOpacity>
      <Text style={styles.title}>Meus pedidos</Text>
      {!customerOrders.length ? <View style={styles.empty}><Text style={styles.emptyTitle}>Você ainda não tem pedidos</Text><Text style={styles.emptyDescription}>Quando finalizar uma compra, o acompanhamento aparecerá aqui.</Text><TouchableOpacity onPress={() => router.replace('/telas-cliente/home')} style={styles.primary}><Text style={styles.primaryText}>Explorar catálogo</Text></TouchableOpacity></View> : customerOrders.map((order) => {
        const itemSummary = order.items?.length
          ? order.items.map((item) => `${item.quantity}× ${products.find((product) => product.id === item.productId)?.nome ?? 'Produto'}`).join('\n')
          : products.find((product) => product.id === order.productId)?.nome ?? 'Produto';
        return <TouchableOpacity key={order.id} onPress={() => router.push({ pathname: '/telas-cliente/pedido/[id]', params: { id: order.id } } as unknown as Href)} style={styles.card}>
          <View style={styles.cardHeader}><Text style={styles.orderId}>Pedido #{order.id}</Text><Text style={styles.date}>{order.date}</Text></View>
          <Text style={styles.items}>{itemSummary}</Text>
          <View style={styles.statusBox}><Text style={styles.statusLabel}>Status</Text><Text style={styles.status}>{order.status}</Text></View>
          <View style={styles.footer}><Text style={styles.total}>{money(order.price)}</Text><Text style={styles.payment}>Pagamento: {order.paymentStatus}</Text></View>
          {order.status === 'Cancelado' && order.cancellationReason ? <Text style={styles.cancelReason}>Motivo: {order.cancellationReason}</Text> : null}
          <Text style={styles.detailsLink}>Ver detalhes ›</Text>
        </TouchableOpacity>;
      })}
      {!!customerOrders.length && <TouchableOpacity style={styles.secondary} onPress={() => router.push('/telas-cliente/conversar-vendedor')}><Text style={styles.secondaryText}>Falar com o ateliê</Text></TouchableOpacity>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, content: { padding: 20, paddingBottom: 35 }, back: { color: '#514C65', marginBottom: 16, paddingVertical: 6 }, title: { color: '#17151D', fontSize: 25, fontWeight: '600', marginBottom: 18 }, card: { borderColor: '#E6E4EB', borderRadius: 18, borderWidth: 1, marginBottom: 13, padding: 15 }, cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, orderId: { color: '#17151D', fontSize: 13, fontWeight: '600' }, date: { color: '#77727C', fontSize: 11 }, items: { color: '#514C65', fontSize: 12, lineHeight: 18, marginTop: 12 }, statusBox: { backgroundColor: '#F0EFFB', borderRadius: 12, marginTop: 13, padding: 11 }, statusLabel: { color: '#77727C', fontSize: 10 }, status: { color: '#5146C8', fontSize: 13, fontWeight: '600', marginTop: 3 }, footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }, total: { color: '#17151D', fontSize: 15, fontWeight: '700' }, payment: { color: '#77727C', fontSize: 10 }, cancelReason: { color: '#9E4040', fontSize: 11, marginTop: 9 }, detailsLink: { color: '#5146C8', fontSize: 11, marginTop: 12, textAlign: 'right' }, empty: { alignItems: 'center', backgroundColor: '#F8F7FA', borderRadius: 18, marginTop: 14, padding: 25 }, emptyTitle: { color: '#17151D', fontSize: 16, fontWeight: '600' }, emptyDescription: { color: '#77727C', fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: 'center' }, primary: { backgroundColor: '#151528', borderRadius: 20, marginTop: 18, paddingHorizontal: 22, paddingVertical: 12 }, primaryText: { color: '#FFF', fontSize: 12 }, secondary: { alignItems: 'center', borderColor: '#DAD8E2', borderRadius: 20, borderWidth: 1, marginTop: 6, padding: 13 }, secondaryText: { color: '#5146C8', fontSize: 12 } });
