import { useState } from 'react';
import { authAPI } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authAPI.login(username, password);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.24),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.2),_transparent_40%)]" />
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-teal-700 to-emerald-500 p-10 text-white md:block">
          <p className="text-xs uppercase tracking-[0.2em] text-white/75">Sistema academico</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">Gestion de Restaurante</h1>
          <p className="mt-4 text-sm text-white/80">
            Administra menus, pedidos, reservas y facturacion en un panel moderno.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/85">
            <p>• Arquitectura modular FastAPI</p>
            <p>• Integracion React + Docker</p>
            <p>• Datos demo listos para presentar</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-slate-900">Bienvenido</h2>
          <p className="mt-2 text-sm text-slate-500">Inicia sesion para continuar</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-teal-700 p-2.5 font-semibold text-white transition hover:bg-teal-800">
            Iniciar Sesión
          </button>
          <p className="text-xs text-slate-500">Demo: admin / secret</p>
        </form>
      </div>
      </div>
    </div>
  );
}
