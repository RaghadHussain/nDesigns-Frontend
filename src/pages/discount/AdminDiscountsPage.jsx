import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { getAllDiscounts } from '../../services/discountService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const AdminDiscountsPage = ({}) => {
  useDocumentTitle("Discounts")
  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDiscounts(){
      try {
        const data = await getAllDiscounts();
        setDiscounts(data);
      } catch (err) {
        console.log(`Error: ${err}`)
        setError(err.message);
      }
    }
    fetchDiscounts();
  }, []);

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <main className='admin-main'>
        <div className='admin-page-header'>
          <h1>Discounts</h1>
          <Link to='/admin/discounts/new' className='btn btn--sm'>Create Discount</Link>
        </div>
        <p className='error'>{error}</p>
        <div className='admin-table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Code</th>
                <th>Value</th>
                <th>Usage</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount._id}>
                  <td>{discount.code}</td>
                  <td>{discount.discountValue}%</td>
                  <td>{discount.usedCount} / {discount.usageLimit}</td>
                  <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                  <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDiscountsPage;
