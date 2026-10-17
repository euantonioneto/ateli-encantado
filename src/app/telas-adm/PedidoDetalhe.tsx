import { router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../context/StoreContext';
import { Button, colors, Header, Panel, Screen, SectionTitle, formatMoney } from '../../components/admin/AdminUI';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, products, conversations, confirmOrderPayment } = useStore();
  const order = orders.find((item) => item.id === id);
  const product = products.find((item) => item.id === order?.productId);
  const conversation = conversations.find((item) => item.customerEmail?.toLowerCase() === order?.customerEmail?.toLowerCase());
  if (!order) return <Screen><Header title="Pedido não encontrado" back /><Text style={styles.muted}>Esse pedido pode ter sido removido.</Text></Screen>;
  return <Screen>
    <Header title={`Pedido #${order.id}`} subtitle={`${product?.nome ?? 'Produto'} · ${order.customer}`} back />
    <Panel><Image source={product?.imagem ?? require('@/assets/images/logo/logo2.png')} style={styles.productImage} resizeMode="contain" />
      {order.items?.length ? order.items.map((item, index) => { const itemProduct = products.find((entry) => entry.id === item.productId); return <View key={`${item.productId}-${index}`} style={styles.itemRow}><Text style={styles.productName}>{item.quantity}× {itemProduct?.nome ?? 'Produto'}</Text><Text style={styles.muted}>{item.type} · {formatMoney(item.unitPrice)} cada</Text>{item.customization ? <Text style={styles.muted}>Personalização: {item.customization}</Text> : null}{item.productionTime ? <Text style={styles.muted}>Prazo de produção: {item.productionTime}</Text> : null}</View>; }) : <><Text style={styles.productName}>{product?.nome ?? 'Produto'}</Text><Text style={styles.muted}>Tipo {order.type}</Text></>}
      <Text style={styles.total}>Total: {formatMoney(order.price)}</Text></Panel>
    <SectionTitle>Cliente</SectionTitle><Panel><Text style={styles.bold}>{order.customer}</Text><Text style={styles.muted}>{order.customerEmail ?? 'E-mail não informado'} · {order.customerPhone ?? 'Telefone não informado'}</Text></Panel>
    {conversation && <Button title="Abrir conversa deste cliente" secondary onPress={() => router.push({ pathname: '/telas-adm/Conversa', params: { id: conversation.id } })} />}
    <SectionTitle>Entrega / Retirada</SectionTitle><Panel><Text style={styles.bold}>{order.delivery}</Text><Text style={styles.muted}>{order.deliveryEstimate ?? 'Prazo a combinar'}</Text><Text style={styles.muted}>{order.date}</Text><Text style={styles.muted}>Subtotal: {formatMoney(order.subtotal ?? order.price)}</Text><Text style={styles.muted}>Frete: {order.deliveryFee == null ? 'A confirmar' : order.deliveryFee === 0 ? 'Grátis' : formatMoney(order.deliveryFee)}</Text></Panel>
    <SectionTitle>Personalização</SectionTitle><Panel><Text style={styles.muted}>{order.customization}</Text></Panel>
    <SectionTitle>Pagamento</SectionTitle><Panel><Text style={styles.bold}>Pagamento {order.paymentStatus.toLowerCase()}</Text><Text style={styles.muted}>{order.paymentMethod ?? 'Forma não informada'} · {formatMoney(order.price)}</Text></Panel>
    {order.paymentStatus === 'Pendente' && <Button title="Confirmar pagamento" onPress={() => confirmOrderPayment(order.id)} />}
    {!['Entregue', 'Cancelado'].includes(order.status) && <><View style={{ height: 10 }} /><Button title="Avancar pedido" onPress={() => router.push({ pathname: '/telas-adm/AtualizarStatus', params: { id: order.id } })} />
    <View style={{ height: 9 }} /><Button title="Cancelar pedido" secondary onPress={() => router.push({ pathname: '/telas-adm/CancelarPedido', params: { id: order.id } })} /></>}
    {order.status === 'Cancelado' && <Panel><Text style={styles.muted}>Motivo do cancelamento: {order.cancellationReason || 'Nao informado'}</Text></Panel>}
  </Screen>;
}

const styles = StyleSheet.create({ productImage: { alignSelf: 'center', height: 155, width: 190 }, itemRow: { borderTopColor: colors.line, borderTopWidth: 1, marginTop: 9, paddingTop: 8 }, productName: { color: colors.ink, fontSize: 13, fontWeight: '600' }, muted: { color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 5 }, total: { color: colors.ink, fontSize: 14, fontWeight: '700', marginTop: 12 }, bold: { color: colors.ink, fontSize: 12, fontWeight: '600', lineHeight: 18 } });
