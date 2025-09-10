import { PurchasePlanBidModel } from "./PurchasingPlanBidder";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import { ArgsProps } from "antd/lib/notification";
import { AxiosError } from "axios";
import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { type TFunction } from "i18next";
import { RepoStateDetail } from "models/Payment";
import React, { Dispatch, SetStateAction } from "react";
import { Model } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { DataForm } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import { TYPE_PURCHASING_PLAN } from "./PurchasingPlanConstant";
import {
  BodyApprovePurchasingPlan,
  IPurchaseRequest,
  PurchasePlanTypeRouter,
  PurchasingPlan,
  QuotationDetailIdType,
  SupplierModel,
} from "./PurchasingPlan";

export interface PurchasePlanAdjustBidDetailHookContextProps {
  purchasePlanId?: string;
  model?: PurchasePlanBidModel;
  isCreatePage?: boolean;
  isDetailPage?: boolean;
  isViewPage?: boolean;

  dispatchModel?: React.Dispatch<GeneralAction<PurchasePlanBidModel>>;
  translate?: TFunction<"translation", undefined>;
  breadcrumbs?: { name?: string; path?: string }[];
  tabRepositories?: RepoStateDetail[];
  purchaseRequest?: IPurchaseRequest;
  handleChangeSelectField?: (
    config?: ConfigField
  ) => (idValue?: number, value?: Model) => void;
  handleChangeSingleField?: (
    config?: ConfigField
  ) => (value?: string | number | boolean | object) => void;
  handleChangeDateField?: (
    config?: ConfigField
  ) => (date?: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeAllField?: (value?: PurchasePlanBidModel) => void;
  handleViewPurchaseProposal?: () => void;
  handleViewOriginPurchaseProposal?: () => void;
  path?: string;
  notifyToast?: (args?: ArgsProps) => void;
  errorsModal: ModalTypeError;
  setErrorsModal: Dispatch<SetStateAction<ModalTypeError>>;
  handleSave?: (isDraft?: boolean) => void;
  handleValidateCreate?: (isDraft?: boolean) => void;
  loading?: boolean;
  setLoading?: React.Dispatch<SetStateAction<boolean>>;
  isSubmit?: boolean;
  setIsSubmit?: React.Dispatch<SetStateAction<boolean>>;
  handleUploadAttachmentError?: (error?: AxiosError) => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  mappingStatusToProcess?: (status?: number) => number;
  tabRepositoriesView?: RepoStateDetail[];
  modelSelected?: ModelSelect | null;
  setModelSelected?: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  handleApplyButtonInConfirmModal?: (
    model?: PurchasingPlan,
    data?: DataForm
  ) => void;
  handleChangeMultipleSelectField?: (
    config?: ConfigField
  ) => (values?: Model[]) => void;
  handleChangeMultipleField?: (value?: PurchasePlanBidModel) => void;
  handleApprovePurchasingPlan?: (
    id?: string,
    body?: BodyApprovePurchasingPlan
  ) => void;
  handleApproveCancellationPurchasingPlan?: (id?: string) => void;
  selectSupplierAction?: (model?: PurchasePlanBidModel) => void;
  isDrawerSupplier?: boolean;
  isDrawerQuote?: boolean;
  handleClickDrawerSupplier?: (status?: boolean) => void;
  setIsDrawerSupplier?: React.Dispatch<SetStateAction<boolean>>;
  setIsDrawerQuote?: React.Dispatch<SetStateAction<boolean>>;
  quoteAgainAction?: (model?: PurchasePlanBidModel) => void;
  handleOpenSupplierDrawerByRecord?: (record?: SupplierModel) => void;
  isOpenModalQuoteAgain?: boolean;
  setIsOpenModalQuoteAgain?: React.Dispatch<SetStateAction<boolean>>;
  handleSubmitApproval?: (isDraft?: boolean) => void;
  handleClickDrawerQuote?: (
    id?: QuotationDetailIdType["quotationId"],
    status?: boolean
  ) => void;
  tabKey?: string;
  setTabKey?: React.Dispatch<SetStateAction<string>>;
  handleValidateSendApproval?: () => void;
  titlePageHeader?: string;
  getPurchasePlanTypeByRouter?: (
    id?: TYPE_PURCHASING_PLAN
  ) => PurchasePlanTypeRouter;
  loadingConfirm?: boolean;
  selectedDetailSupplier?: SupplierModel;
  selectedDetailSupplierId?: string;
  setSelectedDetailSupplierId?: React.Dispatch<React.SetStateAction<string>>;
  handleValidateSaveForm?: (isDraft: boolean) => Promise<boolean>;
}
