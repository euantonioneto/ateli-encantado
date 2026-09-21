import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';

type Cadastro = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
  endereco: string;
  cep: string;
  numero: string;
  bairro: string;
  cidade: string;
};

const initialCadastro: Cadastro = {
  nome: '', email: '', senha: '', confirmarSenha: '', telefone: '', endereco: '', cep: '', numero: '', bairro: '', cidade: '',
};

export default function CadastroScreen() {
  const [etapa, setEtapa] = useState(1);
  const [cadastro, setCadastro] = useState<Cadastro>(initialCadastro);
  const { createCustomerProfile } = useStore();

  const atualizarCampo = (campo: keyof Cadastro, valor: string) => {
    setCadastro((dadosAtuais) => ({ ...dadosAtuais, [campo]: valor }));
  };

  const avancar = () => {/*avali*/
    if (etapa === 1) {
      if (!cadastro.nome || !cadastro.email || !cadastro.senha || !cadastro.confirmarSenha) {
        Alert.alert('Preencha seus dados', 'Informe nome, e-mail e senha para continuar.');
        return;
      }
      if (cadastro.senha !== cadastro.confirmarSenha) {
        Alert.alert('Senhas diferentes', 'A confirmação de senha deve ser igual à senha informada.');
        return;
      }
    }

    if (etapa === 2 && (!cadastro.telefone || !cadastro.endereco || !cadastro.cep || !cadastro.numero || !cadastro.bairro || !cadastro.cidade)) {
      Alert.alert('Preencha seu endereço', 'Informe todos os dados de contato e endereço para continuar.');
      return;
    }

    setEtapa((etapaAtual) => etapaAtual + 1);
  };

  const concluirCadastro = () => {/*concluir*/
    createCustomerProfile({
      nome: cadastro.nome,
      email: cadastro.email,
      telefone: cadastro.telefone,
      endereco: cadastro.endereco,
      cep: cadastro.cep,
      numero: cadastro.numero,
      bairro: cadastro.bairro,
      cidade: cadastro.cidade,
    });
    router.replace('/telas-cliente');
  };

  const renderCampo = (
    label: string,
    campo: keyof Cadastro,
    options?: { keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric'; secureTextEntry?: boolean },
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={cadastro[campo]}
        onChangeText={(valor) => atualizarCampo(campo, valor)}
        keyboardType={options?.keyboardType}
        secureTextEntry={options?.secureTextEntry}
        autoCapitalize={campo === 'email' ? 'none' : 'words'}
        placeholderTextColor="#8B8B8B"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.stepLabel}>Etapa {etapa} de 3</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(etapa / 3) * 100}%` }]} />
            </View>

            {etapa === 1 && <View style={styles.form}>
              {renderCampo('Nome', 'nome')}
              {renderCampo('E-mail', 'email', { keyboardType: 'email-address' })}
              {renderCampo('Senha', 'senha', { secureTextEntry: true })}
              {renderCampo('Confirmar senha', 'confirmarSenha', { secureTextEntry: true })}
            </View>}

            {etapa === 2 && <View style={styles.form}>
              {renderCampo('Telefone', 'telefone', { keyboardType: 'phone-pad' })}
              {renderCampo('Endereço', 'endereco')}
              {renderCampo('CEP', 'cep', { keyboardType: 'numeric' })}
              {renderCampo('Número', 'numero', { keyboardType: 'numeric' })}
              {renderCampo('Bairro', 'bairro')}
              {renderCampo('Cidade', 'cidade')}
            </View>}

            {etapa === 3 && <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Dados pessoais</Text>
              <ReviewItem label="Nome" value={cadastro.nome} />
              <ReviewItem label="E-mail" value={cadastro.email} />
              <ReviewItem label="Contato" value={cadastro.telefone} />
              <ReviewItem label="Endereço" value={`${cadastro.endereco}, ${cadastro.numero}`} />
              <ReviewItem label="Bairro" value={cadastro.bairro} />
              <ReviewItem label="CEP" value={cadastro.cep} />
              <ReviewItem label="Cidade" value={cadastro.cidade} />
            </View>}

            <View style={styles.actions}>
              {etapa > 1 && <TouchableOpacity style={styles.backButton} onPress={() => setEtapa((etapaAtual) => etapaAtual - 1)}>
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>}
              <TouchableOpacity style={styles.nextButton} onPress={etapa === 3 ? concluirCadastro : avancar}>
                <Text style={styles.nextButtonText}>{etapa === 3 ? 'Concluir cadastro' : 'Próximo'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return <View style={styles.reviewItem}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value}</Text>
  </View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, paddingHorizontal: 26, paddingVertical: 18 },
  logo: { alignSelf: 'center', height: 100, marginBottom: 2, width: 130 },
  title: { color: '#090909', fontSize: 25, fontWeight: '500', textAlign: 'center' },
  stepLabel: { color: '#6B6B6B', fontSize: 13, marginTop: 18, textAlign: 'center' },
  progressTrack: { backgroundColor: '#ECECEC', borderRadius: 4, height: 6, marginBottom: 22, marginTop: 8, overflow: 'hidden' },
  progressFill: { backgroundColor: '#A7A7A7', borderRadius: 4, height: '100%' },
  form: { gap: 12 },
  field: { gap: 5 },
  label: { color: '#272727', fontSize: 14 },
  input: { backgroundColor: '#DDDDDD', borderRadius: 22, color: '#090909', fontSize: 16, height: 46, paddingHorizontal: 18 },
  reviewCard: { backgroundColor: '#DDDDDD', borderRadius: 18, paddingHorizontal: 20, paddingVertical: 10 },
  reviewTitle: { color: '#272727', fontSize: 16, fontWeight: '600', marginBottom: 5, textAlign: 'center' },
  reviewItem: { borderBottomColor: '#A7A7A7', borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 9 },
  reviewLabel: { color: '#505050', fontSize: 12 },
  reviewValue: { color: '#171717', fontSize: 15, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 'auto', paddingTop: 28 },
  nextButton: { alignItems: 'center', backgroundColor: '#CFCFCF', borderRadius: 22, flex: 1, height: 46, justifyContent: 'center', maxWidth: 230 },
  nextButtonText: { color: '#171717', fontSize: 15, fontWeight: '500' },
  backButton: { alignItems: 'center', borderColor: '#CFCFCF', borderRadius: 22, borderWidth: 1, height: 46, justifyContent: 'center', paddingHorizontal: 22 },
  backButtonText: { color: '#3D3D3D', fontSize: 15 },
});
