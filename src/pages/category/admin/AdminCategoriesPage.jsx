import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { getAllCategories } from '../../../services/categoryService';
import { getAllProducts } from '../../../services/productService';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const AdminCategoriesPage = ({}) => {
  useDocumentTitle("Categories")
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [expandedParentIds, setExpandedParentIds] = useState(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getAllCategories(),
          getAllProducts(),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  function toggleParent(parentId) {
    setExpandedParentIds((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  }

  const parentCategories = categories.filter((category) => !category.parentCategory);

  const subCategoriesByParentId = categories.reduce((map, category) => {
    if (!category.parentCategory) return map;
    const parentId = category.parentCategory._id || category.parentCategory;
    if (!map[parentId]) map[parentId] = [];
    map[parentId].push(category);
    return map;
  }, {});

  const productsByCategoryId = products.reduce((map, product) => {
    const categoryId = product.category?._id || product.category;
    if (!map[categoryId]) map[categoryId] = [];
    map[categoryId].push(product);
    return map;
  }, {});

  return (
    <div>
      <AdminSidebar />
      <main>
        <h1>Categories</h1>
        <Link to='/admin/categories/new'>Create Category</Link>
        <p className='error'>{error}</p>
        <ul>
          {parentCategories.map((parent) => {
            const isExpanded = expandedParentIds.has(parent._id);
            const subCategories = subCategoriesByParentId[parent._id] || [];

            return (
              <li key={parent._id}>
                <button type='button' onClick={() => toggleParent(parent._id)}>
                  {isExpanded ? '▼' : '▶'} {parent.name}
                </button>
                <Link to={`/admin/categories/${parent._id}`}>Edit</Link>

                {isExpanded && (
                  <ul>
                    {subCategories.length === 0 && <li>No subcategories</li>}
                    {subCategories.map((sub) => {
                      const subProducts = productsByCategoryId[sub._id] || [];
                      return (
                        <li key={sub._id}>
                          <strong>{sub.name}</strong>
                          <Link to={`/admin/categories/${sub._id}`}>Edit</Link>
                          <ul>
                            {subProducts.length === 0 && <li>No products</li>}
                            {subProducts.map((product) => (
                              <li key={product._id}>{product.name}</li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export default AdminCategoriesPage;
