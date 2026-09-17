import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/carrinho.png')} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>Seu carrinho está vazio</Text>
        <Text style={styles.description}>Adicione um presente especial para continuar.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFF', flex: 1 },
  container: { alignItems: 'center', backgroundColor: '#FFF', flex: 1, justifyContent: 'center', padding: 28 },
  image: { height: 74, width: 74 },
  title: { color: '#211E25', fontSize: 22, marginTop: 10 },
  description: { color: '#77727B', fontSize: 14, marginTop: 8, textAlign: 'center' },
});
