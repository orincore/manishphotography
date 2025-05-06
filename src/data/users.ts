import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    email: 'admin@manishphotography.com',
    firstName: 'Manish',
    lastName: 'Kumar',
    phoneNumber: '+1234567890',
    role: 'admin',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phoneNumber: '+0987654321',
    role: 'user',
    createdAt: '2023-05-15',
  },
  {
    id: '3',
    email: 'david@example.com',
    firstName: 'David',
    lastName: 'Chen',
    phoneNumber: '+1122334455',
    role: 'user',
    createdAt: '2023-07-22',
  },
  {
    id: '4',
    email: 'priya@example.com',
    firstName: 'Priya',
    lastName: 'Patel',
    phoneNumber: '+6677889900',
    role: 'user',
    createdAt: '2023-09-10',
  },
];