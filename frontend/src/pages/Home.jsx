import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceHero from '../components/MarketplaceHero';
import PaginationControls from '../components/PaginationControls';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import StatusMessage from '../components/StatusMessage';
import { getStoredUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/productService';
import { getWishlist, getWishlistIds, toggleWishlist, WISHLIST_UPDATED_EVENT } from '../services/wishlistService';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [filters, setFilters] = useState({
    category: '',
    sort: 'newest',
    search: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('Loading listings...');

  useEffect(() => {
    const load = async () => {
      try {
        setStatus('Loading listings...');
        const data = await getProducts({ ...filters, limit: 8 });
        setProducts(data.products);
        const flaggedWishlistIds = data.products
          .filter((product) => product.isWishlisted)
          .map((product) => product._id.toString());
        if (flaggedWishlistIds.length) {
          setWishlistIds((current) => new Set([...current, ...flaggedWishlistIds]));
        }
        setPagination(data.pagination);
        setStatus('');
      } catch (err) {
        setStatus(err.message);
      }
    };

    load();
  }, [filters]);

  const loadWishlist = async () => {
    if (!getStoredUser()) {
      setWishlistIds(new Set());
      return;
    }

    try {
      const items = await getWishlist();
      setWishlistIds(new Set(getWishlistIds(items)));
    } catch {
      setWishlistIds(new Set());
    }
  };

  useEffect(() => {
    const handleWishlistUpdated = (event) => {
      if (event.detail?.productIds) {
        setWishlistIds(new Set(event.detail.productIds));
        return;
      }

      loadWishlist();
    };

    loadWishlist();
    window.addEventListener('focus', loadWishlist);
    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);

    return () => {
      window.removeEventListener('focus', loadWishlist);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    };
  }, [user]);

  const saveProduct = async (productId) => {
    if (!getStoredUser()) {
      navigate('/login');
      return;
    }

    const normalizedProductId = productId.toString();
    const wasWishlisted = wishlistIds.has(normalizedProductId);
    setWishlistIds((current) => {
      const next = new Set(current);
      if (wasWishlisted) next.delete(normalizedProductId);
      else next.add(normalizedProductId);
      return next;
    });

    try {
      const data = await toggleWishlist(productId);
      setWishlistIds((current) => {
        if (!Array.isArray(data.products)) return current;
        return new Set(data.products.map((id) => id.toString()));
      });
    } catch (err) {
      setWishlistIds((current) => {
        const next = new Set(current);
        if (wasWishlisted) next.add(normalizedProductId);
        else next.delete(normalizedProductId);
        return next;
      });
      setStatus(err.message);
    }
  };

  const stats = useMemo(() => {
    const total = pagination.total;
    const low = products.filter((item) => item.price <= 500).length;
    return { total, low };
  }, [products, pagination.total]);

  return (
    <main>
      <MarketplaceHero budgetFinds={stats.low} totalListings={stats.total} />
      <ProductFilters filters={filters} onChange={setFilters} />

      <StatusMessage>{status}</StatusMessage>
      <section className="grid">
        {products.map((product) => (
          <ProductCard
            isWishlisted={wishlistIds.has(product._id.toString())}
            key={product._id}
            onToggleWishlist={saveProduct}
            product={product}
          />
        ))}
      </section>

      {!status && products.length === 0 && (
        <StatusMessage>No listings match these filters yet.</StatusMessage>
      )}

      <PaginationControls pagination={pagination} onPageChange={setFilters} />
    </main>
  );
};

export default Home;
