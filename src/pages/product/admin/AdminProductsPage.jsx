import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { getAllProducts } from '../../../services/productService';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const AdminProductsPage = ({}) => {
  useDocumentTitle("Products")
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Products</h1>
        <Link to='/admin/products/new'>Create Product</Link>
        <p className='error'>{error}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category?.name || '—'}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td><Link to={`/admin/products/${product._id}`}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminProductsPage;
