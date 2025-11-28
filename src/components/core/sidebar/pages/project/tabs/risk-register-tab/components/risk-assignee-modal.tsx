"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RiskAssignee, TeamMember } from "@/model/project-management";
import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const assigneesAreEqual = (a: RiskAssignee[], b: RiskAssignee[]) => {
    if (a.length !== b.length) return false;
    const aIds = a.map(u => u.userId).sort().join(',');
    const bIds = b.map(u => u.userId).sort().join(',');
    return aIds === bIds;
};


export interface RiskAssigneeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedAssignees: RiskAssignee[]) => void;
    currentAssignees: RiskAssignee[];
    teamMembers: TeamMember[];
}

const RiskAssigneeModal = ({ isOpen, onClose, onSave, currentAssignees, teamMembers }: RiskAssigneeModalProps) => {
    const [modalDraftAssignees, setModalDraftAssignees] = useState<RiskAssignee[]>(currentAssignees);

    useEffect(() => {
        setModalDraftAssignees(currentAssignees);
    }, [currentAssignees]);


    const handleUserToggle = useCallback((user: TeamMember, isChecked: boolean) => {
        const assignee: RiskAssignee = user;

        setModalDraftAssignees(prev => {
            if (isChecked) {
                if (!prev.some(a => a.userId === assignee.userId)) {
                    return [...prev, assignee];
                }
            } else {
                return prev.filter(a => a.userId !== assignee.userId);
            }
            return prev;
        });
    }, []);

    const handleUpdateAssignees = useCallback(() => {
        onSave(modalDraftAssignees);
        onClose();
    }, [modalDraftAssignees, onSave, onClose]);


    const handleModalCancel = useCallback(() => {
        onClose();
        setModalDraftAssignees(currentAssignees);
    }, [onClose, currentAssignees]);


    // Check if modal changes are different from the component's *current* draft state
    const isModalDirty = !assigneesAreEqual(modalDraftAssignees, currentAssignees);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="lg:max-w-[595px] h-[320px]">
                <DialogHeader>
                    <DialogTitle>Assign Task Members</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto">
                    {teamMembers.map((user) => {
                        const isAssigned = modalDraftAssignees.some(a => a.userId === user.userId);

                        return (
                            <div
                                key={user.userId}
                                className="grid grid-cols-[1fr_120px_20px] gap-4 items-center p-2 hover:bg-gray-50 rounded"
                            >
                                {/* Column 1: Avatar, Name, Email, and Custom Role (Main Content) */}
                                <div className="flex items-center space-x-3 min-w-0">
                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarImage src={user.avatarUrl} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className='flex-grow min-w-0'>
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>

                                { /* Column 2: Primary Role (Fixed Width) */}
                                <span className='text-xs text-gray-500 justify-self-start overflow-hidden'>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="truncate block" style={{ maxWidth: '120px' }}>
                                                {user.role}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>{user.role}</TooltipContent>
                                    </Tooltip>
                                </span>

                                {/* Column 3: Checkbox (Fixed Width and Right-Aligned) */}
                                <div className="justify-self-end">
                                    <Checkbox
                                        checked={isAssigned}
                                        onCheckedChange={(checked) => {
                                            handleUserToggle(user, Boolean(checked));
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleModalCancel}
                    >Cancel
                    </Button>
                    {/* Use the new handleUpdateAssignees function */}
                    <Button
                        onClick={handleUpdateAssignees}
                        className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
                        disabled={!isModalDirty}
                    >
                        {isModalDirty ? <Check size={16} className='mr-2' /> : null}
                        Update Assignees
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RiskAssigneeModal;