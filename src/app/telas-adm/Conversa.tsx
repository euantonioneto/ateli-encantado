import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from '../context/StoreContext';
import { colors, Header, Screen } from '../../components/admin/AdminUI';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { conversations, orders, markConversationRead, sendAdminMessage } = useStore();
  const conversation = conversations.find((item) => item.id === id);
  const relatedOrder = orders.find((order) => order.id === conversation?.relatedOrderId);
  const [reply, setReply] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => { if (id) markConversationRead(id); }, [id, markConversationRead]);
  function send() { if (!conversation || !reply.trim()) return; sendAdminMessage(conversation.id, reply); setReply(''); }
  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#FFF' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Screen>
      <Header title={conversation?.customer ?? 'Conversa'} subtitle={relatedOrder ? `Pedido #${relatedOrder.id} · ${relatedOrder.status}` : 'Atendimento ao cliente'} back />
      {relatedOrder && <TouchableOpacity style={styles.orderCard} onPress={() => router.push({ pathname: '/telas-adm/PedidoDetalhe', params: { id: relatedOrder.id } })}><Text style={styles.orderTitle}>Abrir pedido #{relatedOrder.id} ›</Text><Text style={styles.orderMeta}>{relatedOrder.delivery} · {relatedOrder.paymentStatus}</Text></TouchableOpacity>}
      <ScrollView ref={scrollRef} contentContainerStyle={styles.messages} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
        {conversation?.messages.map((message) => <View key={message.id} style={[styles.bubble, message.author === 'adm' ? styles.adminBubble : styles.customerBubble]}><Text style={[styles.message, message.author === 'adm' && styles.adminMessage]}>{message.text}</Text><Text style={[styles.time, message.author === 'adm' && styles.adminTime]}>{message.time}</Text></View>)}
        {!conversation?.messages.length && <Text style={styles.empty}>A conversa com este cliente ainda nao tem mensagens.</Text>}
      </ScrollView>
    </Screen>
    <View style={styles.composer}><TextInput value={reply} onChangeText={setReply} placeholder="Digite sua resposta..." placeholderTextColor="#999" style={styles.input} multiline /><TouchableOpacity disabled={!reply.trim()} onPress={send} style={[styles.send, !reply.trim() && styles.disabled]}><Text style={styles.sendText}>Enviar</Text></TouchableOpacity></View>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ orderCard: { backgroundColor: colors.pale, borderRadius: 14, marginBottom: 10, padding: 12 }, orderTitle: { color: colors.purple, fontSize: 12, fontWeight: '600' }, orderMeta: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 4 }, messages: { flexGrow: 1, justifyContent: 'flex-end', paddingVertical: 8 }, bubble: { borderRadius: 16, marginBottom: 11, maxWidth: '88%', padding: 12 }, customerBubble: { alignSelf: 'flex-start', backgroundColor: '#F2F1F5' }, adminBubble: { alignSelf: 'flex-end', backgroundColor: colors.ink }, message: { color: colors.ink, fontSize: 12, lineHeight: 18 }, adminMessage: { color: '#FFF' }, time: { color: colors.muted, fontSize: 9, marginTop: 6, textAlign: 'right' }, adminTime: { color: '#D8D6F8' }, empty: { color: colors.muted, fontSize: 12, paddingVertical: 24, textAlign: 'center' }, composer: { alignItems: 'flex-end', borderTopColor: colors.line, borderTopWidth: 1, flexDirection: 'row', gap: 8, padding: 12 }, input: { backgroundColor: '#F5F4F7', borderRadius: 14, color: colors.ink, flex: 1, maxHeight: 100, minHeight: 42, padding: 11, textAlignVertical: 'top' }, send: { backgroundColor: colors.ink, borderRadius: 14, justifyContent: 'center', minHeight: 42, paddingHorizontal: 14 }, disabled: { opacity: 0.45 }, sendText: { color: '#FFF', fontSize: 11 } });
