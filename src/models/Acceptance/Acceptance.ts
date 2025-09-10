import { OptionBaseModel } from "models/Common/Common";
import { DocumentGroup } from "models/DocumentGroup";
import { Tax as TaxModel } from "models/Tax";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";
import { GoodsReceiptModel } from "./GoodsReceipt";

export class BaseModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

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

  @Field(Number)
  public status?: number;
}

export class PurchaseOrganization extends Model {
  @Field(String)
  public email?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public taxCode?: string;

  @Field(String)
  public address?: string;

  @Field(String)
  public personAgent?: string;

  @Field(String)
  public position?: string;
}

export class PurchasePlanRelativeModel extends OptionBaseModel {
  @Field(String)
  public ticketType?: string;

  @Field(String)
  public createdBy?: string;

  @Field(String)
  public createdName?: string;

  @Field(String)
  public createdDate?: string;

  @Field(Number)
  public ticketTypeNumber?: number;

  @Field(String)
  public costGroup?: string;

  @Field(String)
  public costType?: string;
}

export class TicketRelatedModel extends Model {
  @ObjectField(PurchasePlanRelativeModel)
  purchasePlanRelateds?: PurchasePlanRelativeModel[];
}

export class AcceptanceComponent {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public fullName?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public userName?: string;

  @Field(String)
  public phoneNumber?: string;

  @Field(String)
  public businessDepartmentId?: string;

  @Field(String)
  public businessDepartment?: string;

  @Field(String)
  public businessBranchId?: string;

  @Field(String)
  public businessBranch?: string;

  @Field(String)
  public businessUnitId?: string;

  @Field(String)
  public businessUnit?: string;

  @Field(String)
  public organizationId?: string;

  @Field(String)
  public organizationName?: string;

  @Field(String)
  public positionId?: string;

  @Field(String)
  public positionName?: string;
}

export class AcceptanceModel extends OptionBaseModel {
  @Field(String)
  public contractId?: string;

  @Field(String)
  public description?: string;

  @Field(String)
  public applyDate?: string;

  @Field(String)
  public createUser?: string;

  @Field(String)
  public currency?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractName?: string;

  @Field(String)
  public contractType?: string;

  @Field(Number)
  public totalAmount?: number;

  @Field(String)
  public effectiveDate?: string;

  @Field(Number)
  public contractFrom?: number;

  @Field(Number)
  public contractTo?: number;

  @Field(String)
  public endDate?: string;

  @Field(Number)
  public exchangeRate?: number;

  @Field(String)
  public managerEmail?: string;

  @Field(String)
  public managerName?: string;

  @Field(String)
  public origin?: string;

  @Field(String)
  public purchaseOrganizationId?: string;

  @Field(String)
  public purchaseOrganization?: PurchaseOrganization;

  @Field(String)
  public supplierId?: string;

  @Field(String)
  public supplierName?: string;

  @Field(String)
  public supplierTaxCode?: string;

  @Field(String)
  public supplierPersonAgent?: string;

  @Field(String)
  public supplierPosition?: string;

  @Field(String)
  public conclude?: string;

  @ObjectField(TicketRelatedModel)
  public ticketRelated?: TicketRelatedModel;

  public accentanceGoodItems?: string[];

  public goodsReceiptRequests?: GoodsReceiptModel[];

  public acceptanceFiles?: DocumentGroup[];

  @ObjectField(AcceptanceComponent)
  public acceptanceComponents?: AcceptanceComponent[];

  @ObjectField(AcceptanceComponent)
  public documentGroups?: DocumentGroup[];

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
  public canReturn?: boolean;

  @Field(Boolean)
  public canDecline?: boolean;

  @Field(Boolean)
  public canApprove?: boolean;

  @Field(Number)
  public status?: number;

  public acceptanceGoodsItems?: GoodItemsModel[];
}

export class GoodItemsModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public contractGoodsItemId?: string;

  @Field(String)
  public goodsId?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public description?: string;

  @Field(String)
  public note?: string;

  @Field(String)
  public branchId?: string;

  @Field(String)
  public unitId?: string;

  @Field(String)
  public taxId?: string;

  @Field(Number)
  public taxPercent?: number;

  @Field(Number)
  public taxAmount?: number;

  @Field(Number)
  public taxConvertedAmount?: number;

  @Field(Number)
  public totalConvertedAmount?: number;

  @Field(Number)
  public amountBeforeTax?: number;

  @Field(Number)
  public convertedAmountBeforeTax?: number;

  @Field(Number)
  public originalTotalAmount?: number;

  @Field(Number)
  public otherAmount?: number;

  @ObjectField(TaxModel)
  public tax?: TaxModel;

  @ObjectField(OptionBaseModel)
  public unit?: OptionBaseModel;

  @ObjectField(OptionBaseModel)
  public branch?: OptionBaseModel;

  @Field(String)
  public categoryId?: string;

  @ObjectField(OptionBaseModel)
  public category?: OptionBaseModel;

  @Field(Number)
  public quantity?: number;

  @Field(Number)
  public quantityConact?: number;

  @Field(Number)
  public quantityDifference?: number;

  @Field(Number)
  public unitPrice?: number;

  @Field(Number)
  public totalAmount?: number;

  @Field(Number)
  public totalTaxAmount?: number;

  // goodsReceiptRequest: GoodsReceiptRequest[];
}

export class EvaluationDetail extends Model {
  public id?: string;

  public code?: string;
  public name?: string;

  public evaluationItemId?: string;

  public standard?: string;

  public weight?: number;
  public score?: number;

  public note?: string;
}

// Evaluation supplier
export class EvaluationSupplierModel extends Model {
  public evaluationWeightTotal?: number;

  public evaluationScoreTotal?: number;

  public evaluationScoreResult?: number;

  public evaluationScoreMax?: number;

  public supplierEvaluationConclusion?: string;

  public evaluationDetails?: EvaluationDetail[];
}

export class AcceptanceWaitingModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  public originalPurchaseRequest?: OriginalPurchaseRequest;

  @Field(String)
  public supplier?: string;

  @Field(String)
  public manager?: string;

  @Field(String)
  public effectiveDate?: string;

  @Field(String)
  public contractType?: string;

  @Field(String)
  public contractNo?: string;

  @Field(Number)
  public contractFrom?: number;

  @Field(Number)
  public contractTo?: number;
}

export class OriginalPurchaseRequest extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}
