import { map, Observable } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + "/users/profile";

export class UserRepository extends BaseRepository {
    constructor(userId: number) {
        super(userId, BASE_API_URL);
    };

    public getProfile = (): Observable<any> => {
        return this.http.get("")
            .pipe(map(res => res?.data));
    };

    public updateProfile = (body?: any): Observable<any> => {
        return this.http.put("", body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .pipe(map(res => res?.data));
    };
};

export const userRepositoryCons = (userId: number) => new UserRepository(userId);