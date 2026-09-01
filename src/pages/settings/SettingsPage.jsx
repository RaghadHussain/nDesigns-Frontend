import { useState, useEffect } from 'react';

import { getSettings, createSettings } from '../../services/settingsService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const SettingsPage = ({}) => {
  useDocumentTitle('Settings');
  const [formData, setFormData] = useState({ deliveryFee: '', pointsPerBHD: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setFormData({ deliveryFee: data.deliveryFee, pointsPerBHD: data.pointsPerBHD });
      } catch (err) {
        setError(err.message);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timeoutId = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timeoutId);
  }, [message]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await createSettings(Number(formData.deliveryFee), Number(formData.pointsPerBHD));
      setFormData({ deliveryFee: data.deliveryFee, pointsPerBHD: data.pointsPerBHD });
      setMessage('Settings updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <div className='admin-page-header'>
          <h1>Settings</h1>
        </div>
        <p className='error'>{error}</p>
        <p className='notice'>{message}</p>
        <div className='admin-form-card'>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='field'>
              <label htmlFor='deliveryFee'>Delivery Fee (BHD)</label>
              <input
                type='number'
                id='deliveryFee'
                value={formData.deliveryFee}
                name='deliveryFee'
                onChange={handleChange}
                min='0'
                step='0.01'
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='pointsPerBHD'>Points Earned per BHD Spent</label>
              <input
                type='number'
                id='pointsPerBHD'
                value={formData.pointsPerBHD}
                name='pointsPerBHD'
                onChange={handleChange}
                min='0'
                step='0.01'
                required
              />
            </div>
            <div className='form-actions'>
              <button className='btn'>Save</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
