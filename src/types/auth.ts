export type UserRole = "admin" | "vendor" | "customer";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
};

export type OtpType = "email" | "phone";

export type SendOtpInput =
  | {
      otpType: "email";
      email: string;
    }
  | {
      otpType: "phone";
      phone: string;
    };

export type VerifyOtpInput = SendOtpInput & {
  code: string;
};

export type SendOtpResponse = {
  message: string;
};

export type VerifyOtpAuthResponse = {
  success: true;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export type VerifyOtpPendingResponse = {
  success: true;
  message?: string;
  data: {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    email?: string;
    phone?: string;
  };
};

export type VerifyOtpResponse = VerifyOtpAuthResponse | VerifyOtpPendingResponse;

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

