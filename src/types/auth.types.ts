export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: number;
  firstName: string;
  email: string;
}
