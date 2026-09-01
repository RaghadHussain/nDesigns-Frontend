import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { getCategoryById, updateCategory } from '../../../services/categoryService';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const EditCategoryPage = ({}) => {
  useDocumentTitle("Edit Category")
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategory() {
      try {
        const data = await getCategoryById(id);
        setCategory(data);
        setName(data.name);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCategory();
  }, [id]);

  function handleChange(event) {
    setName(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await updateCategory(id, { name });
      navigate('/admin/categories');
    } catch (err) {
      setError(err.message);
    }
  }

  if (!category) {
    return (
      <div className='admin-shell'>
        <AdminSidebar />
        <main className='admin-main'><p>Loading...</p></main>
      </div>
    );
  }

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <div className='admin-page-header'>
          <h1>Edit Category</h1>
        </div>
        <p className='error'>{error}</p>
        <div className='admin-form-card'>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='field'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                value={name}
                name='name'
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-actions'>
              <button className='btn'>Update Category</button>
              <button type='button' onClick={() => navigate('/admin/categories')} className='btn btn--ghost'>Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditCategoryPage;
