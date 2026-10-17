export type OrderStatus = 'Pendente' | 'Em produção' | 'Pronto' | 'Entregue' | 'Cancelado';

export type AdminOrder = {
  id: string;
  productId: string;
  customer: string;
  type: string;
  price: number;
  status: OrderStatus;
  paymentStatus: 'Pendente' | 'Pago';
  delivery: string;
  customization: string;
  date: string;
  cancellationReason?: string;
  items?: OrderItem[];
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod?: string;
  statusHistory?: OrderStatusEvent[];
  subtotal?: number;
  deliveryFee?: number | null;
  deliveryEstimate?: string;
};

export type OrderItem = {
  productId: string;
  type: string;
  quantity: number;
  unitPrice: number;
  customization?: string;
  productionTime?: string;
};

export type OrderStatusEvent = { status: OrderStatus; at: string };

export type ChatMessage = { id: string; author: 'cliente' | 'adm'; text: string; time: string };
export type AdminConversation = { id: string; customer: string; customerEmail?: string; initials: string; preview: string; time: string; messages: ChatMessage[]; relatedOrderId?: string; unreadByAdmin?: boolean };

// No data is seeded: orders and conversations are created as real flows are connected.
export const initialOrders: AdminOrder[] = [];
export const initialConversations: AdminConversation[] = [];
