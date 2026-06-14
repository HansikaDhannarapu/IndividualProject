import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSellerProducts } from '../services/productService';
import { getSellerRatings } from '../services/ratingService';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({ ratings: [], average: 0, count: 0 });
  const [status, setStatus] = useState('Loading seller profile...');

  useEffect(() => {
    Promise.all([getSellerProducts(sellerId), getSellerRatings(sellerId)])
      .then(([sellerProducts, sellerRatings]) => {
        setProducts(sellerProducts);
        setRatings(sellerRatings);
        setStatus('');
      })
      .catch((err) => setStatus(err.message));
  }, [sellerId]);

  const seller = products[0]?.seller;

  return (
    <main>
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Seller profile</p>
          <h1>{seller?.name || 'Campus seller'}</h1>
          <p className="status">{ratings.count ? `${ratings.average} / 5 Trusted Seller from ${ratings.count} rating(s)` : 'New seller'}</p>
        </div>
      </div>
      {status && <p className="status">{status}</p>}

      <section className="grid">
        {products.map((product) => (
          <Link className="productCard" to={`/products/${product._id}`} key={product._id}>
            <div className="imageSlot">
              {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <span>{product.category}</span>}
            </div>
            <div>
              <p className={`badge ${product.status}`}>{product.status}</p>
              <h2>{product.name}</h2>
              <strong>Rs. {product.price}</strong>
            </div>
          </Link>
        ))}
      </section>

      <section className="listStack">
        <h2>Ratings</h2>
        {ratings.ratings.map((rating) => (
          <article className="listItem" key={rating._id}>
            <div>
              <p className="meta">By {rating.buyer?.name || 'Buyer'}</p>
              <h2>{((rating.communication + rating.productQuality + rating.punctuality) / 3).toFixed(1)} / 5</h2>
              <p>{rating.comment || 'No comment'}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default SellerProfile;
