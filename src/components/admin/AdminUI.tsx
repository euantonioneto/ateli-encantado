import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { router } from 'expo-router';

export const colors = { ink: '#19182D', purple: '#625CDE', pale: '#F1F0FF', muted: '#858493', line: '#ECEBF1', bg: '#FFFFFF', green: '#328466', red: '#D05252' };

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return <SafeAreaView style={ui.safe} edges={['top']}>
    {scroll ? <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">{children}</ScrollView> : <View style={ui.content}>{children}</View>}
  </SafeAreaView>;
}

export function Header({ title, subtitle, back = false, right }: { title: string; subtitle?: string; back?: boolean; right?: ReactNode }) {
  return <View style={ui.header}>
    {back && <TouchableOpacity onPress={() => router.back()} style={ui.back}><Text style={ui.backText}>‹</Text></TouchableOpacity>}
    <View style={{ flex: 1 }}><Text style={ui.title}>{title}</Text>{subtitle ? <Text style={ui.subtitle}>{subtitle}</Text> : null}</View>{right}
  </View>;
}

export function Button({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <TouchableOpacity disabled={disabled} onPress={onPress} style={[ui.button, secondary && ui.buttonSecondary, disabled && { opacity: 0.45 }]}>
    <Text style={[ui.buttonText, secondary && ui.buttonSecondaryText]}>{title}</Text>
  </TouchableOpacity>;
}

export function Field({ label, value, onChangeText, placeholder, multiline = false, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: 'default' | 'numeric' | 'email-address' }) {
  return <View style={ui.field}><Text style={ui.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A7A6B1" multiline={multiline} keyboardType={keyboardType} style={[ui.input, multiline && ui.multiline]} /></View>;
}

export function Panel({ children, style }: { children: ReactNode; style?: ViewStyle }) { return <View style={[ui.panel, style]}>{children}</View>; }
export function SectionTitle({ children, action }: { children: string; action?: string }) { return <View style={ui.section}><Text style={ui.sectionTitle}>{children}</Text>{action ? <Text style={ui.action}>{action}</Text> : null}</View>; }
export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) { return <TouchableOpacity onPress={onPress} style={[ui.chip, active && ui.chipActive]}><Text style={[ui.chipText, active && ui.chipTextActive]}>{label}</Text></TouchableOpacity>; }
export function formatMoney(value: number) { return `R$ ${value.toFixed(2).replace('.', ',')}`; }

const ui = StyleSheet.create({
  safe: { backgroundColor: colors.bg, flex: 1 }, content: { padding: 22, paddingBottom: 32 }, header: { alignItems: 'center', flexDirection: 'row', gap: 8, marginBottom: 22, minHeight: 44 },
  back: { alignItems: 'center', height: 36, justifyContent: 'center', width: 30 }, backText: { color: colors.ink, fontSize: 34, lineHeight: 36 },
  title: { color: colors.ink, fontFamily: 'serif', fontSize: 23, fontWeight: '600' }, subtitle: { color: colors.muted, fontSize: 12, marginTop: 3 },
  button: { alignItems: 'center', backgroundColor: colors.ink, borderRadius: 18, justifyContent: 'center', minHeight: 46, paddingHorizontal: 18 }, buttonText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  buttonSecondary: { backgroundColor: '#F2F1F5' }, buttonSecondaryText: { color: colors.ink },
  field: { marginBottom: 14 }, fieldLabel: { color: colors.ink, fontSize: 12, marginBottom: 6 }, input: { backgroundColor: '#FFF', borderColor: colors.line, borderRadius: 13, borderWidth: 1, color: colors.ink, fontSize: 13, minHeight: 42, paddingHorizontal: 13 }, multiline: { minHeight: 90, paddingTop: 12, textAlignVertical: 'top' },
  panel: { backgroundColor: '#FFF', borderColor: colors.line, borderRadius: 17, borderWidth: 1, marginBottom: 12, padding: 14 }, section: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 11, marginTop: 8 }, sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '600' }, action: { color: colors.purple, fontSize: 11 },
  chip: { backgroundColor: '#F3F2F6', borderRadius: 17, paddingHorizontal: 13, paddingVertical: 8 }, chipActive: { backgroundColor: colors.ink }, chipText: { color: colors.ink, fontSize: 11 }, chipTextActive: { color: '#FFF' },
});
