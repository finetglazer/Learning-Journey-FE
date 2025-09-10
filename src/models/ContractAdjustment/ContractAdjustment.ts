import { Model } from "react-3layer-common";
import { Field, ObjectField, ObjectList } from "react-3layer-decorators";

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

/** Supplier Information */
export class SupplierInfo extends BaseModel {
  @Field(String) public supplierTaxCode?: string;
  @Field(String) public supplierAddress?: string;
  @Field(String) public supplierAgentPerson?: string;
  @Field(Boolean) public isByProcuration?: boolean;
  @Field(String) public supplierProcuration?: string;
  @Field(String) public supplierAgentPersonPosition?: string;
  @Field(String) public supplierContactPerson?: string;
  @Field(String) public supplierEmail?: string;
  @Field(String) public supplierPhone?: string;
}

/** Payment Information */
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
  @Field(Boolean) public isAmend?: boolean;
  @ObjectField(ContractType) public contractType?: ContractType;
  @ObjectField(ContractMethod) public contractMethod?: ContractMethod;
  @ObjectField(UserInformation) public createUserInformation?: UserInformation;
}

/** Receiver Information */
export class ReceiverInfo extends BaseModel {
  @Field(String) public shippingDate?: string;
  @Field(Number) public quantity?: number;
  @Field(String) public organizationId?: string;
  @Field(String) public person?: string;
  @Field(String) public phone?: string;
  @Field(String) public address?: string;
  @Field(String) public note?: string;
}

/** Contract Adjustment Item */
export class ContractAdjustmentItem extends BaseModel {
  @Field(String) public purchaseItemId?: string;
  @ObjectField(Goods) public goods?: Goods;
  @ObjectField(BaseModel) public goodsServiceUnit?: BaseModel;
  @ObjectField(BaseModel) public goodsServicesCategory?: BaseModel;
  @Field(String) public description?: string;
  @Field(String) public note?: string;
  @Field(Number) public quantity?: number;
  @Field(Number) public unitPrice?: number;
  @Field(Number) public amountBeforeTax?: number;
  @Field(Number) public convertedAmountBeforeTax?: number;
  @ObjectList(ReceiverInfo)
  public receiverInformations?: ReceiverInfo[];
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
  @Field(Number) public warrantyCalculationTime?: number;
  @Field(String) public description?: string;
}

/** Contract Annex Model */
export class ContractAdjustment extends BaseModel {
  @Field(String) public contractAdjustmentNo?: string;
  @Field(String) public contractId?: string;
  @ObjectField(UserInformation) public userCreatedInfo?: UserInformation;
  @ObjectField(ContractInfo)
  public contractInfo?: ContractInfo;
  @ObjectField(OrganizationInfo)
  public legalInfo?: OrganizationInfo;
  @ObjectField(SupplierInfo)
  public supplierInfo?: SupplierInfo;
  @ObjectList(ContractAdjustmentItem)
  public contractAdjustmentGoodsItems?: ContractAdjustmentItem[];
  @ObjectList(ReceiverInfo)
  public receiverInfos?: ReceiverInfo[];
  @ObjectList(ContractGuarantee)
  public contractAdjustmentGuarantees?: ContractGuarantee[];
  @ObjectList(ContractWarranty)
  public contractAdjustmentWarranties?: ContractWarranty[];
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

export class ContractToAdjustmentModel extends BaseModel {
  @Field(String)
  public contractNo?: string;

  @Field(String)
  public contractTypeId?: string;

  @ObjectField(ContractType)
  public contractType?: string;

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
