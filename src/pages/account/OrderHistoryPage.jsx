import { useState, useEffect } from 'react'
import { Link } from 'react-router'

import { getMyOrders } from '../../services/orderService'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function OrderHistoryPage() {
  useDocumentTitle("Order History")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p className='error'>{error}</p>
  }

  return (
    <main>
      <h1>Order History</h1>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet</p>
      ) : (
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
                <td><Link to={`/account/orders/${order._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default OrderHistoryPage
