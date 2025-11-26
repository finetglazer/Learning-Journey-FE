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

    public reorderList = (params: any, body: any): Observable<any> => {
        return this.http.put(`/${params.projectId}/list/reorder`, body)
            .pipe(map(res => res?.data));
    };

    // MEMBER FUNCTIONS

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

    public updateMemberProject = (params: any, body: any): Observable<any> => {
        return this.http.put(`/${params.projectId}/members/${params.targetUserId}`, body)
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

    // DELIVERABLE FUNCTIONS
    public getProjectStructure = (params: any): Observable<any> => {
        return this.http.get(`/${params.projectId}/deliverables/structure?search=${params.search || ''}`)
            .pipe(map(res => res?.data));
    };

    public createDeliverable = (params: any, body: any): Observable<any> => {
        return this.http.post(`/${params.projectId}/deliverables`, body)
            .pipe(map(res => res?.data));
    };

    public updateDeliverable = (params: any, body: any): Observable<any> => {
        return this.http.put(`/${params.projectId}/deliverables/${params.deliverableId}`, body)
            .pipe(map(res => res?.data));
    };

    public deleteDeliverable = (params: any): Observable<any> => {
        return this.http.delete(`/${params.projectId}/deliverables/${params.deliverableId}`)
            .pipe(map(res => res?.data));
    };

    // PHASE FUNCTIONS
    public createPhase = (params: any, body: any): Observable<any> => {
        return this.http.post(`/${params.projectId}/deliverables/${params.deliverableId}/phases`, body)
            .pipe(map(res => res?.data));
    };

    public updatePhase = (params: any, body: any): Observable<any> => {
        return this.http.put(`/${params.projectId}/phases/${params.phaseId}`, body)
            .pipe(map(res => res?.data));
    };

    public deletePhase = (params: any): Observable<any> => {
        return this.http.delete(`/${params.projectId}/phases/${params.phaseId}`)
            .pipe(map(res => res?.data));
    };

    // TASK FUNCTIONS
    public getTasks = (params: any, body: any): Observable<any> => {
        return this.http.post(`/${params.projectId}/tasks`, body)
            .pipe(map(res => res?.data));
    };

    public createTask = (params: any, body: any): Observable<any> => {
        return this.http.post(`/${params.projectId}/phases/${params.phaseId}/tasks`, body)
            .pipe(map(res => res?.data));
    };

    public updateTask = (params: any, body: any): Observable<any> => {
        return this.http.put(`/${params.projectId}/tasks/${params.taskId}`, body)
            .pipe(map(res => res?.data));
    };

    public deleteTask = (params: any): Observable<any> => {
        return this.http.delete(`/${params.projectId}/tasks/${params.taskId}`)
            .pipe(map(res => res?.data));
    };

    public updateTaskStatusOnly = (params: any, body: any): Observable<any> => {
        return this.http.put(`/${params.projectId}/tasks/${params.taskId}/status`, body)
            .pipe(map(res => res?.data));
    };

    // Project summary metrics
    public getDeliverableProgress = (params: { projectId: number }): Observable<any> => {
        return this.http.get(`/${params.projectId}/summary/deliverable-progress`)
            .pipe(map(res => res?.data));
    };

    /**
     * Retrieves workload metrics showing task allocation across team members.
     * Corresponds to: GET /{projectId}/summary/teammate-workload
     */
    public getTeammateWorkload = (params: { projectId: number }): Observable<any> => {
        return this.http.get(`/${params.projectId}/summary/teammate-workload`)
            .pipe(map(res => res?.data));
    };

    /**
     * Retrieves key statistical data about tasks (e.g., completed, overdue, due soon).
     * Corresponds to: GET /{projectId}/summary/task-stats
     */
    public getTaskStats = (params: { projectId: number }): Observable<any> => {
        return this.http.get(`/${params.projectId}/summary/task-stats`)
            .pipe(map(res => res?.data));
    };

    /**
     * Retrieves data necessary to render the project's overall timeline or schedule.
     * Corresponds to: GET /{projectId}/summary/timeline
     */
    public getProjectTimeline = (params: { projectId: number }): Observable<any> => {
        return this.http.get(`/${params.projectId}/summary/timeline`)
            .pipe(map(res => res?.data));
    };

    /**
     * Retrieves a list of risks currently flagged as active for the project.
     * Corresponds to: GET /{projectId}/summary/active-risks
     */
    public getActiveRisks = (params: { projectId: number }): Observable<any> => {
        return this.http.get(`/${params.projectId}/summary/active-risks`)
            .pipe(map(res => res?.data));
    };
};

export const projectRepository = new ProjectRepository();