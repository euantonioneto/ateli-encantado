import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { initialProducts, NewProduct, Product, ProductType, productTypes } from '../../data/catalog';
import { AdminConversation, AdminOrder, initialConversations, initialOrders, OrderItem, OrderStatus } from '../../data/admin';

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

export type AuthRole = 'cliente' | 'adm';

type StoreContextData = {
  storeReady: boolean;
  favorites: string[];
  cart: CartItem[];
  customerProfile: CustomerProfile | null;
  authRole: AuthRole | null;
  login: (role: AuthRole) => void;
  logout: () => void;
  products: Product[];
  addProduct: (product: NewProduct) => string;
  updateProduct: (productId: string, changes: Partial<Omit<Product, 'id'>>) => void;
  toggleProductPublished: (productId: string) => void;
  deleteProduct: (productId: string) => void;
  orders: AdminOrder[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  confirmOrderPayment: (orderId: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  conversations: AdminConversation[];
  sendAdminMessage: (conversationId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  toggleFavorite: (productId: string) => void;
  addCartItem: (productId: string, type: ProductType, quantity?: number) => void;
  updateCartQuantity: (productId: string, type: ProductType, quantity: number) => void;
  updateCartCustomization: (productId: string, type: ProductType, customization: string) => void;
  removeCartItem: (productId: string, type: ProductType) => void;
  createOrderFromCart: (details: CheckoutDetails) => string | null;
  ensureCustomerConversation: (orderId?: string) => string | null;
  sendCustomerMessage: (conversationId: string, text: string) => void;
  updateCustomerProfile: (profile: CustomerProfile) => void;
  createCustomerProfile: (profile: CustomerProfile) => void;
};

export type CartItem = { productId: string; type: ProductType; quantity: number; customization: string };
export type CheckoutDetails = { delivery: string; deliveryFee?: number | null; deliveryEstimate?: string; customization: string; paymentMethod: string; customerName: string; customerEmail: string; customerPhone: string };

const StoreContext = createContext<StoreContextData | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) { /*fa/ca/pe/ca */
  const [storeReady, setStoreReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [conversations, setConversations] = useState<AdminConversation[]>(initialConversations);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('atelie-store-v1').then((raw) => {
      if (raw && mounted) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.products)) setProducts(saved.products);
        if (Array.isArray(saved.orders)) setOrders(saved.orders);
        if (Array.isArray(saved.conversations)) setConversations(saved.conversations);
        if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
        if (Array.isArray(saved.cart)) setCart(saved.cart);
        if (saved.customerProfile && typeof saved.customerProfile === 'object') setCustomerProfile(saved.customerProfile);
      }
    }).catch(() => {
      // Keep the in-memory defaults available if local storage cannot be read.
    }).finally(() => { if (mounted) setStoreReady(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!storeReady) return;
    AsyncStorage.setItem('atelie-store-v1', JSON.stringify({ products, orders, conversations, favorites, cart, customerProfile })).catch(() => {
      // Storage failures do not block the current session; callers still see the live state.
    });
  }, [storeReady, products, orders, conversations, favorites, cart, customerProfile]);

  function addProduct(product: NewProduct) {
    const id = product.id ?? `produto-${Date.now()}`;
    setProducts((items) => [...items, { ...product, id }]);
    return id;
  }

  function updateProduct(productId: string, changes: Partial<Omit<Product, 'id'>>) {
    setProducts((items) => items.map((product) => product.id === productId ? { ...product, ...changes } : product));
  }

  function toggleProductPublished(productId: string) {
    setProducts((items) => items.map((product) => product.id === productId ? { ...product, publicado: !product.publicado } : product));
  }

  function deleteProduct(productId: string) {
    setProducts((items) => items.filter((product) => product.id !== productId));
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = { Pendente: 'Em produ\u00e7\u00e3o', ['Em produ\u00e7\u00e3o']: 'Pronto', Pronto: 'Entregue' };
    setOrders((items) => items.map((order) => {
      if (order.id !== orderId || nextStatus[order.status] !== status) return order;
      return { ...order, status, statusHistory: [...(order.statusHistory ?? []), { status, at: new Date().toISOString() }] };
    }));
  }

  function confirmOrderPayment(orderId: string) {
    setOrders((items) => items.map((order) => order.id === orderId && order.status !== 'Cancelado' ? { ...order, paymentStatus: 'Pago' } : order));
  }

  function cancelOrder(orderId: string, reason: string) {
    setOrders((items) => items.map((order) => {
      if (order.id !== orderId || ['Cancelado', 'Entregue'].includes(order.status) || !reason.trim()) return order;
      return { ...order, status: 'Cancelado', cancellationReason: reason, statusHistory: [...(order.statusHistory ?? []), { status: 'Cancelado', at: new Date().toISOString() }] };
    }));
  }

  function addCartItem(productId: string, type: ProductType, quantity = 1) {
    const product = products.find((entry) => entry.id === productId);
    if (!product?.publicado || quantity < 1 || !Number.isInteger(quantity) || !(product.tiposDisponiveis?.length ? product.tiposDisponiveis : productTypes).includes(type)) return;
    setCart((items) => {
      const existing = items.find((item) => item.productId === productId && item.type === type);
      if (existing) return items.map((item) => item === existing ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item);
      return [...items, { productId, type, quantity, customization: '' }];
    });
  }

  function updateCartQuantity(productId: string, type: ProductType, quantity: number) {
    if (quantity <= 0) { removeCartItem(productId, type); return; }
    const safeQuantity = Math.min(99, Math.floor(quantity));
    setCart((items) => items.map((item) => item.productId === productId && item.type === type ? { ...item, quantity: safeQuantity } : item));
  }

  function removeCartItem(productId: string, type: ProductType) {
    setCart((items) => items.filter((item) => item.productId !== productId || item.type !== type));
  }

  function updateCartCustomization(productId: string, type: ProductType, customization: string) {
    setCart((items) => items.map((item) => item.productId === productId && item.type === type ? { ...item, customization } : item));
  }

  function createOrderFromCart(details: CheckoutDetails) {
    if (!cart.length) return null;
    const resolvedItems = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const unitPrice = product?.precosPorTipo?.[item.type] ?? product?.preco;
      if (!product?.publicado || !(product.tiposDisponiveis?.length ? product.tiposDisponiveis : productTypes).includes(item.type) || unitPrice == null || unitPrice <= 0 || item.quantity < 1 || item.quantity > 99) return null;
      return { productId: item.productId, type: item.type, quantity: item.quantity, unitPrice, customization: item.customization.trim(), productionTime: product.prazoProducao };
    });
    if (!resolvedItems.length || resolvedItems.some((item) => !item)) return null;
    const orderItems = resolvedItems as OrderItem[];
    const firstItem = orderItems[0];
    const now = new Date();
    const id = `PED-${now.getTime().toString().slice(-7)}`;
    const date = now.toLocaleDateString('pt-BR');
    const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const order: AdminOrder = {
      id,
      productId: firstItem.productId,
      customer: details.customerName,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      type: orderItems.length === 1 ? firstItem.type : 'Vários itens',
      subtotal: total,
      deliveryFee: details.deliveryFee ?? null,
      price: total + (details.deliveryFee ?? 0),
      status: 'Pendente',
      statusHistory: [{ status: 'Pendente', at: now.toISOString() }],
      paymentStatus: 'Pendente',
      paymentMethod: details.paymentMethod,
      delivery: details.delivery,
      deliveryEstimate: details.deliveryEstimate,
      customization: details.customization.trim() || 'Sem personalização informada.',
      date,
      items: orderItems,
    };
    setOrders((items) => [order, ...items]);
    setCart([]);
    return id;
  }

  function sendAdminMessage(conversationId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setConversations((items) => items.map((conversation) => conversation.id === conversationId
      ? { ...conversation, preview: trimmed, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), unreadByAdmin: false, messages: [...conversation.messages, { id: `msg-${Date.now()}`, author: 'adm', text: trimmed, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }] }
      : conversation));
  }

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((items) => items.map((conversation) => conversation.id === conversationId ? { ...conversation, unreadByAdmin: false } : conversation));
  }, []);

  const ensureCustomerConversation = useCallback((orderId?: string) => {
    const email = customerProfile?.email.trim().toLowerCase() || 'cliente-local';
    const existing = conversations.find((item) => item.customerEmail?.toLowerCase() === email);
    if (existing) {
      if (orderId && existing.relatedOrderId !== orderId) setConversations((items) => items.map((conversation) => conversation.id === existing.id ? { ...conversation, relatedOrderId: orderId } : conversation));
      return existing.id;
    }
    const id = `chat-${Date.now()}`;
    const customerName = customerProfile?.nome ?? 'Cliente';
    const initials = customerName.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    setConversations((items) => [{ id, customer: customerName, customerEmail: email, initials, preview: 'Conversa iniciada', time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), messages: [], ...(orderId ? { relatedOrderId: orderId } : {}) }, ...items]);
    return id;
  }, [customerProfile, conversations]);

  function sendCustomerMessage(conversationId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setConversations((items) => items.map((conversation) => conversation.id === conversationId
      ? { ...conversation, preview: trimmed, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), unreadByAdmin: true, messages: [...conversation.messages, { id: `msg-${Date.now()}`, author: 'cliente', text: trimmed, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }] }
      : conversation));
  }

  function toggleFavorite(productId: string) {
    setFavorites((items) =>
      items.includes(productId)
        ? items.filter((id) => id !== productId)
        : [...items, productId]
    );
  }

  function createCustomerProfile(profile: CustomerProfile) {
    setCustomerProfile(profile);
  }

  function updateCustomerProfile(profile: CustomerProfile) {
    setCustomerProfile(profile);
  }

  function login(role: AuthRole) {
    setAuthRole(role);
  }

  function logout() {
    setAuthRole(null);
  }

  return (
    <StoreContext.Provider value={{ storeReady, favorites, cart, customerProfile, authRole, login, logout, products, addProduct, updateProduct, toggleProductPublished, deleteProduct, orders, updateOrderStatus, confirmOrderPayment, cancelOrder, conversations, sendAdminMessage, markConversationRead, sendCustomerMessage, ensureCustomerConversation, toggleFavorite, addCartItem, updateCartQuantity, updateCartCustomization, removeCartItem, createOrderFromCart, updateCustomerProfile, createCustomerProfile }}>
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
