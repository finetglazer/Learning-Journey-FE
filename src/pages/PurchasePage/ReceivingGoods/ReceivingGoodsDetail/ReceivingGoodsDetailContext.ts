import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { GoodsReceipt } from "models/ReceivingGood/GoodsReceipt";
import { ConfirmModalType } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";

// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { AxiosError } from "axios";

// config enum Tab

export const DEFAULT_ERROR_MODAL_TYPE: ModalType = { type: "NONE", errors: [] };

export enum TabKeyDetailEnum {
  RECEIVED_INFORMATION = "0",
  SUPPLIER_EVALUATION = "1",
  ACCEPTANCE_FILES = "2",
  INTEGRATION = "3",
  HISTORY_APPROVAL = "4",
}

export enum STATUS_RECEIVED_REQUEST {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELED = 4,
}

export interface ModelSelect {
  type: ConfirmModalType;
  model: GoodsReceipt;
  errorMessage?: string;
}

export enum MODEL_CONFIRM_TYPE {
  RETURN = "RETURN",
  REJECT = "REJECT",
}

export interface ModalType {
  type:
    | "CREATE"
    | "UPDATE"
    | "DETAIL"
    | "DELETE"
    | "IMPORT_FAIL"
    | "SUBMIT_FAIL"
    | "NONE";
  id?: string;
  errors?: string[];
}

export interface ReceivingGoodsDetailContextContextType {
  model: GoodsReceipt;
  isEditable: boolean;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  state?: "CLONE" | "VIEW" | "EDIT" | "CREATE";
  handleSendRequest?: (isDraft: boolean, callbackFn?: () => void) => void;
  handleChangeAllField?: (data: unknown) => void;
  handleApproval?: () => void;
  handleReturn: (id: string, reason: string) => void;
  handelReject: (id: string, reason: string) => void;
  modelSelected: ModelSelect | null;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>> | null;
  loadingList: boolean;
  loadingModal: boolean;
  handleApplyButtonInConfirmModal: (
    model: GoodsReceipt,
    reason: string
  ) => void;
  handleViewContract?: () => void;
  handleUploadAttachmentError?: (error: any) => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  goodsReceiptIdSelect?: string | null;
  setGoodsReceiptIdSelect?: Dispatch<SetStateAction<string>>;
  modalConfirm?: string;
  handleUpdateTypeModal?: (type: string) => void;
  errorsModal?: ModalType;
  setErrorsModal?: Dispatch<SetStateAction<ModalType>>;
  setModalType: Dispatch<SetStateAction<ModalType>>;
  modalType: ModalType;
  processAfterFeedbackSubmission?: () => void;
  dispatch: Dispatch<GeneralAction<GoodsReceipt>>;
  handleErrorResponse: (error: AxiosError, newModel: GoodsReceipt) => void;
}

const INITIAL_CONTEXT: ReceivingGoodsDetailContextContextType = {
  model: null,
  dispatch: null,
  isEditable: false,
  handleChangeSingleField: null,
  handleApproval: null,
  handleReturn: null,
  handelReject: null,
  setModelSelected: null,
  modelSelected: null,
  loadingList: false,
  loadingModal: false,
  handleApplyButtonInConfirmModal: null,
  handleViewContract: null,
  modalConfirm: null,
  handleUpdateTypeModal: null,
  errorsModal: DEFAULT_ERROR_MODAL_TYPE,
  setErrorsModal: null,
  setModalType: null,
  handleErrorResponse: null,
  modalType: {
    type: "NONE",
  },
};

const ReceivingGoodsDetailContext =
  createContext<ReceivingGoodsDetailContextContextType>(INITIAL_CONTEXT);

const useReceivingGoodsDetailContext = () => {
  const context = useContext(ReceivingGoodsDetailContext);

  return context;
};

export { ReceivingGoodsDetailContext, useReceivingGoodsDetailContext };
