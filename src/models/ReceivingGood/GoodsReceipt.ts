import { RequestAttachment } from "models/Budget/BugetSettlement";
import { DocumentGroup } from "models/DocumentGroup";
import { Model } from "react-3layer-common";
import { Field, ObjectField, ObjectList } from "react-3layer-decorators";
import { ReceivingGoodModel } from "./ReceivingGoodModel";
import { OptionBaseModel } from "models/Common/Common";

export class BaseModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}

export class ManagerOrganization extends BaseModel {
  @Field(String)
  public email?: string;

  @Field(String)
  public phone?: string;

  @Field(String)
  public taxCode?: string;

  @Field(String)
  public address?: string;
}

export class BusinessDepartment extends BaseModel {
  @Field(String)
  businessUnitId?: string;

  @Field(String)
  businessUnitCode?: string;

  @Field(String)
  businessUnitName?: string;
}

export class ManagerOrganizationDetail extends Model {
  @Field(String)
  public id?: string;

  @ObjectField(BaseModel)
  public businessBranch?: BaseModel;

  @ObjectField(BaseModel)
  public businessUnit?: BaseModel;

  @ObjectField(BusinessDepartment)
  public businessDepartment?: BusinessDepartment;
}

export class Currency extends BaseModel {
  @Field(String)
  public symbol?: string;
}

export class Bank extends BaseModel {
  @Field(Boolean)
  isActive?: boolean;

  @Field(Boolean)
  isInternal?: boolean;
}

export class SupplierPayment extends BaseModel {
  @Field(Boolean)
  public isActive?: boolean;

  @ObjectField(Currency)
  public currency?: Currency;

  @ObjectField(Bank)
  public bank?: Bank;
}

export class Supplier extends BaseModel {
  @Field(String)
  public taxCode?: string;

  @Field(String)
  public address?: string;

  @Field(String)
  public type?: string;
}
export class ContractSupplier extends Model {
  @Field(String)
  public supplierId: string;

  @ObjectField(BaseModel)
  public supplier?: Supplier;

  @Field(String)
  public address?: string;

  @Field(String)
  public agentPerson?: string;

  @Field(String)
  public agentPersonPosition?: string;

  @Field(String)
  public procuration?: string;

  @Field(String)
  public contactPerson?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public phone?: string;

  @Field(String)
  public supplierPaymentId?: string;

  @ObjectField(SupplierPayment)
  public supplierPayment?: SupplierPayment;
}

export class ContractInfo extends BaseModel {
  @Field(String)
  public contractNo?: string;

  @Field(String)
  public effectiveDate?: string;

  @Field(String)
  public endDate?: string;

  @Field(String)
  public managerName?: string;

  @Field(String)
  public managerEmail?: string;

  @ObjectField(ManagerOrganization)
  public managerOrganization?: ManagerOrganization;

  @ObjectField(ManagerOrganizationDetail)
  public managerOrganizationDetail?: ManagerOrganizationDetail;

  @ObjectField(ContractSupplier)
  public contractSupplier?: ContractSupplier;

  @ObjectField(ManagerOrganization)
  public receiverOrganization?: ManagerOrganization;

  @Field(String)
  public receiverName?: string;

  @Field(String)
  public receiverEmail?: string;

  @ObjectField(ManagerOrganizationDetail)
  public receiverOrganizationDetail?: ManagerOrganizationDetail;

  @Field(String)
  public supplierPaymentId?: string;
}

export class Attachment extends Model {
  @Field(String)
  public systemFileId: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public contentType?: string;

  @Field(Number)
  public size?: number;

  @Field(String)
  public path?: string;
}

export class GoodsInfo extends BaseModel {
  @ObjectField(ReceivingGoodModel)
  public goodsServiceUnit?: BaseModel;

  @ObjectField(ReceivingGoodModel)
  public goodsServicesCategory?: BaseModel;

  @ObjectField(ReceivingGoodModel)
  public costGroups?: BaseModel;

  @ObjectField(ReceivingGoodModel)
  public costGroup?: BaseModel;
}

export class TaxInfo extends BaseModel {
  @Field(Number)
  public rate?: number;

  @Field(Boolean)
  public isActive?: boolean;

  @Field(Number)
  public taxType?: number;
}

export class ContractGoodsItem extends Model {
  @Field(String)
  public goodsId?: string;

  @ObjectField(GoodsInfo)
  public goodsInfo?: GoodsInfo;

  @ObjectField(BaseModel)
  public manufacturerInfo?: BaseModel;

  @ObjectField(TaxInfo)
  public taxInfo?: TaxInfo;

  @ObjectField(OptionBaseModel)
  public unitInfo?: OptionBaseModel;

  @Field(Number)
  public convertedUnitPrice?: number;

  @Field(Number)
  public taxAmountPerOne?: number;

  @Field(Number)
  public convertedTaxAmountPerOne?: number;

  @Field(Number)
  public taxAmount?: number;

  @Field(Number)
  public convertedTaxAmount?: number;

  @Field(Number)
  public amountBeforeTax?: number;

  @Field(Number)
  public convertedAmountBeforeTax?: number;

  @Field(Number)
  public otherAmountPerOne?: number;

  @Field(Number)
  public convertedOtherAmountPerOne?: number;

  @Field(Number)
  public otherAmount?: number;

  @Field(Number)
  public convertedOtherAmount?: number;

  @Field(Number)
  public totalAmountPerOne?: number;

  @Field(Number)
  public convertedTotalAmountPerOne?: number;

  @Field(Number)
  public totalAmount?: number;

  @Field(Number)
  public convertedTotalAmount?: number;

  @Field(String)
  description?: string;

  @Field(Number)
  public quantity?: number;

  @Field(Number)
  public unitPrice?: number;

  @Field(Number)
  public taxConvertedAmount?: number;

  @Field(Number)
  public totalConvertedAmount?: number;

  @Field(Number)
  public taxPercent?: number;
}

export class GoodsReceiptRequestItem extends BaseModel {
  @Field(Number)
  public quantity?: number;

  @Field(Number)
  public qualityByContract?: number;

  @Field(Number)
  public alreadyReceivedQuantity?: number;

  @Field(Number)
  public remainingQuantity?: number;

  @Field(Number)
  public contractGoodsItemId?: number;

  @Field(String)
  public serialNumber?: string;

  @Field(String)
  public note?: string;

  @ObjectField(ContractGoodsItem)
  public contractGoodsItem?: ContractGoodsItem;

  @Field(String)
  public parentId?: string;
}

export class SupplierEvaluationDetail extends OptionBaseModel {
  @Field(String)
  public note?: string;

  @Field(Number)
  public score?: number;

  @Field(String)
  public standard?: string;

  @Field(Number)
  public weight?: number;
}

export class EvaluationResultsModel extends OptionBaseModel {
  @Field(String)
  public conclude?: string;

  @Field(Number)
  public fromScore?: number;

  @Field(Number)
  public toScore?: number;

  @Field(String)
  public supplierEvaluationConfigId?: string;
}
export class SupplierEvaluation {
  @Field(String)
  public id?: string;

  @Field(String)
  public evaluationItemId?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public supplierId?: string;

  @Field(Number)
  public evaluationScoreTotal?: number;

  @Field(Number)
  public evaluationScoreMax?: number;

  @Field(String)
  public supplierEvaluationConclusion?: string;

  @ObjectList(SupplierEvaluationDetail)
  public evaluationDetails?: SupplierEvaluationDetail[];

  @ObjectList(EvaluationResultsModel)
  public evaluationResults?: EvaluationResultsModel[];
}

export class GoodsReceipt extends BaseModel {
  @Field(String)
  public contractId?: string;

  @ObjectField(ContractInfo)
  public contractInfo?: ContractInfo;

  @Field(String)
  public deliveryPersonName?: string;

  @Field(String)
  public deliveryPersonPhone?: string;

  @Field(String)
  public deliveryPersonPosition?: string;

  @Field(String)
  public receiptPersonPhone?: string;

  @Field(String)
  public receiptDate?: string;

  @Field(String)
  public receiptPersonPosition?: string;

  @Field(Number)
  public exchangeRate?: number;

  @ObjectField(RequestAttachment)
  public attachments?: RequestAttachment[];

  @ObjectField(GoodsReceiptRequestItem)
  public goodsReceiptRequestItems?: GoodsReceiptRequestItem[];

  @Field(Number)
  public status?: number;

  @Field(String)
  public canceledDate?: string;

  @Field(Boolean)
  public isReturn?: boolean;

  @ObjectField(SupplierEvaluation)
  public supplierEvaluation?: SupplierEvaluation;

  @Field(String)
  public currency?: string;

  @ObjectField(DocumentGroup)
  public documentGroups?: DocumentGroup[];
}
