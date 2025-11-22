import React, { useState, useEffect, useMemo } from 'react';

// Dynamically import all images from the carouselbanners folder
// When new images are added to the folder, they will be included after rebuild
const bannerModules = import.meta.glob('/public/carouselbanners/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
});

export const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract banner URLs from the imported modules
  const banners = useMemo(() => {
    return Object.keys(bannerModules)
      .sort()
      .map((path) => {
        // Convert /public/carouselbanners/banner1.png to /carouselbanners/banner1.png
        return path.replace('/public', '');
      });
  }, []);

  // Auto-rotate every 2.5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Don't render if no banners
  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 py-3">
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ aspectRatio: '2 / 1' }}>
        {banners.map((banner, index) => (
          <img
            key={banner}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Indicator dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
