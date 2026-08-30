import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { getProductById, updateProduct } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';
import {
  getVariantByProduct,
  createVariant,
  updateVariant,
  deleteVariant,
} from '../../../services/productVariantService';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import getImageUrl from '../../../utils/imageUrl';

let nextTempKey = 0;

const EditProductPage = ({}) => {
  useDocumentTitle('Edit Product');
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', category: '' });
  const [variants, setVariants] = useState([]);
  const [removedVariantIds, setRemovedVariantIds] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productData, categoryList, variantList] = await Promise.all([
          getProductById(id),
          getAllCategories(),
          getVariantByProduct(id),
        ]);
        setProduct(productData);
        setFormData({
          name: productData.name,
          description: productData.description,
          category: productData.category,
        });
        setCategories(categoryList);
        setVariants(
          variantList.map((variant) => ({
            key: variant._id,
            _id: variant._id,
            size: variant.size,
            price: variant.price,
            quantity: variant.quantity,
          }))
        );
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, [id]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleImageChange(event) {
    setImageFiles(Array.from(event.target.files));
  }

  function handleVariantChange(key, field, value) {
    setVariants(variants.map((variant) =>
      variant.key === key ? { ...variant, [field]: value } : variant
    ));
  }

  function addVariantRow() {
    setVariants([...variants, { key: `new-${nextTempKey++}`, _id: null, size: '', price: '', quantity: '' }]);
  }

  function removeVariantRow(key) {
    const variant = variants.find((item) => item.key === key);
    if (variant?._id) {
      setRemovedVariantIds([...removedVariantIds, variant._id]);
    }
    setVariants(variants.filter((item) => item.key !== key));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const variantsToKeep = variants.filter((variant) => variant.size.trim() !== '');
    const sizesSeen = new Set();
    for (const variant of variantsToKeep) {
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

      await updateProduct(id, productFormData);

      await Promise.all([
        ...removedVariantIds.map((variantId) => deleteVariant(variantId)),
        ...variantsToKeep.map((variant) => {
          const payload = {
            size: variant.size,
            price: Number(variant.price),
            quantity: Number(variant.quantity),
          };
          return variant._id
            ? updateVariant(variant._id, payload)
            : createVariant(id, payload);
        }),
      ]);

      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!product) {
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
        <h1>Edit Product</h1>
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

          {product.images && product.images.length > 0 && (
            <div>
              <span>Current Images:</span>
              {product.images.map((image) => (
                <img key={image} src={getImageUrl(image)} alt={product.name} width='80' />
              ))}
            </div>
          )}
          <div>
            <label htmlFor='images'>Replace Images (leave empty to keep current):</label>
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
          {variants.map((variant) => (
            <div key={variant.key}>
              <label htmlFor={`size-${variant.key}`}>Size:</label>
              <input
                type='text'
                id={`size-${variant.key}`}
                value={variant.size}
                onChange={(event) => handleVariantChange(variant.key, 'size', event.target.value)}
              />

              <label htmlFor={`price-${variant.key}`}>Price:</label>
              <input
                type='number'
                id={`price-${variant.key}`}
                value={variant.price}
                onChange={(event) => handleVariantChange(variant.key, 'price', event.target.value)}
                min='0'
              />

              <label htmlFor={`quantity-${variant.key}`}>Quantity:</label>
              <input
                type='number'
                id={`quantity-${variant.key}`}
                value={variant.quantity}
                onChange={(event) => handleVariantChange(variant.key, 'quantity', event.target.value)}
                min='0'
              />

              <button type='button' onClick={() => removeVariantRow(variant.key)}>Remove</button>
            </div>
          ))}
          <button type='button' onClick={addVariantRow}>Add Size</button>

          <div>
            <button disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
            <button type='button' onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProductPage;
