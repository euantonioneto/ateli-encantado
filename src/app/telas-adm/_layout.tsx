import { Tabs } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../context/StoreContext';

const items: Record<string, string> = { Dashboard: 'Início', Pedidos: 'Pedidos', Produtos: 'Produtos', Mensagens: 'Mensagens', Conta: 'Conta' };

export default function AdminLayout() {
  const { conversations } = useStore();
  const unreadMessages = conversations.filter((conversation) => conversation.unreadByAdmin).length;
  return <Tabs screenOptions={{ headerShown: false }} tabBar={({ state, navigation }) => {
    const current = state.routes[state.index]?.name;
    if (current === 'RecuperarSenha' || current === 'EmailEnviado') return null;
    const activeTab = ['PedidoDetalhe', 'AtualizarStatus', 'CancelarPedido'].includes(current) ? 'Pedidos'
      : ['ProdutoFormulario', 'ProdutoSalvo'].includes(current) ? 'Produtos'
      : current === 'Conversa' ? 'Mensagens' : current;
    return <View style={styles.bar}>
    {state.routes.map((route, index) => {
      const label = items[route.name];
      if (!label) return null;
      const active = activeTab === route.name;
      return <TouchableOpacity key={route.key} onPress={() => navigation.navigate(route.name)} style={[styles.tab, active && styles.active]}>
        <Text style={[styles.label, active && styles.activeLabel]}>{label}{route.name === 'Mensagens' && unreadMessages ? ` (${unreadMessages})` : ''}</Text>
      </TouchableOpacity>;
    })}
  </View>; }}>
    <Tabs.Screen name="Dashboard" options={{ title: 'Início' }} />
    <Tabs.Screen name="Pedidos" options={{ title: 'Pedidos' }} />
    <Tabs.Screen name="Produtos" options={{ title: 'Produtos' }} />
    <Tabs.Screen name="Mensagens" options={{ title: 'Mensagens' }} />
    <Tabs.Screen name="Conta" options={{ title: 'Conta' }} />
    {['PedidoDetalhe', 'AtualizarStatus', 'CancelarPedido', 'ProdutoFormulario', 'ProdutoSalvo', 'Conversa', 'RecuperarSenha', 'EmailEnviado'].map((name) =>
      <Tabs.Screen key={name} name={name} options={{ href: null }} />)}
  </Tabs>;
}

const styles = StyleSheet.create({
  bar: { alignItems: 'center', backgroundColor: '#FFF', borderTopColor: '#EEEFF5', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 22, paddingHorizontal: 8, paddingTop: 9 },
  tab: { alignItems: 'center', borderRadius: 18, justifyContent: 'center', minWidth: 54, paddingHorizontal: 11, paddingVertical: 9 },
  active: { backgroundColor: '#E9E8FF' }, label: { color: '#77768B', fontSize: 10 }, activeLabel: { color: '#5954D6', fontWeight: '600' },
});
