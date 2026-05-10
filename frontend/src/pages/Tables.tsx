import { useState, useEffect } from 'react';
import { tablesAPI } from '../api';
import type { Table } from '../types';

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ table_number: '', capacity: '4' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { loadTables(); }, []);

  const loadTables = async () => {
    try { const res = await tablesAPI.getAll(); setTables(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { table_number: parseInt(form.table_number), capacity: parseInt(form.capacity), is_available: true };
      if (editId) { await tablesAPI.update(editId, data); }
      else { await tablesAPI.create(data); }
      resetForm();
      loadTables();
    } catch { alert('Error'); }
  };

  const resetForm = () => { setForm({ table_number: '', capacity: '4' }); setEditId(null); setShowForm(false); };

  const handleEdit = (table: Table) => {
    setForm({ table_number: String(table.table_number), capacity: String(table.capacity) });
    setEditId(table.id);
    setShowForm(true);
  };

  const toggleAvailability = async (table: Table) => {
    await tablesAPI.update(table.id, { is_available: !table.is_available });
    loadTables();
  };

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white/80 p-6">Cargando...</div>;

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mesas</h1>
        <button onClick={resetForm} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nueva Mesa</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Número de mesa" type="number" value={form.table_number} onChange={e => setForm({...form, table_number: e.target.value})} className="border p-2 rounded" required />
            <input placeholder="Capacidad" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="border p-2 rounded" required />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map(table => (
          <div key={table.id} className={`bg-white p-4 rounded shadow ${table.is_available ? '' : 'opacity-50'}`}>
            <div className="text-center">
              <div className="text-4xl mb-2">🪑</div>
              <h3 className="font-bold">Mesa {table.table_number}</h3>
              <p className="text-gray-500 text-sm">Capacidad: {table.capacity}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded text-sm ${table.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {table.is_available ? 'Disponible' : 'Ocupada'}
              </span>
              <div className="mt-2 flex gap-1 justify-center">
                <button onClick={() => handleEdit(table)} className="text-blue-600 text-sm">Editar</button>
                <button onClick={() => toggleAvailability(table)} className="text-gray-600 text-sm">{table.is_available ? 'Ocupar' : 'Liberar'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {tables.length === 0 && <p className="text-center text-gray-500">No hay mesas</p>}
    </div>
  );
}
