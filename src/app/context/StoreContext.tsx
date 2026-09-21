import { createContext, ReactNode, useContext, useState } from 'react';

export type CustomerProfile = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cep: string;
  numero: string;
  bairro: string;
  cidade: string;
};

type StoreContextData = {
  favorites: string[];
  cart: string[];
  customerProfile: CustomerProfile | null;
  toggleFavorite: (productId: string) => void;
  toggleCart: (productId: string) => void;
  createCustomerProfile: (profile: CustomerProfile) => void;
};

const StoreContext = createContext<StoreContextData | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) { /*fa/ca/pe/ca */
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);

  function toggleFavorite(productId: string) {
    setFavorites((items) =>
      items.includes(productId)
        ? items.filter((id) => id !== productId)
        : [...items, productId]
    );
  }

  function toggleCart(productId: string) {
    setCart((items) =>
      items.includes(productId)
        ? items.filter((id) => id !== productId)
        : [...items, productId]
    );
  }

  function createCustomerProfile(profile: CustomerProfile) {
    setCustomerProfile(profile);
  }

  return (
    <StoreContext.Provider value={{ favorites, cart, customerProfile, toggleFavorite, toggleCart, createCustomerProfile }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore deve ser usado dentro de StoreProvider');
  }

  return store;
}
