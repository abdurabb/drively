export type UserRole = "admin" | "vendor" | "customer";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
};

export type RegisterResponse = {
  success: true;
  message: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export type RefreshResponse = {
  success: true;
  accessToken: string;
};

