import { Button } from '@/components/ui/button';
import { ProjectMembershipRole, TeamMember } from '@/model/project-management';
import { X } from 'lucide-react';
import React from 'react';

export interface TeamMembersViewModalProps {
    onClose: () => void;
    members: TeamMember[];
};

export const TeamMembersViewModal = ({
    onClose,
    members,
}: TeamMembersViewModalProps) => {
    return (
        // 4. Add relative class
        <div className="
            w-full absolute top-[25%] left-[30%] max-w-[600px] p-8 bg-white rounded-2xl shadow-2xl z-[9999]
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
                    <div key={member.userId} className="flex items-center justify-between gap-4">

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
                        <div className="flex items-center space-x-4 flex-shrink-0">
                            <span className="text-sm text-blue-600">
                                {/* 4. Use 'customRoleName' */}
                                {member.customRoleName || '<Custom name role>'}
                            </span>

                            <span className={`text-sm font-medium w-16 text-left ${
                                // 4. Use 'ProjectMembershipRole.OWNER' enum
                                member.role === ProjectMembershipRole.OWNER
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                                }`}>
                                {member.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Default export for the App
export default TeamMembersViewModal;