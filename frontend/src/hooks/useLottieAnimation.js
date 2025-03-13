import { useState, useEffect } from 'react';

const useLottieAnimation = (url) => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setAnimationData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAnimation();
  }, [url]);

  return { animationData, loading, error };
};

export default useLottieAnimation; 