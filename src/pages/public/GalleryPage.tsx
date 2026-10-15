import { useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEMO_GALLERY } from '../../data/demoData';
import { formatDate } from '../../utils/helpers';

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = DEMO_GALLERY.filter((g) => g.publishStatus === 'published');

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-50 mb-4">
          <Image className="w-7 h-7 text-pink-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Society Gallery</h1>
        <p className="text-gray-500">Photographs from community events and activities.</p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No photographs published yet.</p>
          <p className="text-sm mt-1">Check back after upcoming events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2"
              aria-label={`View ${img.title}`}
            >
              <img
                src={img.thumbnailUrl ?? img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100">
                <div className="text-white text-xs font-medium truncate">{img.title}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-8 text-center">
        All photographs are published with appropriate permission. If you have concerns about any image,
        please contact the RWA at burariektasocietyrwa@gmail.com.
      </p>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-4xl max-h-full flex flex-col items-center gap-3">
            <img
              src={images[lightboxIndex].imageUrl}
              alt={images[lightboxIndex].title}
              className="max-h-[75vh] max-w-full rounded-lg object-contain"
            />
            <div className="text-center">
              <p className="text-white font-medium">{images[lightboxIndex].title}</p>
              {images[lightboxIndex].eventName && (
                <p className="text-gray-400 text-sm">{images[lightboxIndex].eventName}</p>
              )}
              {images[lightboxIndex].description && (
                <p className="text-gray-400 text-sm">{images[lightboxIndex].description}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {images[lightboxIndex].createdAt ? formatDate(images[lightboxIndex].createdAt) : ''}
              </p>
            </div>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
