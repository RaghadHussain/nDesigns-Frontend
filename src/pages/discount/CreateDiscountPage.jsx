import { useState } from 'react';
import { useNavigate } from 'react-router';

import { createDiscount } from '../../services/discountService';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CreateDiscountPage = ({}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    discountValue: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
  });

  function handleChange(event){
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event){
    event.preventDefault();
    try {
      await createDiscount(formData);
      navigate('/admin/discounts');
    } catch (err) {
      console.log(`Error: ${err}`)
      setError(err.message);
    }
  };

  return (
    <div>
      <AdminSidebar />
      <main>
      <h1>Create Discount</h1>
      <p className='error'>{error}</p>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='code'>Code:</label>
          <input
            type='text'
            id='code'
            value={formData.code}
            name='code'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='discountValue'>Discount Value (%):</label>
          <input
            type='number'
            id='discountValue'
            value={formData.discountValue}
            name='discountValue'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='usageLimit'>Usage Limit:</label>
          <input
            type='number'
            id='usageLimit'
            value={formData.usageLimit}
            name='usageLimit'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='startDate'>Start Date:</label>
          <input
            type='date'
            id='startDate'
            value={formData.startDate}
            name='startDate'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='endDate'>End Date:</label>
          <input
            type='date'
            id='endDate'
            value={formData.endDate}
            name='endDate'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button>Create Discount</button>
          <button type='button' onClick={() => navigate('/admin/discounts')}>Cancel</button>
        </div>
      </form>
      </main>
    </div>
  );
};

export default CreateDiscountPage;
