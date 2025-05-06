import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
}) => {
  const hoverStyles = hoverEffect
    ? 'hover:shadow-xl transition-shadow duration-300'
    : '';

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5 } : undefined}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
}

const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'landscape',
}) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
  };

  return (
    <div className={`${aspectRatioClasses[aspectRatio]} overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 dark:text-white mb-2 ${className}`}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`text-gray-600 dark:text-gray-300 ${className}`}>
      {children}
    </p>
  );
};

Card.Image = CardImage;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;