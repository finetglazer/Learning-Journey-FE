import { map, Observable } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + "/pm/projects";

export class ProjectRepository extends BaseRepository {
    constructor() {
        super(BASE_API_URL);
    };

    public getProjects = (): Observable<any> => {
        return this.http.get("")
            .pipe(map(res => res?.data));
    };

    public createProject = (body: any): Observable<any> => {
        return this.http.post("", body)
            .pipe(map(res => res?.data));
    };

    public deleteProject = (params: any): Observable<any> => {
        return this.http.delete(`/${params.projectId}`)
            .pipe(map(res => res?.data));
    };

    public getTeamMembers = (params: any): Observable<any> => {
        return this.http.get(`/${params.projectId}/members`)
            .pipe(map(res => res?.data));
    };

    public findUsersByEmail = (params: any): Observable<any> => {
        return this.http.get(`/${params.projectId}/members/find-users-by-email/${params.email}`)
            .pipe(map(res => res?.data));
    };

    public addMemberToProject = (params: any, body: any): Observable<any> => {
        return this.http.post(`/${params.projectId}/members`, body)
            .pipe(map(res => res?.data));
    };

    public removeMemberFromProject = (params: any): Observable<any> => {
        return this.http.delete(`/${params.projectId}/members/${params.targetUserId}`)
            .pipe(map(res => res?.data));
    };

    public acceptInvitation = (params: any, body: any): Observable<any> => {
        return this.http.post(`/${params.projectId}/members/accept`, body)
            .pipe(map(res => res?.data));
    };

    public declineInvitation = (params: any, body: any): Observable<any> => {
        return this.http.post(`/${params.projectId}/members/decline`, body)
            .pipe(map(res => res?.data));
    };
};

export const projectRepository = new ProjectRepository();