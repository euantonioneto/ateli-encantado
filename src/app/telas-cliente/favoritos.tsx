import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function FavoritesScreen() {
  const { favorites, cart, toggleFavorite, products } = useStore();
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}><Image source={require('@/assets/images/logo/logo2.png')} style={styles.logo} resizeMode="contain" /></View>
        {favoriteProducts.map((product) => <ProductCard key={product.id} product={product} favorite inCart={cart.some((item) => item.productId === product.id)}
          onToggleFavorite={() => toggleFavorite(product.id)} />)}
        {!favoriteProducts.length && <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFF', flex: 1 }, page: { backgroundColor: '#FFF', flex: 1 },
  content: { paddingBottom: 20, paddingHorizontal: 22, paddingTop: 2 },
  logoContainer: { alignItems: 'center', height: 112, justifyContent: 'center', marginBottom: 68 }, logo: { height: 98, width: 150 },
  emptyText: { color: '#77727B', fontSize: 16, marginTop: 40, textAlign: 'center' },
});
