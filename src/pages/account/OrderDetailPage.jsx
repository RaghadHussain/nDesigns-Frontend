import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'

import { getOrderById, cancelOrder } from '../../services/orderService'
import { getCurrentUser } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const CANCELLABLE_STATUSES = ['pending', 'confirmed']

function OrderDetailPage() {
  useDocumentTitle("Order Details")
  const { id } = useParams()
  const { setUser } = useAuth()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderById(id)
        setOrder(data.order)
        setItems(data.items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  async function handleCancel() {
    try {
      const updatedOrder = await cancelOrder(id)
      setOrder(updatedOrder)

      const updatedUser = await getCurrentUser()
      setUser(updatedUser)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p className='error'>{error}</p>
  }

  return (
    <main className='account-page container'>
      <p className='account-back'><Link to='/account/orders'>Back to Order History</Link></p>

      <div className='order-detail-card'>
        <div className='order-detail-card__header'>
          <div>
            <h1>Order {order._id}</h1>
            <p className='order-detail-card__date'>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`badge badge--${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
        </div>

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

        {CANCELLABLE_STATUSES.includes(order.orderStatus) && (
          <button onClick={handleCancel} className='btn btn--danger order-detail-card__cancel'>Cancel Order</button>
        )}
      </div>
    </main>
  )
}

export default OrderDetailPage
