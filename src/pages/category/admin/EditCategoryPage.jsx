import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { getCategoryById, updateCategory } from '../../../services/categoryService';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const EditCategoryPage = ({}) => {
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
      <div>
        <AdminSidebar />
        <main><p>Loading...</p></main>
      </div>
    );
  }

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Edit Category</h1>
        <p className='error'>{error}</p>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={name}
              name='name'
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button>Update Category</button>
            <button type='button' onClick={() => navigate('/admin/categories')}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditCategoryPage;
