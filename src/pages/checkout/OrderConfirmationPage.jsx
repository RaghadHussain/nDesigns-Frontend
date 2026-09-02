import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';

import { getOrderById } from '../../services/orderService';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const OrderConfirmationPage = ({}) => {
  useDocumentTitle("Order Confirmed")
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder(){
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
        setItems(data.items);
      } catch (err) {
        console.log(`Error: ${err}`)
        setError(err.message);
      }
    }
    fetchOrder();
  }, [id]);

  if (error) return <p className='error'>{error}</p>
  if (!order) return <p>Loading...</p>

  return (
    <main className='order-confirmation'>
      <h1>Order Confirmed</h1>
      <p className='order-confirmation__intro'>Thank you! Your order has been placed.</p>

      <div className='order-confirmation__card'>
        <h2>Order {order._id}</h2>
        <ul className='line-items'>
          {items.map((item) => (
            <li key={item._id} className='line-items__row'>{item.variantId.productId.name} ({item.variantId.size}) x {item.quantity} - <span>{item.totalPrice}</span></li>
          ))}
        </ul>
        <div className='summary-list'>
          <div className='summary-list__row'>Subtotal: <span>{order.subTotal}</span></div>
          <div className='summary-list__row'>Discount: <span>{order.discountAmount}</span></div>
          <div className='summary-list__row'>Delivery Fee: <span>{order.deliveryFee}</span></div>
          <div className='summary-list__row summary-list__row--total'>Total: <span>{order.totalAmount}</span></div>
        </div>
        <p className='order-confirmation__status'>Status: <span className={`badge badge--${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></p>
      </div>

      <Link to='/' className='order-confirmation__back'>Back to Home</Link>
    </main>
  );
};

export default OrderConfirmationPage;
