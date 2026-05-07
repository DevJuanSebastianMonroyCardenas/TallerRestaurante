import { useState, useEffect } from 'react';
import { menuItemsAPI, categoriesAPI } from '../api';
import type { MenuItem, Category } from '../types';

export default function MenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', is_available: true });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([menuItemsAPI.getAll(), categoriesAPI.getAll()]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, price: parseFloat(form.price), category_id: form.category_id ? parseInt(form.category_id) : null };
      if (editId) { await menuItemsAPI.update(editId, data); }
      else { await menuItemsAPI.create(data); }
      resetForm();
      loadData();
    } catch { alert('Error'); }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category_id: '', is_available: true });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category_id: item.category_id ? String(item.category_id) : '',
      is_available: item.is_available,
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar?')) { await menuItemsAPI.delete(id); loadData(); }
  };

  const getCategoryName = (id: number | null) => categories.find(c => c.id === id)?.name || '-';

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platillos</h1>
        <button onClick={resetForm} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo Platillo</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 rounded" required />
            <input placeholder="Precio" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="border p-2 rounded" required />
            <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="border p-2 rounded">
              <option value="">Sin categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Descripción" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} /> Disponible</label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Nombre</th><th className="p-3 text-left">Precio</th><th className="p-3 text-left">Categoría</th><th className="p-3 text-left">Estado</th><th className="p-3 text-left">Acciones</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">S/. {item.price}</td>
                <td className="p-3">{getCategoryName(item.category_id)}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-sm ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.is_available ? 'Disponible' : 'No disponible'}</span></td>
                <td className="p-3"><button onClick={() => handleEdit(item)} className="text-blue-600 mr-2">Editar</button><button onClick={() => handleDelete(item.id)} className="text-red-600">Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="p-4 text-center text-gray-500">No hay platillos</p>}
      </div>
    </div>
  );
}
