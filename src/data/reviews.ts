import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 5,
    comment: 'Manish did an incredible job capturing our wedding day. The photos are absolutely stunning and exactly what we wanted!',
    serviceType: 'wedding',
    createdAt: '2024-02-15',
  },
  {
    id: '2',
    userId: '3',
    userName: 'David Chen',
    userAvatar: 'https://images.pexels.com/photos/936090/pexels-photo-936090.jpeg',
    rating: 5,
    comment: 'Our pre-wedding shoot was amazing! Manish made us feel comfortable and the photos turned out beautifully.',
    serviceType: 'pre-wedding',
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    userId: '4',
    userName: 'Priya Patel',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    rating: 4,
    comment: 'Great experience working with Manish for our corporate event photography.',
    serviceType: 'event',
    createdAt: '2024-02-05',
  },
];