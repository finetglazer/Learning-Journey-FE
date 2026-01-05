"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppContext, AppContextProps } from '@/hooks/app-context';
import { cn, getFileIcon, getFileSize, getRelativeTimeByDays, toDayJs } from '@/lib/utils';
import { FileNode, PM_Task, PM_TaskDetail, TaskAttachmentDetail, TaskPriority, TaskStatus, TeamMember } from '@/model/project-management';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Flame,
    Loader,
    MinusSquare,
    PlusSquare,
    SignalHigh,
    SignalLow,
    SignalMedium,
    User,
    X
} from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Divider } from '../divider/divider';
import InfoCircle from '../icons/info-circle';
import { FilePicker } from '../notion-editor/extensions/file-picker';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import { TaskCommentItem } from './task-comment-item';

export const STATUS_CONFIG: Record<TaskStatus, { label: string, icon: any, color: string }> = {
    [TaskStatus.TO_DO]: { label: "To do", icon: InfoCircle, color: "text-slate-500" },
    [TaskStatus.IN_PROGRESS]: { label: "In progress", icon: Loader, color: "text-indigo-500" },
    [TaskStatus.IN_REVIEW]: { label: "In review", icon: Clock, color: "text-blue-500" },
    [TaskStatus.DONE]: { label: "Completed", icon: CheckCircle2, color: "text-green-500" },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string, icon: any, color: string }> = {
    [TaskPriority.MINOR]: { label: "Minor", icon: SignalLow, color: "text-green-500" },
    [TaskPriority.MEDIUM]: { label: "Medium", icon: SignalMedium, color: "text-orange-500" },
    [TaskPriority.MAJOR]: { label: "Major", icon: SignalHigh, color: "text-red-500" },
    [TaskPriority.CRITICAL]: { label: "Critical", icon: Flame, color: "text-pink-600" },
};

const AttachmentItem = ({ file, onDelete }: { file: TaskAttachmentDetail; onDelete: (attachmentId: number) => void }) => (
    <div className="flex items-center group space-x-3 py-2 border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50">
        {getFileIcon(file.extension, file.fileType)}
        <div className="flex-grow">
            <p className="text-sm font-medium truncate">{file.fileName}</p>
            <p className="text-xs text-gray-500">
                {getRelativeTimeByDays(file.attachedAt || "")} `• {getFileSize(file.sizeBytes)}`
            </p>
        </div>
        <MinusSquare
            size={16}
            className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
            onClick={() => onDelete(file.nodeId)}
        />
    </div>
);

export function TaskDetailDrawer({ task, members }: { task: PM_Task, members: TeamMember[], }) {
    const [taskDetail, setTaskDetail] = useState<PM_TaskDetail | null>(null);
    const [fileList, setFileList] = useState<FileNode[]>([]);
    const [openFilePicker, setOpenFilePicker] = useState<boolean>(false);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [commentContent, setCommentContent] = useState<string>("");
    const [parentCommentId, setParentCommentId] = useState<number | null>(null);
    const [showAllAttachments, setShowAllAttachments] = useState<boolean>(false);
    const [showAllComments, setShowAllComments] = useState<boolean>(false);

    const {
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    const {
        selectedProject,
        getFiles,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    // 1. Resolve Task Assignees (supports multiple assignees)
    const assignees = taskDetail?.taskInfo?.assignees || [];
    const taskAssignees = assignees
        .map(assignee => members.find(member => member.userId === assignee.userId))
        .filter((member): member is TeamMember => member !== undefined);

    const MAX_VISIBLE_AVATARS = 3;
    const visibleAssignees = taskAssignees.slice(0, MAX_VISIBLE_AVATARS);
    const remainingCount = taskAssignees.length - MAX_VISIBLE_AVATARS;

    const ownerDisplay = taskAssignees.length > 0
        ? (
            <div className="flex items-center space-x-2">
                {/* Stacked Avatars */}
                <div className="flex items-center -space-x-2">
                    {visibleAssignees.map((assignee, index) => (
                        <Avatar
                            key={assignee.userId}
                            className="w-6 h-6 border-2 border-white ring-1 ring-gray-200"
                            style={{ zIndex: MAX_VISIBLE_AVATARS - index }}
                        >
                            <AvatarImage src={assignee.avatarUrl} />
                            <AvatarFallback className="text-xs bg-gray-100">{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ))}
                    {remainingCount > 0 && (
                        <div
                            className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center text-xs font-medium text-gray-600"
                            style={{ zIndex: 0 }}
                        >
                            +{remainingCount}
                        </div>
                    )}
                </div>
                {/* Display first assignee name, or count if multiple */}
                <span className="text-sm">
                    {taskAssignees.length === 1
                        ? taskAssignees[0].name
                        : `${taskAssignees[0].name} +${taskAssignees.length - 1}`}
                </span>
            </div>
        )
        : <span className="text-gray-400">Unassigned</span>;


    // 2. Resolve Status and Priority Configs
    const statusConfig = taskDetail?.taskInfo ? STATUS_CONFIG[taskDetail?.taskInfo?.status] || { label: taskDetail?.taskInfo?.status, icon: InfoCircle, color: "text-gray-500" } : { label: "", icon: null, color: "text-gray-500" };
    const priorityConfig = taskDetail?.taskInfo ? PRIORITY_CONFIG[taskDetail?.taskInfo?.priority] || { label: taskDetail?.taskInfo?.priority, icon: SignalLow, color: "text-gray-500" } : { label: "", icon: null, color: "text-gray-500" };

    const parentComment = (taskDetail?.comments || []).find(c => c.commentId === parentCommentId);

    // 3. Define Property Items for Mapping
    const propertyConfigs = [
        {
            label: "Progress",
            value: statusConfig.label,
            prefixIcon: statusConfig.icon,
            valuePrefixIcon: statusConfig.icon,
            valueColor: statusConfig.color
        },
        {
            label: "Task owner",
            value: ownerDisplay,
            prefixIcon: User,
            isOwner: true
        },
        {
            label: "Urgency",
            value: priorityConfig.label,
            prefixIcon: priorityConfig.icon,
            valuePrefixIcon: priorityConfig.icon,
            valueColor: priorityConfig.color
        },
        {
            label: "Start date",
            value: taskDetail?.taskInfo?.startDate ? toDayJs(taskDetail?.taskInfo?.startDate, 0).format("DD/MM/YYYY") : "",
            prefixIcon: Calendar
        },
        {
            label: "Deadline",
            value: taskDetail?.taskInfo?.endDate ? toDayJs(taskDetail?.taskInfo?.endDate, 0).format("DD/MM/YYYY") : "",
            prefixIcon: Calendar
        },
    ];

    const getTaskDetail = useCallback(() => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        const subscription = projectRepository.getTaskDetail({
            projectId: selectedProject.id,
            taskId: task.taskId,
        })
            .subscribe({
                next: res => {
                    if (res?.status) {
                        setTaskDetail(res?.data);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => { }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [task, projectRepository, selectedProject]);

    const onSelectFile = useCallback((file: FileNode) => {
        if (!projectRepository || !selectedProject) return;

        const subscription = projectRepository.uploadTaskAttachment({
            projectId: selectedProject.id,
            taskId: task.taskId
        }, { nodeId: file.nodeId }).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getTaskDetail();
                    setOpenFilePicker(false);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: (err) => {
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject]);

    const onDeleteFile = useCallback((nodeId: number) => {
        if (!projectRepository || !selectedProject) return;

        const subscription = projectRepository.deleteTaskAttachment({
            projectId: selectedProject.id,
            taskId: task.taskId,
            attachmentId: nodeId
        }).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getTaskDetail();
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: (err) => {
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject]);

    const onEditComment = useCallback((commentId: number) => {
        setEditingCommentId(commentId);
    }, []);

    const onConfirmEditComment = useCallback((commentId: number, content: string) => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        const subscription = projectRepository.updateTaskComment({
            commentId: commentId,
        }, {
            content: content
        }).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getTaskDetail();
                    setEditingCommentId(null);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: (err) => {
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject, getTaskDetail]);

    const onCancelEditComment = useCallback(() => {
        setEditingCommentId(null);
    }, []);

    const onDeleteComment = useCallback((commentId: number) => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        const subscription = projectRepository.deleteTaskComment({
            commentId: commentId,
        }).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getTaskDetail();
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: (err) => {
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject, getTaskDetail]);

    const onCreateComment = useCallback((comment: string) => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        const subscription = projectRepository.createTaskComment({
            taskId: task?.taskId,
        }, {
            content: commentContent,
            parentCommentId: parentCommentId,
        }).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getTaskDetail();
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: (err) => {
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject, getTaskDetail, commentContent, parentCommentId]);

    useEffect(() => {
        getTaskDetail();
    }, [task]);

    useEffect(() => {
        if (!openFilePicker) {
            return;
        }
        getFiles("", undefined, true, undefined, (files: FileNode[]) => {
            setFileList(files);
        });
    }, [openFilePicker]);

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header / Title */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{taskDetail?.taskInfo?.name || "---"}</h2>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="py-4">

                    {/* --- 1. Properties Section --- */}
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Properties
                    </h3>
                    <div className="space-y-1">
                        {propertyConfigs.map((prop, index) => {
                            const PrefixIcon = prop.prefixIcon;
                            const ValueIcon = prop.valuePrefixIcon;

                            return (
                                <div key={index} className="flex items-center space-x-3 py-1.5 border-gray-100 last:border-b-0">
                                    {/* 🛠️ Property Name (W-32): Icon + Label */}
                                    <span className="w-32 text-sm text-gray-500 flex items-center space-x-2">
                                        {/* <PrefixIcon size={16} className={`text-gray-500`} /> */}
                                        <span>{prop.label}</span>
                                    </span>

                                    {/* 🛠️ Value: Icon (for progress/urgency) + Value Text */}
                                    <div className={`text-sm flex items-center font-medium gap-2 ${prop.valueColor || 'text-gray-700'}`}>
                                        {/* Render the value icon only if it's Status or Priority */}
                                        {(prop.label === 'Progress' || prop.label === 'Urgency') && ValueIcon && (
                                            <ValueIcon size={20} className={cn(prop.valueColor, `inline-block`)} />
                                        )}

                                        {/* If Task Owner, render the component directly */}
                                        {prop.isOwner ? prop.value : <span className="whitespace-nowrap">{prop.value}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Divider className={"w-[calc(100%-10px)] mt-5"} />

                    {/* --- 2. Attachments Section --- */}
                    <div className="flex items-center justify-between group mt-6 mb-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Attachments
                        </h3>
                        <div className="flex items-center">
                            {(taskDetail?.attachments || []).length > 3 && (
                                <span
                                    className="text-xs text-blue-600 cursor-pointer mr-3 hover:underline"
                                    onClick={() => setShowAllAttachments(!showAllAttachments)}
                                >
                                    {showAllAttachments ? "Show less" : "Show all"}
                                </span>
                            )}
                            <Button variant="ghost" className="mr-3 text-gray-500 cursor-pointer hover:bg-transparent p-0 h-auto"
                                onClick={() => {
                                    setOpenFilePicker(true);
                                }}
                            >
                                <PlusSquare size={16} />
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {showAllAttachments ? (
                            <ScrollArea className="h-48 w-full rounded-md border border-gray-100">
                                <div className="p-1">
                                    {(taskDetail?.attachments || []).map((file, index) => (
                                        <AttachmentItem
                                            key={index}
                                            file={file}
                                            onDelete={onDeleteFile}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            (taskDetail?.attachments || []).slice(0, 3).map((file, index) => (
                                <AttachmentItem
                                    key={index}
                                    file={file}
                                    onDelete={onDeleteFile}
                                />
                            ))
                        )}

                    </div>

                    {openFilePicker && (
                        <FilePicker
                            files={fileList}
                            onSelect={(file) => onSelectFile(file)}
                            onClose={() => setOpenFilePicker(false)}
                        />
                    )}

                    <Divider className={"w-[calc(100%-10px)] mt-5"} />

                    {/* --- 3. Discussion Section --- */}
                    <div className="flex items-center justify-between mt-6 mb-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Discussion
                        </h3>
                        {(taskDetail?.comments || []).length > 2 && (
                            <span
                                className="text-xs text-blue-600 cursor-pointer hover:underline"
                                onClick={() => setShowAllComments(!showAllComments)}
                            >
                                {showAllComments ? "Show less" : "Show all"}
                            </span>
                        )}
                    </div>
                    <div className="space-y-2">
                        {showAllComments ? (
                            <ScrollArea className="h-75 w-full rounded- md border border-gray-100">
                                <div className="p-1">
                                    {(taskDetail?.comments || []).map((comment, index) => (
                                        <TaskCommentItem
                                            key={index}
                                            comment={comment}
                                            onEdit={onEditComment}
                                            onDelete={onDeleteComment}
                                            onConfirmEdit={onConfirmEditComment}
                                            onCancelEdit={onCancelEditComment}
                                            onReply={() => {
                                                setParentCommentId(comment.commentId);
                                                setCommentContent("");
                                            }}
                                            editingCommentId={editingCommentId}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            (taskDetail?.comments || []).slice(0, 2).map((comment, index) => (
                                <TaskCommentItem
                                    key={index}
                                    comment={comment}
                                    onEdit={onEditComment}
                                    onDelete={onDeleteComment}
                                    onConfirmEdit={onConfirmEditComment}
                                    onCancelEdit={onCancelEditComment}
                                    onReply={() => {
                                        setParentCommentId(comment.commentId);
                                        setCommentContent("");
                                    }}
                                    editingCommentId={editingCommentId}
                                />
                            ))
                        )}

                    </div>
                </div>
            </ScrollArea>

            {/* --- 4. Write a Comment Input --- */}
            <div className="p-4 border-t border-gray-200 relative">
                {parentComment && (
                    <div className="flex items-start space-x-2 mb-2 bg-gray-50 p-2 rounded-md absolute bottom-15 w-[95%] right-1 left-3 bg-gray-300 group">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={parentComment.userAvatar} />
                            <AvatarFallback>{parentComment.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-700">{parentComment.userName}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{parentComment.content}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 cursor-pointer absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                            onClick={() => setParentCommentId(null)}
                        >
                            <X size={12} />
                        </Button>
                    </div>
                )}
                <Input
                    placeholder={parentComment ? "Reply to comment" : "Write a comment"}
                    className="w-full h-10 pr-10"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onCreateComment(commentContent);
                            setCommentContent('');
                            setParentCommentId(null);
                        }
                    }}
                />
            </div>
        </div>
    );
}