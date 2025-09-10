import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";

import { Field } from "react-3layer-decorators";

// eslint-disable-next-line import/no-unresolved

export class ManageSupplier extends Model {
  supplierType: {
    id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
  };
  taxCode: string;
  email: string;
  manageStatus: number;
  createdDate: string;
  id: string;
  code: string;
  name: string;
}

export class ContractPrinciple extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  code?: string;

  @Field(String)
  managerName?: string;

  @Field(String)
  managerEmail?: string;

  @Field(String)
  effectiveDate?: Dayjs | string;

  @Field(String)
  endDate?: Dayjs | string;

  @Field(String)
  contractNo?: string;

  @Field(String)
  contractType?: string;

  @Field(String)
  name?: string;

  @Field(String)
  supplierId?: string;

  @Field(String)
  supplierName?: string;

  @Field(String)
  supplierTaxCode?: string;

  @Field(String)
  createUserName?: string;

  @Field(Number)
  total?: number;

  @Field(String)
  costGroup?: string;

  @Field(Number)
  status?: number;
}

export enum CONTRACT_STATUS {
  DRAFT = 0,
  IN_PROGRESS = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCEL = 4,
  CLOSED = 5,
}

export enum ActionRowType {
  VIEW,
  EDIT,
  CANCEL,
  DELETE,
}
