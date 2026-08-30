import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { createProduct } from '../../../services/productService';
import { createVariant } from '../../../services/productVariantService';
import { getAllCategories } from '../../../services/categoryService';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const CreateProductPage = ({}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [variants, setVariants] = useState([{ size: '', price: '', quantity: '' }]);

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

  function handleImageChange(event) {
    setImageFiles(Array.from(event.target.files));
  }

  function handleVariantChange(index, field, value) {
    const updatedVariants = variants.map((variant, variantIndex) =>
      variantIndex === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  }

  function addVariantRow() {
    setVariants([...variants, { size: '', price: '', quantity: '' }]);
  }

  function removeVariantRow(index) {
    setVariants(variants.filter((variant, variantIndex) => variantIndex !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const variantsToCreate = variants.filter((variant) => variant.size.trim() !== '');
    const sizesSeen = new Set();
    for (const variant of variantsToCreate) {
      const normalizedSize = variant.size.trim().toLowerCase();
      if (sizesSeen.has(normalizedSize)) {
        setError('Each size can only be added once.');
        return;
      }
      sizesSeen.add(normalizedSize);
    }

    setSubmitting(true);

    try {
      const productFormData = new FormData();
      productFormData.append('name', formData.name);
      productFormData.append('description', formData.description);
      productFormData.append('category', formData.category);
      imageFiles.forEach((file) => productFormData.append('images', file));

      const createdProduct = await createProduct(productFormData);

      await Promise.all(
        variantsToCreate.map((variant) =>
          createVariant(createdProduct._id, {
            size: variant.size,
            price: Number(variant.price),
            quantity: Number(variant.quantity),
          })
        )
      );

      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Create Product</h1>
        <p className='error'>{error}</p>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={formData.name}
              name='name'
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>Description:</label>
            <textarea
              id='description'
              value={formData.description}
              name='description'
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='category'>Category:</label>
            <select
              id='category'
              value={formData.category}
              name='category'
              onChange={handleChange}
              required
            >
              <option value=''>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='images'>Images:</label>
            <input
              type='file'
              id='images'
              name='images'
              accept='image/*'
              multiple
              onChange={handleImageChange}
            />
          </div>

          <h2>Sizes</h2>
          {variants.map((variant, index) => (
            <div key={index}>
              <label htmlFor={`size-${index}`}>Size:</label>
              <input
                type='text'
                id={`size-${index}`}
                value={variant.size}
                onChange={(event) => handleVariantChange(index, 'size', event.target.value)}
              />

              <label htmlFor={`price-${index}`}>Price:</label>
              <input
                type='number'
                id={`price-${index}`}
                value={variant.price}
                onChange={(event) => handleVariantChange(index, 'price', event.target.value)}
                min='0'
              />

              <label htmlFor={`quantity-${index}`}>Quantity:</label>
              <input
                type='number'
                id={`quantity-${index}`}
                value={variant.quantity}
                onChange={(event) => handleVariantChange(index, 'quantity', event.target.value)}
                min='0'
              />

              {variants.length > 1 && (
                <button type='button' onClick={() => removeVariantRow(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type='button' onClick={addVariantRow}>Add Size</button>

          <div>
            <button disabled={submitting}>{submitting ? 'Creating...' : 'Create Product'}</button>
            <button type='button' onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProductPage;
