import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getRiskLevelLabel, RiskAssignee, RiskItem, RiskLevel } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { Edit, Loader2, Plus, RotateCcw, Search, Trash2, UserPlus, X } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { RiskLevelDropdown } from "./components/risk-level-dropdown";
import { finalize } from "rxjs";
import { AlertMessage, AlertModal } from "@/components/core/alert-modal/alert-modal";
import RiskAssigneeModal from "./components/risk-assignee-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { debounce } from "lodash";
import { getScoreDetails } from "@/lib/utils";
import CreateRiskModal from "./components/create-risk-modal";
import SpinnerLoader from "@/components/core/loader/spinner-loader";
import { EmptyData } from "@/components/core/project-management/empty-data";
import { useSearchParams } from "next/navigation";

export interface RiskRegisterTabProps {
};

export default function RiskRegisterTab({
}: RiskRegisterTabProps) {
    const [data, setData] = useState<RiskItem[]>([]);
    const [isMyRisk, setIsMyRisk] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [openRiskId, setOpenRiskId] = useState<number | null>(null);
    const [originalData, setOriginalData] = useState<{ [id: number]: RiskItem }>({});
    const [loadingRiskId, setLoadingRiskId] = useState<number | null>(null);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

    const {
        selectedProject,
        currentMember,
        members,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);
    
    const urlParams = useSearchParams();

    const pageSizeUrlParam = Number(urlParams.get("pageSize")) || 20;

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

    const getRiskItems = useCallback((useCustomPageSize?: boolean, customPageSize?: number) => {
        const subscription = projectRepository.getRisks({
            projectId: selectedProject?.id as number,
            page: currentPage,
            limit: useCustomPageSize ? customPageSize : pageSize,
            search: searchQuery,
            assignee: isMyRisk ? "me" : "",
        })
            .pipe(finalize(() => {
                setFetching(false);
            }))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        let newOriginalData: { [id: number]: RiskItem } = {};
                        const mappedData = (res?.data?.risks || []).map((risk: any) => {
                            const mappedRisk = {
                                ...risk,
                                probability: RiskLevel[risk.probability as keyof typeof RiskLevel].value,
                                impact: RiskLevel[risk.impact as keyof typeof RiskLevel].value,
                                revisedProbability: (RiskLevel[risk.revisedProbability as keyof typeof RiskLevel] || {}).value,
                                revisedImpact: (RiskLevel[risk.revisedImpact as keyof typeof RiskLevel] || {}).value,
                                isMine: (risk.assignees || []).some((assignee: any) => assignee.userId === currentMember?.userId),
                            };
                            newOriginalData[risk.id as number] = mappedRisk;
                            return mappedRisk;
                        });

                        setTotalCount(res?.data?.pagination?.totalRisks);
                        setData(mappedData);
                        setOriginalData(newOriginalData);
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: err => { }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [
        selectedProject,
        searchQuery,
        currentPage,
        isMyRisk,
        currentMember,
    ]);

    const debouncedFetch = useMemo(() => {
        return debounce(() => getRiskItems(), 500);
    }, [getRiskItems]);

    const handleCreateRiskItem = useCallback((newRisk: Partial<RiskItem>) => {
        projectRepository.createRisk({
            projectId: selectedProject?.id as number,
        }, {
            risk_statement: newRisk.riskStatement,
            probability: getRiskLevelLabel(newRisk.probability as number),
            impact: getRiskLevelLabel(newRisk.impact as number),
        })
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg);
                        setIsCreating(false);
                        getRiskItems();
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
                }
            });
    }, [
        selectedProject,
    ]);

    const handleUpdateRiskItem = useCallback((risk: RiskItem) => {
        setLoadingRiskId(risk.id);

        projectRepository.updateRisk({
            projectId: selectedProject?.id as number,
            riskId: risk.id,
        }, {
            risk_statement: risk?.riskStatement,
            probability: getRiskLevelLabel(risk?.probability),
            impact: getRiskLevelLabel(risk?.impact),
            assignees: (risk?.assignees || []).map(assignee => assignee.userId),
            mitigation_plan: risk?.mitigationPlan,
            note: risk?.note,
            status: risk?.status,
            revised_probability: risk?.revisedProbability ? getRiskLevelLabel(risk?.revisedProbability) : null,
            revised_impact: risk?.revisedImpact ? getRiskLevelLabel(risk?.revisedImpact) : null,
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
                }
            })
    }, [
        selectedProject,
        data,
    ]);

    const handleUpdateRiskAssignees = useCallback((assignees: RiskAssignee[]) => {
        if (!selectedRisk) {
            return;
        }
        const risk: RiskItem = selectedRisk;
        setSelectedRisk(null);
        handleUpdateRiskItem({
            ...risk,
            assignees: [...assignees],
        });
    }, [
        selectedRisk,
        handleUpdateRiskItem,
    ]);

    const handleDeleteRiskItem = useCallback((riskId: number) => {
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
    }, [
        selectedProject,
        data,
    ]);

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

    useEffect(() => {
        if (selectedProject?.id) {
            setFetching(true);
            debouncedFetch();
        }
        return () => {
            debouncedFetch.cancel();
        };
    }, [
        selectedProject,
        searchQuery,
        currentPage,
        isMyRisk,
        debouncedFetch,
    ]);

    useEffect(() => {
        setPageSize(pageSizeUrlParam);
        setFetching(true);
        getRiskItems(true, pageSizeUrlParam);
    }, [pageSizeUrlParam]);

    return (
        <div className="w-full p-6 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search risk register" className="pl-8 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="my-risk"
                            checked={isMyRisk}
                            onCheckedChange={(c) => setIsMyRisk(!!c)}
                        />
                        <label
                            htmlFor="my-risk"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            My risk
                        </label>
                    </div>
                    <Button
                        className="bg-blue-400 hover:bg-blue-700 cursor-pointer"
                        onClick={() => {
                            setIsCreating(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-md border bg-white mb-6">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="w-[500px]">Risk statement</TableHead>
                            <TableHead>Assigned to</TableHead>
                            <TableHead>Probability</TableHead>
                            <TableHead>Impact</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    {fetching && (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex justify-center items-center w-full">
                                        <SpinnerLoader
                                            sizeClass="24"
                                            message="Getting risk items..."
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                    {(!fetching && (!data || !data.length)) && (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <EmptyData
                                        title="No risks found"
                                        message={!searchQuery ? "You haven't added any risks yet. Add one to get started." : `No risks found with "${searchQuery}"`}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                    {!fetching && (
                        <TableBody>
                            {(data || []).map((item) => {
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
                                            <TableRow className="cursor-pointer group h-14">
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
                                                    {!isLoading && (<Button
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
                                                    </Button>)}
                                                </TableCell>

                                                {/* Probability Dropdown */}
                                                <TableCell>
                                                    <RiskLevelDropdown
                                                        value={item.probability}
                                                        onChange={(val) => handleUpdate(item.id, 'probability', val)}
                                                    />
                                                </TableCell>

                                                {/* Impact Dropdown */}
                                                <TableCell>
                                                    <RiskLevelDropdown
                                                        value={item.impact}
                                                        onChange={(val) => handleUpdate(item.id, 'impact', val)}
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
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </PopoverTrigger>

                                        {/* DETAIL MODAL */}
                                        <PopoverContent
                                            side="right"
                                            align="center"
                                            className="w-[450px] p-0 z-50 overflow-hidden shadow-xl border-slate-100 relative"
                                            sideOffset={-360}
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
                                                        <textarea
                                                            value={item.riskStatement}
                                                            onChange={(e) => handleUpdate(item.id, 'riskStatement', e.target.value)}
                                                            rows={3}
                                                            className="w-full text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-300 resize-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                    {/* Mitigation Plan */}
                                                    <div className="text-slate-500 text-xs font-medium pt-1">Mitigation plan</div>
                                                    <div className="col-span-1">
                                                        <textarea
                                                            value={item.mitigationPlan}
                                                            onChange={(e) => handleUpdate(item.id, 'mitigationPlan', e.target.value)}
                                                            rows={3}
                                                            className="w-full text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-300 resize-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>

                                                    {/* Note */}
                                                    <div className="text-slate-500 text-xs font-medium pt-1">Note</div>
                                                    <div className="col-span-1">
                                                        <textarea
                                                            value={item.note}
                                                            onChange={(e) => handleUpdate(item.id, 'note', e.target.value)}
                                                            rows={3}
                                                            className="w-full text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-300 resize-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>

                                                    {/* Divider */}
                                                    <div className="col-span-2 h-px bg-slate-100 my-1" />

                                                    {/* Revised Probability */}
                                                    <div className="text-slate-500 text-xs font-medium flex items-center">Revised probability</div>
                                                    <div>
                                                        <RiskLevelDropdown
                                                            value={item.revisedProbability || "-" as any as number}
                                                            onChange={(val) => handleRevisedUpdate(item.id, 'revisedProbability', val)}
                                                        />
                                                    </div>

                                                    {/* Revised Impact */}
                                                    <div className="text-slate-500 text-xs font-medium flex items-center">Revised Impact</div>
                                                    <div>
                                                        <RiskLevelDropdown
                                                            value={item.revisedImpact || "-" as any as number}
                                                            onChange={(val) => handleRevisedUpdate(item.id, 'revisedImpact', val)}
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
                            })}

                            <CreateRiskModal
                                isOpen={isCreating}
                                onClose={() => {
                                    setIsCreating(false);
                                }}
                                onCreate={handleCreateRiskItem}
                            />

                            <RiskAssigneeModal
                                isOpen={!!selectedRisk}
                                onClose={() => setSelectedRisk(null)}
                                onSave={handleUpdateRiskAssignees}
                                currentAssignees={selectedRisk?.assignees || []}
                                teamMembers={members}
                            />

                            {alertMessage && (
                                <AlertModal
                                    alertMessage={alertMessage}
                                    onClose={() => setAlertMessage(null)}
                                />
                            )}
                        </TableBody>
                    )}
                </Table>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end">
                <PaginationWithLinks
                    page={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    pageSizeSelectOptions={{
                        pageSizeSearchParam: "pageSize",
                        pageSizeOptions: [20, 30, 40, 50]
                    }}
                />
            </div>
        </div>
    );
}