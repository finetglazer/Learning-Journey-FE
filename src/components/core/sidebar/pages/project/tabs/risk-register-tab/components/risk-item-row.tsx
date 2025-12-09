import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    TableCell,
    TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getScoreDetails } from "@/lib/utils";
import { Project, RiskItem, TeamMember } from "@/model/project-management";
import { Edit, Loader2, RotateCcw, Trash2, UserPlus, X } from "lucide-react";
import { Dispatch, memo, SetStateAction } from "react";
import { RiskLevelDropdown } from "./risk-level-dropdown";
import { toast } from "sonner";
import { projectRepository } from "@/repository/project-repository";
import { finalize } from "rxjs";
import { AlertMessage } from "@/components/core/alert-modal/alert-modal";
import { Input } from "@/components/ui/input";

export interface RiskItemRowProps {
    item: RiskItem;
    canEdit: boolean;
    originalData: { [id: number]: RiskItem };
    setOriginalData: Dispatch<SetStateAction<{
        [id: number]: RiskItem;
    }>>;
    loadingRiskId: number | null;
    openRiskId: number | null;
    setOpenRiskId: Dispatch<SetStateAction<number | null>>;
    members: TeamMember[];
    setSelectedRisk: Dispatch<SetStateAction<RiskItem | null>>;
    handleUpdateRiskItem: (risk: RiskItem) => void;
    setData: Dispatch<SetStateAction<RiskItem[]>>;
    getRiskItems: (useCustomPageSize?: boolean | undefined, customPageSize?: number | undefined) => () => void;
    setLoadingRiskId: Dispatch<SetStateAction<number | null>>;
    selectedProject: Project | null;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
};

function arePropsEqual(prev: RiskItemRowProps, next: RiskItemRowProps) {
    if (prev.item !== next.item) return false;
    if (prev.originalData[prev.item.id] !== next.originalData[next.item.id]) return false;

    if (prev.canEdit !== next.canEdit) return false;

    const wasLoading = prev.loadingRiskId === prev.item.id;
    const isLoading = next.loadingRiskId === next.item.id;
    if (wasLoading !== isLoading) return false;

    const wasOpen = prev.openRiskId === prev.item.id;
    const isOpen = next.openRiskId === next.item.id;
    if (wasOpen !== isOpen) return false;

    if (prev.members !== next.members) return false;
    if (prev.selectedProject !== next.selectedProject) return false;

    return true;
};

export const RiskItemRow = memo(({
    item,
    canEdit,
    originalData,
    loadingRiskId,
    openRiskId,
    setOpenRiskId,
    members,
    setSelectedRisk,
    handleUpdateRiskItem,
    setData,
    getRiskItems,
    setLoadingRiskId,
    selectedProject,
    setAlertMessage,
}: RiskItemRowProps) => {
    const hasRiskItemChanged = (current: RiskItem, original: RiskItem): boolean => {
        return (
            current.probability !== original.probability ||
            current.impact !== original.impact ||
            current.status !== original.status ||
            current.riskStatement !== original.riskStatement ||
            current.revisedProbability !== original.revisedProbability ||
            current.revisedImpact !== original.revisedImpact ||
            current.mitigationPlan !== original.mitigationPlan ||
            current.note !== original.note
        );
    };

    const handleUpdate = (id: number, field: keyof RiskItem, val: any) => {
        setData((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const updated = { ...item, [field]: val };
                    if (field === 'probability' || field === 'impact') {
                        updated.riskScore = (updated.probability as number) * (updated.impact as number);
                    }
                    return updated;
                }
                return item;
            })
        );
    };

    const handleRevertRiskItem = (id: number) => {
        setData((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    item = originalData[item.id];
                }
                return item;
            })
        );
    };

    const handleDeleteRiskItem = (riskId: number) => {
        projectRepository.deleteRisk({
            projectId: selectedProject?.id as number,
            riskId,
        })
            .pipe(finalize(() => {
                setLoadingRiskId(null);
                getRiskItems();
            }))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.msg || res?.message);
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: err => { }
            })
    };

    const handleRevisedUpdate = (id: number, field: 'revisedProbability' | 'revisedImpact', val: number) => {
        setData((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const updated = { ...item, [field]: val };
                    return updated;
                }
                return item;
            })
        );
    };

    const scoreDisplay = getScoreDetails(item.riskScore);
    const calculatedRevisedScore = (item.revisedProbability as number) * (item.revisedImpact as number);
    const revisedScoreDetails = getScoreDetails(calculatedRevisedScore);
    const isDirty = hasRiskItemChanged(item, originalData[item.id]);
    const isLoading = loadingRiskId === item.id;

    const visibleAssignees = (item.assignees || []).slice(0, 2);
    const remainingCount = (item.assignees || []).length - visibleAssignees.length;
    const remainingAssignees = (item.assignees || []).slice(2);

    return (
        <Popover
            key={item.id}
            open={openRiskId === item.id}
            onOpenChange={(open) => setOpenRiskId(open ? item.id : null)}
        >
            <PopoverTrigger asChild>
                <TableRow className={cn("cursor-pointer group h-14", { "bg-[#fce9ac] hover:bg-[#fce9ac]": openRiskId === item.id })}>
                    {/* Risk Statement + ID */}
                    <TableCell className="font-medium">
                        <div className="flex gap-3 items-center">
                            <span className="text-slate-400 text-xs w-8">{item.key}</span>
                            <span className="text-sm text-slate-700">{item.riskStatement}</span>
                        </div>
                    </TableCell>

                    {/* Assigned To (Avatars) */}
                    <TableCell className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {visibleAssignees.map(a => {
                                const member = members.find(member => member.userId === a.userId);
                                return (
                                    <Tooltip key={a.userId}>
                                        <TooltipTrigger asChild>
                                            <Avatar className="w-6 h-6 border-2 border-white">
                                                <AvatarImage src={a.avatarUrl || (a as any).avatar_url} />
                                                <AvatarFallback>{member?.name ? member.name.charAt(0) : 'U'}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent><span key={a.userId} className="truncate">{member?.name} ({member?.email})</span></TooltipContent>
                                    </Tooltip>
                                )
                            })}
                            {remainingCount > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar className="w-6 h-6 border-2 border-white bg-gray-400 text-xs font-medium text-white cursor-pointer">
                                            <AvatarFallback>+{remainingCount}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold mb-1">Other Assignees:</p>
                                        {remainingAssignees.map(a => {
                                            const member = members.find(member => member.userId === a.userId);
                                            return (
                                                <span key={a.userId} className="truncate">{member?.name} ({member?.email})</span>
                                            )
                                        })}
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        {(!isLoading && canEdit) && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRisk(item);
                                }}
                                className="h-7 w-7 cursor-pointer p-0 text-gray-400 hover:text-indigo-600"
                                title="Edit Assignees"
                            >
                                <UserPlus size={16} />
                            </Button>
                        )}
                    </TableCell>

                    {/* Probability Dropdown */}
                    <TableCell>
                        <RiskLevelDropdown
                            value={item.probability}
                            onChange={(val) => handleUpdate(item.id, 'probability', val)}
                            canEdit={canEdit}
                        />
                    </TableCell>

                    {/* Impact Dropdown */}
                    <TableCell>
                        <RiskLevelDropdown
                            value={item.impact}
                            onChange={(val) => handleUpdate(item.id, 'impact', val)}
                            canEdit={canEdit}
                        />
                    </TableCell>

                    {/* Score Badge */}
                    <TableCell>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${scoreDisplay.color} ${scoreDisplay.bg}`}>
                            {scoreDisplay.label}
                        </span>
                    </TableCell>

                    {/* Status Checkbox */}
                    <TableCell className="text-center pr-6">
                        <Checkbox
                            onClick={(e) => { e.stopPropagation(); }}
                            checked={item.status === 'RESOLVED'}
                            // onCheckedChange={(c) => handleUpdate(item.id, 'status', c ? 'COMPLETE' : 'INCOMPLETE')}
                            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 rounded-full h-5 w-5 border-slate-300"
                        />
                    </TableCell>

                    {/* ACTIONS COLUMN */}
                    <TableCell className="text-center pr-2 w-[80px]">
                        <div className="flex justify-end space-x-1">

                            {/* UPDATE BUTTON */}
                            {isDirty && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isLoading} // Disable during loading
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateRiskItem(item);
                                    }}
                                    className="h-8 w-8 cursor-pointer text-blue-600 hover:bg-blue-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Edit className="h-4 w-4" />
                                    )}
                                </Button>
                            )}

                            {/* REVERT BUTTON */}
                            {isDirty && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isLoading}
                                    title="Revert changes"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRevertRiskItem(item.id);
                                    }}
                                    className="h-8 w-8 cursor-pointer text-amber-600 hover:bg-amber-50"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            )}

                            {/* DELETE BUTTON */}
                            {canEdit && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isLoading} // Disable during loading
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAlertMessage({
                                            type: "warning",
                                            title: "Confirm to delete",
                                            description: "Do you really want to delete this risk?",
                                            proceedAnyway: () => {
                                                handleDeleteRiskItem(item.id);
                                            }
                                        })
                                    }}
                                    className="h-8 w-8 cursor-pointer text-rose-600 hover:bg-rose-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            </PopoverTrigger>

            {/* DETAIL MODAL */}
            <PopoverContent
                side="right"
                align="center"
                className="w-[450px] p-0 z-50 overflow-hidden shadow-xl border-slate-100 relative"
                sideOffset={-650}
            >
                <div className="p-4 bg-white">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpenRiskId(null)}
                        className="absolute cursor-pointer right-2 top-2 h-6 w-6 rounded-full text-slate-500 hover:bg-slate-100"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </Button>

                    <h4 className="font-semibold text-sm mb-4 text-slate-800">Detail</h4>

                    <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm">
                        {/* Risk statement */}
                        <div className="text-slate-500 text-xs font-medium pt-1">Risk statement</div>
                        <div className="col-span-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-full">
                                        {canEdit ? (
                                            <Input
                                                value={item.riskStatement}
                                                onChange={(e) => handleUpdate(item.id, 'riskStatement', e.target.value)}
                                                className="h-8 text-sm bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
                                                placeholder="Enter risk statement"
                                            />
                                        ) : (
                                            <div className="h-8 flex items-center px-3 text-sm bg-slate-50 border border-slate-100 rounded text-slate-700 truncate cursor-default">
                                                {item.riskStatement || <span className="text-slate-400 italic">No statement</span>}
                                            </div>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                {item.riskStatement && (
                                    <TooltipContent className="max-w-[400px] break-words">
                                        {item.riskStatement}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </div>

                        {/* Mitigation Plan */}
                        <div className="text-slate-500 text-xs font-medium pt-1">Mitigation plan</div>
                        <div className="col-span-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-full">
                                        {canEdit ? (
                                            <Input
                                                value={item.mitigationPlan}
                                                onChange={(e) => handleUpdate(item.id, 'mitigationPlan', e.target.value)}
                                                className="h-8 text-sm bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
                                                placeholder="Enter mitigation plan"
                                            />
                                        ) : (
                                            <div className="h-8 flex items-center px-3 text-sm bg-slate-50 border border-slate-100 rounded text-slate-700 truncate cursor-default">
                                                {item.mitigationPlan || <span className="text-slate-400 italic">No mitigation plan</span>}
                                            </div>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                {item.mitigationPlan && (
                                    <TooltipContent className="max-w-[400px] break-words">
                                        {item.mitigationPlan}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </div>

                        {/* Note */}
                        <div className="text-slate-500 text-xs font-medium pt-1">Note</div>
                        <div className="col-span-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-full">
                                        {canEdit ? (
                                            <Input
                                                value={item.note}
                                                onChange={(e) => handleUpdate(item.id, 'note', e.target.value)}
                                                className="h-8 text-sm bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
                                                placeholder="Add a note"
                                            />
                                        ) : (
                                            <div className="h-8 flex items-center px-3 text-sm bg-slate-50 border border-slate-100 rounded text-slate-700 truncate cursor-default">
                                                {item.note || <span className="text-slate-400 italic">No note</span>}
                                            </div>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                {item.note && (
                                    <TooltipContent className="max-w-[400px] break-words">
                                        {item.note}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </div>

                        {/* Revised Probability */}
                        <div className="text-slate-500 text-xs font-medium flex items-center">Revised probability</div>
                        <div>
                            <RiskLevelDropdown
                                value={item.revisedProbability || "-" as any as number}
                                onChange={(val) => handleRevisedUpdate(item.id, 'revisedProbability', val)}
                                canEdit={canEdit}
                            />
                        </div>

                        {/* Revised Impact */}
                        <div className="text-slate-500 text-xs font-medium flex items-center">Revised Impact</div>
                        <div>
                            <RiskLevelDropdown
                                value={item.revisedImpact || "-" as any as number}
                                onChange={(val) => handleRevisedUpdate(item.id, 'revisedImpact', val)}
                                canEdit={canEdit}
                            />
                        </div>

                        {/* Revised Score */}
                        <div className="text-slate-500 text-xs font-medium flex items-center">Revised score</div>
                        <div>
                            <span className={`${revisedScoreDetails.color} bg-transparent font-medium`}>
                                {revisedScoreDetails.label}
                            </span>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}, arePropsEqual);