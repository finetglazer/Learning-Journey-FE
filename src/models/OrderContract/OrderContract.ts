import { OptionBaseModel } from "models/Common/Common";
import { Field, ObjectField } from "react-3layer-decorators";

export class OrderContractModel extends OptionBaseModel {
  @Field(String) public contractNo?: string;
  @Field(String) public contractId?: string;
  @Field(String) public description?: string;
  @Field(String) public contractTypeId?: string;
  @Field(String) public contractTypeName?: string;
  @Field(String) public effectiveDate?: string;
  @Field(String) public endDate?: string;
  @Field(String) public approvedDate?: string;
  @Field(String) public costItemId?: string;
  @Field(String) public costItemName?: string;
  @Field(Number) public status?: number;
  @Field(Number) public appendixCount?: number;
  @Field(Number) public totalAmount?: number;
  @Field(Number) public taxAmount?: number;
  @Field(String) public currency?: string;
  @Field(Number) public settlementAmount?: number;
  @Field(Number) public paidAmount?: number;
  @Field(String) public supplierTaxCode?: string;
  @Field(String) public supplierName?: string;
  @Field(String) public purchasePlanId?: string;
  @Field(String) public purchasePlanCode?: string;
  @Field(String) public purchaseRequestId?: string;
  @Field(String) public purchaseRequestCode?: string;
  @Field(String) public createdUser?: string;
  @Field(String) public createdEmail?: string;
  @Field(String) public createdOrganizationId?: string;
  @Field(String) public createdOrganizationName?: string;
  @Field(String) public manageUser?: string;
  @Field(String) public manageEmail?: string;
  @Field(String) public manageOrganizationId?: string;
  @Field(String) public manageOrganizationName?: string;
  @Field(String) public createdBusinessBranchId?: string;
  @Field(String) public createdBusinessBranchName?: string;
  @Field(String) public remainAmountByTotalContract?: string;
  @Field(String) public totalAmountBeforeTax?: string;
  @Field(String) public remainAmountBySettlement?: string;
}

export class OrderContractDetailInformationModel extends OptionBaseModel {
  @Field(String) public contractNo?: string;
  @Field(String) public contractId?: string;
  @Field(Number) public contractRequestType?: number;
  @Field(String) public contractTypeName?: string;
  @Field(String) public supplierTaxCode?: string;
  @Field(String) public supplierName?: string;
  @Field(String) public costTypeCode?: string;
  @Field(String) public costTypeName?: string;
  @Field(String) public costItemName?: string;
  @Field(Number) public totalAmountBeforeTax?: number;
  @Field(Number) public totalTax?: number;
  @Field(String) public currency?: string;
  @Field(String) public manageOrganizationName?: string;
  @Field(String) public manageOrganizationCode?: string;
  @Field(String) public manageUserEmail?: string;
  @Field(String) public manageUserName?: string;
  @Field(String) public createdOrganizationName?: string;
  @Field(String) public createdOrganizationCode?: string;
  @Field(String) public createdUserEmail?: string;
  @Field(String) public createdUserName?: string;
  @Field(String) public effectiveDate?: string;
  @Field(String) public endDate?: string;
  @Field(String) public approvedDate?: string;
  @Field(Number) public appendixCount?: number;
  @Field(String) public originalPurchasePlanId?: string;
  @Field(String) public originalPurchasePlanCode?: string;
  @Field(String) public originalPurchaseRequestId?: string;
  @Field(String) public originalPurchaseRequestCode?: string;
}
export class OrderContractDetailModel extends OptionBaseModel {
  @ObjectField(OrderContractDetailInformationModel)
  public info?: OrderContractDetailInformationModel;

  @Field(Array) public appendixs?: ContractAppendixModel[];
  @Field(Array) public warranties?: ContractWarrantyModel[];
  @Field(Number) public remainAmountForWarranty?: number;
  @Field(Array) public guarantees?: ContractGuaranteeModel[];
}

export class ContractAppendixModel extends OptionBaseModel {
  @Field(String) public approvedDate?: string;
  @Field(String) public contractAppendixNo?: string;
  @Field(Number) public totalAmountBeforeTax?: number;
  @Field(Number) public totalTax?: number;
}

export class ContractWarrantyModel extends OptionBaseModel {
  @Field(String) public warrantyTypeName?: string;
  @Field(Number) public warrantyPeriod?: number;
  @Field(String) public warrantyTermsName?: string;
  @Field(String) public expiredDate?: string;
}

export class ContractGuaranteeModel extends OptionBaseModel {
  @Field(String) public guaranteeTypeName?: string;
  @Field(String) public fromDate?: string;
  @Field(String) public toDate?: string;
  @Field(Number) public amount?: number;
  @Field(String) public status?: string;
}
