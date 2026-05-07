import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesAPI, menuItemsAPI, ordersAPI, tablesAPI } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ categories: 0, items: 0, orders: 0, tables: 0 });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [cats, items, orders, tables] = await Promise.all([
        categoriesAPI.getAll(0, 1000),
        menuItemsAPI.getAll(),
        ordersAPI.getAll(),
        tablesAPI.getAll(),
      ]);
      setStats({
        categories: cats.data.length,
        items: items.data.length,
        orders: orders.data.length,
        tables: tables.data.length,
      });
    } catch (err) {
      console.error('Error loading stats', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sistema de Restaurante</h1>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Categorías" value={stats.categories} icon="📋" to="/categories" />
          <StatCard title="Platillos" value={stats.items} icon="🍽️" to="/menu-items" />
          <StatCard title="Pedidos" value={stats.orders} icon="📝" to="/orders" />
          <StatCard title="Mesas" value={stats.tables} icon="🪑" to="/tables" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Link to="/reservations" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <span className="text-3xl">📅</span>
            <h3 className="text-lg font-semibold mt-2">Reservaciones</h3>
          </Link>
          <Link to="/invoices" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <span className="text-3xl">💰</span>
            <h3 className="text-lg font-semibold mt-2">Facturas</h3>
          </Link>
          <Link to="/users" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <span className="text-3xl">👥</span>
            <h3 className="text-lg font-semibold mt-2">Usuarios</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, to }: { title: string; value: number; icon: string; to: string }) {
  return (
    <Link to={to} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Link>
  );
}
