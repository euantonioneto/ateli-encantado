import { Href, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore, CustomerProfile } from '../context/StoreContext';
import { DELIVERY_ESTIMATE, FIXED_DELIVERY_FEE } from '../../data/delivery-config';

const inputStyle = { backgroundColor: '#F6F5F8', borderColor: '#E6E4EB', borderRadius: 14, borderWidth: 1, color: '#17151D', minHeight: 46, paddingHorizontal: 13 } as const;

export default function CheckoutScreen() {
  const { cart, products, customerProfile, saveCustomerProfile, createOrderFromCart } = useStore();
  const [name, setName] = useState(customerProfile?.nome ?? '');
  const [email, setEmail] = useState(customerProfile?.email ?? '');
  const [phone, setPhone] = useState(customerProfile?.telefone ?? '');
  const [street, setStreet] = useState(customerProfile?.endereco ?? '');
  const [number, setNumber] = useState(customerProfile?.numero ?? '');
  const [neighborhood, setNeighborhood] = useState(customerProfile?.bairro ?? '');
  const [city, setCity] = useState(customerProfile?.cidade ?? '');
  const [zip, setZip] = useState(customerProfile?.cep ?? '');
  const [deliveryMode, setDeliveryMode] = useState<'Entrega' | 'Retirada'>('Entrega');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [customization, setCustomization] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.precosPorTipo?.[item.type] ?? product?.preco ?? 0) * item.quantity;
  }, 0);
  const deliveryFee = deliveryMode === 'Retirada' ? 0 : FIXED_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  async function finishOrder() {
    if (submitting) return;
    const addressRequired = deliveryMode === 'Entrega' && (!street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !zip.trim());
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const phoneDigits = phone.replace(/\D/g, '');
    if (!name.trim() || !validEmail || phoneDigits.length < 8 || addressRequired) {
      setError('Confira nome, e-mail, telefone e os dados de entrega obrigatorios.');
      return;
    }

    const profile: CustomerProfile = { nome: name.trim(), email: email.trim(), telefone: phone.trim(), endereco: street.trim(), numero: number.trim(), bairro: neighborhood.trim(), cidade: city.trim(), cep: zip.trim() };
    const delivery = deliveryMode === 'Retirada' ? 'Retirada no atelie' : `${street.trim()}, ${number.trim()} - ${neighborhood.trim()} - ${city.trim()} - CEP ${zip.trim()}`;
    setSubmitting(true);
    setError('');
    try {
      await saveCustomerProfile(profile);
      const orderId = await createOrderFromCart({ delivery, deliveryMode, deliveryFee, deliveryEstimate: deliveryMode === 'Entrega' ? DELIVERY_ESTIMATE : 'A combinar na retirada', customization, paymentMethod, customerName: profile.nome, customerEmail: profile.email, customerPhone: profile.telefone });
      if (!orderId) {
        setError('Nao foi possivel criar o pedido. Revise os itens do carrinho.');
        return;
      }
      router.replace({ pathname: '/telas-cliente/pedido-confirmado', params: { id: orderId } } as unknown as Href);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Nao foi possivel salvar o pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }
  if (!cart.length) return <SafeAreaView style={styles.safe}><View style={styles.center}><Text style={styles.heading}>Seu carrinho está vazio</Text><TouchableOpacity onPress={() => router.replace('/telas-cliente/home')}><Text style={styles.link}>Voltar ao catálogo</Text></TouchableOpacity></View></SafeAreaView>;

  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹  Voltar ao carrinho</Text></TouchableOpacity>
        <Text style={styles.heading}>Finalizar pedido</Text>
        <Text style={styles.section}>Seus dados</Text>
        <Field label="Nome completo" value={name} onChangeText={setName} />
        <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text style={styles.section}>Como receber</Text>
        <View style={styles.choices}>{(['Entrega', 'Retirada'] as const).map((mode) => <Choice key={mode} label={mode === 'Entrega' ? 'Receber no endereço' : 'Retirar no ateliê'} active={deliveryMode === mode} onPress={() => setDeliveryMode(mode)} />)}</View>
        <View style={styles.deliverySummary}><Text style={styles.summaryLine}>Frete {deliveryMode === 'Retirada' ? '(retirada)' : '(taxa fixa)'}</Text><Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</Text><Text style={styles.estimate}>Previsão de entrega: {deliveryMode === 'Retirada' ? 'a combinar no ateliê' : DELIVERY_ESTIMATE}</Text></View>
        {deliveryMode === 'Entrega' && <>
          <Field label="Endereço" value={street} onChangeText={setStreet} />
          <View style={styles.row}><View style={{ flex: 1 }}><Field label="Número" value={number} onChangeText={setNumber} /></View><View style={{ flex: 1 }}><Field label="CEP" value={zip} onChangeText={setZip} keyboardType="numeric" /></View></View>
          <Field label="Bairro" value={neighborhood} onChangeText={setNeighborhood} />
          <Field label="Cidade" value={city} onChangeText={setCity} />
        </>}
        <Text style={styles.section}>Pagamento</Text>
        <View style={styles.choices}>{['Pix', 'Cartão', 'Dinheiro'].map((method) => <Choice key={method} label={method} active={paymentMethod === method} onPress={() => setPaymentMethod(method)} />)}</View>
        <Text style={styles.helper}>A forma de pagamento será registrada no pedido. O pagamento ainda não é processado pelo app.</Text>
        <Text style={styles.section}>Personalização / observações</Text>
        <TextInput value={customization} onChangeText={setCustomization} placeholder="Observações gerais do pedido (opcional)" placeholderTextColor="#898590" multiline maxLength={500} style={[inputStyle, styles.multiline]} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.totalBox}><Text style={styles.summaryLine}>Subtotal dos produtos</Text><Text style={styles.summaryValue}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text><Text style={styles.summaryLine}>Frete</Text><Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</Text><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text></View>
        <TouchableOpacity disabled={submitting} onPress={finishOrder} style={[styles.primary, submitting && { opacity: 0.6 }]}><Text style={styles.primaryText}>{submitting ? 'Salvando pedido...' : `Confirmar pedido · R$ ${total.toFixed(2).replace('.', ',')}`}</Text></TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

function Field({ label, value, onChangeText, keyboardType = 'default' }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'} style={inputStyle} /></View>;
}

function Choice({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return <TouchableOpacity onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({ safe: { backgroundColor: '#FFF', flex: 1 }, content: { padding: 20, paddingBottom: 36 }, back: { color: '#514C65', marginBottom: 16, paddingVertical: 6 }, heading: { color: '#17151D', fontSize: 25, fontWeight: '600' }, subheading: { color: '#77727C', fontSize: 13, marginTop: 6 }, section: { color: '#17151D', fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 22 }, field: { gap: 6, marginBottom: 11 }, label: { color: '#5F5A68', fontSize: 12 }, row: { flexDirection: 'row', gap: 10 }, choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, choice: { borderColor: '#E6E4EB', borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 }, choiceActive: { backgroundColor: '#F0EFFB', borderColor: '#645CD8' }, choiceText: { color: '#514C65', fontSize: 12 }, choiceTextActive: { color: '#5146C8', fontWeight: '600' }, helper: { color: '#77727C', fontSize: 11, lineHeight: 16, marginTop: 9 }, multiline: { minHeight: 86, paddingTop: 12, textAlignVertical: 'top' }, deliverySummary: { backgroundColor: '#F8F7FA', borderRadius: 14, marginTop: 12, padding: 13 }, summaryLine: { color: '#77727C', fontSize: 12, marginTop: 5 }, summaryValue: { color: '#17151D', fontSize: 13, fontWeight: '600', marginTop: 3 }, estimate: { color: '#5146C8', fontSize: 11, marginTop: 9 }, totalBox: { borderTopColor: '#E6E4EB', borderTopWidth: 1, marginTop: 22, paddingTop: 14 }, totalLabel: { color: '#17151D', fontSize: 14, fontWeight: '600', marginTop: 14 }, totalValue: { color: '#17151D', fontSize: 23, fontWeight: '700', marginTop: 4 }, error: { color: '#B14747', fontSize: 12, marginTop: 14 }, primary: { alignItems: 'center', backgroundColor: '#151528', borderRadius: 22, marginTop: 18, padding: 15 }, primaryText: { color: '#FFF', fontSize: 13, fontWeight: '600' }, center: { alignItems: 'center', flex: 1, justifyContent: 'center' }, link: { color: '#645CD8', marginTop: 12 } });
