import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import PasswordSettings from '../components/PasswordSettings';
import ProductCard from '../components/ProductCard';
import ProfileSummary from '../components/ProfileSummary';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';
import { getWishlist, toggleWishlist } from '../services/wishlistService';

const Profile = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [status, setStatus] = useState('Loading profile...');
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);

  useEffect(() => {
    getWishlist()
      .then((items) => {
        setWishlist(items);
        setStatus('');
      })
      .catch((err) => setStatus(err.message));
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      setWishlist((items) => items.filter((item) => item._id !== productId));
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <main>
      <PageHeader title="Profile" />
      <ProfileSummary
        onPasswordClick={() => setShowPasswordSettings((current) => !current)}
        user={user}
      />
      {showPasswordSettings && <PasswordSettings />}

      <section className="sectionHeader">
        <h2>Wishlist</h2>
        <span>{wishlist.length} saved</span>
      </section>
      <StatusMessage>{status}</StatusMessage>
      <section className="grid">
        {wishlist.map((product) => (
          <ProductCard key={product._id} onRemove={removeFromWishlist} product={product} />
        ))}
      </section>
      {!status && wishlist.length === 0 && <StatusMessage>Your wishlist is empty.</StatusMessage>}
    </main>
  );
};

export default Profile;
