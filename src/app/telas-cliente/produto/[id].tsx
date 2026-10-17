import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductType, productTypes } from '../../../data/catalog';
import { useStore } from '../../context/StoreContext';

const typeName: Record<ProductType, string> = { Simples: 'Simples', 'Médio': 'Médio', Completo: 'Completo', Especial: 'Especial' };
const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, cart, addCartItem } = useStore();
  const product = products.find((item) => item.id === id);
  const types = useMemo(() => product?.tiposDisponiveis?.length ? product.tiposDisponiveis : [...productTypes], [product]);
  const [selectedType, setSelectedType] = useState<ProductType>(types[0]);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => { setSelectedType(types[0]); }, [id, types]);

  if (!product || !product.publicado) {
    return <SafeAreaView style={styles.safe}><View style={styles.empty}><Text style={styles.title}>Produto indisponível</Text><TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>Voltar ao catálogo</Text></TouchableOpacity></View></SafeAreaView>;
  }

  const unitPrice = product.precosPorTipo?.[selectedType] ?? product.preco;
  const alreadyInCart = cart.some((item) => item.productId === product.id && item.type === selectedType);

  function addToCart() {
    addCartItem(id, selectedType, quantity);
    router.replace('/telas-cliente/carrinho');
  }

  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹  Voltar</Text></TouchableOpacity>
      <Image source={product.imagem} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{product.nome}</Text>
      <Text style={styles.description}>{product.descricao}</Text>
      <Text style={styles.section}>Escolha o tipo</Text>
      <View style={styles.options}>{types.map((type) => {
        const price = product.precosPorTipo?.[type] ?? product.preco;
        const active = selectedType === type;
        return <TouchableOpacity key={type} onPress={() => setSelectedType(type)} style={[styles.option, active && styles.optionActive]}>
          <View><Text style={styles.optionName}>{typeName[type]}</Text><Text style={styles.optionPrice}>{money(price)}</Text></View>
          <Text style={styles.radio}>{active ? '●' : '○'}</Text>
        </TouchableOpacity>;
      })}</View>
      <Text style={styles.section}>Quantidade</Text>
      <View style={styles.quantity}><TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity((value) => Math.max(1, value - 1))}><Text style={styles.quantityText}>−</Text></TouchableOpacity><Text style={styles.count}>{quantity}</Text><TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity((value) => value + 1)}><Text style={styles.quantityText}>+</Text></TouchableOpacity></View>
      <Text style={styles.total}>Total: {money(unitPrice * quantity)}</Text>
      {alreadyInCart && <Text style={styles.note}>Este tipo já está no carrinho; ao adicionar, a quantidade será somada.</Text>}
      <TouchableOpacity style={styles.primary} onPress={addToCart}><Text style={styles.primaryText}>Adicionar ao carrinho</Text></TouchableOpacity>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#FFF', flex: 1 }, content: { padding: 22, paddingBottom: 36 }, back: { alignSelf: 'flex-start', paddingVertical: 8 }, backText: { color: '#343147', fontSize: 14 },
  image: { alignSelf: 'center', backgroundColor: '#F7F6F8', borderRadius: 22, height: 240, marginBottom: 20, width: '100%' }, title: { color: '#17151D', fontSize: 23, fontWeight: '600' }, description: { color: '#77727C', fontSize: 14, lineHeight: 21, marginTop: 8 }, section: { color: '#17151D', fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 24 },
  options: { gap: 9 }, option: { alignItems: 'center', borderColor: '#E6E4EB', borderRadius: 15, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 14 }, optionActive: { backgroundColor: '#F0EFFB', borderColor: '#645CD8' }, optionName: { color: '#17151D', fontSize: 14, fontWeight: '600' }, optionPrice: { color: '#77727C', fontSize: 13, marginTop: 4 }, radio: { color: '#645CD8', fontSize: 18 }, quantity: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 18 }, quantityButton: { alignItems: 'center', backgroundColor: '#F0EFFB', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 }, quantityText: { color: '#343147', fontSize: 21 }, count: { color: '#17151D', fontSize: 16 }, total: { color: '#17151D', fontSize: 18, fontWeight: '700', marginTop: 22 }, note: { color: '#645CD8', fontSize: 12, marginTop: 8 }, primary: { alignItems: 'center', backgroundColor: '#151528', borderRadius: 22, marginTop: 18, padding: 15 }, primaryText: { color: '#FFF', fontSize: 14, fontWeight: '600' }, empty: { alignItems: 'center', flex: 1, justifyContent: 'center' }, link: { color: '#645CD8', marginTop: 16 },
});
