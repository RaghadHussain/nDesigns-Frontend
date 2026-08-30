import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { getOrderById, updateOrderStatus, getOrderStatuses } from '../../services/orderService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const EditOrderPage = ({}) => {
  useDocumentTitle("Edit Order")
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder(){
      try {
        const [data, statusesData] = await Promise.all([
          getOrderById(id),
          getOrderStatuses(),
        ]);
        setOrder(data.order);
        setItems(data.items);
        setStatus(data.order.orderStatus);
        setStatuses(statusesData);
      } catch (err) {
        console.log(`Error: ${err}`)
        setError(err.message);
      }
    }
    fetchOrder();
  }, [id]);

  function handleChange(event){
    setStatus(event.target.value);
  }

  async function handleSubmit(event){
    event.preventDefault();
    try {
      await updateOrderStatus(id, status);
      navigate('/admin/orders');
    } catch (err) {
      console.log(`Error: ${err}`)
      setError(err.message);
    }
  };

  if (!order) {
    return (
      <div>
        <AdminSidebar />
        <main>
          <p className='error'>{error}</p>
          {!error && <p>Loading...</p>}
        </main>
      </div>
    );
  }

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Order {order._id}</h1>
        <p className='error'>{error}</p>
        <p>Subtotal: {order.subTotal}</p>
        <p>Discount: {order.discountAmount}</p>
        <p>Delivery Fee: {order.deliveryFee}</p>
        <p>Total: {order.totalAmount}</p>

        <h2>Items</h2>
        <ul>
          {items.map((item) => (
            <li key={item._id}>{item.variantId.size} x {item.quantity} - {item.totalPrice}</li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='status'>Status:</label>
            <select id='status' name='status' value={status} onChange={handleChange}>
              {statuses.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <button>Update Status</button>
            <button type='button' onClick={() => navigate('/admin/orders')}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditOrderPage;
