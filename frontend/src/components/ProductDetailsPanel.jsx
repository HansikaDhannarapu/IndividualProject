import React from 'react';
import { Link } from 'react-router-dom';

const ProductDetailsPanel = ({ product, rating, isWishlisted, onMessageSeller, onSaveProduct }) => (
  <>
    <p className="meta">{product.quickSell ? 'Quick Sell | ' : ''}{product.category} | {product.condition} | {product.status}</p>
    <h1>{product.name}</h1>
    <strong className="price">Rs. {product.price}</strong>
    <p>{product.description}</p>
    {product.bundleItems?.length > 0 && <p><strong>Bundle:</strong> {product.bundleItems.join(', ')}</p>}
    <dl>
      <div><dt>Seller</dt><dd><Link to={`/sellers/${product.seller?._id}`}>{product.seller?.name || 'Campus seller'}</Link></dd></div>
      <div><dt>Trust score</dt><dd>{rating.count ? `${rating.average} / 5 Trusted Seller` : 'New seller'}</dd></div>
      <div><dt>Pickup</dt><dd>{product.pickupLocation}</dd></div>
      <div><dt>Age</dt><dd>{product.age || 'Not specified'}</dd></div>
      <div><dt>Views</dt><dd>{product.views}</dd></div>
    </dl>
    <div className="heroActions">
      <button className="button primary" onClick={onMessageSeller}>Message seller</button>
      <button
        className={isWishlisted ? 'button secondary wishlistSavedAction' : 'button secondary'}
        onClick={onSaveProduct}
      >
        {isWishlisted ? 'Wishlisted' : 'Save to wishlist'}
      </button>
      <Link className="button secondary" to="/">Back to listings</Link>
    </div>
  </>
);

export default ProductDetailsPanel;
