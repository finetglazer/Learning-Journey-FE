import { OptionBaseModel } from "models/Common/Common";
import { PAYMENT_REQUEST_TYPE } from "models/Payment/PaymentRequestConstant";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class BusinessDepartment extends OptionBaseModel {
  businessUnitCode?: string;
  businessUnitName?: string;
  businessUnitId?: string;
}

export class PaymentReportAuthorityModel extends Model {
  @Field(String) public id?: string;
  @Field(String) paymentRequestId?: string;
  @ObjectField(OptionBaseModel) businessBranch?: OptionBaseModel;
  @ObjectField(OptionBaseModel) businessUnit?: OptionBaseModel;
  @ObjectField(BusinessDepartment) businessDepartment?: BusinessDepartment;
  @Field(String) code?: string;
  @Field(Number) paymentRequestType?: keyof typeof PAYMENT_REQUEST_TYPE;
  @ObjectField(OptionBaseModel) costGroup?: OptionBaseModel;
  @ObjectField(OptionBaseModel) costType?: OptionBaseModel;
  @Field(Number) paymentMethod?: number;
  @Field(String) description?: string;
  @Field(String) currency?: string;
  @Field(Number) amount?: number;
  @Field(Number) exchangeAmount?: number;
  @Field(Number) status?: number;
  @Field(String) createUser?: string;
  @Field(String) updateUser?: string;
}
