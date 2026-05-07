import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import MenuItems from './pages/MenuItems';
import Tables from './pages/Tables';
import Orders from './pages/Orders';
import Reservations from './pages/Reservations';
import Invoices from './pages/Invoices';
import Users from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/menu-items" element={<MenuItems />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/users" element={<Users />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
