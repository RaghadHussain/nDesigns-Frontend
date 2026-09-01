import { Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'

function AdminSidebar() {
    const { logout } = useAuth()

    return (
        <aside className='admin-sidebar'>
            <div className='admin-sidebar__brand'>
                <strong>ndesign</strong>
                <p>Admin Management</p>
            </div>
            <nav className='admin-sidebar__nav'>
                <Link to="/admin" className='admin-sidebar__link'>Dashboard</Link>
                <Link to="/admin/orders" className='admin-sidebar__link'>Orders</Link>
                <Link to="/admin/products" className='admin-sidebar__link'>Products</Link>
                <Link to="/admin/categories" className='admin-sidebar__link'>Categories</Link>
                <Link to="/admin/discounts" className='admin-sidebar__link'>Discounts</Link>
                <Link to="/admin/settings" className='admin-sidebar__link'>Settings</Link>
                <button type="button" onClick={logout} className='admin-sidebar__link admin-sidebar__link--button'>Sign Out</button>
            </nav>
        </aside>
    )
}

export default AdminSidebar
