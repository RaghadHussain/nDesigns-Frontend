import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { createCategory, getAllCategories } from '../../../services/categoryService';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const CreateCategoryPage = ({}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: '',
  });

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

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = { name: formData.name };
      if (formData.parentCategory) {
        payload.parentCategory = formData.parentCategory;
      }
      await createCategory(payload);
      navigate('/admin/categories');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Create Category</h1>
        <p className='error'>{error}</p>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={formData.name}
              name='name'
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='parentCategory'>Parent Category:</label>
            <select
              id='parentCategory'
              value={formData.parentCategory}
              name='parentCategory'
              onChange={handleChange}
            >
              <option value=''>None</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button>Create Category</button>
            <button type='button' onClick={() => navigate('/admin/categories')}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCategoryPage;
