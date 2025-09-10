import { listWarrantyCalculationTime } from "config/const";
import { Attachment } from "models/Attachment";
import { PaymentSchedules } from "models/Contract/Contract";
import { ContractTermsModel } from "models/ContractTerms/ContractTerms";
import { Model } from "react-3layer-common";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";

/** Base Model */
export class BaseModel extends Model {
  @Field(String) public id?: string;
  @Field(String) public code?: string;
  @Field(String) public name?: string;
}

/** User Information */
export class UserInformation extends BaseModel {
  @Field(String) public createFullname?: string;
  @Field(String) public createOrganization?: string;
  @Field(String) public createPosition?: string;
  @Field(String) public createUser?: string;
}

/** Contract Type & Method */
export class ContractType extends BaseModel {
  @Field(String) public description?: string;
  @Field(Number) public maxOverpaymentAmount?: number;
  @Field(Number) public maxOverpaymentPercentage?: number;
  @Field(Boolean) public isActive?: boolean;
}

export class ContractMethod extends BaseModel {
  @Field(String) public description?: string;
  @Field(Boolean) public isActive?: boolean;
}

/** Organization Information */
export class OrganizationInfo extends BaseModel {
  @Field(String) public taxCode?: string;
  @Field(String) public address?: string;
  @Field(String) public agentPerson?: string;
  @Field(String) public agentPersonPosition?: string;
}

export class Currency extends BaseModel {
  @Field(String) public symbol?: string;
}

export class Bank extends BaseModel {
  @Field(Boolean) public isInternal?: boolean;
}

export class SupplierPayment extends BaseModel {
  @Field(Boolean) public isActive?: boolean;
  @ObjectField(Currency) public currency?: Currency;
  @ObjectField(Bank) public bank?: Bank;
  @Field(String) public bankAccountNo?: string;
  @Field(String) public bankAccountName?: string;
}

/** Supplier Information */
export class SupplierInfo extends BaseModel {
  @Field(String) public supplierTaxCode?: string;
  @Field(String) public supplierName?: string;
  @Field(String) public supplierAddress?: string;
  @Field(String) public supplierAgentPerson?: string;
  @Field(Boolean) public isByProcuration?: boolean;
  @Field(String) public supplierProcuration?: string;
  @Field(String) public supplierAgentPersonPosition?: string;
  @Field(String) public supplierContactPerson?: string;
  @Field(String) public supplierEmail?: string;
  @Field(String) public supplierPhone?: string;
  @ObjectField(SupplierPayment) public supplierPayment?: SupplierPayment;
}

/** Payment Information */

/** Goods Information */
export class Goods extends BaseModel {
  @ObjectField(BaseModel) public goodsServiceUnit?: BaseModel;
  @ObjectField(BaseModel) public goodsServicesCategory?: BaseModel;
  @Field(Number) public fixedAssetDepreciationPeriod?: number;
  @Field(Number) public toolsDepreciationPeriod?: number;
  @Field(Number) public assetType?: number;
}

/** Contract Information */
export class ContractInfo extends BaseModel {
  @Field(String) public contractNo?: string;
  @Field(Number) public contractValue?: number;
  @Field(String) public currency?: string;
  @Field(Number) public rate?: number;
  @Field(String) public effectiveDate?: string;
  @Field(String) public endDate?: string;
  @Field(Boolean) public isContractTermination?: boolean;
  @Field(Boolean) public isAdjustedContractInfo?: boolean;
  @Field(String) public managerOrganizationUnit?: string;
  @Field(String) public managerOrganizationBranch?: string;
  @Field(String) public managerOrganizationId?: string;
  @Field(String) public managerOrganizationName?: string;
  @Field(String) public managerEmail?: string;
  @Field(String) public managerName?: string;
  @Field(String) public managerId?: string;
  @ObjectField(ContractType) public contractType?: ContractType;
  @ObjectField(ContractMethod) public contractMethod?: ContractMethod;
  @ObjectField(UserInformation) public createUserInformation?: UserInformation;
}

/** Receiver Information */
export class ReceiverInfo extends BaseModel {
  @Field(String) public shippingDate?: string;
  @Field(Number) public quantity?: number;
  @Field(String) public organizationId?: string;
  @Field(String) public organizationName?: string;
  @Field(String) public personId?: string;
  @Field(String) public person?: string;
  @Field(String) public phone?: string;
  @Field(String) public address?: string;
  @Field(String) public note?: string;
}

/** Contract Appendix Item */
export class ContractAppendixItem extends BaseModel {
  @Field(String) public purchaseItemId?: string;
  @ObjectField(Goods) public goods?: Goods;
  @ObjectField(BaseModel) public goodsServiceUnit?: BaseModel;
  @ObjectField(BaseModel) public goodsServicesCategory?: BaseModel;
  @Field(String) public description?: string;
  @Field(String) public note?: string;
  @Field(String) public currency?: string;
  @Field(Number) public quantity?: number;
  @Field(Number) public unitPrice?: number;
  @Field(Number) public amountBeforeTax?: number;
  @Field(Number) public convertedAmountBeforeTax?: number;
  @ObjectList(ReceiverInfo)
  public receiverInfos?: ReceiverInfo[];
}

/**   Contract Quarantee */
export class ContractGuarantee extends BaseModel {
  @Field(Number) public amount?: number;
  @Field(String) public description?: string;
  @Field(String) public fromDate?: string;
  @Field(String) public toDate?: string;
  @Field(String) public guaranteeTypeId?: string;
  @ObjectField(BaseModel) public guaranteeType?: BaseModel;
}

/** Contract Warranty */

export class ContractWarranty extends BaseModel {
  @Field(String) public warrantyTypeId?: string;
  @ObjectField(BaseModel) public warrantyType?: BaseModel;
  @Field(Number) public warrantyPeriod?: number;
  @Field(String) public warrantyTermsId?: string;
  @ObjectField(BaseModel) public warrantyTerm?: BaseModel;
  public warrantyCalculationTime?: (typeof listWarrantyCalculationTime)[0];
  @Field(String) public description?: string;
}

export enum RelatedSlipInfoType {
  PurchaseProposal = 1,
  PurchaseRequest,
  PurchasePlan,
  Contract,
  Order,
  OrderByPrinciple,
  PrincipleContract,
}

export class RelatedSlipInfo extends BaseModel {
  @Enum(RelatedSlipInfoType) public type?: RelatedSlipInfoType;
  @Field(String) public typeName?: string;
  @Field(String) public createUser?: string;
  @Field(String) public createFullname?: string;
  @Field(String) public createdDate?: string;
  @Field(String) public approvedDate?: string;
}

/** Contract Annex Model */
export class ContractAnnex extends BaseModel {
  @Field(String) public contractAppendixNo?: string;
  @Field(String) public contractId?: string;
  @ObjectField(UserInformation) public userCreatedInfo?: UserInformation;
  @ObjectField(ContractInfo)
  public contractInfo?: ContractInfo;
  @ObjectField(OrganizationInfo)
  public legalInfo?: OrganizationInfo;
  @ObjectField(SupplierInfo)
  public supplierInfo?: SupplierInfo;
  @ObjectList(ContractAppendixItem)
  public contractAppendixGoodsItems?: ContractAppendixItem[];
  @ObjectList(ReceiverInfo)
  public receiverInfos?: ReceiverInfo[];
  @ObjectList(ContractGuarantee)
  public contractAppendixGuarantees?: ContractGuarantee[];
  @ObjectList(ContractWarranty)
  public contractAppendixWarranties?: ContractWarranty[];

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

  @Field(Boolean)
  public canReturn?: boolean;
  @ObjectField(RelatedSlipInfo)
  public relatedSlipInfos?: RelatedSlipInfo[];
  @ObjectList(Attachment)
  public attachments?: Attachment[];
  @Field(Number) public receivedType?: number;

  @ObjectList(ContractTermsModel) public contractTerms?: ContractTermsModel[];
  @Field(Number)
  public calculationValue?: number;

  @ObjectList(PaymentSchedules)
  public contractAppendixPaymentSchedules?: PaymentSchedules[];

  @Field(String)
  public appendixDate?: string;

  @Field(Number)
  public adjustmentType?: number;
}

export class ContractTypeModal extends BaseModel {
  @Field(String)
  public description?: string;

  @Field(Number)
  public maxOverpaymentAmount?: number;

  @Field(Number)
  public maxOverpaymentPercentage?: number;

  @Field(Boolean)
  public isActive?: boolean;
}

export class ContractToAppendixModel extends BaseModel {
  @Field(String)
  public contractNo?: string;

  @Field(String)
  public currency?: string;

  @Field(String)
  public contractTypeId?: string;

  @ObjectField(ContractType)
  public contractType?: ContractType;

  @Field(String)
  public contractSupplierName?: string;

  @Field(String)
  public costItem?: string;

  @Field(Number)
  public contractValue?: number;

  @Field(Date)
  public effectiveDate?: Date;

  @Field(Date)
  public createdDate?: Date;

  @Field(String)
  public createUser?: string;

  @Field(String)
  public createFullname?: string;
}

export class SelectAdjustableGoodsServicesModel extends BaseModel {
  @Field(String) unit?: string;
  @Field(Number) unitPrice?: number;
  @Field(String) currency?: string;
  @Field(String) description?: string;
  @Field(Number) amount?: number;
  @ObjectField(BaseModel) goodCategory?: BaseModel;
  @ObjectField(BaseModel) goodUnit?: BaseModel;
  @ObjectField(BaseModel) taxModel?: BaseModel;
  @ObjectField(BaseModel) goodBranch?: BaseModel;
  @Field(Number) taxAmount?: number;
  @Field(Number) totalAmount?: number;
  @Field(Number) totalAmountConvert?: number;
  @Field(String) note?: string;
  @Field(String) purchaseItemId?: string;
  @Field(Number) quantity?: number;
  @Field(Number) currencyRate?: number;
  @ObjectList(ReceiverInfo) receiverInfos?: ReceiverInfo[];
}
