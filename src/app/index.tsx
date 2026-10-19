import { Redirect } from 'expo-router';
import { useStore } from './context/StoreContext';

export default function EntryRoute() {
  const { authRole, authReady, storeReady } = useStore();
  if (!storeReady || !authReady) return null;
  if (authRole === 'adm') return <Redirect href="/telas-adm/Dashboard" />;
  if (authRole === 'cliente') return <Redirect href="/telas-cliente/home" />;
  return <Redirect href="/loguin" />;
}
