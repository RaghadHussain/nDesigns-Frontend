import { Link } from 'react-router'

function AdminSidebar() {
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
            </nav>
        </aside>
    )
}

export default AdminSidebar
