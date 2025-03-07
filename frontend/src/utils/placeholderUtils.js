/**
 * Generate a data URI for a simple colored placeholder with text
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @param {string} text - Text to display on the placeholder
 * @param {string} bgColor - Background color (hex)
 * @returns {string} - Data URI for the placeholder image
 */
export const generatePlaceholder = (width, height, text, bgColor = '#E2E8F0') => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw text
  ctx.fillStyle = '#475569';
  ctx.font = `bold ${Math.floor(height/10)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width/2, height/2);

  // Return as data URI
  return canvas.toDataURL('image/png');
};

/**
 * Generate a colored avatar placeholder with initials
 * @param {string} initial - Initial letter to display
 * @param {number} size - Size of the avatar
 * @returns {string} - Data URI for the avatar placeholder
 */
export const generateAvatarPlaceholder = (initial, size = 48) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Get a color based on the initial
  const colors = ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
  
  // Draw circle background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw initial
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.floor(size/2)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial.toUpperCase(), size/2, size/2);
  
  return canvas.toDataURL('image/png');
};

// Export placeholder utility functions
export const placeholders = {
  image: (width, height, text) => generatePlaceholder(width, height, text),
  profileImage: (initial) => generateAvatarPlaceholder(initial),
  logo: () => generatePlaceholder(120, 40, 'GlowSpace', '#CBD5E1'),
  illustration: () => generatePlaceholder(600, 400, 'Illustration', '#DBEAFE'),
  contactUs: () => generatePlaceholder(600, 400, 'Contact Us', '#E0E7FF'),
  healingConnect: () => generatePlaceholder(600, 400, 'Healing Connect', '#FCE7F3'),
  mentalHealth: () => generatePlaceholder(600, 400, 'Mental Health', '#DBEAFE'),
};
