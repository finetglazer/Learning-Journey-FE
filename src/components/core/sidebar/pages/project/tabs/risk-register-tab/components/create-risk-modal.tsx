"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getScoreDetails } from "@/lib/utils";
import { RiskItem } from '@/model/project-management';
import { Ban, Save, X } from "lucide-react";
import React, { useMemo, useState } from 'react';
import { RiskLevelDropdown } from "./risk-level-dropdown";

export interface CreateRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (newRiskData: Partial<RiskItem>) => void;
};

const initialNewRiskState: Partial<RiskItem> = {
    riskStatement: "",
    probability: 1,
    impact: 1,
    mitigationPlan: "",
    note: "",
    revisedProbability: "-" as any as number,
    revisedImpact: "-" as any as number,
};


const CreateRiskModal: React.FC<CreateRiskModalProps> = ({
    isOpen,
    onClose,
    onCreate,
}) => {
    const [newRisk, setNewRisk] = useState<Partial<RiskItem>>(initialNewRiskState);

    const calculateScores = (risk: Partial<RiskItem>) => {
        const currentScore = (risk.probability || 0) * (risk.impact || 0);
        const revisedScore = (risk.revisedProbability || 0) * (risk.revisedImpact || 0);

        return {
            current: currentScore,
            revised: revisedScore
        };
    };

    const scores = useMemo(() => calculateScores(newRisk), [newRisk]);
    const currentScoreDetails = getScoreDetails(scores.current);

    const handleInputChange = (field: keyof Partial<RiskItem>, value: string | number | undefined) => {
        setNewRisk(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onCreate(newRisk);
        setNewRisk(initialNewRiskState); // Reset form
        onClose();
    };

    // Check if the form is valid for initial saving
    const isSaveDisabled = !newRisk.riskStatement || !newRisk.probability || !newRisk.impact;


    // --- Helper Component for nullable select field ---
    // Includes the 'X' button to clear the selected value
    const NullableRiskSelect: React.FC<{
        label: string;
        field: keyof Partial<RiskItem>;
        value: number | undefined
    }> = ({ label, field, value }) => (
        <div className="space-y-1">
            <Label htmlFor={field}>{label}</Label>
            <div className="flex items-center space-x-2">
                <RiskLevelDropdown
                    value={value}
                    onChange={(val) => handleInputChange(field, val)}
                />
                {/* 'X' Button to clear the selection */}
                {value && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleInputChange(field, undefined)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        title="Clear selection"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="relative">
                    <DialogTitle>Create New Risk Item</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">

                    {/* RISK STATEMENT */}
                    <div className="space-y-1">
                        <Label htmlFor="riskStatement">Risk Statement<span className="text-red-500">*</span></Label>
                        <textarea
                            id="riskStatement"
                            value={newRisk.riskStatement}
                            onChange={(e) => handleInputChange('riskStatement', e.target.value)}
                            rows={3}
                            className="w-full text-sm text-gray-800 border border-gray-300 p-2 rounded resize-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* MITIGATION PLAN */}
                    <div className="space-y-1">
                        <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
                        <textarea
                            id="mitigationPlan"
                            value={newRisk.mitigationPlan}
                            onChange={(e) => handleInputChange('mitigationPlan', e.target.value)}
                            rows={3}
                            className="w-full text-sm text-gray-800 border border-gray-300 p-2 rounded resize-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* NOTE */}
                    <div className="space-y-1">
                        <Label htmlFor="note">Note</Label>
                        <textarea
                            id="note"
                            value={newRisk.note}
                            onChange={(e) => handleInputChange('note', e.target.value)}
                            rows={3}
                            className="w-full text-sm text-gray-800 border border-gray-300 p-2 rounded resize-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <h3 className="text-md font-semibold mt-4 border-t pt-4">Risk Evaluation</h3>

                    <div className="grid grid-cols-3 gap-6">

                        {/* PROBABILITY (Required) */}
                        <div className="space-y-1">
                            <Label htmlFor="probability">Probability<span className="text-red-500">*</span></Label>
                            <RiskLevelDropdown
                                value={newRisk.probability}
                                onChange={(val) => handleInputChange('probability', val)}
                            />
                        </div>

                        {/* IMPACT (Required) */}
                        <div className="space-y-1">
                            <Label htmlFor="impact">Impact<span className="text-red-500">*</span></Label>
                            <RiskLevelDropdown
                                value={newRisk.impact}
                                onChange={(val) => handleInputChange('impact', val)}
                            />
                        </div>

                        {/* CALCULATED SCORE */}
                        <div className="space-y-1">
                            <Label>Risk Score</Label>
                            <div className={`p-2 text-center text-sm font-semibold rounded ${currentScoreDetails.bg} ${currentScoreDetails.color}`}>
                                {scores.current > 0 ? currentScoreDetails.label : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={false} className="cursor-pointer">
                        <Ban className="w-4 h-4 mr-2 cursor-pointer" /> Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaveDisabled} className="cursor-pointer bg-blue-600 hover:bg-teal-400">
                        <Save className="w-4 h-4 mr-2" /> Save Risk
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRiskModal;