"use client";

import { Button } from "@/components/ui/button";
import { FetchedUser, Project, ProjectMembershipRole, TeamMember } from "@/model/project-management";
import { X } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertMessage, AlertModal } from "../alert-modal/alert-modal";
import { TeamProjectContext, TeamProjectContextProps } from "../sidebar/pages/project/team-project-context";
import { cn } from "@/lib/utils";
import { AppContext, AppContextProps } from "@/hooks/app-context";

// --- 1. Debounce Hook ---
/**
 * A custom hook to debounce a value.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set debouncedValue to value (passed in) after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Return a cleanup function that will be called ...
        // ... if value or delay changes (or if component unmounts)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-call effect if value or delay changes

    return debouncedValue;
};

// --- Helper Components ---
const MinusCircle = ({ className, ...props }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className || "w-5 h-5 cursor-pointer"}
        {...props}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

/**
 * Renders a single user in the search results dropdown.
 */
const SearchResultItem = ({ user, onSelect }: { user: FetchedUser, onSelect: (user: FetchedUser) => void }) => (
    <li
        className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50"
        // Use onMouseDown to fire before the input's onBlur
        onMouseDown={() => onSelect(user)}
    >
        <img
            src={user.avatarUrl || `https://placehold.co/40x40/E0E0E0/707070?text=${user.name[0] || '..'}`}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
        />
        <div>
            <div className="font-semibold text-sm text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
        </div>
    </li>
);

export interface InviteMembersModalProps {
    onClose: () => void;
    teamMembers: TeamMember[];
    currentSelectedProject: Project | null;
    getTeamMembers: () => void;
};

export const InviteMembersModal = ({
    onClose,
    teamMembers,
    currentSelectedProject,
    getTeamMembers,
}: InviteMembersModalProps) => {
    const [inviteUser, setInviteUser] = useState<FetchedUser | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [inviteEmail, setInviteEmail] = useState<string>('');
    const [searchResults, setSearchResults] = useState<FetchedUser[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchQuery = useDebounce(inviteEmail || '', 300);

    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const {
        selectedProject,
        currentMember,
        setMembers,
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
            next: res => {
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
            error: err => {
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

    useEffect(() => {
        if (!projectRepository || !inviteEmail) {
            return;
        }
        if (debouncedSearchQuery) {
            projectRepository.findUsersByEmail({
                email: inviteEmail.toLowerCase(),
                projectId: currentSelectedProject?.id,
            }).subscribe({
                next: res => {
                    if (res?.status) {
                        const results = res?.data || [];
                        setSearchResults(results);
                        setIsDropdownOpen(results.length > 0);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                        setAlertMessage(null);
                    }
                },
                error: err => {
                    setAlertMessage(null);
                },
            });
        } else {
            setSearchResults([]);
            setIsDropdownOpen(false);
        }
    }, [debouncedSearchQuery, projectRepository]);

    const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!projectRepository || !inviteUser || isLoading) {
            return;
        }
        setIsLoading(true);
        projectRepository.addMemberToProject({
            projectId: currentSelectedProject?.id,
        }, {
            email: inviteUser?.email,
        }).subscribe({
            next: res => {
                setIsLoading(false);
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    setInviteUser(null);
                    setInviteEmail('');
                    setIsDropdownOpen(false);
                    setMembers(prev => [...prev, {
                        userId: inviteUser?.userId,
                        name: inviteUser?.name,
                        avatarUrl: inviteUser?.avatarUrl,
                        email: inviteUser?.email,
                        customRoleName: "",
                        role: ProjectMembershipRole.INVITED,
                    }]);
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.msg || res?.message,
                        description: res?.data
                    });
                }
            },
            error: err => {
                setIsLoading(false);
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        })
    };

    const handleRemoveMember = (memberToRemove: TeamMember) => {
        if (!projectRepository) {
            return;
        }
        projectRepository.removeMemberFromProject({
            projectId: currentSelectedProject?.id,
            targetUserId: memberToRemove?.userId,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.msg || res?.message);
                    getTeamMembers();
                }
                else {
                    toast.error(res?.msg || res?.message);
                }
            },
            error: err => { },
        });
    };

    const handleCancelEditing = useCallback(() => {
        setEditingUserId(null);
    }, [setEditingUserId]);

    // --- 5. New handler for selecting a user from dropdown ---
    const handleSelectUser = (user: FetchedUser) => {
        setInviteUser(user);
        setInviteEmail(user.email);
        setIsDropdownOpen(false);
    };

    // --- Warning Dialog Handlers ---
    const onRemoveClick = (member: TeamMember) => {
        setAlertMessage({
            type: "warning",
            title: "Confirm to remove member " + member.name,
            description: "Are you sure you want to remove this person? They will immediately lose all access to this project.",
            proceedAnyway: () => {
                handleRemoveMember(member);
            }
        });
    };

    return (
        <>
            {/* --- Modal Card --- */}
            <div className="
                w-full max-w-[640px] absolute top-[12%] left-[25%] p-8 bg-white rounded-2xl shadow-2xl z-[9999]
                animate-in fade-in slide-in-from-top-10 duration-500 ease-out
            ">

                {/* --- Close Button --- */}
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
                    Invite new team member
                </h2>

                {/* --- 6. Modified Invite Input Section --- */}
                <form onSubmit={handleInvite}>
                    <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-800 mb-2">
                        Invite members
                    </label>
                    <div className="relative">
                        <input
                            id="inviteEmail"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onFocus={() => {
                                if (searchResults.length > 0) setIsDropdownOpen(true);
                            }}
                            onBlur={() => {
                                setTimeout(() => setIsDropdownOpen(false), 150);
                            }}
                            placeholder="name@company.com"
                            className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm
                                         focus:outline-none focus:ring-2 focus:ring-blue-500
                                         pr-20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            autoComplete="off"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inviteUser}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium
                                         text-green-800 bg-green-100 rounded-lg
                                         hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                                         cursor-pointer"
                        >
                            {isLoading ? 'Sending...' : 'Invite'}
                        </button>

                        {/* --- 7. Search Results Dropdown --- */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                <ul className="divide-y divide-gray-100">
                                    {searchResults.map(user => (
                                        <SearchResultItem
                                            key={user.userId}
                                            user={user}
                                            onSelect={handleSelectUser}
                                        />
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </form>

                <p className="text-sm text-gray-500 mt-2 mb-6">
                    Filling the email of members you want to invite
                </p>

                {/* --- Members List Section --- */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Members
                </h3>

                {/* Fading, scrollable container for members */}
                <div className="relative max-h-60 overflow-y-auto -mx-2 px-2
                                 [mask-image:linear-gradient(to_bottom,white_90%,transparent_100%)]">
                    <div className="space-y-4">
                        {teamMembers.map((member) => (
                            <div key={member.userId} className="flex items-center justify-between">
                                {/* Left part: Avatar and Info */}
                                <div className="flex items-center space-x-3 flex-1 min-w-0 mr-5">
                                    <img
                                        src={member.avatarUrl || `https://placehold.co/40x40/E0E0E0/707070?text=${member.name[0] || 'A'}`}
                                        alt={member.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://placehold.co/40x40/E0E0E0/707070?text=${member.name[0] || 'A'}`;
                                        }}
                                    />
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900 truncate">
                                            {member.name}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[150px_100px_32px] gap-2 items-center flex-shrink-0 ml-4">

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
                                                    { "cursor-default": currentMember?.role !== ProjectMembershipRole.OWNER }
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

                                    {/* Column 3: Remove Button (Fixed width for alignment) */}
                                    <div className="flex justify-end">
                                        {(member.role !== ProjectMembershipRole.OWNER && currentMember?.role === ProjectMembershipRole.OWNER) ? (
                                            <button
                                                onClick={() => onRemoveClick(member)}
                                                className="text-gray-400 hover:text-red-500"
                                                aria-label="Remove member"
                                            >
                                                <MinusCircle className={""} />
                                            </button>
                                        ) : (
                                            <div className="w-5 h-5"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
        </>
    );
};

export default InviteMembersModal;


export const EditingRoleInput = ({
    initialName,
    onSave,
    onCancel,
}: {
    initialName: string;
    onSave: (newRoleName: string) => void;
    onCancel: () => void;
}) => {
    const [name, setName] = useState(initialName);

    const handleSave = useCallback(() => {
        if (name.trim() !== initialName.trim() && name.trim().length > 0) {
            onSave(name.trim());
        } else {
            onCancel(); // Cancel if no valid change
        }
    }, [
        onSave,
        onCancel,
        name,
        initialName,
    ]);

    return (
        <div className="flex items-center gap-1 w-full max-w-[200px] flex-shrink-0">
            <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSave();
                    }
                    if (e.key === "Escape") {
                        onCancel();
                    }
                }}
                className="w-full px-2 py-1 text-sm border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Custom role name"
            />
            {/* The Save and Cancel buttons will be rendered inside the main list item now */}
        </div>
    );
};