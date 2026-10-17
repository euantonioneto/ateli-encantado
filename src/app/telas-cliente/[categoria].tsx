import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { productCategories } from '../../data/catalog';
import { useStore } from '../context/StoreContext';

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ categoria?: string | string[] }>();
  const categoryId = Array.isArray(params.categoria) ? params.categoria[0] : params.categoria;
  const category = productCategories.find((item) => item.id === categoryId);
  const { products, favorites, cart, toggleFavorite } = useStore();
  const categoryProducts = products.filter((product) => product.publicado && product.categoria === categoryId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Voltar para o catálogo" onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{category?.name ?? 'Categoria'}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {categoryProducts.map((product) => <ProductCard key={product.id} product={product}
            favorite={favorites.includes(product.id)} inCart={cart.some((item) => item.productId === product.id)}
            onToggleFavorite={() => toggleFavorite(product.id)} />)}
          {!categoryProducts.length && <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Produtos em breve</Text>
            <Text style={styles.emptyDescription}>Os produtos publicados desta categoria serão exibidos aqui.</Text>
          </View>}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 }, container: { backgroundColor: '#FFFFFF', flex: 1, paddingHorizontal: 18, paddingTop: 14 },
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 42 }, backButton: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  backIcon: { color: '#090C20', fontSize: 32, fontWeight: '300', lineHeight: 34 }, title: { color: '#17151D', flex: 1, fontSize: 18, fontWeight: '600', marginRight: 36, textAlign: 'center' },
  list: { paddingTop: 24 }, emptyState: { alignItems: 'center', backgroundColor: '#F8F7F8', borderRadius: 18, marginTop: 2, paddingHorizontal: 28, paddingVertical: 34 },
  emptyTitle: { color: '#17151D', fontSize: 16, fontWeight: '600', marginBottom: 8 }, emptyDescription: { color: '#77727C', fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
