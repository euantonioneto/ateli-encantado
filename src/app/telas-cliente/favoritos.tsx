import { useStore } from '../context/StoreContext';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { favorites, cart, toggleFavorite, toggleCart } = useStore();

  const productId = 'buque-borboleta';
  const favorite = favorites.includes(productId);
  const inCart = cart.includes(productId);
  const makeupProductId = 'buque-maquiagem';
  const makeupFavorite = favorites.includes(makeupProductId);
  const makeupInCart = cart.includes(makeupProductId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {favorite ? (
          <View style={styles.productCard}>
            <Image
              source={require('@/assets/images/produtos/buque-borboleta-branco.png')}
              style={styles.productImage}
              resizeMode="contain"
            />

            <Text style={styles.productName}>buquê de borboleta</Text>

            <View style={styles.delivery}>
              <Text style={styles.deliveryText}>Tipo:{'\n'}Completo</Text>
            </View>

            <Text style={styles.price}>$: 180,00</Text>

            <Text style={styles.productDetails}>
              70 borboletas{'\n'}
              polaroides: quantas quiser{'\n'}
              cor a sua escolha
            </Text>

            <TouchableOpacity
              onPress={() => toggleFavorite(productId)}
              style={styles.favorite}
              accessibilityRole="button"
              accessibilityLabel="Remover dos favoritos">
              <Text style={styles.heart}>♥</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleCart(productId)}
              style={[styles.cart, inCart && styles.cartActive]}
              accessibilityRole="button"
              accessibilityLabel={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}>
              <Image
                source={require('@/assets/images/carrinho.png')}
                style={styles.cartIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : makeupFavorite ? null : (
          <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>
        )}
        {makeupFavorite && (
          <View style={styles.productCardExtra}>
            <Image source={require('@/assets/images/produtos/buque de maquiagem.png')} style={styles.productImage} resizeMode="contain" />
            <Text style={styles.productName}>buquê de maquiagem</Text>
            <View style={styles.delivery}>
              <Text style={styles.deliveryText}>Tipo:{'\n'}Completo</Text>
            </View>
            <Text style={styles.price}>$: 180,00</Text>
            <Text style={styles.productDetails}>maquiagem{'\n'}polaroides: quantas quiser{'\n'}cor a sua escolha</Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(makeupProductId)}
              style={styles.favorite}
              accessibilityRole="button"
              accessibilityLabel="Remover dos favoritos">
              <Text style={styles.heart}>{'\u2665'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleCart(makeupProductId)}
              style={[styles.cart, makeupInCart && styles.cartActive]}
              accessibilityRole="button"
              accessibilityLabel={makeupInCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}>
              <Image source={require('@/assets/images/carrinho.png')} style={styles.cartIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFF', flex: 1 },
  container: { alignItems: 'center', backgroundColor: '#FFF', flex: 1, justifyContent: 'center', padding: 28 },
  image: { height: 74, width: 74 },
  title: { color: '#211E25', fontSize: 22, marginTop: 10 },
  description: { color: '#77727B', fontSize: 14, marginTop: 8, textAlign: 'center' },
  productCard: { backgroundColor: '#DDDDDD', borderRadius: 30, height: 132, overflow: 'visible', position: 'relative' },
  productCardExtra: { backgroundColor: '#DDDDDD', borderRadius: 30, height: 132, marginTop: 74, overflow: 'visible', position: 'relative' },
  productImage: { height: 150, left: '50%', marginLeft: -75, position: 'absolute', top: -67, width: 150, zIndex: 1 },
  productName: { color: '#090909', fontSize: 11, left: 14, position: 'absolute', top: 27 },
  delivery: { position: 'absolute', right: 18, top: 24 },
  deliveryText: { color: '#090909', fontSize: 11, lineHeight: 13, textAlign: 'center' },
  price: { bottom: 16, color: '#090909', fontSize: 16, left: 14, position: 'absolute' },
  productDetails: { bottom: 8, color: '#090909', fontSize: 10, lineHeight: 11, position: 'absolute', textAlign: 'center', width: '100%' },
  favorite: { bottom: 12, padding: 1, position: 'absolute', right: 50 },
  heart: { color: '#090909', fontSize: 38, fontWeight: '200', lineHeight: 40 },

  page: { backgroundColor: '#FFFFFF', flex: 1 },
  content: { paddingBottom: 20, paddingHorizontal: 22, paddingTop: 2 },
  logoContainer: { alignItems: 'center', height: 112, justifyContent: 'center', marginBottom: 68 },
  logo: { height: 98, width: 150 },

 cart: { alignItems: 'center', bottom: 14, height: 30, justifyContent: 'center', position: 'absolute', right: 12, width: 30 },
 cartActive: { backgroundColor: '#C9CDD9', borderRadius: 15 },
 cartIcon: { height: 23, tintColor: '#090909', width: 23 },

 emptyText: {
  color: '#77727B',
  fontSize: 16,
  marginTop: 40,
  textAlign: 'center',
},
});
