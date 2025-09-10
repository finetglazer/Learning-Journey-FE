/* eslint-disable import/named */
import { ArgsProps } from "antd/es/notification";
import { AxiosError } from "axios";
import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { TFunction } from "i18next";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { Contract } from "models/Contract";
import { RepoStateDetail } from "models/Payment";
import { ModalTypes } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetDetail/TemporaryImportAssetDetailHook";
import { Dispatch, Key, SetStateAction } from "react";
import { Model } from "react-3layer-common";
/* eslint-disable import/no-unresolved */
import { TableRowSelection } from "antd/lib/table/interface";
import { ModalType } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetDetail/Components/SelectAssetModal/SelectAssetHook";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { SelectAsset } from "./SelectAsset";

export interface ModelSelect {
  type: ConfirmModalType;
  model: TemporaryImportAssetTypeModel;
  errorMessage?: string;
  action?: actionType;
}

export enum actionType {
  APPROVE,
  RETURN,
  DECLINED,
}
export class TemporaryImportAsset extends Model {
  canView: boolean;
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canAction: boolean;
  canViewApprove: boolean;
  canCopy: boolean;
  canGiveBack: boolean;
  canApproved: boolean;
  canApprovedCanceled: boolean;
  canChooseSupplier: boolean;
  canRound: boolean;
  canQuoted: boolean;
  canSaveDraft: boolean;
  canWaitingForApprove: boolean;
  canDeclined: boolean;
  canRefuse: boolean;
  id: string;
  code: string;
  contractId: string;
  totalAmount: number;
  description: string;
  status: number;
  organizationId: string;
  businessDepartmentId: string;
  originalTempReceiptId: string;
  createUser: string;
  costGroup: string;
  contract: Contract;
  createdDate: string;
}

export type Breadcrumbs = { name: string; path?: string };

export type TemporaryImportAssetModel = {
  model: TemporaryImportAssetTypeModel;
  idDetail?: string;
  dispatchModel: React.Dispatch<GeneralAction<TemporaryImportAssetTypeModel>>;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeAllField?: (value: TemporaryImportAssetTypeModel) => void;
  handleChangeMultipleSelectField?: (
    config: ConfigField
  ) => (values: Model[]) => void;
  translate: TFunction<"translation", undefined>;
  breadcrumbs: Breadcrumbs[];
  tabRepositories: RepoStateDetail[];
  loading: boolean;
  notifyToast: (args: ArgsProps) => void;
  handleUploadAttachmentError: (error: AxiosError) => void;
  handleDownloadFileAttached: (file?: FileModel) => void;
  rowSelection: TableRowSelection<SelectAsset>;
  selectedRowKeys: Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  handleCallback: (data: SelectAsset[]) => void;
  modalType: ModalType;
  setModalType: React.Dispatch<React.SetStateAction<ModalType>>;
  handleDeleteRow: (id: string) => void;
  isOpenModelConfirmDeleteRow: boolean;
  setIsOpenModelConfirmDeleteRow: (value: boolean) => void;
  handleConfirmDeleteRow: (id: string) => void;
  isModalChooseContract: boolean;
  setIsModalChooseContract: Dispatch<SetStateAction<boolean>>;
  handleSave: (isDraft: boolean, callbackFc: () => void) => void;
  handleUpdate: (isDraft: boolean, callbackFc: () => void) => void;
  errorsModal: ModalTypes;
  setErrorsModal: Dispatch<SetStateAction<ModalTypes>>;
  handleDeleteMultipleRow: () => void;
  loadingButtonConfirm: boolean;
  loadingModal: boolean;
  modelSelected: ModelSelect | null;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>>;
  handleApplyButtonInConfirmModal: (
    model: TemporaryImportAssetTypeModel,
    reason: string,
    action: number
  ) => void;
  runAsset: (
    goodId: string,
    value: number,
    columnId: string,
    fieldNameError: string
  ) => void;
  rowIdDelete?: string;
};

export interface ContractTempReceiptModel {
  canView?: boolean;
  canEdit?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canAction?: boolean;
  canViewApprove?: boolean;
  canCopy?: boolean;
  canGiveBack?: boolean;
  canApproved?: boolean;
  canApprovedCanceled?: boolean;
  canChooseSupplier?: boolean;
  canRound?: boolean;
  canQuoted?: boolean;
  canSaveDraft?: boolean;
  canWaitingForApprove?: boolean;
  canDeclined?: boolean;
  canRefuse?: boolean;
  canApproveSupplier?: boolean;
  canCreateAdjustmentContract?: boolean;
  canCreateAppendixContract?: boolean;
  id?: string;
  code?: string;
  managerEmail?: string;
  managerName?: string;
  effectiveDate?: string | Dayjs;
  endDate?: string | Dayjs;
  contractNo?: string;
  name?: string;
  supplierId?: string;
  supplierName?: string;
  supplierTaxCode?: string;
  createUserName?: string;
  costGroup?: string;
  contractType?: string;
  contractRequestType?: number;
  total?: number;
  status?: number;
  contractClassification?: number;
  currency?: string;
  organizationName?: string;
}

export type TemporaryImportAssetViewModel = {
  model: TemporaryImportAssetTypeModel;
  dispatchModel: React.Dispatch<GeneralAction<TemporaryImportAssetTypeModel>>;
  handleChangeAllField?: (value: TemporaryImportAssetTypeModel) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleDownloadFileAttached: (file?: FileModel) => void;
  breadcrumbs: { name: string; path: string }[];
  loading: boolean;
  loadingModal: boolean;
  loadingButtonConfirm: boolean;
  tabRepositoriesView: RepoStateDetail[];
  translate: TFunction<"translation", undefined>;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  handleApplyButtonInConfirmModal: (
    model: TemporaryImportAssetTypeModel,
    reason?: string
  ) => void;
  handleApproveTemporaryAsset: (id: string, actionType?: number) => void;
};

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  REJECT = "REJECT",
  RETURN = "RETURN",
}

export class TemporaryImportAssetTypeModel extends Model {
  public id: string;
}

export interface RequestCreateTemporaryImportAsset {
  id?: string;
  isDraft?: boolean;
  contractId?: string;
  description?: string;
  tempReceiptItems?: TempReceipt[];
  attachments?: RequestAttachment;
  isHardValidate?: boolean;
}

export interface TempReceipt {
  goodsReceiptRequestAssetId?: string;
  amount?: number;
}

export enum TemporaryImportAssetStatus {
  DRAFT,
  IN_PROGRESS,
  APPROVE,
  REJECT,
  CANCEL,
}
