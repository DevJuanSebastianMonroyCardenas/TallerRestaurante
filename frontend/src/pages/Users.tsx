import { useState, useEffect } from 'react';
import { usersAPI } from '../api';
import type { User } from '../types';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', role: 'user' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const res = await usersAPI.getAll(); setUsers(res.data); }
    catch { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) { const { password, ...updateData } = form; await usersAPI.update(editId, updateData); }
      else { await usersAPI.create(form); }
      resetForm();
      loadUsers();
    } catch { alert('Error'); }
  };

  const resetForm = () => { setForm({ username: '', email: '', password: '', full_name: '', role: 'user' }); setEditId(null); setShowForm(false); };

  const handleEdit = (user: User) => {
    setForm({ username: user.username, email: user.email, password: '', full_name: user.full_name || '', role: user.role });
    setEditId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => { if (confirm('¿Eliminar?')) { await usersAPI.delete(id); loadUsers(); } };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button onClick={resetForm} className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo Usuario</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Usuario" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="border p-2 rounded" required={!editId} />
            <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border p-2 rounded" required />
            <input placeholder={editId ? 'Nueva contraseña (opcional)' : 'Contraseña'} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="border p-2 rounded" required={!editId} />
            <input placeholder="Nombre completo" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="border p-2 rounded" />
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="border p-2 rounded">
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
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
            <tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Usuario</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Nombre</th><th className="p-3 text-left">Rol</th><th className="p-3 text-left">Activo</th><th className="p-3 text-left">Acciones</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.full_name || '-'}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-sm ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-sm ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? 'Sí' : 'No'}</span></td>
                <td className="p-3"><button onClick={() => handleEdit(u)} className="text-blue-600 mr-2">Editar</button><button onClick={() => handleDelete(u.id)} className="text-red-600">Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-4 text-center text-gray-500">No hay usuarios</p>}
      </div>
    </div>
  );
}
