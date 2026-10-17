import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../context/StoreContext';
import { colors, Header, Screen } from '../../components/admin/AdminUI';

export default function MessagesScreen() {
  const { conversations, orders } = useStore();
  const sorted = [...conversations].sort((a, b) => Number(Boolean(b.unreadByAdmin)) - Number(Boolean(a.unreadByAdmin)));
  const unreadCount = conversations.filter((conversation) => conversation.unreadByAdmin).length;
  return <Screen><Header title="Mensagens" subtitle={`${unreadCount} sem resposta · conversas ligadas ao atendimento`} />
    {sorted.map((conversation) => {
      const relatedOrder = orders.find((order) => order.id === conversation.relatedOrderId);
      return <TouchableOpacity key={conversation.id} onPress={() => router.push({ pathname: '/telas-adm/Conversa', params: { id: conversation.id } })} style={styles.row}>
        <View style={styles.avatar}><Text style={styles.initials}>{conversation.initials}</Text></View>
        <View style={{ flex: 1 }}><View style={styles.nameRow}><Text style={styles.name}>{conversation.customer}</Text>{conversation.unreadByAdmin && <Text style={styles.unread}>Nova</Text>}</View><Text numberOfLines={1} style={styles.preview}>{conversation.preview}</Text><Text style={styles.order}>{relatedOrder ? `Pedido #${relatedOrder.id} · ${relatedOrder.status}` : 'Sem pedido vinculado'}</Text></View><Text style={styles.time}>{conversation.time}</Text>
      </TouchableOpacity>;
    })}
    {!conversations.length && <Text style={styles.empty}>As mensagens enviadas pelos clientes aparecerao aqui.</Text>}
  </Screen>;
}

const styles = StyleSheet.create({ row: { alignItems: 'center', borderColor: colors.line, borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 10, marginBottom: 9, padding: 12 }, avatar: { alignItems: 'center', backgroundColor: '#F0EFF5', borderRadius: 23, height: 44, justifyContent: 'center', width: 44 }, initials: { color: colors.ink, fontSize: 11, fontWeight: '600' }, nameRow: { alignItems: 'center', flexDirection: 'row', gap: 7 }, name: { color: colors.ink, fontSize: 12, fontWeight: '600' }, unread: { backgroundColor: colors.pale, borderRadius: 10, color: colors.purple, fontSize: 9, overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 3 }, preview: { color: colors.muted, fontSize: 10, marginTop: 5 }, order: { color: colors.purple, fontSize: 9, marginTop: 5 }, time: { color: colors.muted, fontSize: 9 }, empty: { color: colors.muted, fontSize: 12, lineHeight: 18, paddingVertical: 24, textAlign: 'center' } });
