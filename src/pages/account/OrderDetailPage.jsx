import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'

import { getOrderById, cancelOrder } from '../../services/orderService'

const CANCELLABLE_STATUSES = ['pending', 'confirmed']

function OrderDetailPage() {
  const { id } = useParams()
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
    <main>
      <p><Link to='/account/orders'>Back to Order History</Link></p>

      <h1>Order {order._id}</h1>
      <p>Status: {order.orderStatus}</p>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>{item.variantId.size} x {item.quantity} - {item.totalPrice}</li>
        ))}
      </ul>

      <p>Subtotal: {order.subTotal}</p>
      <p>Discount: {order.discountAmount}</p>
      <p>Delivery Fee: {order.deliveryFee}</p>
      <p>Total: {order.totalAmount}</p>

      {CANCELLABLE_STATUSES.includes(order.orderStatus) && (
        <button onClick={handleCancel}>Cancel Order</button>
      )}
    </main>
  )
}

export default OrderDetailPage
