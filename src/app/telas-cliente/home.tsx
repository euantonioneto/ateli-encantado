import { Href, router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { productCategories } from '../../data/catalog';
import { useStore } from '../context/StoreContext';

export default function HomeScreen() {
  const { favorites, toggleFavorite, cart, customerProfile, products } = useStore();
  const published = products.filter((product) => product.publicado);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}><Image source={require('@/assets/images/logo/logo2.png')} style={styles.logo} resizeMode="contain" /></View>
        {customerProfile && <Text style={styles.welcome}>Olá, {customerProfile.nome.split(' ')[0]}!</Text>}
        <Text style={styles.sectionTitle}>Catálogo</Text>
        <View style={styles.categoryGrid}>
          {productCategories.map(({ catalogName, id, image }) => (
            <TouchableOpacity key={id} style={styles.category} activeOpacity={0.7} accessibilityRole="button"
              accessibilityLabel={`Ver categoria ${catalogName.replace('\n', ' ')}`}
              onPress={() => id === 'presente-personalizado'
                ? router.push('/telas-cliente/conversar-vendedor')
                : router.push({ pathname: '/telas-cliente/[categoria]', params: { categoria: id } } as unknown as Href)}>
              <Image source={image} style={styles.categoryImage} resizeMode="contain" />
              <Text style={styles.categoryName}>{catalogName}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.popularTitle}>Produtos</Text>
        {published.map((product) => <ProductCard key={product.id} product={product}
          favorite={favorites.includes(product.id)} inCart={cart.some((item) => item.productId === product.id)}
          onToggleFavorite={() => toggleFavorite(product.id)} />)}
        {!published.length && <Text style={styles.empty}>Nenhum produto publicado no momento.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 }, page: { backgroundColor: '#FFFFFF', flex: 1 },
  content: { paddingBottom: 20, paddingHorizontal: 22, paddingTop: 2 },
  logoContainer: { alignItems: 'center', height: 112, justifyContent: 'center', marginBottom: 2 }, logo: { height: 98, width: 150 },
  welcome: { color: '#090909', fontSize: 18, marginBottom: 8 }, sectionTitle: { color: '#090909', fontSize: 18, marginBottom: 6 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 },
  category: { alignItems: 'center', aspectRatio: 1, backgroundColor: '#DDDDDD', justifyContent: 'space-between', paddingBottom: 4, paddingTop: 4, width: '29.5%' },
  categoryImage: { height: '61%', width: '70%' }, categoryName: { color: '#090909', fontSize: 10, lineHeight: 12, textAlign: 'center' },
  popularTitle: { color: '#090909', fontSize: 24, marginBottom: 72, marginTop: 14 }, empty: { color: '#77727C', marginVertical: 20, textAlign: 'center' },
});
