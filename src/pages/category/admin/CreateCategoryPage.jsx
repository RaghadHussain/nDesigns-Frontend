import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { createCategory, getAllCategories } from '../../../services/categoryService';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const CreateCategoryPage = ({}) => {
  useDocumentTitle("Create Category")
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
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <div className='admin-page-header'>
          <h1>Create Category</h1>
        </div>
        <p className='error'>{error}</p>
        <div className='admin-form-card'>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='field'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                value={formData.name}
                name='name'
                onChange={handleChange}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='parentCategory'>Parent Category</label>
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
            <div className='form-actions'>
              <button className='btn'>Create Category</button>
              <button type='button' onClick={() => navigate('/admin/categories')} className='btn btn--ghost'>Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCategoryPage;
