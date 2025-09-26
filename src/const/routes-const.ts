import { join } from "path";

// Auth routes
export const SIGN_IN_ROUTE = "/auth/sign-in";
export const SIGN_UP_BASE_ROUTE = "/auth/sign-up";
export const SIGN_UP_EMAIL_VERIFICATION_ROUTE = join(SIGN_UP_BASE_ROUTE, "/email-verification");
export const FORGOT_PASSWORD_BASE_ROUTE = "/auth/forgot-password";
export const FORGOT_PASSWORD_EMAIL_INPUT_ROUTE = join(FORGOT_PASSWORD_BASE_ROUTE, "/email-input");
export const FORGOT_PASSWORD_RESET_PASSWORD_ROUTE = join(FORGOT_PASSWORD_BASE_ROUTE, "/reset-password");
