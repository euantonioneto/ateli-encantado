import { useState } from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { name: 'buquê de\nborboleta', image: require('@/assets/images/catalog/buque-borboleta.png') },
  { name: 'buquê de\nflor de cetim', image: require('@/assets/images/catalog/flor-cetim.png') },
  { name: 'cesta de\npresente', image: require('@/assets/images/catalog/cesta-presente.png') },
  { name: 'buquê de\nmaquiagem', image: require('@/assets/images/catalog/buque-maquiagem.png') },
  { name: 'fotos em\npolaroid', image: require('@/assets/images/catalog/fotos-polaroid.png') },
  { name: 'presente\npersonalizado', image: require('@/assets/images/catalog/presente-personalizado.png') },
];

type Category = { name: string; image: ImageSourcePropType };

export default function HomeScreen() {
  const [favorite, setFavorite] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.sectionTitle}>catalogo</Text>
        <View style={styles.categoryGrid}>
          {categories.map(({ name, image }: Category) => (
            <TouchableOpacity key={name} style={styles.category} activeOpacity={0.7} accessibilityLabel={name.replace('\n', ' ')}>
              <Image source={image} style={styles.categoryImage} resizeMode="contain" />
              <Text style={styles.categoryName}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.popularTitle}>Popular</Text>
        <View style={styles.productCard}>
          <Image source={require('@/assets/images/produtos/buque-borboleta-branco.png')} style={styles.productImage} resizeMode="contain" />
          <Text style={styles.productName}>buquê de borboleta</Text>
          <View style={styles.delivery}>
            <Text style={styles.deliveryText}>Tipo:{`\n`}Completo</Text>
          </View>
          <Text style={styles.price}>$: 180,00</Text>
          <Text style={styles.productDetails}>70 borboletas{`\n`}polaroides: quantas quiser{`\n`}cor a sua escolha</Text>
          <TouchableOpacity
            onPress={() => setFavorite((current) => !current)}
            style={styles.favorite}
            accessibilityRole="button"
            accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
            <Text style={styles.heart}>{favorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 },
  page: { backgroundColor: '#FFFFFF', flex: 1 },
  content: { paddingBottom: 20, paddingHorizontal: 22, paddingTop: 2 },
  logoContainer: { alignItems: 'center', height: 112, justifyContent: 'center', marginBottom: 2 },
  logo: { height: 98, width: 150 },
  sectionTitle: { color: '#090909', fontSize: 18, fontWeight: '400', marginBottom: 6 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 },
  category: { alignItems: 'center', aspectRatio: 1, backgroundColor: '#DDDDDD', justifyContent: 'space-between', paddingBottom: 4, paddingTop: 4, width: '29.5%' },
  categoryImage: { height: '61%', width: '70%' },
  categoryName: { color: '#090909', fontSize: 10, lineHeight: 12, textAlign: 'center' },
  popularTitle: { color: '#090909', fontSize: 24, fontWeight: '400', marginBottom: 66, marginTop: 14 },
  productCard: { backgroundColor: '#DDDDDD', borderRadius: 30, height: 132, overflow: 'visible', position: 'relative' },
  productImage: { height: 150, left: '50%', marginLeft: -75, position: 'absolute', top: -67, width: 150, zIndex: 1 },
  productName: { color: '#090909', fontSize: 11, left: 14, position: 'absolute', top: 27 },
  delivery: { position: 'absolute', right: 18, top: 24 },
  deliveryText: { color: '#090909', fontSize: 11, lineHeight: 13, textAlign: 'center' },
  price: { bottom: 16, color: '#090909', fontSize: 16, left: 14, position: 'absolute' },
  productDetails: { bottom: 8, color: '#090909', fontSize: 10, lineHeight: 11, position: 'absolute', textAlign: 'center', width: '100%' },
  favorite: { bottom: 12, padding: 1, position: 'absolute', right: 18 },
  heart: { color: '#090909', fontSize: 38, fontWeight: '200', lineHeight: 40 },
});
