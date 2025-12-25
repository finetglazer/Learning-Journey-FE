"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppContext, AppContextProps } from '@/hooks/app-context';
import { ProjectMembershipRole, TaskComment } from '@/model/project-management';
import { isEqual } from 'lodash';
import {
    CornerUpLeft,
    Pencil,
    Trash2
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';


export const TaskCommentItem = ({
    comment,
    onEdit,
    onDelete,
    onConfirmEdit,
    onCancelEdit,
    onReply,
    editingCommentId,
}: {
    comment: TaskComment,
    onEdit: (commentId: number) => void,
    onDelete: (commentId: number) => void,
    onConfirmEdit: (commentId: number, content: string) => void,
    onCancelEdit: () => void,
    onReply: (commentId: number) => void,
    editingCommentId: number | null,
}) => {
    const {
        userId,
    } = useContext<AppContextProps>(AppContext);

    const {
        currentMember,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const isMine = isEqual(userId, comment.userId);
    const isOwner = isEqual(currentMember?.role, ProjectMembershipRole.OWNER);

    const [tempContent, setTempContent] = useState(comment.content);

    useEffect(() => {
        setTempContent(comment.content);
    }, [comment.content]);

    return (
        <div className="flex space-x-3 py-3 border-gray-100 last:border-b-0 group">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div>
                            {comment.isEdited && (
                                <p className="text-[10px] text-[#33BFFF] font-medium leading-none mb-1">Edited</p>
                            )}
                            <p className="text-sm font-semibold">{comment.userName}</p>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => onReply(comment.commentId)}>
                                <CornerUpLeft size={14} />
                            </Button>
                            {(isMine || isOwner) && (
                                <>
                                    {isMine && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => onEdit(comment.commentId)}>
                                            <Pencil size={14} />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 cursor-pointer hover:text-red-500" onClick={() => onDelete(comment.commentId)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {comment.replyInfo && (
                    <div className="mb-1 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-500 truncate max-w-fit w-full">
                        {comment.replyInfo.replyPreview}
                    </div>
                )}
                {editingCommentId === comment.commentId ? (
                    <div className="mt-1">
                        <Input
                            autoFocus
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            onBlur={onCancelEdit}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onConfirmEdit(comment.commentId, tempContent);
                                }
                                if (e.key === 'Escape') {
                                    onCancelEdit();
                                }
                            }}
                            className="h-8 text-sm"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
                )}
            </div>
        </div>
    )
};