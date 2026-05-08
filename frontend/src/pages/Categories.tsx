import { useState, useEffect } from 'react';
import { categoriesAPI } from '../api';
import type { Category } from '../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoriesAPI.update(editId, form);
      } else {
        await categoriesAPI.create(form);
      }
      setForm({ name: '', description: '' });
      setEditId(null);
      setShowForm(false);
      loadCategories();
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar categoría?')) {
      await categoriesAPI.delete(id);
      loadCategories();
    }
  };

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white/80 p-6">Cargando...</div>;

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '' }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded">
          + Nueva Categoría
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="border p-2 rounded" required />
            <input placeholder="Descripción" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="border p-2 rounded" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-t">
                <td className="p-3">{cat.id}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.description || '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 mr-2">Editar</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="p-4 text-center text-gray-500">No hay categorías</p>}
      </div>
    </div>
  );
}
