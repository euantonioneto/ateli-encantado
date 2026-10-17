import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { useStore } from '../context/StoreContext';
import { Button, Field, Header, Panel, Screen } from '../../components/admin/AdminUI';

export default function CancelOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, products, cancelOrder } = useStore();
  const order = orders.find((item) => item.id === id);
  const product = products.find((item) => item.id === order?.productId);
  const [reason, setReason] = useState('');
  return <Screen><Header title="Cancelar pedido" subtitle={`Confirme o cancelamento do pedido #${id}.`} back />
    <Panel><Text>{product?.nome ?? 'Produto'} · {order?.type} · R$ {order?.price.toFixed(2).replace('.', ',')}</Text></Panel>
    <Field label="Motivo do cancelamento" value={reason} onChangeText={setReason} placeholder="Conte ao cliente o motivo do cancelamento." multiline />
    {order && ['Entregue', 'Cancelado'].includes(order.status) && <Text>Este pedido nao pode mais ser cancelado.</Text>}
    <Button title="Confirmar cancelamento" disabled={!reason.trim() || !order || ['Entregue', 'Cancelado'].includes(order.status)} onPress={() => { if (order) cancelOrder(order.id, reason.trim()); router.replace('/telas-adm/Pedidos'); }} />
  </Screen>;
}
