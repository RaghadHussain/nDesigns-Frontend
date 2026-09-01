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
      <div className='admin-shell'>
        <AdminSidebar />
        <main className='admin-main'>
          <p className='error'>{error}</p>
          {!error && <p>Loading...</p>}
        </main>
      </div>
    );
  }

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <div className='admin-page-header'>
          <h1>Order {order._id}</h1>
        </div>
        <p className='error'>{error}</p>

        <div className='order-detail'>
          <div className='admin-panel order-detail__items'>
            <h2>Items</h2>
            <ul className='line-items'>
              {items.map((item) => (
                <li key={item._id} className='line-items__row'>{item.variantId.size} x {item.quantity} - <span>{item.totalPrice}</span></li>
              ))}
            </ul>

            <div className='summary-list'>
              <div className='summary-list__row'>Subtotal: <span>{order.subTotal}</span></div>
              <div className='summary-list__row'>Discount: <span>{order.discountAmount}</span></div>
              <div className='summary-list__row'>Delivery Fee: <span>{order.deliveryFee}</span></div>
              <div className='summary-list__row summary-list__row--total'>Total: <span>{order.totalAmount}</span></div>
            </div>
          </div>

          <div className='admin-form-card order-detail__status'>
            <h2>Update Status</h2>
            <form onSubmit={handleSubmit}>
              <div className='field'>
                <label htmlFor='status'>Status</label>
                <select id='status' name='status' value={status} onChange={handleChange}>
                  {statuses.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className='form-actions'>
                <button className='btn'>Update Status</button>
                <button type='button' onClick={() => navigate('/admin/orders')} className='btn btn--ghost'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditOrderPage;
