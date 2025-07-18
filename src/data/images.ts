import { ImageItem } from '../types';

export const images: ImageItem[] = [
  {
    id: '1',
    title: 'Sunset Wedding Ceremony',
    description: 'Beautiful beachside wedding ceremony during sunset',
    src: 'https://images.pexels.com/photos/1231365/pexels-photo-1231365.jpeg',
    category: 'photos',
    subcategory: 'wedding',
    featured: true,
    tags: ['sunset', 'beach', 'wedding'],
    createdAt: '2023-11-15',
  },
  {
    id: '2',
    title: 'Couple Portrait Session',
    description: 'Intimate portrait session with the newlyweds',
    src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    category: 'photos',
    subcategory: 'wedding',
    featured: true,
    tags: ['couple', 'portrait', 'intimate'],
    createdAt: '2023-10-28',
  },
  {
    id: '3',
    title: 'Engagement Shoot',
    description: 'Urban engagement photoshoot in the city',
    src: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg',
    category: 'photos',
    subcategory: 'pre-wedding',
    featured: true,
    tags: ['engagement', 'urban', 'city'],
    createdAt: '2023-09-12',
  },
  {
    id: '4',
    title: 'Morning Preparations',
    description: 'Bride getting ready on her special day',
    src: 'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg',
    category: 'photos',
    subcategory: 'wedding',
    tags: ['bride', 'preparation', 'morning'],
    createdAt: '2023-12-05',
  },
  {
    id: '5',
    title: 'Golden Hour Silhouette',
    description: 'Romantic silhouette during golden hour',
    src: 'https://images.pexels.com/photos/1034859/pexels-photo-1034859.jpeg',
    category: 'photos',
    subcategory: 'pre-wedding',
    featured: true,
    tags: ['golden hour', 'silhouette', 'romantic'],
    createdAt: '2024-01-20',
  },
  {
    id: '6',
    title: 'Wedding Reception',
    description: 'Elegant reception venue decoration',
    src: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg',
    category: 'photos',
    subcategory: 'wedding',
    tags: ['reception', 'venue', 'decor'],
    createdAt: '2023-11-30',
  },
  {
    id: '7',
    title: 'Mountain Pre-Wedding',
    description: 'Adventure pre-wedding shoot in the mountains',
    src: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg',
    category: 'photos',
    subcategory: 'pre-wedding',
    tags: ['mountain', 'adventure', 'nature'],
    createdAt: '2023-08-18',
  },
  {
    id: '8',
    title: 'First Dance',
    description: 'Emotional first dance of the newlyweds',
    src: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    category: 'photos',
    subcategory: 'wedding',
    featured: true,
    tags: ['first dance', 'emotional', 'reception'],
    createdAt: '2024-02-14',
  },
];