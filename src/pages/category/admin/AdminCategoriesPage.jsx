import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { getAllCategories } from '../../../services/categoryService';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const AdminCategoriesPage = ({}) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Categories</h1>
        <Link to='/admin/categories/new'>Create Category</Link>
        <p className='error'>{error}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.parentCategory?.name || 'None'}</td>
                <td><Link to={`/admin/categories/${category._id}`}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminCategoriesPage;
