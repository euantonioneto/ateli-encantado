import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../../data/admin';
import { Button, colors, Header, Screen } from '../../components/admin/AdminUI';

const statuses: OrderStatus[] = ['Pendente', 'Em produ\u00e7\u00e3o', 'Pronto', 'Entregue'];
export default function UpdateOrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, updateOrderStatus } = useStore();
  const order = orders.find((item) => item.id === id);
  const [selected, setSelected] = useState<OrderStatus>(order?.status ?? 'Pendente');
  const statusIndex = order ? statuses.indexOf(order.status) : -1;
  const nextStatus = statusIndex >= 0 ? statuses[statusIndex + 1] : undefined;
  const canAdvance = Boolean(order && nextStatus && selected === nextStatus);

  return <Screen><Header title="Atualizar status" subtitle="Avance o pedido para a pr\u00f3xima etapa." back />
    {order && statuses.map((status, index) => <TouchableOpacity key={status} disabled={status !== order.status && status !== nextStatus} onPress={() => setSelected(status)} style={[styles.option, selected === status && styles.selected, status !== order.status && status !== nextStatus && styles.disabled]}>
      <Text style={styles.icon}>{['1', '2', '3', '4'][index]}</Text><Text style={styles.label}>{status === 'Pendente' ? 'Novo pedido' : status}</Text><Text style={styles.radio}>{selected === status ? '\u25cf' : '\u25cb'}</Text>
    </TouchableOpacity>)}
    {order && !nextStatus && <Text style={styles.note}>Este pedido j\u00e1 chegou \u00e0 \u00faltima etapa.</Text>}
    {order && <Button title={canAdvance ? 'Avan\u00e7ar pedido' : 'Selecione a pr\u00f3xima etapa'} disabled={!canAdvance} onPress={() => { if (nextStatus) updateOrderStatus(order.id, nextStatus); router.replace({ pathname: '/telas-adm/PedidoDetalhe', params: { id } }); }} />}
  </Screen>;
}

const styles = StyleSheet.create({ option: { alignItems: 'center', borderColor: colors.line, borderRadius: 15, borderWidth: 1, flexDirection: 'row', gap: 13, marginBottom: 10, padding: 15 }, selected: { backgroundColor: colors.pale, borderColor: colors.purple }, disabled: { opacity: 0.42 }, icon: { color: colors.purple, fontSize: 14, fontWeight: '700', width: 18 }, label: { color: colors.ink, flex: 1, fontSize: 13 }, radio: { color: colors.purple, fontSize: 17 }, note: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 14 } });
