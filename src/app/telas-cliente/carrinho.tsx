import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductType } from '../../data/catalog';
import { useStore } from '../context/StoreContext';

const typeName: Record<ProductType, string> = { Simples: 'Simples', 'Médio': 'Médio', Completo: 'Completo', Especial: 'Especial' };
const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function CartScreen() {
  const { cart, updateCartQuantity, updateCartCustomization, removeCartItem, products } = useStore();
  const lines = cart.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? [{ item, product, unitPrice: product.precosPorTipo?.[item.type] ?? product.preco }] : [];
  });
  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.item.quantity, 0);

  return <SafeAreaView style={styles.safe} edges={['top']}>
    {!lines.length ? <View style={styles.empty}>
      <Image source={require('@/assets/images/carrinho.png')} style={styles.emptyImage} resizeMode="contain" />
      <Text style={styles.title}>Seu carrinho está vazio</Text><Text style={styles.description}>Adicione um presente especial para continuar.</Text>
      <TouchableOpacity style={styles.secondary} onPress={() => router.replace('/telas-cliente/home')}><Text style={styles.secondaryText}>Voltar ao catálogo</Text></TouchableOpacity>
    </View> : <>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.pageTitle}>Meu carrinho</Text>
        {lines.map(({ item, product, unitPrice }) => <View key={`${item.productId}-${item.type}`} style={styles.card}>
          <Image source={product.imagem} style={styles.productImage} resizeMode="contain" />
          <View style={styles.productDetails}><Text style={styles.productName}>{product.nome}</Text><Text style={styles.meta}>Tipo: {typeName[item.type]}</Text><Text style={styles.meta}>{money(unitPrice)} cada</Text>
            <View style={styles.quantity}><TouchableOpacity onPress={() => updateCartQuantity(item.productId, item.type, item.quantity - 1)} style={styles.quantityButton}><Text style={styles.quantityText}>−</Text></TouchableOpacity><Text style={styles.count}>{item.quantity}</Text><TouchableOpacity onPress={() => updateCartQuantity(item.productId, item.type, item.quantity + 1)} style={styles.quantityButton}><Text style={styles.quantityText}>+</Text></TouchableOpacity></View>
            <TextInput value={item.customization} onChangeText={(value) => updateCartCustomization(item.productId, item.type, value)} placeholder="Personalização deste item (opcional)" placeholderTextColor="#898590" multiline maxLength={250} style={styles.customization} />
          </View>
          <View style={styles.lineEnd}><Text style={styles.lineTotal}>{money(unitPrice * item.quantity)}</Text><TouchableOpacity onPress={() => removeCartItem(item.productId, item.type)} accessibilityRole="button"><Text style={styles.remove}>Remover</Text></TouchableOpacity></View>
        </View>)}
        <View style={styles.summary}><Text style={styles.summaryLabel}>Subtotal dos produtos</Text><Text style={styles.summaryTotal}>{money(total)}</Text><Text style={styles.disclaimer}>Frete e pagamento serão informados na próxima etapa.</Text></View>
        <TouchableOpacity style={styles.primary} onPress={() => router.push('/telas-cliente/checkout')}><Text style={styles.primaryText}>Continuar para entrega</Text></TouchableOpacity>
      </ScrollView>
    </>}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#FFF', flex: 1 }, list: { padding: 20, paddingBottom: 35 }, pageTitle: { color: '#17151D', fontSize: 24, fontWeight: '600', marginBottom: 18 },
  card: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#EAE8EE', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 10, marginBottom: 12, padding: 11 }, productImage: { backgroundColor: '#F7F6F8', borderRadius: 13, height: 82, width: 74 }, productDetails: { flex: 1 }, productName: { color: '#17151D', fontSize: 13, fontWeight: '600' }, meta: { color: '#77727C', fontSize: 11, marginTop: 4 }, quantity: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 10, marginTop: 8 }, quantityButton: { alignItems: 'center', backgroundColor: '#F0EFFB', borderRadius: 14, height: 28, justifyContent: 'center', width: 28 }, quantityText: { color: '#343147', fontSize: 18 }, count: { color: '#17151D', fontSize: 13 }, customization: { backgroundColor: '#F8F7FA', borderRadius: 9, color: '#17151D', fontSize: 10, marginTop: 9, maxHeight: 60, minHeight: 34, padding: 8, textAlignVertical: 'top' }, lineEnd: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 75 }, lineTotal: { color: '#17151D', fontSize: 12, fontWeight: '600' }, remove: { color: '#B14747', fontSize: 10 },
  summary: { borderTopColor: '#EAE8EE', borderTopWidth: 1, marginTop: 8, paddingTop: 16 }, summaryLabel: { color: '#77727C', fontSize: 12 }, summaryTotal: { color: '#17151D', fontSize: 22, fontWeight: '700', marginTop: 3 }, disclaimer: { color: '#77727C', fontSize: 11, marginTop: 5 }, primary: { alignItems: 'center', backgroundColor: '#151528', borderRadius: 22, marginTop: 18, padding: 15 }, primaryText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  empty: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 22 }, emptyImage: { height: 74, width: 74 }, title: { color: '#211E25', fontSize: 22, marginTop: 10 }, description: { color: '#77727B', fontSize: 14, marginTop: 8, textAlign: 'center' }, secondary: { borderColor: '#DAD8E2', borderRadius: 22, borderWidth: 1, marginTop: 18, paddingHorizontal: 20, paddingVertical: 12 }, secondaryText: { color: '#343147', fontSize: 13 },
});
