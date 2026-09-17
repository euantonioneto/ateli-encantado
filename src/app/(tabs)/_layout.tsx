import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

const tabItems: Record<string, { label: string; image: ImageSourcePropType }> = {
  index: { label: 'Home', image: require('@/assets/images/inicio.png') },
  favoritos: { label: 'Favoritos', image: require('@/assets/images/favoritos.png') },
  carrinho: { label: 'Carrinho', image: require('@/assets/images/carrinho.png') },
  perfil: { label: 'Perfil', image: require('@/assets/images/perfil.png') },
};

type AppTabBarProps = {
  state: { index: number; routes: Array<{ key: string; name: string }> };
  descriptors: Record<string, { options: { tabBarAccessibilityLabel?: string } }>;
  insets: { bottom: number };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

function AppTabBar({ state, descriptors, navigation, insets }: AppTabBarProps) {
  return (
    <View style={[styles.tabBar, { height: 72 + insets.bottom, paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const item = tabItems[route.name];
        const focused = state.index === index;
        const { options } = descriptors[route.key];

        if (!item) return null;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? item.label}
            onPress={onPress}
            style={[styles.tabButton, focused && styles.tabButtonActive]}>
            <Image source={item.image} style={[styles.tabIcon, { tintColor: focused ? '#090C20' : '#A7A7A7' }]} resizeMode="contain" />
            {focused && <Text style={styles.activeLabel}>{item.label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <AppTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="carrinho" options={{ title: 'Carrinho' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { alignItems: 'center', backgroundColor: '#FFFFFF', borderTopColor: '#F3F1F3', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 34, paddingTop: 10 },
  tabButton: { alignItems: 'center', height: 48, justifyContent: 'center', minWidth: 47 },
  tabButtonActive: { backgroundColor: '#E8EBFC', borderRadius: 28, flexDirection: 'row', gap: 9, paddingHorizontal: 14 },
  tabIcon: { height: 30, width: 30 },
  activeLabel: { color: '#090C20', fontSize: 16, fontWeight: '600' },
});
