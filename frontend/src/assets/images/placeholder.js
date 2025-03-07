import { placeholders as generatePlaceholders } from '../../utils/placeholderUtils';

// This file provides reliable image placeholders using CSS-based solutions instead of external services

/**
 * Creates a colored rectangle with optional text as a placeholder
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels  
 * @param {string} text - Optional text to display
 * @param {string} bgColor - Background color (hex or name)
 * @param {string} textColor - Text color (hex or name)
 * @returns {string} - Data URL for the placeholder
 */
export const generatePlaceholder = (width, height, text = '', bgColor = '#e2e8f0', textColor = '#475569') => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Get the drawing context
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add text if provided
  if (text) {
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.floor(width/20)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
  }
  
  // Convert to data URL
  return canvas.toDataURL('image/png');
};

/**
 * Predefined placeholders for common use cases throughout the app
 */
export const placeholders = {
  ...generatePlaceholders
};

/**
 * Fallback image in case of loading errors
 */
export const fallbackImage = (width = 100, height = 100) =>
  generatePlaceholder(width, height, 'Image Not Found', '#f3f4f6', '#6b7280');
