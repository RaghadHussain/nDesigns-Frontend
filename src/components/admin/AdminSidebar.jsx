import { Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'

function AdminSidebar() {
    const { logout } = useAuth()

    return (
        <aside>
            <div>
                <strong>ndesign</strong>
                <p>Admin Management</p>
            </div>
            <nav>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/orders">Orders</Link>
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/categories">Categories</Link>
                <Link to="/admin/discounts">Discounts</Link>
                <Link to="/admin/delivery-settings">Delivery Settings</Link>
                <button type="button" onClick={logout}>Sign Out</button>
            </nav>
        </aside>
    )
}

export default AdminSidebar
