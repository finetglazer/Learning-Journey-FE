import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FetchedUser, Project, ProjectMembershipRole, TeamMember } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { toast } from "sonner";
import { AlertMessage, AlertModal } from "../alert-modal/alert-modal";

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
    const [inviteEmail, setInviteEmail] = useState('');

    const [searchResults, setSearchResults] = useState<FetchedUser[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const debouncedSearchQuery = useDebounce(inviteEmail, 300);

    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    useEffect(() => {
        if (debouncedSearchQuery) {
            projectRepository.findUsersByEmail({
                email: inviteEmail,
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
    }, [debouncedSearchQuery]); // Re-run if query or members list changes

    const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inviteEmail) {
            projectRepository.addMemberToProject({
                projectId: currentSelectedProject?.id,
            }, {
                email: inviteEmail,
            }).subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg);
                        setInviteEmail('');
                        setIsDropdownOpen(false);
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
                    const errors = err?.response?.data?.data;
                    const message = err?.response?.data?.msg || err?.response?.data?.message;
                    setAlertMessage({
                        type: "warning",
                        title: message,
                        description: errors,
                    });
                },
            })
        }
    };

    const handleRemoveMember = (memberToRemove: TeamMember) => {
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

    // --- 5. New handler for selecting a user from dropdown ---
    const handleSelectUser = (user: FetchedUser) => {
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
            <div className="w-full max-w-[600px] absolute top-[25%] left-[40%] p-8 bg-white rounded-2xl shadow-2xl">

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
                                         pr-20"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium
                                         text-green-800 bg-green-100 rounded-lg
                                         hover:bg-green-200"
                        >
                            Invite
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
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
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
                                        <div className="font-semibold text-sm text-gray-900">
                                            {member.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Right part: Role and Actions */}
                                <div className="flex items-center space-x-4 flex-shrink-0">
                                    <button className="text-sm text-blue-600 hover:text-blue-800">
                                        {member.customRoleName || '<Custome name role>'}
                                    </button>
                                    <span className={`text-sm font-medium ${member.role === ProjectMembershipRole.OWNER ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {member.role}
                                    </span>
                                    {member.role !== ProjectMembershipRole.OWNER ? (
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