import React, { useState } from 'react';
import { fallbackImage } from '../assets/images/placeholder';

/**
 * Image component with built-in error handling and fallback
 */
const ImageWithFallback = ({ 
  src, 
  alt, 
  fallbackSrc, 
  width = 300, 
  height = 200, 
  className = '',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc || fallbackImage(width, height));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;
