import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';

const ProductCard = ({ product, isWishlisted = false, onToggleWishlist, onRemove }) => {
  const cardClass = onToggleWishlist ? 'productCard productCardInteractive' : 'productCard';

  return (
    <article className={cardClass}>
      {onToggleWishlist && (
        <button
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={isWishlisted ? 'wishlistButton active' : 'wishlistButton'}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleWishlist(product._id);
          }}
          type="button"
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      )}
      <Link to={`/products/${product._id}`}>
        <ProductImage product={product} />
        <div>
          <p className="meta">
            {onRemove
              ? product.status
              : `${product.quickSell ? 'Quick Sell | ' : ''}${product.condition} | ${product.pickupLocation}`}
          </p>
          {!onRemove && <p className={`badge ${product.status}`}>{product.status}</p>}
          <h2>{product.name}</h2>
          {!onRemove && <p>{product.description}</p>}
          <strong>Rs. {product.price}</strong>
        </div>
      </Link>
      {onRemove && (
        <div className="cardActions">
          <Link to={`/products/${product._id}`}>View</Link>
          <button onClick={() => onRemove(product._id)}>Remove</button>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
