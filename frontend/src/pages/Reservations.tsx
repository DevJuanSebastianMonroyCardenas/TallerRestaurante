import { useState, useEffect } from 'react';
import { reservationsAPI, tablesAPI } from '../api';
import type { Reservation, Table } from '../types';

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '', table_id: '', reservation_date: '', duration_minutes: 120, notes: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [resRes, tablesRes] = await Promise.all([reservationsAPI.getAll(), tablesAPI.getAll({ available_only: true })]);
      setReservations(resRes.data);
      setTables(tablesRes.data);
    } catch { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, table_id: form.table_id ? parseInt(form.table_id) : null };
      if (editId) { await reservationsAPI.update(editId, data); }
      else { await reservationsAPI.create(data); }
      resetForm();
      loadData();
    } catch { alert('Error'); }
  };

  const resetForm = () => { setForm({ customer_name: '', customer_phone: '', customer_email: '', table_id: '', reservation_date: '', duration_minutes: 120, notes: '' }); setEditId(null); setShowForm(false); };

  const handleEdit = (r: Reservation) => {
    setForm({ customer_name: r.customer_name, customer_phone: r.customer_phone || '', customer_email: r.customer_email || '', table_id: r.table_id ? String(r.table_id) : '', reservation_date: r.reservation_date.slice(0, 16), duration_minutes: r.duration_minutes, notes: r.notes || '' });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => { if (confirm('¿Eliminar?')) { await reservationsAPI.delete(id); loadData(); } };

  const getStatusColor = (status: string) => ({ confirmed: 'bg-green-100 text-green-700', seated: 'bg-blue-100 text-blue-700', completed: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700', no_show: 'bg-yellow-100 text-yellow-700' }[status] || 'bg-gray-100');

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservaciones</h1>
        <button onClick={resetForm} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nueva Reservación</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Nombre" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="border p-2 rounded" required />
            <input placeholder="Teléfono" value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} className="border p-2 rounded" />
            <input placeholder="Email" type="email" value={form.customer_email} onChange={e => setForm({...form, customer_email: e.target.value})} className="border p-2 rounded" />
            <input placeholder="Fecha y hora" type="datetime-local" value={form.reservation_date} onChange={e => setForm({...form, reservation_date: e.target.value})} className="border p-2 rounded" required />
            <select value={form.table_id} onChange={e => setForm({...form, table_id: e.target.value})} className="border p-2 rounded">
              <option value="">Sin mesa asignada</option>
              {tables.map(t => <option key={t.id} value={t.id}>Mesa {t.table_number} (Cap: {t.capacity})</option>)}
            </select>
            <input placeholder="Duración (minutos)" type="number" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: parseInt(e.target.value)})} className="border p-2 rounded" />
            <input placeholder="Notas" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="border p-2 rounded" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map(r => (
          <div key={r.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{r.customer_name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(r.status)}`}>{r.status}</span>
            </div>
            <p className="text-gray-600">{r.customer_phone || '-'}</p>
            <p className="text-gray-600">{r.customer_email || '-'}</p>
            <p className="mt-2">{new Date(r.reservation_date).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Duración: {r.duration_minutes} min</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => handleEdit(r)} className="text-blue-600 text-sm">Editar</button>
              {r.status === 'confirmed' && <button onClick={() => reservationsAPI.update(r.id, { status: 'seated' }).then(loadData)} className="text-green-600 text-sm">Sentar</button>}
              {r.status === 'seated' && <button onClick={() => reservationsAPI.update(r.id, { status: 'completed' }).then(loadData)} className="text-gray-600 text-sm">Completar</button>}
              {r.status !== 'cancelled' && r.status !== 'completed' && <button onClick={() => reservationsAPI.cancel(r.id).then(loadData)} className="text-red-600 text-sm">Cancelar</button>}
              <button onClick={() => handleDelete(r.id)} className="text-red-600 text-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {reservations.length === 0 && <p className="text-center text-gray-500">No hay reservaciones</p>}
    </div>
  );
}
