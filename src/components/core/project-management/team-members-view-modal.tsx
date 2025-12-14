"use client";

import { Button } from '@/components/ui/button';
import { ProjectMembershipRole, TeamMember } from '@/model/project-management';
import { X } from 'lucide-react';
import React, { useCallback, useContext, useState } from 'react';
import { EditingRoleInput } from './invite-members-modal';
import { cn } from '@/lib/utils';
import { AppContext, AppContextProps } from '@/hooks/app-context';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import { AlertMessage, AlertModal } from '../alert-modal/alert-modal';
import { toast } from 'sonner';

export interface TeamMembersViewModalProps {
    onClose: () => void;
    members: TeamMember[];
};

export const TeamMembersViewModal = ({
    onClose,
    members,
}: TeamMembersViewModalProps) => {
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const {
        selectedProject,
        members: teamMembers,
        getTeamMembers,
        currentMember,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const {
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    const handleUpdateCustomRoleName = useCallback((name: string) => {
        if (!projectRepository) {
            return;
        }
        projectRepository.updateMemberProject({
            projectId: selectedProject?.id,
            targetUserId: teamMembers.find(member => member.userId === editingUserId)?.userId,
        }, {
            customRoleName: name,
        }).subscribe({
            next: (res: any) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    setEditingUserId(null);
                    getTeamMembers();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: (err: any) => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    }, [
        selectedProject,
        editingUserId,
        teamMembers,
        setEditingUserId,
        getTeamMembers,
        projectRepository,
    ]);

    return (
        // 4. Add relative class
        <div className="
            w-full absolute top-[15%] left-[25%] max-w-[600px] p-8 bg-white rounded-2xl shadow-2xl z-[9999]
            animate-in fade-in slide-in-from-top-10 duration-500 ease-out
        ">

            {/* --- 5. Add the 'X' Close Button --- */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
                onClick={onClose}
            >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </Button>

            {/* --- Header --- */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Team members
            </h2>

            {/* --- Subheader --- */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Members
            </h3>

            {/* --- Member List Container --- */}
            <div className="relative max-h-80 overflow-y-auto rounded-lg bg-slate-50 p-4 space-y-4
                            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">

                {/* 3. Map over the 'members' prop */}
                {(members || []).map((member) => (
                    // 4. Use 'userId' for the key
                    <div key={member.userId} className="grid grid-cols-[1fr_1fr] gap-10 items-center flex-shrink-0">

                        {/* Left part: Avatar and Info */}
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <img
                                // 4. Use 'avatarUrl'
                                src={member.avatarUrl || `https://placehold.co/40x40/E0E0E0/707070?text=${member.name[0] || 'A'}`}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `https://placehold.co/40x40/E0E0E0/707070?text=${member.name[0] || 'A'}`;
                                }}
                            />
                            <div>
                                <div className="font-semibold text-sm text-gray-900">
                                    {member.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {member.email}
                                </div>
                            </div>
                        </div>

                        {/* Right part: Roles */}
                        <div className="grid grid-cols-[2fr_1fr] items-center">
                            {/* Column 1: Custom Role Name / Input */}
                            <div
                                className="text-sm truncate pr-2"
                                onDoubleClick={() => {
                                    if (currentMember?.role !== ProjectMembershipRole.OWNER) {
                                        return;
                                    }
                                    if (member?.role !== ProjectMembershipRole.OWNER) {
                                        setEditingUserId(member.userId);
                                    }
                                }}
                            >
                                {editingUserId === member.userId ? (
                                    <EditingRoleInput
                                        initialName={member.customRoleName || ''}
                                        onSave={handleUpdateCustomRoleName}
                                        onCancel={() => setEditingUserId(null)}
                                    />
                                ) : (
                                    <button
                                        className={cn("text-sm truncate text-center w-full",
                                            { "cursor-pointer text-blue-600 hover:text-blue-800": member?.role !== ProjectMembershipRole.OWNER },
                                            { "cursor-not-allowed text-gray-500": member?.role === ProjectMembershipRole.OWNER },
                                            { "cursor-default": currentMember?.role !== ProjectMembershipRole.OWNER },
                                        )}
                                        disabled={member.role === ProjectMembershipRole.OWNER}
                                        title={member.role === ProjectMembershipRole.OWNER ? 'Owner role cannot be customized' : 'Double click to customize role name'}
                                    >
                                        {member.customRoleName || `Contributor`}
                                    </button>
                                )}
                            </div>

                            {/* Column 2: Primary Role (OWNER/MEMBER/INVITED) */}
                            <span
                                className={`text-sm font-medium ${member.role === ProjectMembershipRole.OWNER ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                {member.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => {
                        setAlertMessage(null);
                    }}
                />
            )}
        </div>
    );
};

// Default export for the App
export default TeamMembersViewModal;