import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Header, Screen } from '../../components/admin/AdminUI';
import { useStore } from '../context/StoreContext';

const options = ['Perfil', 'Notificações', 'Permissões'];
export default function AccountScreen() {
  const { logout } = useStore();
  return <Screen><Header title="Conta" subtitle="Ajustes, configurações, permissões e ajuda." />
    <View style={styles.profile}><View style={styles.avatar}><Text style={styles.initials}>AD</Text></View><View><Text style={styles.name}>Administrador</Text><Text style={styles.email}>Sessão administrativa</Text></View></View>
    {options.map((option) => <TouchableOpacity key={option} style={styles.option}><Text style={styles.optionText}>{option}</Text><Text style={styles.arrow}>›</Text></TouchableOpacity>)}
    <TouchableOpacity onPress={() => { logout(); router.replace('/loguin'); }} style={styles.option}><Text style={[styles.optionText, { color: colors.red }]}>Sair</Text><Text style={styles.arrow}>↪</Text></TouchableOpacity>
  </Screen>;
}
const styles = StyleSheet.create({ profile: { alignItems: 'center', backgroundColor: '#F8F7FA', borderRadius: 16, flexDirection: 'row', gap: 12, marginBottom: 20, padding: 15 }, avatar: { alignItems: 'center', backgroundColor: colors.ink, borderRadius: 25, height: 46, justifyContent: 'center', width: 46 }, initials: { color: '#FFF', fontWeight: '600' }, name: { color: colors.ink, fontSize: 13, fontWeight: '600' }, email: { color: colors.muted, fontSize: 10, marginTop: 5 }, option: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, paddingVertical: 17 }, optionText: { color: colors.ink, fontSize: 12 }, arrow: { color: colors.muted, fontSize: 20 } });
