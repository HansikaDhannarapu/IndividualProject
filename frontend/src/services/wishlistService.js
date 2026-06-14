import { apiRequest } from './api';

export const WISHLIST_UPDATED_EVENT = 'wishlistUpdated';

export const getWishlistIds = (items) => items.map((item) => item._id || item.toString());

export const notifyWishlistUpdated = (productIds = []) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(WISHLIST_UPDATED_EVENT, {
      detail: { productIds: productIds.map((id) => id.toString()) },
    })
  );
};

export const getWishlist = () => apiRequest('/api/wishlist');

export const toggleWishlist = async (productId) => {
  const data = await apiRequest('/api/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });

  notifyWishlistUpdated(data.products || []);
  return data;
};
