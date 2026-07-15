import { strings } from '../constants/strings';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_NAME_LENGTH = 3;
export const MIN_USERNAME_LENGTH = 3;

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return strings.validation.nameRequired;
  if (trimmed.length < MIN_NAME_LENGTH) return strings.validation.nameMin(MIN_NAME_LENGTH);
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return strings.validation.emailRequired;
  if (!EMAIL_REGEX.test(trimmed)) return strings.validation.emailInvalid;
  return undefined;
}

export function validateUsername(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return strings.validation.usernameRequired;
  if (trimmed.length < MIN_USERNAME_LENGTH) return strings.validation.usernameMin(MIN_USERNAME_LENGTH);
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return strings.validation.passwordRequired;
  if (value.length < MIN_PASSWORD_LENGTH) return strings.validation.passwordMin(MIN_PASSWORD_LENGTH);
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
