import { map, Observable } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + "/calendar";

const API_GET_UNSCHEDULED_ITEMS = "/planning/unscheduled-items";
const API_GET_SCHEDULED_ITEMS = "/items";
const API_UPDATE_CALENDAR_ITEM = "/items/";
const API_GET_CALENDAR_ITEM = "/items";
const API_DELETE_CALENDAR_ITEM = "/items";
const API_CREATE_CALENDAR_ITEM = "/items/create";
const API_GET_MONTH_PLANNING_ITEMS = "/planning/months";
const API_UPDATE_MONTH_PLANNING_ROUTINES = "/planning/months";
const API_GET_BIG_TASK = "/planning/months";
const API_UPDATE_UNSCHEDULED_TASK = "/planning/months";
const API_UPDATE_BIG_TASK = "/planning/months";
const API_UPDATE_ROUTINE_LIST = "/planning/months/";
const API_CREATE_BIG_TASK = "/planning/months";
const API_CREATE_UNSCHEDULED_TASK = "/planning/months";
const API_DELETE_BIG_TASK = "/planning/months";
const API_CREATE_MONTH_PLANNING_EVENT = "/planning/months";
const API_CREATE_MONTH_PLAN = "/planning/months";

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

    public getCalendars = (): Observable<any> => {
        return this.http.get("")
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

    public getMonthPlaningItems = (params: any): Observable<any> => {
        return this.http.get(API_GET_MONTH_PLANNING_ITEMS + `/${params?.monthPlanId}`)
            .pipe(map(res => res?.data));
    };

    public getMonthPlanIdByDate = (params: { year: number, month: number }): Observable<any> => {
        return this.http.get(API_GET_MONTH_PLANNING_ITEMS, {
            params: {
                year: params.year,
                month: params.month,
            }
        })
            .pipe(map(res => res?.data));
    };

    public updateMonthPlanRoutines = (monthPlanId: number, body: any): Observable<any> => {
        return this.http.put(API_UPDATE_MONTH_PLANNING_ROUTINES + `/${monthPlanId}/routines`, body)
            .pipe(map(res => res?.data));
    };

    public getBigTask = (params: any): Observable<any> => {
        return this.http.get(API_GET_BIG_TASK + `/${params.monthPlanId}/big-tasks/${params.bigTaskId}`)
            .pipe(map(res => res?.data));
    };

    public createBigTask = (params: any, body: any): Observable<any> => {
        return this.http.post(API_CREATE_BIG_TASK + `/${params.monthPlanId}/big-tasks`, body)
            .pipe(map(res => res?.data));
    };

    public createUnscheduledTask = (params: any, body: any): Observable<any> => {
        return this.http.post(API_CREATE_UNSCHEDULED_TASK + `/${params.monthPlanId}/big-tasks/${params.bigTaskId}/unscheduled-tasks`, body)
            .pipe(map(res => res?.data));
    };

    public updateUnscheduledTask = (params: any, body: any): Observable<any> => {
        return this.http.put(API_UPDATE_UNSCHEDULED_TASK + `/${params.monthPlanId}/big-tasks/${params.bigTaskId}/unscheduled-tasks/${params.unscheduledTaskId}`, body)
            .pipe(map(res => res?.data));
    };

    public updateBigTask = (params: any, body: any): Observable<any> => {
        return this.http.put(API_UPDATE_BIG_TASK + `/${params.monthPlanId}/big-tasks/${params.bigTaskId}`, body)
            .pipe(map(res => res?.data));
    };

    public updateRoutineList = (params: any, body: any): Observable<any> => {
        return this.http.put(API_UPDATE_ROUTINE_LIST + `/${params.monthPlanId}/routines`, body)
            .pipe(map(res => res?.data));
    };

    public deleteBigTask = (params: any): Observable<any> => {
        return this.http.delete(API_DELETE_BIG_TASK + `/${params.monthPlanId}/big-tasks/${params.bigTaskId}`)
            .pipe(map(res => res?.data));
    };

    public createMonthPlanningEvent = (params: any, body: any): Observable<any> => {
        return this.http.post(API_CREATE_MONTH_PLANNING_EVENT + `/${params.monthPlanId}/events`, body)
            .pipe(map(res => res?.data));
    };

    public createMonthPlan = (body: any): Observable<any> => {
        return this.http.post(API_CREATE_MONTH_PLAN, body)
            .pipe(map(res => res?.data));
    };
};

export const calendarRepository = new CalendarRepository();