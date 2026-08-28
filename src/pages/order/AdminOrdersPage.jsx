import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { getAllOrders } from '../../services/orderService';

const AdminOrdersPage = ({}) => {
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
    <main>
      <h1>Orders</h1>
      <p className='error'>{error}</p>
      <table>
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
              <td>{order.orderStatus}</td>
              <td>{order.totalAmount}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td><Link to={`/admin/orders/${order._id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default AdminOrdersPage;
