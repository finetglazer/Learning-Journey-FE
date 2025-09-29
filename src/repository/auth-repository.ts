import { Model } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = "http://localhost:8081/api/users/auth";
const API_SIGN_IN = "/login";
const API_SIGN_UP = "/register";
const API_VERIFY_OTP = "/verify";
const API_CHANGE_PASSWORD = "/change-password";
const API_RESET_PASSWORD = "/reset-password";
const API_RESET_PASSWORD_SEND_EMAIL = "/forgot-password";

export class AuthRepository extends BaseRepository {
    constructor() {
        super(BASE_API_URL);
    };

    public signIn = (form?: Model): Observable<any> => {
        return this.http.post(API_SIGN_IN, form)
            .pipe(map(res => res?.data));
    };

    public signUp = (form?: Model): Observable<any> => {
        return this.http.post(API_SIGN_UP, form)
            .pipe(map(res => res?.data));
    };

    public verifyOtp = (form?: Model): Observable<any> => {
        return this.http.get(API_VERIFY_OTP, {
            params: {
                token: form?.otp
            }
        })
            .pipe(map(res => res?.data));
    };

    public changePassword = (form?: Model): Observable<any> => {
        return this.http.post(API_CHANGE_PASSWORD, form)
            .pipe(map(res => res?.data));
    };

    public resetPassword = (form?: Model): Observable<any> => {
        return this.http.post(API_RESET_PASSWORD, form)
            .pipe(map(res => res?.data));
    };

    public resetPasswordSendEmail = (form?: Model): Observable<any> => {
        return this.http.post(API_RESET_PASSWORD_SEND_EMAIL, form)
            .pipe(map(res => res?.data));
    };
};

export const authRepository = new AuthRepository();