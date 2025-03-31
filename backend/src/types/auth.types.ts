export type User = {
  id: string;
  email: string;
  password?: string;
  created_at: string;
};

export type AuthRequest = {
  email: string;
  password: string;
};