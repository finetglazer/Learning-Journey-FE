import { BaseRepository } from "@/repository/base-repository";
import { map, Observable } from "rxjs";

// 1. Define both Base URLs
const CALENDAR_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/calendar/constraints";
const USER_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/users/constraints";

const API_SLEEP_HOURS = "/sleep-hours";
const API_DAILY_LIMITS = "/daily-limits";
const API_TIMEZONE = "/timezone";

export class SettingsRepository extends BaseRepository {
    constructor(userId: number) {
        // 2. Initialize with the Calendar URL as the default
        super(userId, CALENDAR_BASE_URL);
    }

    // --------------------------
    // 💤 Sleep Hours (Uses Calendar Base)
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
    // ⏰ Daily Limits (Uses Calendar Base)
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
    // 🌍 Timezone (Uses User Base)
    // --------------------------

    /** Get user's timezone */
    public getTimeZone = (): Observable<any> => {
        // 3. Override the base URL by passing the full path
        const fullUrl = USER_BASE_URL + API_TIMEZONE;
        return this.http.get(fullUrl).pipe(map(res => res?.data));
    };

    /** Update user's timezone */
    public updateTimeZone = (payload: any): Observable<any> => {
        // 3. Override the base URL by passing the full path
        const fullUrl = USER_BASE_URL + API_TIMEZONE;
        return this.http.put(fullUrl, payload).pipe(map(res => res?.data));
    };
}

export const settingsRepositoryCons = (userId: number) => new SettingsRepository(userId);