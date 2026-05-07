import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('token') && location.pathname !== '/') {
      window.location.href = '/';
    }
  }, [location]);

  if (location.pathname === '/') return <Outlet />;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-bold">🍽️ Restaurante</Link>
            <div className="flex gap-4 text-sm">
              <Link to="/categories" className="hover:underline">Categorías</Link>
              <Link to="/menu-items" className="hover:underline">Platillos</Link>
              <Link to="/tables" className="hover:underline">Mesas</Link>
              <Link to="/orders" className="hover:underline">Pedidos</Link>
              <Link to="/reservations" className="hover:underline">Reservas</Link>
              <Link to="/invoices" className="hover:underline">Facturas</Link>
              <Link to="/users" className="hover:underline">Usuarios</Link>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('username'); window.location.href = '/'; }}
            className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600">
            Cerrar
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
