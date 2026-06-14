import React, { useEffect, useState } from 'react';

const ProductImage = ({ product, className = 'imageSlot' }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images || [];
  const imageSrc = images[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [product._id, images.length]);

  const handleImageError = () => {
    setImageIndex((current) => current + 1);
  };

  return (
    <div className={className}>
      {imageSrc ? (
        <img src={imageSrc} alt={product.name} onError={handleImageError} />
      ) : (
        <span>{product.category}</span>
      )}
    </div>
  );
};

export default ProductImage;
