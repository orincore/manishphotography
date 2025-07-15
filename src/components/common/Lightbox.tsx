import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: string;
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  initialIndex?: number;
}

const Lightbox: React.FC<LightboxProps> = ({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case 'r':
          e.preventDefault();
          resetView();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, zoom]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetView();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetView();
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.1));
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setDragOffset({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-100"
        style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              onClick={goToPrevious}
            >
              <ChevronLeft size={32} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              onClick={goToNext}
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Image Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded"
            onClick={zoomIn}
            title="Zoom In (+)"
          >
            <ZoomIn size={20} />
          </button>
          <button
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded"
            onClick={zoomOut}
            title="Zoom Out (-)"
          >
            <ZoomOut size={20} />
          </button>
          <button
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded"
            onClick={rotateImage}
            title="Rotate (R)"
          >
            <RotateCw size={20} />
          </button>
          <button
            className="p-2 text-white hover:text-gray-300 transition-colors border border-white rounded bg-black bg-opacity-50"
            onClick={resetView}
            title="Reset View (R)"
          >
            Reset
          </button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Main Image */}
        <div className="relative max-w-full max-h-full p-4">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-[100vw] max-h-[100vh] object-contain select-none"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                margin: 0,
                padding: 0,
                display: 'block',
                background: '#000',
                userSelect: 'none',
              }}
              draggable={false}
              onContextMenu={e => e.preventDefault()}
            />
          </motion.div>
        </div>

        {/* Image Info */}
        {(currentImage.title || currentImage.description) && (
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-black bg-opacity-50 text-white p-4 rounded">
            {currentImage.title && (
              <h3 className="text-lg font-semibold mb-2">{currentImage.title}</h3>
            )}
            {currentImage.description && (
              <p className="text-gray-300">{currentImage.description}</p>
            )}
          </div>
        )}

        {/* Keyboard Shortcuts Info */}
        <div className="absolute bottom-4 right-4 z-10 text-white text-xs opacity-70">
          <div>← → Navigate</div>
          <div>+ - Zoom</div>
          <div>R Rotate</div>
          <div>ESC Close</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox; 