import { ColumnGroupType, ColumnType } from "antd/lib/table/interface";
import type { DataNode } from "antd/lib/tree";
import { Menu } from "config/config-type";
import { Model } from "react-3layer-common";
import * as yup from "yup";

// Authorization serivce types:
export enum AppActionEnum {
  SET,
  UPDATE,
}

export interface Permission {
  key: string;
  value: string;
  queryExtra: string[];
}

export interface AppState {
  permissions?: Permission[];
  authorizedAction?: string[];
  authorizedMenus?: Menu[];
  authorizedMenuMapper?: Record<string, unknown>;
  loaded?: boolean;
}

export interface AppAction {
  type: AppActionEnum;
  payload?: AppState;
}

// Validate service types:
export type ValidResult = {
  isValid: boolean;
  errorMessage: string;
};
export type ValidationError = { [x: string]: unknown };

export type ValidationField = {
  isValidator: boolean;
  path?: string;
  schema?: yup.ObjectSchema<Model>;
};

// Detail service types:
export enum ModelActionEnum {
  SET,
  UPDATE,
  SET_ERRORS,
  UPDATE_ERRORS,
}

export interface ModelAction<T extends Model> {
  type: ModelActionEnum;
  payload: T | ValidationError;
}

// Field service types:
export interface ConfigField {
  fieldName: string | [string, string];
  errorName?: string;
  sideEffectFunc?: () => void;
  validator?: ValidationField;
}

export type FieldValue = string | number | boolean | object;

// Reducer service types:
export class GeneralActionEnum {
  public static SET = "SET";
  public static UPDATE = "UPDATE";
  public static SET_ERRORS = "SET_ERRORS";
  public static UPDATE_ERRORS = "UPDATE_ERRORS";
}

export interface GeneralAction<T extends Model> {
  type: GeneralActionEnum;
  payload?: T;
  errors?: ValidationError;
}

// Table service type:
export declare type ToogleColumsType<T = unknown> = ((
  | ColumnGroupType<T>
  | ColumnType<T>
) & { isShow?: boolean })[];

// Utility service types:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObj = { [key: string]: any };

export class TreeNode<T extends Model> implements DataNode {
  public title: string;
  public key: number;
  public item: Model;
  public children: TreeNode<T>[];
  public disabled: boolean;

  constructor(model?: T) {
    if (model) {
      this.key = model.id;
      this.item = { ...model };
      this.children = [];
      this.title = model.name;
      this.disabled = model.disabled;
    } else {
      this.title = "";
      this.key = null;
      this.children = [];
      this.item = {};
      this.disabled = false;
    }
  }
}

export enum ValidateStatus {
  success = "success",
  warning = "warning",
  error = "error",
  validating = "validating",
}

// Filter service types:
export enum FilterActionEnum {
  SET,
  UPDATE,
  UPDATE_PAGINATION,
}

export interface FilterAction<TFilter> {
  type: FilterActionEnum;
  payload?: TFilter;
}

// List service types:
export enum ListActionType {
  SET = "SET",
}

export type KeyType = string | number;

export interface ListState<T extends Model> {
  list: T[];
  count: number;
  error?: object;
}

export interface ListAction<T extends Model> {
  type: string;
  payload?: ListState<T>;
}

export interface ListResult<T> {
  data: {
    items: T[];
    totalRecords: number;
  };
}

// PDF service:
export interface Pdf {
  file: File;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pages: Promise<any>[];
}
export interface Dimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Position {
  top: number;
  left: number;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  PAYLOAD_TOO_LARGE = 413,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export const NETWORK_ERROR_MESSAGE = "Network Error";
