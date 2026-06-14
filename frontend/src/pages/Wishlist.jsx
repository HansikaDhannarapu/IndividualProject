import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import StatusMessage from '../components/StatusMessage';
import { getWishlist, toggleWishlist } from '../services/wishlistService';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('Loading wishlist...');

  useEffect(() => {
    getWishlist()
      .then((data) => {
        setProducts(data);
        setStatus('');
      })
      .catch((err) => setStatus(err.message));
  }, []);

  const remove = async (productId) => {
    await toggleWishlist(productId);
    setProducts((items) => items.filter((item) => item._id !== productId));
  };

  return (
    <main>
      <PageHeader title="Wishlist" action={<Link className="button secondary" to="/">Browse products</Link>} />
      <StatusMessage>{status}</StatusMessage>
      <section className="grid">
        {products.map((product) => (
          <ProductCard key={product._id} onRemove={remove} product={product} />
        ))}
      </section>
      {!status && products.length === 0 && <StatusMessage>Your wishlist is empty.</StatusMessage>}
    </main>
  );
};

export default Wishlist;
