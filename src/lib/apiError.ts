import type { ApiErrorBody, FieldErrors } from "@/src/types/apiError";

const FIELD_NAMES = ["name", "email", "password", "phone", "role"] as const;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly errors: string[];
  readonly fields: FieldErrors;

  constructor({
    message,
    status,
    code,
    errors = [],
    fields = {},
  }: {
    message: string;
    status: number;
    code?: string;
    errors?: string[];
    fields?: FieldErrors;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.fields = fields;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function mapJoiErrors(errors: string[]): FieldErrors {
  const fields: FieldErrors = {};

  for (const error of errors) {
    const field = FIELD_NAMES.find((name) =>
      error.toLowerCase().includes(`"${name}"`),
    );

    if (field && !fields[field]) {
      fields[field] = error;
    }
  }

  return fields;
}

export function createApiError(
  status: number,
  body: unknown,
  fallback = "Something went wrong. Please try again.",
): ApiError {
  if (!body || typeof body !== "object") {
    return new ApiError({ message: fallback, status });
  }

  const payload = body as ApiErrorBody;
  const errors = Array.isArray(payload.errors) ? payload.errors : [];
  const message = payload.message || errors[0] || fallback;

  return new ApiError({
    message,
    status,
    code: payload.code,
    errors,
    fields: mapJoiErrors(errors),
  });
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
