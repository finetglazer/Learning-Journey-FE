import { BaseRepository } from "@/repository/base-repository";
import { map, Observable } from "rxjs";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + "/users/constraints";

const API_SLEEP_HOURS = "/sleep-hours";
const API_DAILY_LIMITS = "/daily-limits";
const API_TIMEZONE = "/timezone";

export class SettingsRepository extends BaseRepository {
    constructor() {
        super(BASE_API_URL);
    }

    // --------------------------
    // 💤 Sleep Hours
    // --------------------------

    /** Get user's sleep hours */
    public getSleepHours = (): Observable<any> => {
        return this.http.get(API_SLEEP_HOURS).pipe(map(res => res?.data));
    };

    /** Update user's sleep hours */
    public updateSleepHours = (payload: any): Observable<any> => {
        return this.http.put(API_SLEEP_HOURS, payload).pipe(map(res => res?.data));
    };

    // --------------------------
    // ⏰ Daily Limits
    // --------------------------

    /** Get user's daily limits */
    public getDailyLimits = (): Observable<any> => {
        return this.http.get(API_DAILY_LIMITS).pipe(map(res => res?.data));
    };

    /** Update user's daily limits */
    public updateDailyLimits = (payload: any): Observable<any> => {
        return this.http.put(API_DAILY_LIMITS, payload).pipe(map(res => res?.data));
    };

    // --------------------------
    // 🌍 Timezone
    // --------------------------

    /** Get user's timezone */
    public getTimeZone = (): Observable<any> => {
        return this.http.get(API_TIMEZONE).pipe(map(res => res?.data));
    };

    /** Update user's timezone */
    public updateTimeZone = (payload: any): Observable<any> => {
        return this.http.put(API_TIMEZONE, payload).pipe(map(res => res?.data));
    };
}

export const settingsRepository = new SettingsRepository();
