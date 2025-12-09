import { AlertMessage, AlertModal } from "@/components/core/alert-modal/alert-modal";
import SpinnerLoader from "@/components/core/loader/spinner-loader";
import { EmptyData } from "@/components/core/project-management/empty-data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getRiskLevelLabel, ProjectMembershipRole, RiskAssignee, RiskItem, RiskLevel } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { debounce } from "lodash";
import { Plus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { finalize } from "rxjs";
import { toast } from "sonner";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import CreateRiskModal from "./components/create-risk-modal";
import RiskAssigneeModal from "./components/risk-assignee-modal";
import { RiskItemRow } from "./components/risk-item-row";

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
    const [originalData, setOriginalData] = useState<{ [id: number]: RiskItem }>({});
    const [loadingRiskId, setLoadingRiskId] = useState<number | null>(null);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [openRiskId, setOpenRiskId] = useState<number | null>(null);

    const {
        selectedProject,
        currentMember,
        members,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    // 🆕 RBAC Check
    const canEdit = currentMember?.role === ProjectMembershipRole.OWNER;

    const urlParams = useSearchParams();

    const pageSizeUrlParam = Number(urlParams.get("pageSize")) || 20;

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
                    {canEdit && (
                        <Button
                            className="bg-blue-400 hover:bg-blue-700 cursor-pointer"
                            onClick={() => {
                                setIsCreating(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create
                        </Button>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-md border bg-white mb-6">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="w-[500px] pl-13">Risk statement</TableHead>
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
                            {(data || []).map((item) => (
                                <RiskItemRow
                                    key={item.id}
                                    item={item}
                                    canEdit={canEdit}
                                    originalData={originalData}
                                    setOriginalData={setOriginalData}
                                    loadingRiskId={loadingRiskId}
                                    openRiskId={openRiskId}
                                    setOpenRiskId={setOpenRiskId}
                                    members={members}
                                    setSelectedRisk={setSelectedRisk}
                                    handleUpdateRiskItem={handleUpdateRiskItem}
                                    setData={setData}
                                    getRiskItems={getRiskItems}
                                    setLoadingRiskId={setLoadingRiskId}
                                    selectedProject={selectedProject}
                                    setAlertMessage={setAlertMessage}
                                />
                            ))}

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