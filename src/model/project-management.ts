export enum TaskStatus {
    TO_DO = 'TO_DO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    DONE = 'DONE',
};

export enum TaskPriority {
    MINOR = 'MINOR',
    MEDIUM = 'MEDIUM',
    MAJOR = 'MAJOR',
    CRITICAL = 'CRITICAL',
};

export enum ProjectMembershipRole {
    OWNER = 'OWNER',
    MEMBER = 'MEMBER',
    INVITED = 'INVITED',
};

export enum ReorderType {
    DELIVERABLE = 'DELIVERABLE',
    PHASE = 'PHASE',
    TASK = 'TASK',
}

export type TeamMember = {
    userId: number;
    name: string;
    avatarUrl: string;
    email: string;
    role: ProjectMembershipRole;
    customRoleName: string;
};

export type FetchedUser = {
    userId: number;
    name: string;
    avatarUrl: string;
    email: string;
};

export interface Project {
    id: number;
    name: string;
    color: string;
};

export interface PM_TaskAssignee {
    userId: number;
    avatarUrl: string;
};

export interface PM_Task {
    taskId: number;
    taskIdStr: string;
    phaseId: number;
    phaseIdStr: string;
    name: string;
    key: string;
    status: TaskStatus;
    priority: TaskPriority;
    order: number;
    dateAdded: string; // Corresponds to LocalDate, e.g., "2025-10-25"
    startDate: string; // Corresponds to LocalDate, e.g., "2025-10-25"
    endDate: string; // Corresponds to LocalDate, e.g., "2025-10-25"
    assignees: PM_TaskAssignee[];
};

export interface PM_Phase {
    phaseId: number;
    phaseIdStr: string;
    deliverableId: number;
    deliverableIdStr: string;
    name: string;
    key: string;
    order: number;
    startDate: string; // Corresponds to LocalDate, e.g., "2025-10-25"
    endDate: string; // Corresponds to LocalDate, e.g., "2025-10-25"
    tasks: PM_Task[];
};

export interface PM_Deliverable {
    deliverableId: number;
    deliverableIdStr: string;
    projectId: number;
    name: string;
    key: string;
    order: number;
    startDate: string; // Corresponds to LocalDate, e.g., "2025-10-25"
    endDate: string; // Corresponds to LocalDate, e.g., "2025-10-25"
    phases: PM_Phase[];  // Corresponds to List<PM_Phase>
};