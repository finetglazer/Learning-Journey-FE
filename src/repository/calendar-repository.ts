import { map, Observable } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + "/calendar";

const API_GET_UNSCHEDULED_ITEMS = "/planning/unscheduled-items";
const API_GET_SCHEDULED_ITEMS = "/items";
const API_UPDATE_CALENDAR_ITEM = "/items/";
const API_GET_CALENDAR_ITEM = "/items";
const API_DELETE_CALENDAR_ITEM = "/items";
const API_CREATE_CALENDAR_ITEM = "/items/create";

export class CalendarRepository extends BaseRepository {
    constructor() {
        super(BASE_API_URL);
    };

    public getUnscheduledItems = (): Observable<any> => {
        return this.http.get(API_GET_UNSCHEDULED_ITEMS)
    };

    public getScheduledItems = (params: any): Observable<any> => {
        return this.http.get(API_GET_SCHEDULED_ITEMS, {
            params: {
                view: params?.view,
                date: params?.date, // YYYY-MM-DD
                calendarIds: params?.calendarId,
            }
        })
            .pipe(map(res => res?.data));
    };

    public updateCalendarItem = (itemId: number, body: any): Observable<any> => {
        return this.http.put(API_UPDATE_CALENDAR_ITEM + `/${itemId}`, {
            ...body,
            type: (body?.type || "").toUpperCase(),
            status: (body?.status || "").toUpperCase(),
        })
            .pipe(map(res => res?.data));
    };

    public getCalendarItem = (params: any): Observable<any> => {
        return this.http.get(API_GET_CALENDAR_ITEM + `/${params?.itemId}`)
        .pipe(map(res => res?.data));  
    };
    
    public deleteCalendarItem = (itemId: number): Observable<any> => {
        return this.http.delete(API_DELETE_CALENDAR_ITEM + `/${itemId}`)
            .pipe(map(res => res?.data));
    };

    public createCalendarItem = (body: any): Observable<any> => {
        return this.http.post(API_CREATE_CALENDAR_ITEM, {
            ...body,
            type: (body?.type || "").toUpperCase(),
            status: (body?.status || "").toUpperCase(),
        })
            .pipe(map(res => res?.data));
    };
};

export const calendarRepository = new CalendarRepository();