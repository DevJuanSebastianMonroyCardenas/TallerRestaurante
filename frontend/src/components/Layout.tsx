import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◇' },
  { to: '/categories', label: 'Categorias', icon: '▣' },
  { to: '/menu-items', label: 'Platillos', icon: '◈' },
  { to: '/tables', label: 'Mesas', icon: '◌' },
  { to: '/orders', label: 'Pedidos', icon: '◍' },
  { to: '/reservations', label: 'Reservas', icon: '◎' },
  { to: '/invoices', label: 'Facturas', icon: '◉' },
  { to: '/users', label: 'Usuarios', icon: '◐' },
];

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('token') && location.pathname !== '/') {
      window.location.href = '/';
    }
  }, [location]);

  if (location.pathname === '/') return <Outlet />;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/50 bg-white/70 p-6 backdrop-blur-xl lg:block">
          <Link to="/dashboard" className="mb-8 block rounded-2xl bg-gradient-to-r from-teal-700 to-teal-500 p-4 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.18em] text-white/80">Taller Software</p>
            <h1 className="mt-1 text-2xl font-bold">Restaurante Pro</h1>
            <p className="mt-1 text-sm text-white/80">Control operativo diario</p>
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-teal-700 text-white shadow'
                      : 'text-slate-700 hover:bg-white hover:text-teal-700'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/60 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Sistema de gestion</p>
              <p className="text-lg font-bold text-slate-800">{localStorage.getItem('username') || 'Usuario'}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = '/';
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Cerrar sesion
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
