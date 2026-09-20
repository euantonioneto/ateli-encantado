import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';

export default function CartScreen() {
  const { cart, toggleCart } = useStore();

  const productId = 'buque-borboleta';
  const inCart = cart.includes(productId);
  const makeupProductId = 'buque-maquiagem';
  const makeupInCart = cart.includes(makeupProductId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {(inCart || makeupInCart) ? (
          <>
            <Text style={styles.pageTitle}>Meu carrinho</Text>

            {inCart && (
            <View style={styles.productCard}>
              <Image
                source={require('@/assets/images/produtos/buque-borboleta-branco.png')}
                style={styles.productImage}
                resizeMode="contain"
              />

              <Text style={styles.productName}>buquê de borboleta</Text>
              <Text style={styles.price}>$: 180,00</Text>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => toggleCart(productId)}>
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
            )}
            {makeupInCart && (
              <View style={styles.productCardExtra}>
                <Image
                  source={require('@/assets/images/produtos/buque de maquiagem.png')}
                  style={styles.productImage}
                  resizeMode="contain"
                />

                <Text style={styles.productName}>buquê de maquiagem</Text>
                <Text style={styles.price}>$: 180,00</Text>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => toggleCart(makeupProductId)}>
                  <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            <Image
              source={require('@/assets/images/carrinho.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Seu carrinho está vazio</Text>
            <Text style={styles.description}>
              Adicione um presente especial para continuar.
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },

  pageTitle: {
    alignSelf: 'flex-start',
    color: '#090909',
    fontSize: 24,
    marginBottom: 80,
  },

  productCard: {
    backgroundColor: '#DDDDDD',
    borderRadius: 30,
    height: 150,
    position: 'relative',
    width: '100%',
  },
  productCardExtra: {
    backgroundColor: '#DDDDDD',
    borderRadius: 30,
    height: 150,
    marginTop: 70,
    position: 'relative',
    width: '100%',
  },
  productImage: {
    height: 150,
    left: '50%',
    marginLeft: -75,
    position: 'absolute',
    top: -70,
    width: 150,
  },
  productName: {
    color: '#090909',
    fontSize: 14,
    left: 18,
    position: 'absolute',
    top: 38,
  },
  price: {
    bottom: 20,
    color: '#090909',
    fontSize: 16,
    left: 18,
    position: 'absolute',
  },
  removeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    bottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: 'absolute',
    right: 16,
  },
  removeButtonText: {
    color: '#090909',
    fontSize: 13,
  },

  emptyImage: { height: 74, width: 74 },
  title: { color: '#211E25', fontSize: 22, marginTop: 10 },
  description: {
    color: '#77727B',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
