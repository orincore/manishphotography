import { VideoItem } from '../types';

export const videos: VideoItem[] = [
  {
    id: '1',
    title: 'Sarah & James Wedding Film',
    description: 'Cinematic wedding film captured in the mountains of Colorado',
    thumbnail: 'https://images.pexels.com/photos/2788488/pexels-photo-2788488.jpeg',
    videoUrl: 'https://example.com/videos/sarah-james-wedding',
    category: 'cinematics',
    featured: true,
    tags: ['wedding', 'cinematic', 'mountains'],
    createdAt: '2023-12-18',
  },
  {
    id: '2',
    title: 'Beach Destination Wedding',
    description: 'Tropical beach wedding in Bali',
    thumbnail: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
    videoUrl: 'https://example.com/videos/bali-destination-wedding',
    category: 'cinematics',
    featured: true,
    tags: ['destination', 'beach', 'tropical'],
    createdAt: '2023-10-05',
  },
  {
    id: '3',
    title: 'Urban Pre-Wedding',
    description: 'Stylish pre-wedding shoot in New York City',
    thumbnail: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
    videoUrl: 'https://example.com/videos/nyc-pre-wedding',
    category: 'cinematics',
    tags: ['pre-wedding', 'urban', 'city'],
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    title: 'Traditional Ceremony Highlights',
    description: 'Highlights from a traditional wedding ceremony',
    thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    videoUrl: 'https://example.com/videos/traditional-ceremony',
    category: 'cinematics',
    featured: true,
    tags: ['traditional', 'ceremony', 'highlights'],
    createdAt: '2023-11-28',
  },
];