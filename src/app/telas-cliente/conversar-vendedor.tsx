import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from '../context/StoreContext';

export default function CustomerChatScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { conversations, ensureCustomerConversation, sendCustomerMessage } = useStore();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const initializedFor = useRef<string | undefined>(undefined);
  useEffect(() => {
    const requestedOrderId = orderId ?? '';
    if (initializedFor.current === requestedOrderId) return;
    initializedFor.current = requestedOrderId;
    setConversationId(ensureCustomerConversation(orderId));
  }, [ensureCustomerConversation, orderId]);
  const conversation = conversations.find((item) => item.id === conversationId);

  function send() {
    if (!conversationId || !message.trim()) return;
    sendCustomerMessage(conversationId, message);
    setMessage('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }

  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><View style={{ flex: 1 }}><Text style={styles.title}>Converse com o ateliê</Text><Text style={styles.subtitle}>Tire dúvidas e conte sua ideia de presente</Text></View></View>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.messages} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
        {!conversation?.messages.length && <View style={styles.welcome}><Text style={styles.welcomeTitle}>Olá! Como podemos ajudar?</Text><Text style={styles.welcomeText}>Envie sua mensagem para conversar sobre um presente personalizado ou tirar dúvidas sobre um pedido.</Text></View>}
        {conversation?.messages.map((item) => <View key={item.id} style={[styles.bubble, item.author === 'cliente' ? styles.mine : styles.theirs]}><Text style={[styles.messageText, item.author === 'cliente' && styles.mineText]}>{item.text}</Text><Text style={[styles.time, item.author === 'cliente' && styles.mineTime]}>{item.time}</Text></View>)}
      </ScrollView>
      <View style={styles.composer}><TextInput value={message} onChangeText={setMessage} placeholder="Digite sua mensagem..." placeholderTextColor="#898590" style={styles.input} multiline /><TouchableOpacity onPress={send} disabled={!message.trim() || !conversationId} style={[styles.send, (!message.trim() || !conversationId) && styles.sendDisabled]}><Text style={styles.sendText}>Enviar</Text></TouchableOpacity></View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, keyboard: { flex: 1 }, header: { alignItems: 'center', borderBottomColor: '#EAE8EE', borderBottomWidth: 1, flexDirection: 'row', gap: 12, paddingHorizontal: 18, paddingVertical: 14 }, back: { color: '#343147', fontSize: 30, lineHeight: 32, paddingHorizontal: 5 }, title: { color: '#17151D', fontSize: 16, fontWeight: '600' }, subtitle: { color: '#77727C', fontSize: 11, marginTop: 3 }, messages: { flexGrow: 1, justifyContent: 'flex-end', padding: 16 }, welcome: { alignSelf: 'center', backgroundColor: '#F7F6FA', borderRadius: 18, marginVertical: 18, maxWidth: 290, padding: 17 }, welcomeTitle: { color: '#17151D', fontSize: 14, fontWeight: '600', textAlign: 'center' }, welcomeText: { color: '#77727C', fontSize: 12, lineHeight: 18, marginTop: 7, textAlign: 'center' }, bubble: { borderRadius: 17, marginBottom: 10, maxWidth: '84%', paddingHorizontal: 13, paddingVertical: 10 }, mine: { alignSelf: 'flex-end', backgroundColor: '#19182D', borderBottomRightRadius: 5 }, theirs: { alignSelf: 'flex-start', backgroundColor: '#F0EFF4', borderBottomLeftRadius: 5 }, messageText: { color: '#17151D', fontSize: 13, lineHeight: 19 }, mineText: { color: '#FFF' }, time: { color: '#77727C', fontSize: 9, marginTop: 5, textAlign: 'right' }, mineTime: { color: '#D8D6F8' }, composer: { alignItems: 'flex-end', borderTopColor: '#EAE8EE', borderTopWidth: 1, flexDirection: 'row', gap: 8, padding: 11 }, input: { backgroundColor: '#F7F6F8', borderRadius: 17, color: '#17151D', flex: 1, maxHeight: 110, minHeight: 43, paddingHorizontal: 13, paddingVertical: 11, textAlignVertical: 'top' }, send: { alignItems: 'center', backgroundColor: '#19182D', borderRadius: 16, justifyContent: 'center', minHeight: 43, paddingHorizontal: 15 }, sendDisabled: { opacity: 0.45 }, sendText: { color: '#FFF', fontSize: 12, fontWeight: '600' } });
