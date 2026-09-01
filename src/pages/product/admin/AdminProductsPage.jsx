import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { getAllProducts, deleteProduct } from '../../../services/productService';
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

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <div className='admin-page-header'>
          <h1>Products</h1>
          <Link to='/admin/products/new' className='btn btn--sm'>Create Product</Link>
        </div>
        <p className='error'>{error}</p>
        <div className='admin-table-wrap'>
          <table className='admin-table'>
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
                  <td>
                    <Link to={`/admin/products/${product._id}`} className='admin-table__action'>Edit</Link>
                    <button type='button' onClick={() => handleDelete(product._id)} className='admin-table__action admin-table__action--danger'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminProductsPage;
