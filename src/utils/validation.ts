const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 3;
const MIN_USERNAME_LENGTH = 3;

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Nama wajib diisi';
  if (trimmed.length < MIN_NAME_LENGTH) return `Nama minimal ${MIN_NAME_LENGTH} karakter`;
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Email wajib diisi';
  if (!EMAIL_REGEX.test(trimmed)) return 'Format email tidak valid';
  return undefined;
}

export function validateUsername(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Username wajib diisi';
  if (trimmed.length < MIN_USERNAME_LENGTH) return `Username minimal ${MIN_USERNAME_LENGTH} karakter`;
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password wajib diisi';
  if (value.length < MIN_PASSWORD_LENGTH) return `Password minimal ${MIN_PASSWORD_LENGTH} karakter`;
  return undefined;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {
    username: validateUsername(values.username),
    password: validatePassword(values.password),
  };
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  ) as LoginFormErrors;
}

export interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterFormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {
    name: validateName(values.name),
    username: validateUsername(values.username),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  ) as RegisterFormErrors;
}

export function isFormValid(errors: object): boolean {
  return Object.keys(errors).length === 0;
}
