import { Stack } from 'expo-router';
import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from './context/StoreContext';
import { useStore } from './context/StoreContext';

function AuthGate({ children }: { children: ReactNode }) {
  const { authRole, storeReady } = useStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const firstSegment = segments[0] as string | undefined;

  useEffect(() => {
    if (!navigationState?.key || !storeReady) return;
    const inAdmin = firstSegment === 'telas-adm';
    const publicAdminRoute = inAdmin && ['RecuperarSenha', 'EmailEnviado'].includes(segments[1] as string);
    const inCustomer = firstSegment === 'telas-cliente';
    const inLogin = firstSegment === 'loguin';

    if (!authRole && ((inAdmin && !publicAdminRoute) || inCustomer)) router.replace('/loguin');
    else if (authRole === 'adm' && (inCustomer || inLogin)) router.replace('/telas-adm/Dashboard');
    else if (authRole === 'cliente' && (inAdmin || inLogin)) router.replace('/telas-cliente/home');
  }, [authRole, firstSegment, navigationState?.key, router, storeReady]);

  return children;
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <AuthGate>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </AuthGate>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
