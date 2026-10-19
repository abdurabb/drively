export type ApiErrorBody = {
  success?: boolean;
  message?: string;
  code?: string;
  errors?: unknown[];
  data?: Record<string, unknown>;
};

export type FieldErrors = Record<string, string>;
