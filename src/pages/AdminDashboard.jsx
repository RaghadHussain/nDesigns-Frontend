import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getRecentOrders } from '../services/orderService';
import AdminSidebar from '../components/admin/AdminSidebar';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminDashboard = ({}) => {
  useDocumentTitle("Admin Dashboard")
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard(){
      try {
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(),
        ]);
        setStats(statsData);
        setOrders(ordersData);
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

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase()) ||
    order.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminSidebar />
      <main>
        <header>
          <div>
            <h1>Atelier Overview</h1>
            <p>Real-time sales, order volume, and active tailored designs.</p>
          </div>
          <div>
            <span>{user?.username || 'Atelier Manager'}</span>
          </div>
        </header>

        <p className='error'>{error}</p>

        <section>
          {statCards.map((stat) => (
            <div key={stat.label}>
              <p>{stat.label.toUpperCase()}</p>
              <p>{stat.value}</p>
            </div>
          ))}
        </section>

        <section>
          <div>
            <h2>Atelier Live Orders</h2>
            <div>
              <input
                type='text'
                placeholder='Search Order...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type='button'>Filter Status</button>
            </div>
          </div>

          <table>
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
                  <td>{order.status}</td>
                  <td>
                    <button type='button'>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
