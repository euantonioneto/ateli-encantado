import { Href, router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../data/catalog';

type Props = {
  product: Product;
  favorite?: boolean;
  inCart?: boolean;
  onToggleFavorite?: () => void;
};

export default function ProductCard({ product, favorite = false, inCart = false, onToggleFavorite }: Props) {
  return (
    <View style={styles.card}>
      <Image source={product.imagem} style={styles.image} resizeMode="contain" />
      <Text style={styles.name} numberOfLines={2}>{product.nome}</Text>
      <Text style={styles.price}>{(product.tiposDisponiveis?.length ?? 0) > 1 ? 'A partir de ' : ''}R$ {product.preco.toFixed(2).replace('.', ',')}</Text>
      <Text style={styles.details} numberOfLines={3}>{product.descricao}</Text>
      {onToggleFavorite && <TouchableOpacity onPress={onToggleFavorite} style={styles.favorite} accessibilityRole="button" accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
        <Text style={styles.heart}>{favorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>}
      <TouchableOpacity onPress={() => router.push({ pathname: '/telas-cliente/produto/[id]', params: { id: product.id } } as unknown as Href)} style={[styles.cart, inCart && styles.cartActive]} accessibilityRole="button" accessibilityLabel="Escolher tipo e adicionar ao carrinho">
        <Image source={require('@/assets/images/carrinho.png')} style={styles.cartIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#DDDDDD', borderRadius: 30, height: 148, marginBottom: 78, position: 'relative' },
  image: { height: 150, left: '50%', marginLeft: -75, position: 'absolute', top: -62, width: 150, zIndex: 1 },
  name: { color: '#090909', fontSize: 12, left: 14, maxWidth: '45%', position: 'absolute', top: 27 },
  price: { bottom: 16, color: '#090909', fontSize: 16, left: 14, position: 'absolute' },
  details: { bottom: 8, color: '#090909', fontSize: 10, lineHeight: 11, position: 'absolute', textAlign: 'center', width: '100%' },
  favorite: { bottom: 12, padding: 1, position: 'absolute', right: 50 },
  heart: { color: '#090909', fontSize: 38, fontWeight: '200', lineHeight: 40 },
  cart: { alignItems: 'center', bottom: 14, height: 30, justifyContent: 'center', position: 'absolute', right: 12, width: 30 },
  cartActive: { backgroundColor: '#C9CDD9', borderRadius: 15 },
  cartIcon: { height: 23, tintColor: '#090909', width: 23 },
});
