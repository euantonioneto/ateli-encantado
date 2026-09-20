import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DadosContaScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.message}>Ainda em desenvolvimento</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF', flex: 1 },
  container: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 },
  message: { color: '#555555', fontSize: 17, textAlign: 'center' },
});
