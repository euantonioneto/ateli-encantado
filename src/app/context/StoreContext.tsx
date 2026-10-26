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
  authReady: boolean;
  productsReady: boolean;
  favorites: string[];
  cart: CartItem[];
  customerProfile: CustomerProfile | null;
  authRole: AuthRole | null;
  loginAdmin: (email: string, password: string) => boolean;
  loginCustomer: (email: string, password: string) => boolean;
  registerCustomer: (profile: CustomerProfile, password: string) => void;
  logout: () => void;
  products: Product[];
  addProduct: (product: NewProduct) => Promise<string>;
  updateProduct: (productId: string, changes: Partial<Omit<Product, 'id'>>) => Promise<void>;
  toggleProductPublished: (productId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
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
  createOrderFromCart: (details: CheckoutDetails) => Promise<string | null>;
  ensureCustomerConversation: (orderId?: string) => string | null;
  sendCustomerMessage: (conversationId: string, text: string) => void;
  updateCustomerProfile: (profile: CustomerProfile) => void;
  createCustomerProfile: (profile: CustomerProfile) => void;
  saveCustomerProfile: (profile: CustomerProfile) => Promise<void>;
};

export type CartItem = { productId: string; type: ProductType; quantity: number; customization: string };
export type CheckoutDetails = { delivery: string; deliveryMode: 'Entrega' | 'Retirada'; deliveryFee?: number | null; deliveryEstimate?: string; customization: string; paymentMethod: string; customerName: string; customerEmail: string; customerPhone: string };

const StoreContext = createContext<StoreContextData | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) { /*fa/ca/pe/ca */
  const [storeReady, setStoreReady] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [productsReady, setProductsReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  const [customerCredentials, setCustomerCredentials] = useState<{ email: string; password: string } | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [conversations, setConversations] = useState<AdminConversation[]>(initialConversations);

  useEffect(() => { setProductsReady(true); }, []);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('atelie-store-v1').then((raw) => {
      if (raw && mounted) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.conversations)) setConversations(saved.conversations);
        if (Array.isArray(saved.products)) setProducts(saved.products);
        if (Array.isArray(saved.orders)) setOrders(saved.orders);
        if (saved.customerCredentials) setCustomerCredentials(saved.customerCredentials);
        if (saved.authRole === 'adm' || saved.authRole === 'cliente') setAuthRole(saved.authRole);
        if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
        if (Array.isArray(saved.cart)) setCart(saved.cart);
        if (saved.customerProfile && typeof saved.customerProfile === 'object') setCustomerProfile(saved.customerProfile);
      }
    }).catch(() => {
      // Keep the in-memory defaults available if local storage cannot be read.
    }).finally(() => { if (mounted) { setStoreReady(true); setAuthReady(true); setProductsReady(true); } });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!storeReady) return;
    AsyncStorage.setItem('atelie-store-v1', JSON.stringify({ conversations, products, orders, favorites, cart, customerProfile, customerCredentials, authRole })).catch(() => {
      // Storage failures do not block the current session; callers still see the live state.
    });
  }, [storeReady, conversations, products, orders, favorites, cart, customerProfile, customerCredentials, authRole]);

  async function addProduct(product: NewProduct) {
    const id = product.id ?? `produto-${Date.now()}`;
    setProducts((items) => [{ ...product, id }, ...items]);
    return id;
  }

  async function updateProduct(productId: string, changes: Partial<Omit<Product, 'id'>>) {
    const current = products.find((item) => item.id === productId);
    if (!current) throw new Error('Produto não encontrado.');
    setProducts((items) => items.map((item) => item.id === productId ? { ...item, ...changes } : item));
  }

  async function toggleProductPublished(productId: string) {
    const current = products.find((item) => item.id === productId);
    if (!current) return;
    await updateProduct(productId, { publicado: !current.publicado });
  }

  async function deleteProduct(productId: string) {
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

  async function createOrderFromCart(details: CheckoutDetails): Promise<string | null> {
    if (!cart.length) return null;
    const validItems = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const unitPrice = product?.precosPorTipo?.[item.type] ?? product?.preco;
      if (!product?.publicado || !(product.tiposDisponiveis?.length ? product.tiposDisponiveis : productTypes).includes(item.type) || unitPrice == null || unitPrice <= 0 || item.quantity < 1 || item.quantity > 99) return null;
      return { ...item, product, unitPrice };
    });
    if (validItems.some((item) => !item)) return null;

    const items = validItems as Array<CartItem & { product: Product; unitPrice: number }>;
    const notes = [details.customization.trim(), ...items.filter((item) => item.customization.trim()).map((item) => `${item.product.nome} (${item.type}): ${item.customization.trim()}`)].filter(Boolean).join('\n');
    const now = new Date().toISOString();
    const orderId = `pedido-${Date.now()}`;
    const savedItems: OrderItem[] = items.map((item) => ({ productId: item.productId, type: item.type, quantity: item.quantity, unitPrice: item.unitPrice, customization: item.customization, productionTime: item.product.prazoProducao }));
    const subtotal = savedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = details.deliveryMode === 'Retirada' ? 0 : details.deliveryFee ?? 0;
    const status: OrderStatus = 'Pendente';
    const order: AdminOrder = {
      id: orderId,
      productId: savedItems[0]?.productId ?? '',
      customer: details.customerName,
      customerEmail: customerProfile?.email ?? details.customerEmail,
      customerPhone: details.customerPhone,
      type: savedItems.length === 1 ? savedItems[0].type : 'Vários itens',
      items: savedItems,
      subtotal,
      deliveryFee,
      price: subtotal + deliveryFee,
      status,
      statusHistory: [{ status, at: now }],
      paymentStatus: 'Pendente',
      paymentMethod: details.paymentMethod,
      delivery: details.deliveryMode === 'Retirada' ? 'Retirada no ateliê' : details.delivery,
      deliveryEstimate: details.deliveryEstimate,
      customization: notes || 'Sem personalização informada.',
      date: new Date(now).toLocaleDateString('pt-BR'),
    };
    setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)]);
    setCart([]);
    return String(orderId);
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

  async function saveCustomerProfile(profile: CustomerProfile) {
    setCustomerProfile(profile);
  }

  function logout() {
    setAuthRole(null);
  }

  function loginAdmin(email: string, password: string) {
    if (email.trim().toLowerCase() !== 'adm@gmail.com' || password !== 'Adm') return false;
    setAuthRole('adm');
    return true;
  }

  function loginCustomer(email: string, password: string) {
    if (!customerCredentials || customerCredentials.email !== email.trim().toLowerCase() || customerCredentials.password !== password) return false;
    setAuthRole('cliente');
    return true;
  }

  function registerCustomer(profile: CustomerProfile, password: string) {
    setCustomerProfile(profile);
    setCustomerCredentials({ email: profile.email.trim().toLowerCase(), password });
    setAuthRole('cliente');
  }

  return (
    <StoreContext.Provider value={{ storeReady, authReady, productsReady, favorites, cart, customerProfile, authRole, loginAdmin, loginCustomer, registerCustomer, logout, products, addProduct, updateProduct, toggleProductPublished, deleteProduct, orders, updateOrderStatus, confirmOrderPayment, cancelOrder, conversations, sendAdminMessage, markConversationRead, sendCustomerMessage, ensureCustomerConversation, toggleFavorite, addCartItem, updateCartQuantity, updateCartCustomization, removeCartItem, createOrderFromCart, updateCustomerProfile, createCustomerProfile, saveCustomerProfile }}>
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
