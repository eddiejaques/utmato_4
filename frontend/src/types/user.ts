export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url?: string;
  // Add other fields as needed
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface Invite {
  id: string;
  email: string;
  role: string;
} 