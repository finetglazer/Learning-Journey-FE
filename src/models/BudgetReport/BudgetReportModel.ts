import { OptionBaseModel } from "models/Common/Common";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class CostLine extends OptionBaseModel {
  @Field(Boolean) public isActive?: boolean;
  @Field(String) public parentCode?: string;
  @Field(Number) public total?: number;
  @Field(Number) public reallocateAmount?: number;
  @Field(Boolean) public isChild?: boolean;
  @Field(String) public budgetPeriod?: string;
  @Field(String) public budgetCalculationMethod?: string;
  @Field(String) public costDriverId?: string;
  @Field(String) public costDriverName?: string;
  @Field(Boolean) public isTransfer?: boolean;
  @Field(Boolean) public isBudgetOverruns?: boolean;
  @Field(Boolean) public isUsed?: boolean;
  @Field(String) public message?: string;
}

export class BudgetReportUsageModel extends Model {
  @ObjectField(OptionBaseModel) public project?: OptionBaseModel;
  @ObjectField(CostLine) public costLine?: CostLine;
  @Field(String) public ownerBusinessUnitId?: string;
  @Field(String) public ownerBusinessDepartmentId?: string;
  @Field(String) public ownerBusinessBranchId?: string;
  @Field(Number) public usageAmountMonthly?: number;
  @Field(Number) public actualPaymentMonthly?: number;
  @Field(Number) public budgetMonthly?: number;
  @Field(Number) public remainingBudgetAfterProposal?: number;
  @Field(Number) public remainingBudgetAfterPayment?: number;
  @Field(Number) public cumulativeUsageAmountMonthly?: number;
  @Field(Number) public cumulativeActualPaymentMonthly?: number;
  @Field(Number) public cumulativeBudgetMonthly?: number;
  @Field(Number) public remainingCumulativeBudgetAfterProposal?: number;
  @Field(Number) public remainingCumulativeBudgetAfterPayment?: number;
  @Field(Number) public budgetAnnual?: number;
  @Field(Number) public actualPaymentAnnual?: number;
  @Field(Number) public usageAmountAnnual?: number;
  @Field(Number) public remainingAnnualBudgetAfterApprovedProposal?: number;
  @Field(Number) public remainingAnnualBudgetAfterPayment?: number;
}

export class BudgetReportControlModel extends Model {
  @Field(String) public proposalCode?: string;
  @Field(Number) public approvedBudget?: number;
  @Field(String) public projectName?: string;
  @Field(String) public contractCode?: string;
  @Field(Number) public contractAmount?: number;
  @Field(Number) public finalizedAmount?: number;
  @Field(String) public paymentAdvanceRatioPercent?: string;
  @Field(Number) public paymentAdvanceAmount?: number;
  @Field(Number) public remainingAmount?: number;
  @Field(Number) public warrantyRetentionAmount?: number;
  @Field(String) public firstPaymentDate?: string;
  @Field(String) public reportingMonthDate?: string;
  @Field(Number) public executionMonths?: number;
  @Field(String) public businessLeadUnitName?: string;
  @Field(String) public settlementSupportUnitName?: string;
  @Field(String) public acceptanceStatus?: string;
}
