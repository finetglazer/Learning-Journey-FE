import { OptionBaseModel } from "models/Common/Common";
import { Model } from "react-3layer-common";
import { Field, ObjectField, ObjectList } from "react-3layer-decorators";

// config TagFilterList
export interface TagFilterList {
  title: string;
  value: string;
}

export class BaseModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}

// config ProjectSettlement

class AutomaticCostAllocationJson {
  @ObjectField(OptionBaseModel)
  public costDriver?: OptionBaseModel;

  @Field(String)
  public costDriverId?: string;

  @ObjectField(OptionBaseModel)
  public project?: OptionBaseModel;

  @Field(String)
  public projectId?: string;

  @Field(String)
  public costLine?: string;

  @Field(String)
  public costLineId?: string;

  @Field(Number)
  public allocationMonth?: number;

  @Field(Boolean)
  public isUniqueUnitPrice?: boolean;

  @Field(Number)
  public estimateAmount?: number;

  @Field(Number)
  public contingencyAmount?: number;

  @Field(Array)
  public lines?: string[];
}

export class ProjectSettlementModel extends BaseModel {
  @Field(String)
  public purchaseProposalId?: string;

  @Field(String)
  public purchaseProposalCode?: string;

  @Field(String)
  public purchaseProposalName?: string;

  @Field(String)
  public projectCode?: string;

  @Field(String)
  public projectName?: string;

  @Field(String)
  public createdBy?: string;

  @Field(String)
  public createdByName?: string;

  @Field(String)
  public createdDate?: string;

  @Field(Number)
  public projectSettlementAmount?: number;

  @Field(Number)
  public status?: number;

  @ObjectField(AutomaticCostAllocationJson)
  public automaticCostAllocationJson?: AutomaticCostAllocationJson;

  @Field(Boolean)
  public canView?: boolean;

  @Field(Boolean)
  public canEdit?: boolean;

  @Field(Boolean)
  public canCancel?: boolean;

  @Field(Boolean)
  public canDelete?: boolean;

  @Field(Boolean)
  public canAction?: boolean;

  @Field(Boolean)
  public canViewApprove?: boolean;

  @Field(Boolean)
  public canCopy?: boolean;

  @Field(Boolean)
  public canGiveBack?: boolean;

  @Field(Boolean)
  public canApproved?: boolean;

  @Field(Boolean)
  public canApprovedCanceled?: boolean;

  @Field(Boolean)
  public canChooseSupplier?: boolean;

  @Field(Boolean)
  public canRound?: boolean;

  @Field(Boolean)
  public canQuoted?: boolean;

  @Field(Boolean)
  public canSaveDraft?: boolean;

  @Field(Boolean)
  public canWaitingForApprove?: boolean;

  @Field(Boolean)
  public canDeclined?: boolean;

  @Field(Boolean)
  public canRefuse?: boolean;

  @Field(Boolean)
  public canApproveSupplier?: boolean;
}

// type ProjectSettlementProposal
export class UserInfoProjectSettlement {
  @Field(String)
  public createUser?: string;

  @Field(String)
  public createFullname?: string;

  @Field(String)
  public createOrganization?: string;

  @Field(String)
  public createPosition?: string;
}

export class GoodsProjectSettlement extends OptionBaseModel {
  @Field(Number)
  public fixedAssetDepreciationPeriod?: number;

  @Field(Number)
  public toolsDepreciationPeriod?: number;
}

export class OrganizationProjectSettlement extends OptionBaseModel {
  @Field(String)
  public email?: string;

  @Field(String)
  public phone?: string;

  @Field(String)
  public taxCode?: string;

  @Field(String)
  public address?: string;

  @Field(String)
  public personAgent?: string;

  @Field(String)
  public position?: string;
}

export class UserProjectSettlement {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public fullName?: string;

  @Field(String)
  public phoneNumber?: string;

  @Field(String)
  public departmentId?: string;

  @Field(String)
  public organizationId?: string;

  @Field(String)
  public positionId?: string;
}

export class AssetItemModel extends BaseModel {
  @ObjectField(OptionBaseModel)
  public asset?: OptionBaseModel;

  @ObjectField(GoodsProjectSettlement)
  public goods?: GoodsProjectSettlement;

  @ObjectField(OptionBaseModel)
  public branch?: OptionBaseModel;

  @Field(String)
  public goodsDescription?: string;

  @Field(String)
  public branchId?: string;

  @Field(String)
  public goodsNote?: string;

  @Field(String)
  public originNo?: string;

  @Field(String)
  public serialNumber?: string;

  @Field(Number)
  public quantity?: number;

  @ObjectField(OrganizationProjectSettlement)
  public ownerOrganization?: OrganizationProjectSettlement;

  @ObjectField(UserProjectSettlement)
  public ownerUser?: UserProjectSettlement;

  @Field(Number)
  public originalCost?: number;

  @ObjectField(OptionBaseModel)
  public type?: OptionBaseModel;

  @Field(String)
  public classify?: string;

  @Field(Number)
  public depreciationMonths?: number;

  @Field(String)
  public usageStartDate?: string;

  @Field(String)
  public depreciationStartDate?: string;

  @Field(String)
  public note?: string;

  @Field(Boolean)
  public isCreate?: boolean;
}

export class ProjectSettlementAsset {
  @Field(String)
  public contractName?: string;

  @Field(String)
  public contractNo?: string;

  @Field(Number)
  public contractRequestType?: number;

  @Field(String)
  public contractId?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public supplierName?: string;

  @ObjectField(AssetItemModel)
  public assetItems?: AssetItemModel[];
}

export class ContractSettlementAsset {
  @Field(Number)
  public assetFixedAmount?: number;

  @Field(Number)
  public assetFixedTangibleAmount?: number;

  @Field(Number)
  public assetFixedIntangibleAmount?: number;

  @Field(Number)
  public assetToolsAmount?: number;

  @Field(Number)
  public assetCostAmount?: number;

  @Field(Number)
  public totalAmount?: number;

  @ObjectField(ProjectSettlementAsset)
  public projectSettlementAssets?: ProjectSettlementAsset[];
}

export class Goods extends Model {
  @Field(String)
  public goodsId?: string;

  @Field(String)
  public goodsName?: string;

  @Field(String)
  public goodsCode?: string;

  @ObjectField(BaseModel)
  public goodsServiceUnit?: BaseModel;

  @ObjectField(BaseModel)
  public goodsServicesCategory?: BaseModel;

  @Field(String)
  public goodsDescription?: string;

  @Field(String)
  public goodsNote?: string;

  @Field(String)
  public investmentBeforeTax?: number;

  @Field(String)
  public investmentTax?: number;

  @Field(String)
  public investmentSum?: number;

  @Field(String)
  public settlementBeforeTax?: number;

  @Field(String)
  public settlementTax?: number;

  @Field(String)
  public settlementSum?: number;

  @Field(String)
  public differenceValue?: number;

  @Field(String)
  public note?: string;

  @Field(String)
  public goodsManufacturer?: string;
}

export class ProjectSettlementInfo extends Model {
  @Field(String)
  public proposalCode?: string;

  @Field(String)
  public proposalName?: string;

  @Field(String)
  public projectCode?: string;

  @Field(String)
  public projectName?: string;

  @Field(String)
  public investmentLocation?: string;
}

export class InvestmentCosts extends Model {
  @Field(String)
  public content?: string;

  @Field(Number)
  public investmentBeforeTax?: number;

  @Field(Number)
  public investmentTax?: number;

  @Field(Number)
  public investmentSum?: number;

  @Field(Number)
  public settlementBeforeTax?: number;

  @Field(Number)
  public settlementTax?: number;

  @Field(Number)
  public settlementSum?: number;

  @Field(Number)
  public differenceValue?: number;

  @Field(String)
  public note?: string;
}

export class ContractSettlements extends Model {
  @Field(String)
  public contractId?: string;

  @Field(String)
  public contractName?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public currency?: string;

  @Field(Number)
  public contractValue?: number;

  @Field(Number)
  public settlementValue?: number;

  @Field(Number)
  public differenceValue?: number;

  @Field(String)
  public effectiveDate?: string;

  @Field(String)
  public operationalDate?: string;
}

export class GoodsCategoryCosts extends Model {
  @Field(String)
  goodsCategoryId?: string;

  @Field(String)
  goodsCategoryName?: string;

  @Field(Number)
  investmentBeforeTax?: number;

  @Field(Number)
  investmentTax?: number;

  @Field(Number)
  investmentSum?: number;

  @Field(Number)
  settlementBeforeTax?: number;

  @Field(Number)
  settlementTax?: number;

  @Field(Number)
  settlementSum?: number;

  @Field(Number)
  differenceValue?: number;

  @Field(String)
  note?: string;
}

export class Debts extends Model {
  @Field(String)
  public contractId?: string;

  @Field(String)
  public contractName?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public currency?: string;

  @Field(Number)
  public contractValue?: number;

  @Field(Number)
  public settlementValue?: number;

  @Field(Number)
  public amountPaid?: number;

  @Field(Number)
  public remainingAmount?: number;

  @Field(String)
  public note?: string;

  @ObjectField(OptionBaseModel)
  public supplier?: OptionBaseModel;
}

export class ProjectSettlementProposal extends BaseModel {
  @Field(Boolean)
  public isDraft?: boolean;

  @Field(String)
  public originalPurchaseProposalId?: string;

  @Field(String)
  public projectId?: string;

  @Field(String)
  public settlementDescription?: string;

  @ObjectField(UserInfoProjectSettlement)
  public createUserInfo?: UserInfoProjectSettlement;

  @ObjectField(ProjectSettlementInfo)
  public projectSettlementInfo?: ProjectSettlementInfo;

  @Field(String)
  public investmentForm?: string;

  @Field(Number)
  public status?: number;

  @ObjectField(ContractSettlementAsset)
  public contractSettlementAsset?: ContractSettlementAsset;

  @Field(String)
  public evaluationResult?: string;

  public debts?: Debts[];
  public goodsCategoryCosts?: GoodsCategoryCosts[];
  public investmentCosts?: InvestmentCosts[];
  public contractSettlements?: ContractSettlements[];

  @Field(String)
  public responsibility?: string;

  @Field(Boolean)
  public canEdit?: boolean;

  @Field(Boolean)
  public canCancel?: boolean;

  @Field(Boolean)
  public canDelete?: boolean;

  @Field(Boolean)
  public canCloseRequest?: boolean;

  @Field(Boolean)
  public canCloseButton?: boolean;

  @Field(Boolean)
  public canIntergrationAsset?: boolean;

  @Field(Boolean)
  public canReturn?: boolean;

  @Field(Boolean)
  public canDecline?: boolean;

  @Field(Boolean)
  public canApprove?: boolean;

  @Field(Boolean)
  public canCreatePaymentRequest?: boolean;

  @ObjectList(Goods)
  public projectSettlementGoodsItems?: Goods[];
}

export class AssetClassifyResponse extends Model {
  @Field(String)
  public classify?: string;

  @Field(Number)
  public classifyType?: number;

  @Field(Number)
  public depreciationMonths?: number;
}
