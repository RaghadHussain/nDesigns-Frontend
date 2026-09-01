import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getRecentOrders, getOrderStatuses } from '../services/orderService';
import AdminSidebar from '../components/admin/AdminSidebar';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminDashboard = () => {
  useDocumentTitle("Admin Dashboard")
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard(){
      try {
        const [statsData, ordersData, statusesData] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(),
          getOrderStatuses(),
        ]);
        setStats(statsData);
        setOrders(ordersData);
        setStatuses(statusesData);
      } catch (err) {
        console.log(`Error: ${err}`)
        setError(err.message);
      }
    }
    fetchDashboard();
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats ? stats.totalOrders.toLocaleString() : '...' },
    { label: 'Net Revenue', value: stats ? `BHD ${stats.netRevenue.toFixed(2)}` : '...' },
    { label: 'Pending Tailoring', value: stats ? `${stats.pendingTailoring} items` : '...' },
    { label: 'Active Customers', value: stats ? `${stats.activeCustomers} members` : '...' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <header className='admin-topbar'>
          <div>
            <h1>Admin Overview</h1>
            <p>Real-time sales, order volume, and active tailored designs.</p>
          </div>
          <div className='admin-topbar__user'>
            <span>{user?.username || 'Admin Manager'}</span>
          </div>
        </header>

        <p className='error'>{error}</p>

        <section className='admin-stats'>
          {statCards.map((stat) => (
            <div key={stat.label} className='stat-card'>
              <p className='stat-card__label'>{stat.label.toUpperCase()}</p>
              <p className='stat-card__value'>{stat.value}</p>
            </div>
          ))}
        </section>

        <section className='admin-panel'>
          <div className='admin-panel__header'>
            <h2>Admin Live Orders</h2>
            <div className='admin-panel__controls'>
              <input
                type='text'
                placeholder='Search Order...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='admin-panel__search'
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='admin-panel__filter'>
                <option value=''>All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='admin-table-wrap'>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CLIENT</th>
                  <th>ORDERED DATE</th>
                  <th>ORDERED ITEM</th>
                  <th>TOTAL COST</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.client}</td>
                    <td>{new Date(order.orderedDate).toLocaleDateString()}</td>
                    <td>{order.orderedItem}</td>
                    <td>BHD {order.totalCost.toFixed(2)}</td>
                    <td><span className={`badge badge--${order.status.toLowerCase()}`}>{order.status}</span></td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className='admin-table__action'>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
