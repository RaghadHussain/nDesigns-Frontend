import { useState, useEffect } from 'react';

import { getLoyaltySetting, createLoyaltySetting } from '../../services/loyaltySettingsService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const LoyaltySettingsPage = ({}) => {
  useDocumentTitle('Loyalty Settings');
  const [pointsPerBHD, setPointsPerBHD] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSetting() {
      try {
        const data = await getLoyaltySetting();
        setPointsPerBHD(data.pointsPerBHD);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchSetting();
  }, []);

  function handleChange(event) {
    setPointsPerBHD(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await createLoyaltySetting(Number(pointsPerBHD));
      setPointsPerBHD(data.pointsPerBHD);
      setMessage('Loyalty rate updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Loyalty Settings</h1>
        <p className='error'>{error}</p>
        <p>{message}</p>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='pointsPerBHD'>Points Earned per BHD Spent:</label>
            <input
              type='number'
              id='pointsPerBHD'
              value={pointsPerBHD}
              name='pointsPerBHD'
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

export default LoyaltySettingsPage;
