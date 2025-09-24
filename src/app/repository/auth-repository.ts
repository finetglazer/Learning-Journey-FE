import { Model } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = "localhost:8081/api/users/auth";
const API_SIGN_IN = "/login";

export class AuthRepository extends BaseRepository {
    constructor() {
        super(BASE_API_URL);
    };

    public signIn = (form?: Model): Observable<any> => {
        return this.http.post(API_SIGN_IN, form)
            .pipe(map(res => res?.data));
    };
};

export const authRepository = new AuthRepository();