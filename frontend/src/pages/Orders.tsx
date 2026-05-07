import { useState, useEffect } from 'react';
import { ordersAPI, menuItemsAPI, tablesAPI } from '../api';
import type { Order, MenuItem } from '../types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ table_number: '', customer_name: '', items: [{ menu_item_id: 0, quantity: 1 }] });
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const params = filterStatus ? { status_filter: filterStatus } : {};
      const [ordersRes, itemsRes] = await Promise.all([ordersAPI.getAll(params), menuItemsAPI.getAll({ available_only: true })]);
      setOrders(ordersRes.data);
      setMenuItems(itemsRes.data);
    } catch { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, table_number: parseInt(form.table_number), items: form.items.filter(i => i.menu_item_id > 0) };
      await ordersAPI.create(data);
      resetForm();
      loadData();
    } catch { alert('Error al crear pedido'); }
  };

  const resetForm = () => {
    setForm({ table_number: '', customer_name: '', items: [{ menu_item_id: 0, quantity: 1 }] });
    setShowForm(false);
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { menu_item_id: 0, quantity: 1 }] });

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: field === 'menu_item_id' ? parseInt(value) : parseInt(value) };
    setForm({ ...form, items: newItems });
  };

  const removeItem = (index: number) => {
    if (form.items.length > 1) setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const updateStatus = async (id: number, status: string) => {
    await ordersAPI.updateStatus(id, status);
    loadData();
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo Pedido</button>
      </div>

      <div className="mb-4 flex gap-2">
        {['', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); loadData(); }}
            className={`px-3 py-1 rounded text-sm ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {s || 'Todos'}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input placeholder="Número de mesa" type="number" value={form.table_number} onChange={e => setForm({...form, table_number: e.target.value})} className="border p-2 rounded" required />
            <input placeholder="Nombre del cliente" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="border p-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Items</label>
            {form.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select value={item.menu_item_id} onChange={e => updateItem(index, 'menu_item_id', e.target.value)} className="border p-2 rounded flex-1">
                  <option value={0}>Seleccionar...</option>
                  {menuItems.map(m => <option key={m.id} value={m.id}>{m.name} - S/. {m.price}</option>)}
                </select>
                <input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} className="border p-2 rounded w-20" />
                {form.items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-red-600">X</button>}
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-blue-600 text-sm">+ Agregar item</button>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Crear Pedido</button>
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">Pedido #{order.id}</h3>
              <span className={`px-2 py-1 rounded text-sm ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>{order.status}</span>
            </div>
            <p className="text-gray-600">Mesa {order.table_number}</p>
            <p className="text-gray-600">{order.customer_name || 'Sin nombre'}</p>
            <p className="text-lg font-bold mt-2">Total: S/. {order.total}</p>
            <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {order.status === 'pending' && <button onClick={() => updateStatus(order.id, 'confirmed')} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Confirmar</button>}
              {order.status === 'confirmed' && <button onClick={() => updateStatus(order.id, 'preparing')} className="text-xs bg-orange-600 text-white px-2 py-1 rounded">Preparar</button>}
              {order.status === 'preparing' && <button onClick={() => updateStatus(order.id, 'ready')} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Listo</button>}
              {order.status === 'ready' && <button onClick={() => updateStatus(order.id, 'delivered')} className="text-xs bg-gray-600 text-white px-2 py-1 rounded">Entregado</button>}
              {order.status !== 'delivered' && order.status !== 'cancelled' && <button onClick={() => ordersAPI.cancel(order.id).then(loadData)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Cancelar</button>}
            </div>
          </div>
        ))}
      </div>
      {orders.length === 0 && <p className="text-center text-gray-500">No hay pedidos</p>}
    </div>
  );
}
