import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductDetailsPanel from '../components/ProductDetailsPanel';
import ProductImage from '../components/ProductImage';
import StatusMessage from '../components/StatusMessage';
import { getStoredUser } from '../services/api';
import { createOrGetChat } from '../services/chatService';
import { getProduct } from '../services/productService';
import { createRating } from '../services/ratingService';
import { getSellerRatings } from '../services/ratingService';
import { markNotificationsRead } from '../services/notificationService';
import { createReport } from '../services/reportService';
import { getWishlist, getWishlistIds, toggleWishlist, WISHLIST_UPDATED_EVENT } from '../services/wishlistService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [reportReason, setReportReason] = useState('scam');
  const [ratingForm, setRatingForm] = useState({ communication: 5, productQuality: 5, punctuality: 5, comment: '' });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [status, setStatus] = useState('Loading product...');

  useEffect(() => {
    if (getStoredUser()) {
      markNotificationsRead({ type: 'priceDropped', link: `/products/${id}` }).catch(() => {});
    }

    getProduct(id)
      .then(async (data) => {
        setProduct(data);
        setIsWishlisted(Boolean(data.isWishlisted));
        setStatus('');
        if (data.seller?._id) {
          const ratingData = await getSellerRatings(data.seller._id);
          setRating(ratingData);
        }
      })
      .catch((err) => setStatus(err.message));
  }, [id]);

  const loadWishlistState = async () => {
    if (!getStoredUser()) {
      setIsWishlisted(false);
      return;
    }

    try {
      const items = await getWishlist();
      setIsWishlisted(getWishlistIds(items).includes(id));
    } catch {
      setIsWishlisted(false);
    }
  };

  useEffect(() => {
    const handleWishlistUpdated = (event) => {
      if (event.detail?.productIds) {
        setIsWishlisted(event.detail.productIds.includes(id));
        return;
      }

      loadWishlistState();
    };

    loadWishlistState();
    window.addEventListener('focus', loadWishlistState);
    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);

    return () => {
      window.removeEventListener('focus', loadWishlistState);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    };
  }, [id]);

  const requireLogin = () => {
    const user = getStoredUser();
    if (!user) {
      navigate('/login');
      return null;
    }
    return user;
  };

  const startChat = async () => {
    try {
      const user = requireLogin();
      if (!user) return;
      const chat = await createOrGetChat({ sellerId: product.seller._id, productId: product._id });
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const saveProduct = async () => {
    try {
      if (!requireLogin()) return;
      const data = await toggleWishlist(product._id);
      setIsWishlisted(data.saved);
      setStatus(data.saved ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const submitReport = async () => {
    try {
      if (!requireLogin()) return;
      await createReport({
        product: product._id,
        reportedUser: product.seller?._id,
        reason: reportReason,
        details: `Reported from product page: ${product.name}`,
      });
      setStatus('Report submitted to admin');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      if (!requireLogin()) return;
      await createRating({
        seller: product.seller?._id,
        product: product._id,
        communication: Number(ratingForm.communication),
        productQuality: Number(ratingForm.productQuality),
        punctuality: Number(ratingForm.punctuality),
        comment: ratingForm.comment,
      });
      const ratingData = await getSellerRatings(product.seller._id);
      setRating(ratingData);
      setStatus('Seller rating submitted');
    } catch (err) {
      setStatus(err.message);
    }
  };

  if (status && !product) return <main className="narrow"><StatusMessage>{status}</StatusMessage></main>;
  if (!product) return null;

  return (
    <main className="detail">
      <ProductImage className="detailImage" product={product} />
      <section>
        <ProductDetailsPanel
          isWishlisted={isWishlisted}
          onMessageSeller={startChat}
          onSaveProduct={saveProduct}
          product={product}
          rating={rating}
        />
        <div className="inlineForm">
          <select value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
            <option value="fake product">Fake product</option>
            <option value="scam">Scam</option>
            <option value="abusive seller">Abusive seller</option>
            <option value="wrong pricing">Wrong pricing</option>
          </select>
          <button className="button secondary" type="button" onClick={submitReport}>Report</button>
        </div>
        <form className="form ratingForm" onSubmit={submitRating}>
          <h2>Rate seller after transaction</h2>
          <div className="threeCol">
            <label>Communication<input type="number" min="1" max="5" value={ratingForm.communication} onChange={(e) => setRatingForm({ ...ratingForm, communication: e.target.value })} /></label>
            <label>Quality<input type="number" min="1" max="5" value={ratingForm.productQuality} onChange={(e) => setRatingForm({ ...ratingForm, productQuality: e.target.value })} /></label>
            <label>Punctuality<input type="number" min="1" max="5" value={ratingForm.punctuality} onChange={(e) => setRatingForm({ ...ratingForm, punctuality: e.target.value })} /></label>
          </div>
          <input value={ratingForm.comment} onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })} placeholder="Optional comment" />
          <button className="button secondary" type="submit">Submit rating</button>
        </form>
        <StatusMessage>{status}</StatusMessage>
      </section>
    </main>
  );
};

export default ProductDetails;
