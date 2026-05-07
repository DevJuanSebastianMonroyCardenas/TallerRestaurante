export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number | null;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
}

export interface Table {
  id: number;
  table_number: number;
  capacity: number;
  is_available: boolean;
}

export interface OrderItem {
  id?: number;
  menu_item_id: number;
  quantity: number;
  unit_price?: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  table_number: number;
  customer_name: string | null;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface Reservation {
  id: number;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  table_id: number | null;
  reservation_date: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  order_id: number;
  subtotal: number;
  tax: number;
  total: number;
  payment_method: string | null;
  status: string;
  created_at: string;
}
