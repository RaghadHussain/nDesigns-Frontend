import { Link } from 'react-router';

const NEW_EDIT_ITEMS = [
  { id: 1, label: 'Minimalist Collection', name: 'Classic Crepe Abaya', price: 'BD 40' },
  { id: 2, label: 'Heritage Edit', name: 'Embellished Silk Jalabiya', price: 'BD 20' },
  { id: 3, label: 'Comfort Range', name: 'Linen Utility Outerwear', price: 'BD 22' },
  { id: 4, label: 'Evening Festive', name: 'Organza Flare Abaya', price: 'BD 20' },
];

function Homepage() {
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

        <div className='homepage-curation__grid'>
          <div className='homepage-curation__card'>
            <div className='placeholder-image'>
              <span>Luxury Abayas</span>
            </div>
            <div className='homepage-curation__card-footer'>
              <h3>The Abaya Range</h3>
              <Link to='/products'>View All</Link>
            </div>
          </div>

          <div className='homepage-curation__card'>
            <div className='placeholder-image'>
              <span>Elegant Jalabiyas</span>
            </div>
            <div className='homepage-curation__card-footer'>
              <h3>Classic Jalabiyas</h3>
              <Link to='/products'>View All</Link>
            </div>
          </div>
        </div>
      </section>

      <section className='homepage-new-edit'>
        <div className='homepage-new-edit__header'>
          <div>
            <h2>The New Edit</h2>
            <p>Freshly woven pieces crafted from our finest silks and linens</p>
          </div>
          <Link to='/products' className='btn btn--outline'>View All Arrivals</Link>
        </div>

        <div className='homepage-new-edit__grid'>
          {NEW_EDIT_ITEMS.map((item) => (
            <div key={item.id} className='homepage-new-edit__card'>
              <div className='placeholder-image'>
                <span>{item.label}</span>
              </div>
              <h4>{item.name}</h4>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='homepage-release'>
        <p className='eyebrow'>Limited Private Release</p>
        <h2>The Silk Heritage Collection is now available for pre order</h2>
        <Link to='/products' className='btn btn--primary'>Access Private Sale</Link>
      </section>
    </main>
  );
}

export default Homepage;
