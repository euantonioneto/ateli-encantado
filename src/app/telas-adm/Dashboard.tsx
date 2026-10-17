import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../context/StoreContext';
import { AdminOrder } from '../../data/admin';
import { Button, colors, Header, Panel, Screen, SectionTitle } from '../../components/admin/AdminUI';

function OrderPreview({ order, action }: { order: AdminOrder; action: string }) {
  return <TouchableOpacity onPress={() => router.push({ pathname: '/telas-adm/PedidoDetalhe', params: { id: order.id } })} style={styles.row}>
    <View style={styles.thumb}><Text style={styles.thumbText}>!</Text></View>
    <View style={{ flex: 1 }}><Text style={styles.name}>{action}</Text><Text style={styles.meta}>#{order.id} \u00b7 {order.customer} \u00b7 R$ {order.price.toFixed(2).replace('.', ',')}</Text></View>
    <Text style={styles.open}>Abrir \u203a</Text>
  </TouchableOpacity>;
}

export default function Dashboard() {
  const { orders, conversations, products } = useStore();
  const pending = orders.filter((order) => order.status === 'Pendente').length;
  const production = orders.filter((order) => order.status === 'Em produ\u00e7\u00e3o').length;
  const unpaid = orders.filter((order) => order.paymentStatus === 'Pendente' && order.status !== 'Cancelado');
  const ready = orders.filter((order) => order.status === 'Pronto');
  const unread = conversations.filter((conversation) => conversation.unreadByAdmin);
  const actionOrders = orders.filter((order) => order.status === 'Pendente' || order.status === 'Pronto' || order.paymentStatus === 'Pendente').slice(0, 5);

  function orderAction(order: AdminOrder) {
    if (order.status === 'Pronto') return 'Pronto para combinar entrega';
    if (order.status === 'Pendente' && order.paymentStatus === 'Pendente') return 'Novo pedido · aguardando pagamento';
    if (order.status === 'Pendente') return 'Novo pedido para revisar';
    return 'Pagamento pendente';
  }

  return <Screen>
    <Header title="In\u00edcio" right={<TouchableOpacity onPress={() => router.push('/telas-adm/Conta')}><Text style={styles.link}>Conta</Text></TouchableOpacity>} />
    <View style={styles.stats}>
      <Panel style={styles.stat}><Text style={styles.statLabel}>Pedidos novos</Text><Text style={styles.statNumber}>{String(pending).padStart(2, '0')}</Text></Panel>
      <Panel style={styles.stat}><Text style={styles.statLabel}>Em produ\u00e7\u00e3o</Text><Text style={styles.statNumber}>{String(production).padStart(2, '0')}</Text></Panel>
      <Panel style={styles.stat}><Text style={styles.statLabel}>Produtos</Text><Text style={styles.statNumber}>{products.length.toString().padStart(2, '0')}</Text></Panel>
      <Panel style={styles.stat}><Text style={styles.statLabel}>Prontos para entrega</Text><Text style={styles.statNumber}>{String(ready.length).padStart(2, '0')}</Text></Panel>
    </View>

    <SectionTitle action={String(actionOrders.length + unread.length)}>Fila de a\u00e7\u00f5es</SectionTitle>
    {unread.slice(0, 3).map((conversation) => <TouchableOpacity key={conversation.id} onPress={() => router.push({ pathname: '/telas-adm/Conversa', params: { id: conversation.id } })} style={styles.row}>
      <View style={styles.thumb}><Text style={styles.thumbText}>M</Text></View>
      <View style={{ flex: 1 }}><Text style={styles.name}>Mensagem sem resposta</Text><Text style={styles.meta}>{conversation.customer} \u00b7 {conversation.preview}</Text></View><Text style={styles.open}>Responder \u203a</Text>
    </TouchableOpacity>)}
    {actionOrders.map((order) => <OrderPreview key={order.id} order={order} action={orderAction(order)} />)}
    {!unread.length && !actionOrders.length && <Panel><Text style={styles.meta}>Tudo em dia. Nenhuma a\u00e7\u00e3o pendente.</Text></Panel>}

    <SectionTitle>Resumo</SectionTitle>
    {unpaid.length > 0 && <TouchableOpacity onPress={() => router.push('/telas-adm/Pedidos')}><Panel><Text style={styles.alert}>{unpaid.length} pagamento(s) aguardando confirma\u00e7\u00e3o</Text></Panel></TouchableOpacity>}
    {ready.length > 0 && <TouchableOpacity onPress={() => router.push('/telas-adm/Pedidos')}><Panel><Text style={styles.alert}>{ready.length} pedido(s) pronto(s) para entrega</Text></Panel></TouchableOpacity>}
    <SectionTitle>Mensagens recentes</SectionTitle>
    {conversations.slice(0, 3).map((conversation) => <TouchableOpacity key={conversation.id} onPress={() => router.push({ pathname: '/telas-adm/Conversa', params: { id: conversation.id } })} style={styles.message}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{conversation.initials}</Text></View><View style={{ flex: 1 }}><Text style={styles.name}>{conversation.customer}{conversation.unreadByAdmin ? ' · Nova' : ''}</Text><Text numberOfLines={1} style={styles.meta}>{conversation.preview}</Text></View><Text style={styles.time}>{conversation.time}</Text>
    </TouchableOpacity>)}
    {!conversations.length && <Panel><Text style={styles.meta}>As mensagens dos clientes aparecer\u00e3o aqui.</Text></Panel>}
    <Button title="Ver todos os pedidos" secondary onPress={() => router.push('/telas-adm/Pedidos')} />
  </Screen>;
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, stat: { marginBottom: 0, minHeight: 82, width: '48%' }, statLabel: { color: colors.muted, fontSize: 10 }, statNumber: { color: colors.ink, fontSize: 25, fontWeight: '700', marginTop: 6 },
  link: { color: colors.purple, fontSize: 11 }, alert: { color: colors.ink, fontSize: 12, fontWeight: '600' }, row: { alignItems: 'center', backgroundColor: '#FFF', borderColor: colors.line, borderRadius: 15, borderWidth: 1, flexDirection: 'row', gap: 9, marginBottom: 8, padding: 10 },
  thumb: { alignItems: 'center', backgroundColor: colors.pale, borderRadius: 12, height: 42, justifyContent: 'center', width: 42 }, thumbText: { color: colors.purple, fontSize: 17, fontWeight: '700' }, name: { color: colors.ink, fontSize: 11, fontWeight: '600' }, meta: { color: colors.muted, fontSize: 10, marginTop: 4 }, open: { color: colors.purple, fontSize: 9 },
  message: { alignItems: 'center', borderColor: colors.line, borderRadius: 15, borderWidth: 1, flexDirection: 'row', gap: 9, marginBottom: 8, padding: 11 }, avatar: { alignItems: 'center', backgroundColor: '#F0EFF5', borderRadius: 20, height: 36, justifyContent: 'center', width: 36 }, avatarText: { color: colors.ink, fontSize: 10 }, time: { color: colors.muted, fontSize: 9 },
});
