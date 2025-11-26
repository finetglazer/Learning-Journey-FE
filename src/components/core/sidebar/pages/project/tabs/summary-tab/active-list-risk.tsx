"use client";

import { ActiveRiskSummary } from "@/model/project-management";
import { isNil } from "lodash";
import { useMemo } from "react";

export interface ActiveRisksListProps {
    data: ActiveRiskSummary | null;
};

export function ActiveRisksList({
    data,
}: ActiveRisksListProps) {

    const displayedCount = data?.displayCount;
    const actualTotal = data?.totalCount;
    const hasHiddenRisks = !isNil(actualTotal) && !isNil(displayedCount) ? actualTotal > displayedCount : false;
    const risks = useMemo(() => data?.risks || [], [data?.risks]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
            {/* --- Header --- */}
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Active risk</h3>
                <p className="text-sm text-gray-500">A simple list of high-impact, unresolved risks</p>
            </div>

            {/* --- List Content --- */}
            <div className="flex-1 flex flex-col">
                {risks.map((risk, index) => (
                    <div
                        key={index}
                        className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
                    >
                        {/* Risk key Column */}
                        <span className="w-16 text-sm font-medium text-gray-400 shrink-0">
                            {risk.key}
                        </span>

                        {/* Risk statement Column */}
                        <span className="text-sm font-bold text-gray-900 truncate">
                            {risk.riskStatement}
                        </span>
                    </div>
                ))}
            </div>

            {/* --- Footer / Summary (Based on your annotation) --- */}
            {hasHiddenRisks && (
                <div className="pt-2 text-left">
                    <p className="text-[#FFCB33] font-semibold text-2xs">
                        The above list are <span className="font-medium text-[#FFCB33]">{displayedCount}</span> of a total of <span className="font-medium text-[#FFCB33]">{actualTotal}</span> high-impact, unresolved risks
                    </p>
                </div>
            )}
        </div>
    );
}