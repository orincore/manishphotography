import api from './api';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  bio: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamResponse {
  message: string;
  members: TeamMember[];
}

const teamService = {
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await api.get<TeamResponse>('/team');
    return response.data.members;
  },
};

export default teamService; 