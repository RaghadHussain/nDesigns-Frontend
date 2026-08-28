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
    <div>
      <AdminSidebar />
      <main>
        <h1>Discounts</h1>
        <Link to='/admin/discounts/new'>Create Discount</Link>
        <p className='error'>{error}</p>
        <table>
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
      </main>
    </div>
  );
};

export default AdminDiscountsPage;
