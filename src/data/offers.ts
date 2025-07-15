import { OfferItem } from '../types';
import logoImg from '../Assets/logo/IMG_0040.JPG';

export const offers: OfferItem[] = [
  {
    id: '1',
    title: 'Essential Wedding Package',
    description: 'Perfect for intimate weddings with essential coverage',
    price: 2500,
    discountedPrice: 2100,
    image: logoImg,
    features: [
      '8 hours of photography coverage',
      '1 photographer',
      'Online gallery with all edited photos',
      '100 high-resolution digital images',
      'Engagement session (1 hour)'
    ],
    expiryDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Premium Wedding Collection',
    description: 'Our most popular package for complete wedding day coverage',
    price: 4500,
    discountedPrice: 3800,
    image: logoImg,
    features: [
      '12 hours of photography coverage',
      '2 photographers',
      'Online gallery with all edited photos',
      '300 high-resolution digital images',
      'Engagement session (2 hours)',
      'Premium photo album',
      'Wedding day slideshow'
    ],
    popular: true,
    expiryDate: '2024-11-30',
  },
  {
    id: '3',
    title: 'Destination Wedding Package',
    description: 'Comprehensive coverage for your destination wedding',
    price: 7500,
    discountedPrice: 6500,
    image: logoImg,
    features: [
      '2 days of photography coverage',
      '2 photographers',
      'Online gallery with all edited photos',
      'All high-resolution digital images',
      'Engagement session (3 hours)',
      'Luxury photo album',
      'Wedding day slideshow',
      'Travel and accommodation included'
    ],
    expiryDate: '2024-10-15',
  },
  {
    id: '4',
    title: 'Pre-Wedding Shoot',
    description: 'Capture your love story before the big day',
    price: 1200,
    discountedPrice: 950,
    image: logoImg,
    features: [
      '4 hours of photography',
      '2 locations',
      'Online gallery',
      '75 high-resolution digital images',
      'Photo slideshow'
    ],
    expiryDate: '2024-09-30',
  },
];