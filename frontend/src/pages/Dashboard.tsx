import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesAPI, demoAPI, invoicesAPI, menuItemsAPI, ordersAPI, reservationsAPI, tablesAPI } from '../api';

type Stats = {
  categories: number;
  items: number;
  orders: number;
  tables: number;
  reservations: number;
  invoices: number;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    items: 0,
    orders: 0,
    tables: 0,
    reservations: 0,
    invoices: 0,
  });
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    void loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const [cats, items, orders, tables, reservations, invoices] = await Promise.all([
        categoriesAPI.getAll(0, 1000),
        menuItemsAPI.getAll(),
        ordersAPI.getAll(),
        tablesAPI.getAll(),
        reservationsAPI.getAll(),
        invoicesAPI.getAll(),
      ]);
      setStats({
        categories: cats.data.length,
        items: items.data.length,
        orders: orders.data.length,
        tables: tables.data.length,
        reservations: reservations.data.length,
        invoices: invoices.data.length,
      });
    } catch (err) {
      console.error('Error loading stats', err);
    }
  };

  const occupancy = useMemo(() => {
    if (stats.tables === 0) return '0%';
    const activeOrders = stats.orders;
    const percentage = Math.min(100, Math.round((activeOrders / stats.tables) * 100));
    return `${percentage}%`;
  }, [stats.orders, stats.tables]);

  const bars = useMemo(
    () => [stats.orders, stats.reservations, stats.invoices, stats.items, stats.categories].map((v) => Math.max(8, Math.min(100, v * 10))),
    [stats],
  );

  const resetDemo = async () => {
    try {
      setResetting(true);
      await demoAPI.reset();
      await loadStats();
    } catch (err) {
      console.error('Error resetting demo data', err);
      alert('No se pudo resetear la data demo');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/60 bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-700 px-7 py-8 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Resumen operativo</p>
        <h2 className="mt-2 text-4xl font-bold">Panel del Restaurante</h2>
        <p className="mt-2 max-w-2xl text-sm text-emerald-100/90">
          Visualiza el estado del negocio en tiempo real. Ya tienes datos semilla para mostrar flujo de pedidos,
          reservas y facturacion en tu presentacion.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={resetDemo}
            disabled={resetting}
            className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resetting ? 'Reseteando demo...' : 'Reset demo data'}
          </button>
          <span className="rounded-xl bg-emerald-100/15 px-4 py-2 text-sm text-emerald-50">Login demo: admin / secret</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Categorias" value={stats.categories} subtitle="Catalogo base" to="/categories" />
        <StatCard title="Platillos" value={stats.items} subtitle="Menu disponible" to="/menu-items" />
        <StatCard title="Mesas" value={stats.tables} subtitle={`Ocupacion aprox: ${occupancy}`} to="/tables" />
        <StatCard title="Pedidos" value={stats.orders} subtitle="Operacion diaria" to="/orders" />
        <StatCard title="Reservas" value={stats.reservations} subtitle="Agenda activa" to="/reservations" />
        <StatCard title="Facturas" value={stats.invoices} subtitle="Ingresos registrados" to="/invoices" />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">Accesos rapidos</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <QuickLink to="/orders" title="Gestionar pedidos" />
            <QuickLink to="/reservations" title="Revisar reservas" />
            <QuickLink to="/menu-items" title="Editar menu" />
            <QuickLink to="/users" title="Administrar usuarios" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">Checklist de entrega</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Backend FastAPI modular en Docker</li>
            <li>• Frontend React conectado a API</li>
            <li>• Datos demo cargados automaticamente</li>
            <li>• Documentacion API en `docs/API.md`</li>
            <li>• Flujo CRUD para todos los modulos</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">Actividad del dia (demo)</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-5">
          {[
            { label: 'Pedidos', value: bars[0] },
            { label: 'Reservas', value: bars[1] },
            { label: 'Facturas', value: bars[2] },
            { label: 'Platillos', value: bars[3] },
            { label: 'Categorias', value: bars[4] },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <div className="mt-3 h-24 rounded-lg bg-slate-200/60 p-1">
                <div className="rounded-md bg-gradient-to-t from-teal-700 to-emerald-400" style={{ height: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, subtitle, to }: { title: string; value: number; subtitle: string; to: string }) {
  return (
    <Link to={to} className="group rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-2 text-4xl font-black text-slate-800">{value}</p>
      <p className="mt-2 text-sm text-slate-500 group-hover:text-teal-700">{subtitle}</p>
    </Link>
  );
}

function QuickLink({ to, title }: { to: string; title: string }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700">
      {title}
    </Link>
  );
}
