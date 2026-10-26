import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DELIVERY_ESTIMATE } from '../../../data/delivery-config';
import { useStore } from '../../context/StoreContext';

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function CustomerOrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, products } = useStore();
  const order = orders.find((item) => item.id === id);
  if (!order) return <SafeAreaView style={styles.safe}><View style={styles.empty}><Text style={styles.title}>Pedido não encontrado</Text><TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>Voltar aos pedidos</Text></TouchableOpacity></View></SafeAreaView>;

  const history = order.statusHistory?.length ? order.statusHistory : [{ status: order.status, at: order.date }];
  const subtotal = order.subtotal ?? order.items?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? order.price;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹  Voltar aos pedidos</Text></TouchableOpacity>
    <Text style={styles.title}>Pedido #{order.id}</Text><Text style={styles.muted}>Criado em {order.date}</Text>
    <View style={styles.statusCard}><Text style={styles.sectionTitle}>Acompanhamento</Text><Text style={styles.currentStatus}>Status atual: {order.status}</Text>
      {order.status === 'Cancelado' && <View style={styles.cancelled}><Text style={styles.cancelledTitle}>Pedido cancelado</Text><Text style={styles.cancelledText}>{order.cancellationReason || 'O ateliê cancelou este pedido.'}</Text></View>}
      {history.map((event, index) => <View key={`${event.status}-${event.at}-${index}`} style={styles.timelineRow}><View style={styles.dotComplete} /><View style={styles.timelineContent}><Text style={styles.stepComplete}>{event.status}</Text><Text style={styles.timelineDate}>{formatDate(event.at)}</Text></View></View>)}
    </View>
    <Text style={styles.sectionTitle}>Itens</Text>
    <View style={styles.card}>{order.items?.map((item, index) => {
      const product = products.find((entry) => entry.id === item.productId);
      return <View key={`${item.productId}-${index}`} style={styles.item}>
        <View style={styles.itemHeader}><Text style={styles.itemName}>{item.quantity}× {product?.nome ?? 'Produto'}</Text><Text style={styles.itemPrice}>{money(item.unitPrice * item.quantity)}</Text></View>
        <Text style={styles.muted}>Tipo: {item.type} · {money(item.unitPrice)} cada</Text>
        {!!item.customization && <Text style={styles.itemNote}>Personalização: {item.customization}</Text>}
        {!!item.productionTime && <Text style={styles.itemNote}>Prazo de produção informado: {item.productionTime}</Text>}
      </View>;
    }) ?? <Text style={styles.itemName}>{products.find((item) => item.id === order.productId)?.nome ?? 'Produto'} · {order.type}</Text>}
      {!!order.customization && order.customization !== 'Sem observações adicionais.' && <Text style={styles.itemNote}>Observação geral: {order.customization}</Text>}
    </View>
    <Text style={styles.sectionTitle}>Entrega e pagamento</Text>
    <View style={styles.card}><Text style={styles.itemName}>{order.delivery}</Text><Text style={styles.itemNote}>Previsão: {order.deliveryEstimate ?? (order.delivery.startsWith('Retirada') ? 'a combinar no ateliê' : DELIVERY_ESTIMATE)}</Text><Text style={styles.itemNote}>Pagamento: {order.paymentMethod ?? 'Não informado'} · {order.paymentStatus}</Text><View style={styles.divider} /><PriceRow label="Produtos" value={money(subtotal)} /><PriceRow label="Frete" value={order.deliveryFee == null ? 'A confirmar' : order.deliveryFee === 0 ? 'Grátis' : money(order.deliveryFee)} /><PriceRow label="Total" value={money(order.price)} strong /></View>
    <TouchableOpacity style={styles.chatButton} onPress={() => router.push({ pathname: '/telas-cliente/conversar-vendedor', params: { orderId: order.id } })}><Text style={styles.chatText}>Falar com o ateliê sobre este pedido</Text></TouchableOpacity>
  </ScrollView></SafeAreaView>;
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <View style={styles.priceRow}><Text style={[styles.priceLabel, strong && styles.strong]}>{label}</Text><Text style={[styles.priceValue, strong && styles.strong]}>{value}</Text></View>; }

const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, content: { padding: 20, paddingBottom: 35 }, back: { color: '#514C65', marginBottom: 15, paddingVertical: 5 }, title: { color: '#17151D', fontSize: 24, fontWeight: '600' }, muted: { color: '#77727C', fontSize: 11, lineHeight: 17, marginTop: 4 }, statusCard: { backgroundColor: '#F8F7FA', borderRadius: 18, marginTop: 18, padding: 16 }, sectionTitle: { color: '#17151D', fontSize: 15, fontWeight: '600', marginBottom: 10, marginTop: 20 }, currentStatus: { color: '#5146C8', fontSize: 12, fontWeight: '600', marginBottom: 12 }, timelineRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10, minHeight: 48 }, dotComplete: { backgroundColor: '#625BD3', borderRadius: 7, height: 14, marginTop: 3, width: 14 }, timelineContent: { borderLeftColor: '#E2E0E8', borderLeftWidth: 1, flex: 1, minHeight: 40, paddingBottom: 10, paddingLeft: 12 }, stepComplete: { color: '#343147', fontSize: 12, fontWeight: '600' }, timelineDate: { color: '#8A8592', fontSize: 10, marginTop: 4 }, cancelled: { backgroundColor: '#FFF0F0', borderRadius: 12, marginBottom: 10, padding: 12 }, cancelledTitle: { color: '#A43E3E', fontSize: 13, fontWeight: '600' }, cancelledText: { color: '#754A4A', fontSize: 11, lineHeight: 16, marginTop: 5 }, card: { borderColor: '#E7E5EB', borderRadius: 16, borderWidth: 1, padding: 14 }, item: { borderBottomColor: '#EEE', borderBottomWidth: 1, marginBottom: 9, paddingBottom: 10 }, itemHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, itemName: { color: '#272431', flex: 1, fontSize: 12, fontWeight: '600' }, itemPrice: { color: '#272431', fontSize: 12, fontWeight: '600' }, itemNote: { color: '#77727C', fontSize: 10, lineHeight: 15, marginTop: 5 }, divider: { borderTopColor: '#E7E5EB', borderTopWidth: 1, marginVertical: 10 }, priceRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }, priceLabel: { color: '#77727C', fontSize: 11 }, priceValue: { color: '#514C65', fontSize: 11 }, strong: { color: '#17151D', fontSize: 13, fontWeight: '700' }, chatButton: { alignItems: 'center', backgroundColor: '#19182D', borderRadius: 21, marginTop: 18, padding: 14 }, chatText: { color: '#FFF', fontSize: 12, fontWeight: '600' }, empty: { alignItems: 'center', flex: 1, justifyContent: 'center' }, link: { color: '#625BD3', marginTop: 12 } });
