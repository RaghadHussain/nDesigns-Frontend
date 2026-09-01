import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { getAllOrders } from '../../services/orderService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const AdminOrdersPage = ({}) => {
  useDocumentTitle("Orders")
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders(){
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.log(`Error: ${err}`)
        setError(err.message);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <div className='admin-page-header'>
          <h1>Orders</h1>
        </div>
        <p className='error'>{error}</p>
        <div className='admin-table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Order</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td><span className={`badge badge--${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                  <td>{order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td><Link to={`/admin/orders/${order._id}`} className='admin-table__action'>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
