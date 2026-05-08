import { useState, useEffect } from 'react';
import { invoicesAPI, ordersAPI } from '../api';
import type { Invoice, Order } from '../types';

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ order_id: '', tax_rate: '0.10' });
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const params = filterStatus ? { status_filter: filterStatus } : {};
      const [invRes, ordRes] = await Promise.all([invoicesAPI.getAll(params), ordersAPI.getAll({ status_filter: 'delivered' })]);
      setInvoices(invRes.data);
      setOrders(ordRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoicesAPI.create({ order_id: parseInt(form.order_id), tax_rate: parseFloat(form.tax_rate) });
      resetForm();
      loadData();
    } catch { alert('Error al crear factura'); }
  };

  const resetForm = () => { setForm({ order_id: '', tax_rate: '0.10' }); setShowForm(false); };

  const getStatusColor = (status: string) => ({ pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700' }[status] || 'bg-gray-100');

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white/80 p-6">Cargando...</div>;

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facturas</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nueva Factura</button>
      </div>

      <div className="mb-4 flex gap-2">
        {['', 'pending', 'paid', 'cancelled'].map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); loadData(); }}
            className={`px-3 py-1 rounded text-sm ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {s || 'Todos'}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <select value={form.order_id} onChange={e => setForm({...form, order_id: e.target.value})} className="border p-2 rounded" required>
              <option value="">Seleccionar pedido...</option>
              {orders.map(o => <option key={o.id} value={o.id}>Pedido #{o.id} - Mesa {o.table_number} - S/. {o.total}</option>)}
            </select>
            <input placeholder="Tasa de impuesto" type="number" step="0.01" value={form.tax_rate} onChange={e => setForm({...form, tax_rate: e.target.value})} className="border p-2 rounded" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Crear Factura</button>
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr><th className="p-3 text-left">Nro Factura</th><th className="p-3 text-left">Pedido</th><th className="p-3 text-left">Subtotal</th><th className="p-3 text-left">Impuesto</th><th className="p-3 text-left">Total</th><th className="p-3 text-left">Estado</th><th className="p-3 text-left">Acciones</th></tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-t">
                <td className="p-3 font-mono">{inv.invoice_number}</td>
                <td className="p-3">#{inv.order_id}</td>
                <td className="p-3">S/. {inv.subtotal}</td>
                <td className="p-3">S/. {inv.tax}</td>
                <td className="p-3 font-bold">S/. {inv.total}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-sm ${getStatusColor(inv.status)}`}>{inv.status}</span></td>
                <td className="p-3">
                  {inv.status === 'pending' && <><button onClick={() => invoicesAPI.markPaid(inv.id).then(loadData)} className="text-green-600 mr-2">Pagar</button><button onClick={() => invoicesAPI.cancel(inv.id).then(loadData)} className="text-red-600">Cancelar</button></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p className="p-4 text-center text-gray-500">No hay facturas</p>}
      </div>
    </div>
  );
}
