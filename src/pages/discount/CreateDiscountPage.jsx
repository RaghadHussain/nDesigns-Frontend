import { useState } from 'react';
import { useNavigate } from 'react-router';

import { createDiscount } from '../../services/discountService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const TODAY = new Date().toISOString().split('T')[0];

const CreateDiscountPage = ({}) => {
  useDocumentTitle("Create Discount")
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
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
      <div className='admin-page-header'>
        <h1>Create Discount</h1>
      </div>
      <p className='error'>{error}</p>
      <div className='admin-form-card'>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div className='field'>
            <label htmlFor='code'>Code</label>
            <input
              type='text'
              id='code'
              value={formData.code}
              name='code'
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor='discountValue'>Discount Value (%)</label>
            <input
              type='number'
              id='discountValue'
              value={formData.discountValue}
              name='discountValue'
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor='usageLimit'>Usage Limit</label>
            <input
              type='number'
              id='usageLimit'
              value={formData.usageLimit}
              name='usageLimit'
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor='startDate'>Start Date</label>
            <input
              type='date'
              id='startDate'
              value={formData.startDate}
              name='startDate'
              onChange={handleChange}
              min={TODAY}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor='endDate'>End Date</label>
            <input
              type='date'
              id='endDate'
              value={formData.endDate}
              name='endDate'
              onChange={handleChange}
              min={formData.startDate || TODAY}
              required
            />
          </div>
          <div className='form-actions'>
            <button className='btn'>Create Discount</button>
            <button type='button' onClick={() => navigate('/admin/discounts')} className='btn btn--ghost'>Cancel</button>
          </div>
        </form>
      </div>
      </main>
    </div>
  );
};

export default CreateDiscountPage;
