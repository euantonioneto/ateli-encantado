import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, colors, Screen } from '../../components/admin/AdminUI';

export default function EmailSentScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [resent, setResent] = useState(false);
  return <Screen><View style={styles.center}><Text style={styles.icon}>✉</Text><Text style={styles.title}>Confira seu e-mail</Text><Text style={styles.subtitle}>Se o endereço estiver cadastrado, você receberá um link de redefinição em {email}.</Text><Button title={resent ? 'Solicitação registrada' : 'Reenviar link (demonstração)'} onPress={() => setResent(true)} />{resent && <Text style={styles.note}>Este protótipo ainda não envia e-mails.</Text>}<Text style={styles.link} onPress={() => router.replace('/loguin/logar-adm')}>Voltar para o login</Text></View></Screen>;
}
const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center' }, icon: { color: colors.purple, fontSize: 42, marginBottom: 15, textAlign: 'center' }, title: { color: colors.ink, fontFamily: 'serif', fontSize: 23, textAlign: 'center' }, subtitle: { color: colors.muted, fontSize: 12, lineHeight: 19, marginBottom: 23, marginTop: 8, textAlign: 'center' }, link: { color: colors.purple, fontSize: 11, marginTop: 15, textAlign: 'center' }, note: { color: colors.muted, fontSize: 10, marginTop: 9, textAlign: 'center' } });
