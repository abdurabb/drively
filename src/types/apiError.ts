export type ApiErrorBody = {
  success?: boolean;
  message?: string;
  code?: string;
  errors?: string[];
};

export type FieldErrors = Record<string, string>;
