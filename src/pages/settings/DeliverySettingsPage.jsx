import { useState, useEffect } from 'react';

import { getDeliveryFee, createDeliveryFee } from '../../services/deliverySettingsService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const DeliverySettingsPage = ({}) => {
  useDocumentTitle('Delivery Settings');
  const [fee, setFee] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchFee() {
      try {
        const data = await getDeliveryFee();
        setFee(data.fee);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchFee();
  }, []);

  function handleChange(event) {
    setFee(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await createDeliveryFee(Number(fee));
      setFee(data.fee);
      setMessage('Delivery fee updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Delivery Settings</h1>
        <p className='error'>{error}</p>
        <p>{message}</p>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='fee'>Delivery Fee (BHD):</label>
            <input
              type='number'
              id='fee'
              value={fee}
              name='fee'
              onChange={handleChange}
              min='0'
              step='0.01'
              required
            />
          </div>
          <div>
            <button>Save</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default DeliverySettingsPage;
