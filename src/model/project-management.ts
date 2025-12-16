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
    hasChildContainKeyword?: boolean;
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
    hasChildContainKeyword?: boolean;
};

export type TaskStatsByDeadline = {
    completed: number;
    dueSoon: number;
    overdue: number;
    unassigned: number;
};

export type TaskStatsByStatus = {
    toDo: number;
    inProgress: number;
    inReview: number;
    done: number;
};

export type TaskStats = {
    byStatus: TaskStatsByStatus;
    byDeadline: TaskStatsByDeadline;
};

export type TimelineMilestone = {
    id: number;
    name: string;
    date: string;   // YYYY-MM-DD
};

export type ProjectTimelineType = {
    projectStartDate: string;   // YYYY-MM-DD
    currentDate: string;        // YYYY-MM-DD
    milestones: TimelineMilestone[];
};

export type ActiveRiskItem = {
    key: string;
    riskStatement: string;
};

export type ActiveRiskSummary = {
    totalCount: number;
    displayCount: number;
    risks: ActiveRiskItem[];
};

export type DeliverableProgress = {
    id: number;
    name: string;
    key: string;
    percentage: number;
};

export type TeammateWorkload = {
    name: string;
    percentage: number;
};

export type ProjectGroup = {
    projectId: number;
    projectName: string;
    tasks: UserTaskItem[];
};

export type UserTaskItem = {
    pmTaskId: number;
    name: string;
    deadline: string;   // YYYY-MM-DD
    overdue: boolean;
};

export const RiskLevel = {
    "1-Very low": {
        value: 1,
    },
    "2-Low": {
        value: 2,
    },
    "3-Medium": {
        value: 3,
    },
    "4-High": {
        value: 4,
    },
    "5-Very high": {
        value: 5,
    },
};

export const getRiskLevelLabel = (value: number | undefined) => {
    switch (value) {
        case 1:
            return "1-Very low";
        case 2:
            return "2-Low";
        case 3:
            return "3-Medium";
        case 4:
            return "4-High";
        case 5:
            return "5-Very high";
        default:
            return "NaN";
    };
};

export type RiskDegree = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskAssignee extends PM_TaskAssignee { };

export interface RiskItem {
    id: number;
    key: string;
    riskStatement: string;
    probability: number;
    impact: number;
    status: 'RESOLVED' | 'UNRESOLVED';
    riskScore: number;
    riskDegree: RiskDegree;
    assignees: RiskAssignee[];
    mitigationPlan: string;
    note: string;
    revisedProbability?: number;
    revisedImpact?: number;
    isMine?: boolean;
};

export interface TimelineItem {
    id: number;
    type: "DELIVERABLE" | "PHASE";
    name: string;
    startDate: string;
    endDate: string;
    childrenContainSearchKeyword: boolean;
    children: TimelineItem[];
};

export interface ProjectTimelineStructure {
    items: TimelineItem[];
    milestones: TimelineMilestone[];
    projectStartDate: string; // YYYY-MM-DD
};

export interface ProjectDependency {
    type: "TASK" | "PHASE" | "DELIVERABLE";
    fromId: number;
    toId: number;
};

export type NodeType = 'STATIC_FILE' | 'FOLDER' | 'NOTION_DOC' | 'SHARED_FOLDER';

/**
 * Represents a file or folder node in the project management system.
 * Corresponds to the PM_FileNode JPA entity.
 */
export interface FileNode {
    nodeId: number;
    projectId: number;
    parentNodeId: number | null;
    name: string;
    type: NodeType;
    extension: string | null;
    sizeBytes: number | null;
    storageReference: string | null;
    createdByUserId: number | null;
    createdAt: string;
    updatedAt: string;
    uploadingId?: string;
};

export interface TaskAttachmentDetail {
    fileName: string;
    fileType: NodeType;
    extension: string | null;
    attachedAt: string; // ISO date string, e.g., "2025-12-16T10:30:00"
    sizeBytes: number;
};

export interface ReplyInfo {
    replyToCommentId: number;
    replyToUserName: string;
};

export interface TaskComment {
    commentId: number;
    userId: number;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string; // ISO date string, e.g., "2025-12-16T10:30:00"
    replyInfo: ReplyInfo | null;
};

export interface PM_TaskDetail {
    taskInfo: PM_Task;
    attachments: TaskAttachmentDetail[];
    comments: TaskComment[];
};
