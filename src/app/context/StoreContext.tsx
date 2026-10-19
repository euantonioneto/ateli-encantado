import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { initialProducts, NewProduct, Product, ProductType, productTypes, productCategories } from '../../data/catalog';
import { AdminConversation, AdminOrder, initialConversations, initialOrders, OrderItem, OrderStatus } from '../../data/admin';
import { DELIVERY_ESTIMATE } from '../../data/delivery-config';
import { supabase } from '../lib/supabase';

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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [conversations, setConversations] = useState<AdminConversation[]>(initialConversations);

  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const role = session?.user.app_metadata?.role;
      setAuthRole(session ? (role === 'admin' || role === 'adm' ? 'adm' : 'cliente') : null);
      setAuthReady(true);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (!error) {
        const role = data.session?.user.app_metadata?.role;
        setAuthRole(data.session ? (role === 'admin' || role === 'adm' ? 'adm' : 'cliente') : null);
      }
      setAuthReady(true);
    }).catch(() => {
      if (mounted) {
        setAuthRole(null);
        setAuthReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    let mounted = true;
    setProductsReady(false);

    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('id,nome,descricao,preco,publicado,destaque,prazo_producao,opcoes,imagem_url,categorias!inner(slug)')
          .order('criado_em', { ascending: false });
        if (error) throw error;

        const loaded: Product[] = (data ?? []).flatMap((raw: any) => {
          const categoryRow = Array.isArray(raw.categorias) ? raw.categorias[0] : raw.categorias;
          const category = productCategories.find((item) => item.id === categoryRow?.slug);
          if (!category) return [];
          const options = raw.opcoes && typeof raw.opcoes === 'object' ? raw.opcoes : {};
          const configuredTypes = Array.isArray(options.tiposDisponiveis)
            ? options.tiposDisponiveis.filter((type: unknown): type is ProductType => productTypes.includes(type as ProductType))
            : [];
          const configuredPrices = options.precosPorTipo && typeof options.precosPorTipo === 'object'
            ? options.precosPorTipo as Partial<Record<ProductType, number>>
            : {};
          const types = configuredTypes.length ? configuredTypes : ['Completo' as ProductType];
          const prices = Object.keys(configuredPrices).length ? configuredPrices : { Completo: Number(raw.preco) };

          return [{
            id: raw.id,
            nome: raw.nome,
            descricao: raw.descricao ?? '',
            preco: Number(raw.preco),
            categoria: category.id,
            imagem: raw.imagem_url ? { uri: raw.imagem_url } : category.image,
            publicado: Boolean(raw.publicado),
            destaque: Boolean(raw.destaque),
            prazoProducao: raw.prazo_producao ?? undefined,
            tiposDisponiveis: types,
            precosPorTipo: prices,
          }];
        });

        if (mounted) setProducts(loaded);
      } catch (error) {
        console.error('Não foi possível carregar os produtos do Supabase:', error);
      } finally {
        if (mounted) setProductsReady(true);
      }
    }

    void loadProducts();
    return () => { mounted = false; };
  }, [authReady, authRole]);

  useEffect(() => {
    if (!authReady) return;
    let mounted = true;

    async function loadCustomerOrders() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        if (mounted) setOrders([]);
        return;
      }

      const [{ data, error }, { data: profile }] = await Promise.all([
        supabase.from('pedidos')
          .select('id,status,subtotal,frete,total,forma_entrega,endereco_entrega,forma_pagamento,observacoes,criado_em,itens_pedido(produto_id,nome_produto,opcao,customizacao,quantidade,preco_unitario)')
          .order('criado_em', { ascending: false }),
        supabase.from('perfis').select('nome,telefone').eq('id', user.id).maybeSingle(),
      ]);
      if (error) {
        console.error('Não foi possível carregar os pedidos do Supabase:', error);
        return;
      }

      const loaded: AdminOrder[] = (data ?? []).map((row: any) => {
        const items: OrderItem[] = (row.itens_pedido ?? []).map((item: any) => ({
          productId: item.produto_id,
          type: item.opcao,
          quantity: Number(item.quantidade),
          unitPrice: Number(item.preco_unitario),
          customization: item.customizacao ?? '',
        }));
        const status = row.status as OrderStatus;
        const createdAt = row.criado_em ?? new Date().toISOString();
        const delivery = row.forma_entrega === 'Retirada no ateliê'
          ? 'Retirada no ateliê'
          : `${row.endereco_entrega ?? ''}`;
        return {
          id: String(row.id),
          productId: items[0]?.productId ?? '',
          customer: profile?.nome ?? user.user_metadata?.nome ?? user.email ?? 'Cliente',
          customerEmail: user.email,
          customerPhone: profile?.telefone ?? '',
          type: items.length === 1 ? items[0].type : 'Vários itens',
          items,
          price: Number(row.total),
          subtotal: Number(row.subtotal),
          deliveryFee: Number(row.frete),
          status,
          paymentStatus: 'Pendente',
          paymentMethod: row.forma_pagamento,
          delivery,
          deliveryEstimate: row.forma_entrega === 'Retirada no ateliê' ? 'A combinar na retirada' : DELIVERY_ESTIMATE,
          customization: row.observacoes ?? 'Sem personalização informada.',
          date: new Date(createdAt).toLocaleDateString('pt-BR'),
          statusHistory: [{ status, at: createdAt }],
        };
      });
      if (mounted) setOrders(loaded);
    }

    void loadCustomerOrders().catch((error) => {
      console.error('Falha ao carregar pedidos:', error);
    });
    return () => { mounted = false; };
  }, [authReady, authRole]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('atelie-store-v1').then((raw) => {
      if (raw && mounted) {
        const saved = JSON.parse(raw);
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
    AsyncStorage.setItem('atelie-store-v1', JSON.stringify({ conversations, favorites, cart, customerProfile })).catch(() => {
      // Storage failures do not block the current session; callers still see the live state.
    });
  }, [storeReady, conversations, favorites, cart, customerProfile]);

  async function saveProductImage(image: Product['imagem']) {
    if (!image || typeof image !== 'object' || Array.isArray(image)) return null;
    const uri = image.uri;
    if (!uri) return null;
    if (/^https?:\/\//i.test(uri)) return uri;

    const dataUriMatch = uri.match(/^data:([^;]+);base64,(.*)$/);
    const base64 = dataUriMatch
      ? dataUriMatch[2]
      : await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    const extension = (uri.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/)?.[1] ?? 'jpg').toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const contentType = dataUriMatch?.[1] ?? ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[extension] ?? 'image/jpeg');
    const { error } = await supabase.storage.from('produtos').upload(path, bytes.buffer, {
      contentType,
      upsert: false,
    });
    if (error) throw error;
    return supabase.storage.from('produtos').getPublicUrl(path).data.publicUrl;
  }

  async function persistProduct(product: NewProduct, productId?: string) {
    const { data: category, error: categoryError } = await supabase
      .from('categorias').select('id').eq('slug', product.categoria).single();
    if (categoryError) throw categoryError;

    const imageUrl = await saveProductImage(product.imagem);
    const row = {
      categoria_id: category.id,
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      publicado: product.publicado,
      destaque: product.destaque ?? false,
      prazo_producao: product.prazoProducao ?? null,
      imagem_url: imageUrl,
      opcoes: {
        tiposDisponiveis: product.tiposDisponiveis ?? [],
        precosPorTipo: product.precosPorTipo ?? {},
      },
    };

    const query = productId
      ? supabase.from('produtos').update(row).eq('id', productId).select('id').single()
      : supabase.from('produtos').insert(row).select('id').single();
    const { data, error } = await query;
    if (error) throw error;

    const savedProduct: Product = { ...product, id: data.id, imagem: imageUrl ? { uri: imageUrl } : product.imagem };
    setProducts((items) => productId
      ? items.map((item) => item.id === productId ? savedProduct : item)
      : [savedProduct, ...items]);
    return data.id as string;
  }

  async function addProduct(product: NewProduct) {
    return persistProduct(product);
  }

  async function updateProduct(productId: string, changes: Partial<Omit<Product, 'id'>>) {
    const current = products.find((item) => item.id === productId);
    if (!current) throw new Error('Produto não encontrado.');
    await persistProduct({ ...current, ...changes }, productId);
  }

  async function toggleProductPublished(productId: string) {
    const current = products.find((item) => item.id === productId);
    if (!current) return;
    await updateProduct(productId, { publicado: !current.publicado });
  }

  async function deleteProduct(productId: string) {
    const { error } = await supabase.from('produtos').delete().eq('id', productId);
    if (error) throw error;
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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Entre na sua conta de cliente antes de confirmar o pedido.');

    const items = validItems as Array<CartItem & { product: Product; unitPrice: number }>;
    const notes = [details.customization.trim(), ...items.filter((item) => item.customization.trim()).map((item) => `${item.product.nome} (${item.type}): ${item.customization.trim()}`)].filter(Boolean).join('\n');
    const { data: orderId, error } = await supabase.rpc('criar_pedido_cliente', {
      p_forma_entrega: details.deliveryMode === 'Retirada' ? 'Retirada no ateliê' : 'Entrega',
      p_endereco_entrega: details.deliveryMode === 'Retirada' ? null : details.delivery,
      p_forma_pagamento: details.paymentMethod,
      p_observacoes: notes || null,
      p_itens: items.map((item) => ({ produto_id: item.productId, opcao: item.type, quantidade: item.quantity, customizacao: item.customization.trim() || null })),
    });
    if (error) throw error;

    const { data: row } = await supabase.from('pedidos')
      .select('id,status,subtotal,frete,total,forma_entrega,endereco_entrega,forma_pagamento,observacoes,criado_em,itens_pedido(produto_id,nome_produto,opcao,customizacao,quantidade,preco_unitario)')
      .eq('id', orderId).single();
    const now = new Date().toISOString();
    const savedItems: OrderItem[] = row?.itens_pedido?.map((item: any) => ({
      productId: item.produto_id,
      type: item.opcao,
      quantity: Number(item.quantidade),
      unitPrice: Number(item.preco_unitario),
      customization: item.customizacao ?? '',
    })) ?? items.map((item) => ({ productId: item.productId, type: item.type, quantity: item.quantity, unitPrice: item.unitPrice, customization: item.customization, productionTime: item.product.prazoProducao }));
    const subtotal = row ? Number(row.subtotal) : savedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = row ? Number(row.frete) : details.deliveryMode === 'Retirada' ? 0 : details.deliveryFee ?? 0;
    const status = (row?.status ?? 'Pendente') as OrderStatus;
    const order: AdminOrder = {
      id: String(orderId),
      productId: savedItems[0]?.productId ?? '',
      customer: details.customerName,
      customerEmail: user.email ?? details.customerEmail,
      customerPhone: details.customerPhone,
      type: savedItems.length === 1 ? savedItems[0].type : 'Vários itens',
      items: savedItems,
      subtotal,
      deliveryFee,
      price: row ? Number(row.total) : subtotal + deliveryFee,
      status,
      statusHistory: [{ status, at: row?.criado_em ?? now }],
      paymentStatus: 'Pendente',
      paymentMethod: details.paymentMethod,
      delivery: row?.forma_entrega === 'Retirada no ateliê' ? 'Retirada no ateliê' : row?.endereco_entrega ?? details.delivery,
      deliveryEstimate: details.deliveryEstimate,
      customization: (row?.observacoes ?? notes) || 'Sem personalização informada.',
      date: new Date(row?.criado_em ?? now).toLocaleDateString('pt-BR'),
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Entre na sua conta para salvar seus dados.');

    const { error } = await supabase.from('perfis').upsert({
      id: user.id,
      nome: profile.nome,
      telefone: profile.telefone,
    }, { onConflict: 'id' });
    if (error) throw error;
    setCustomerProfile({ ...profile, email: user.email ?? profile.email });
  }

  function logout() {
    setAuthRole(null);
    void supabase.auth.signOut();
  }

  function loginAdmin(email: string, password: string) {
    if (email.trim().toLowerCase() !== 'adm@gmail.com' || password !== 'Adm') return false;
    setAuthRole('adm');
    return true;
  }

  return (
    <StoreContext.Provider value={{ storeReady, authReady, productsReady, favorites, cart, customerProfile, authRole, loginAdmin, logout, products, addProduct, updateProduct, toggleProductPublished, deleteProduct, orders, updateOrderStatus, confirmOrderPayment, cancelOrder, conversations, sendAdminMessage, markConversationRead, sendCustomerMessage, ensureCustomerConversation, toggleFavorite, addCartItem, updateCartQuantity, updateCartCustomization, removeCartItem, createOrderFromCart, updateCustomerProfile, createCustomerProfile, saveCustomerProfile }}>
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
