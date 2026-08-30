import { useEffect, useState } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Link } from 'react-router';
import { getAllProducts } from '../services/productService';
import { getAllCategories } from '../services/categoryService';
import { getVariantByProduct } from '../services/productVariantService';
import getImageUrl from '../utils/imageUrl';

const NEW_ARRIVALS_COUNT = 4;

function Homepage() {
  useDocumentTitle("Home")
  const [newArrivals, setNewArrivals] = useState([]);
  const [curationCategories, setCurationCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHomepageData() {
      try {
        const [products, categories] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);

        const newestProducts = [...products]
          .sort((productA, productB) => new Date(productB.createdAt) - new Date(productA.createdAt))
          .slice(0, NEW_ARRIVALS_COUNT);

        const newestWithPrices = await Promise.all(
          newestProducts.map(async (product) => {
            const variants = await getVariantByProduct(product._id);
            const prices = variants.map((variant) => variant.price);
            return {
              ...product,
              lowestPrice: prices.length ? Math.min(...prices) : null,
            };
          })
        );

        setNewArrivals(newestWithPrices);
        setCurationCategories(categories.filter((category) => !category.parentCategory));
      } catch (err) {
        setError(err.message);
      }
    }
    fetchHomepageData();
  }, []);

  return (
    <main className='homepage'>
      <section className='homepage-hero'>
        <div className='homepage-hero__content'>
          <p className='eyebrow'>Luxury Modest Wear</p>
          <h1>Stitched with Elegance</h1>
          <p>
            Experience our curation of fine fabrics, refined drapes, and
            exquisite finishes made to elevate daily wear.
          </p>
          <Link to='/products' className='btn btn--primary'>Shop Now</Link>
        </div>
        <div className='homepage-hero__image placeholder-image'>
          <span>Featured Campaign Imagery</span>
        </div>
      </section>

      <section className='homepage-curation'>
        <h2>Signature Curation</h2>
        <p>Discover our twin anchors of luxury Modest clothing</p>
        <p className='error'>{error}</p>

        <div className='homepage-curation__grid'>
          {curationCategories.map((category) => (
            <div key={category._id} className='homepage-curation__card'>
              <div className='placeholder-image'>
                <span>{category.name}</span>
              </div>
              <div className='homepage-curation__card-footer'>
                <h3>{category.name}</h3>
                <Link to={`/products?category=${category._id}`}>View All</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='homepage-new-arrivals'>
        <div className='homepage-new-arrivals__header'>
          <div>
            <h2>New Arrivals</h2>
            <p>Freshly woven pieces crafted from our finest silks and linens</p>
          </div>
          <Link to='/products' className='btn btn--outline'>View All Arrivals</Link>
        </div>

        <div className='homepage-new-arrivals__grid'>
          {newArrivals.map((item) => {
            const firstImage = item.images && item.images[0];
            return (
              <Link key={item._id} to={`/products/${item._id}`} className='homepage-new-arrivals__card'>
                <div className='placeholder-image'>
                  {firstImage ? (
                    <img src={getImageUrl(firstImage)} alt={item.name} />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
                <h4>{item.name}</h4>
                <p>{item.lowestPrice !== null ? `BHD ${item.lowestPrice}` : '—'}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Homepage;
