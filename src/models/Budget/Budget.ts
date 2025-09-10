import { Model } from "react-3layer-common";

export class Budget extends Model {
  id?: string;
  code?: string;
  type?: number;
  status?: number;
  businessUnit?: {
    id?: string;
    code?: string;
    name?: string;
  };
  createdDate?: string;
  name?: string;
  total?: number;
  requester?: string;
  isReturn?: boolean;
}

export interface RequesterModel {
  id?: string;
  name?: string;
  email?: string;
}

export interface BusinessDepartmentModel {
  businessUnitCode: string;
  businessUnitId: string;
  businessUnitName: string;
  code: string;
  id: string;
  name: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
}
