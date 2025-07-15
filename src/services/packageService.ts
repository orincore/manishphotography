import api from './api';

export interface Package {
  id: string;
  name: string;
  color: string;
  features: string[];
  note?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PackagesResponse {
  message: string;
  packages: Package[];
  total: number;
}

const packageService = {
  // Get all packages
  async getAll() {
    const res = await api.get('/portfolio/packages');
    return res.data;
  },

  // Get a single package by ID
  async getById(id: string) {
    const res = await api.get(`/portfolio/packages/${id}`);
    return res.data.package;
  },

  // Create a new package (admin)
  async create(pkg: Omit<Package, 'id' | 'created_at' | 'updated_at'>) {
    const res = await api.post('/portfolio/packages', pkg);
    return res.data.package;
  },

  // Update a package (admin)
  async update(id: string, pkg: Partial<Omit<Package, 'id' | 'created_at' | 'updated_at'>>) {
    const res = await api.put(`/portfolio/packages/${id}`, pkg);
    return res.data.package;
  },

  // Delete a package (admin)
  async remove(id: string) {
    await api.delete(`/portfolio/packages/${id}`);
  },
};

export default packageService; 