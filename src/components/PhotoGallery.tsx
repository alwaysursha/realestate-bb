import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Pagination, EffectFade } from 'swiper/modules';
import 'photoswipe/style.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export default function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [swiper, setSwiper] = useState<any>(null);

  const openPhotoSwipe = async (index: number) => {
    const PhotoSwipeLightbox = (await import('photoswipe/lightbox')).default;

    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    lightbox.init();
    lightbox.loadAndOpen(index);
  };

  return (
    <>
      <div className="relative" id="gallery">
        <Swiper
          modules={[Navigation, Keyboard, Pagination, EffectFade]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          navigation
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          onSwiper={setSwiper}
          className="h-[400px] rounded-xl"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="relative group cursor-pointer">
              <a
                href={image}
                data-pswp-width="1200"
                data-pswp-height="800"
                className="relative h-full w-full block"
                onClick={(e) => {
                  e.preventDefault();
                  openPhotoSwipe(index);
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
} 