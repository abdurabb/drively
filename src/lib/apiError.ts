import type { ApiErrorBody, FieldErrors } from "@/src/types/apiError";

const FIELD_NAMES = ["name", "email", "password", "phone", "role"] as const;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly errors: string[];
  readonly fields: FieldErrors;
  readonly data?: Record<string, unknown>;

  constructor({
    message,
    status,
    code,
    errors = [],
    fields = {},
    data,
  }: {
    message: string;
    status: number;
    code?: string;
    errors?: string[];
    fields?: FieldErrors;
    data?: Record<string, unknown>;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.fields = fields;
    this.data = data;
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

function readIssue(issue: unknown) {
  if (typeof issue === "string") {
    return { text: issue, field: undefined as string | undefined };
  }

  if (!issue || typeof issue !== "object") {
    return { text: "", field: undefined as string | undefined };
  }

  const record = issue as { field?: unknown; message?: unknown };

  return {
    text: typeof record.message === "string" ? record.message : "",
    field: typeof record.field === "string" ? record.field : undefined,
  };
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
  const rawErrors = Array.isArray(payload.errors) ? payload.errors : [];
  const stringIssues = rawErrors.filter(
    (issue): issue is string => typeof issue === "string",
  );
  const fields = mapJoiErrors(stringIssues);
  const errors: string[] = [];

  for (const issue of rawErrors) {
    const parsed = readIssue(issue);

    if (!parsed.text) {
      continue;
    }

    errors.push(parsed.field ? `${parsed.field}: ${parsed.text}` : parsed.text);

    if (parsed.field && !fields[parsed.field]) {
      fields[parsed.field] = parsed.text;
    }
  }

  const message =
    (typeof payload.message === "string" && payload.message) ||
    errors[0] ||
    fallback;

  return new ApiError({
    message,
    status,
    code: payload.code,
    errors,
    fields,
    data:
      payload.data && typeof payload.data === "object" ? payload.data : undefined,
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
