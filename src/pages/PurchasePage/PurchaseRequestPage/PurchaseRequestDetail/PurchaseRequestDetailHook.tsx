/* eslint-disable import/named */
/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { LIST_TYPE_PURCHASE_FROM, listPurposeShoppingEnum } from "config/const";
import {
  APP_OVERVIEW,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE,
  PURCHASE_REQUEST_DETAIL_ROUTE,
  PURCHASE_REQUEST_MASTER_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
} from "config/route-const";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { History } from "history";
import { isEmpty, isEqual } from "lodash";
import { JPY_CURRENCY, VND_CURRENCY } from "models/Payment";
import { RequestAttachment } from "models/Proposal";
import {
  ActiveTabKeys,
  GoodServiceByCategory,
  PurchaseRequest,
  PurchaseRequestBody,
  PurchaseRequestCreate,
  PurchaseRequestDetailModel,
} from "models/PurchaseRequest";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { store } from "rtk";
import { finalize, tap } from "rxjs";
import appMessageService from "../../../../core/services/common-services/app-message-service";
import { ConfirmModalType } from "../PurchaseRequestMaster/PurchaseRequestConfirmModal/PurchaseRequestConfirmModal";
import { ModelSelect } from "../PurchaseRequestMaster/PurchaseRequestMasterHook";
import { purchaseRequestRepository } from "../PurchaseRequestRepository";
import ApprovalHistoryTab from "./Components/ApprovalHistoryTab/ApprovalHistoryTab";
import DirectContractingTab from "./DirectContractingTab/DirectContractingTab";
import PurchaseRequestGenerationInfoTab from "./PurchaseRequestGenerationInfoTab/PurchaseRequestGenerationInfoTab";
import PurchaseRequestGoodsServicesTab from "./PurchaseRequestGoodsServicesTab/PurchaseRequestGoodsServicesTab";

export interface ErrorModalType {
  type: "CREATE" | "UPDATE" | "DETAIL" | "DELETE" | "SUBMIT_FAIL" | "NONE";
  id?: string;
  errors?: string[];
}

const DEFAULT_ERROR_MODAL_TYPE: ErrorModalType = { type: "NONE", errors: [] };

export const PurchaseRequestDetailHookContext =
  createContext<PurchaseRequestDetailModel>({
    model: new PurchaseRequestCreate(),
    dispatchModel: null,
    loading: false,
    handleChangeSingleField: null,
    handleChangeSelectField: null,
    handleChangeDateField: null,
    breadcrumbs: [],
    handleSave: null,
    handleDownloadFileAttached: null,
    handleChangeAllField: null,
    setLoading: null,
    notifyToast: null,
    handleGoMaster: null,
    handleUploadAttachmentError: null,
    handleRemoveFileAttachment: null,
    handleUpdateListAttachments: null,
    isShowModalProposal: false,
    setIsShowModalProposal: null,
    isShowModalGoodsServices: false,
    setIsShowModalGoodsServices: null,
    changeListSelectedGoodsServices: null,
    handleViewPurchaseProposal: null,
    handlePressEdit: null,
    modelSelected: null,
    setModelSelected: null,
    loadingModal: false,
    handleApplyButtonInConfirmModal: null,
    errorsModal: DEFAULT_ERROR_MODAL_TYPE,
    setErrorsModal: null,
    handleClickOriginalCode: null,
  });

type props = {
  isDetail?: boolean;
  isAdjust?: boolean;
};

export function usePurchaseRequestDetailHook({
  isDetail = false,
  isAdjust = false,
}: props) {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const history: History = useHistory();

  const proposalId = useMemo(
    () => history.location.pathname.split("/").pop(),
    [history]
  );

  const queryParams = new URLSearchParams(location.search);
  const isView: boolean = queryParams.get("isView") === "true";

  const { model, dispatch: dispatchModel } =
    detailService.useModel<PurchaseRequestCreate>(PurchaseRequestCreate);

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isShowModalProposal, setIsShowModalProposal] =
    React.useState<boolean>(false);

  const [isShowModalGoodsServices, setIsShowModalGoodsServices] =
    React.useState<boolean>(false);

  const [errorsModal, setErrorsModal] = useState<ErrorModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const purchaseId = useMemo(
    () => history.location.pathname.split("/").pop(),
    [history]
  );

  const exchangeRateNumberType = useMemo(
    () =>
      isEqual(model?.purchaseProposalId?.currency?.code, VND_CURRENCY) ||
      isEqual(model?.purchaseProposalId?.currency?.code, JPY_CURRENCY)
        ? "LONG"
        : "DECIMAL",
    [model?.purchaseProposalId?.currency?.code]
  );

  const adjustPurchaseRequestTitle = useMemo(
    () =>
      model?.id
        ? `${translate("PR.adjust_purchasing_requirements")} ${model?.code}`
        : translate("PR.adjust_purchasing_requirements"),
    [model?.id, model?.code]
  );

  const purchaseRequestTitle = useMemo(
    () =>
      model?.id
        ? `${translate("PR.purchase_request")} ${model?.code}`
        : translate("PR.create_purchase_request"),
    [model?.id, model?.code]
  );

  const title = isAdjust ? adjustPurchaseRequestTitle : purchaseRequestTitle;

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate(
        isAdjust
          ? "PR.adjust_purchasing_requirements"
          : "CM.menu_title_purchase_request"
      ),
      path: !isAdjust
        ? PURCHASE_REQUEST_MASTER_ROUTE
        : `${PURCHASE_REQUEST_MASTER_ROUTE}?tabKey=1`,
    },
    {
      name: title,
    },
  ];

  const approvalHistoryTab = {
    tabKey: ActiveTabKeys.ApprovalHistory,
    tabTitle: translate("PP.tab_approval_history"),
    children: (
      <ApprovalHistoryTab
        topicId={purchaseId}
        status={model?.status}
        model={model}
      />
    ),
  };

  const directContractingTab = model?.purchaseProposalId?.contractorAppointment
    ? [
        {
          tabKey: ActiveTabKeys.DirectAssignContract,
          tabTitle: translate("PP.tab_direct_contracting"),
          children: <DirectContractingTab />,
        },
      ]
    : [];

  const shouldShowApprovalHistoryTab = () =>
    !(
      location.pathname.includes(PURCHASE_REQUEST_DETAIL_ROUTE) ||
      location.pathname.includes(PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE)
    );

  const tabRepositories = [
    {
      tabKey: ActiveTabKeys.GenerationInfo,
      tabTitle: (
        <TabName
          text={translate("PP.tab_general_information")}
          isShowIconError={model.errorTabs?.includes(0)}
        />
      ),
      children: (
        <PurchaseRequestGenerationInfoTab
          topicId={
            isEqual(history.location.pathname, PURCHASE_REQUEST_DETAIL_ROUTE) ||
            isEqual(
              history.location.pathname,
              PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE
            )
              ? undefined
              : proposalId
          }
        />
      ),
    },
    {
      tabKey: ActiveTabKeys.GoodsServices,
      tabTitle: (
        <TabName
          text={translate("PP.tab_goods_services")}
          isShowIconError={model.errorTabs?.includes(1)}
        />
      ),
      children: <PurchaseRequestGoodsServicesTab />,
    },
    ...directContractingTab,
    ...(shouldShowApprovalHistoryTab() ? [approvalHistoryTab] : []),
  ];

  const handleGoMaster = React.useCallback(() => {
    if (isAdjust) {
      history.push(`${PURCHASE_REQUEST_MASTER_ROUTE}?tabKey=1`);
    } else {
      history.push(PURCHASE_REQUEST_MASTER_ROUTE);
    }
  }, [history]);

  const handleViewPurchaseProposal = React.useCallback(() => {
    window.open(
      `${PROPOSAL_DETAIL_ROUTE}/${model.purchaseProposalId?.id}`,
      "_blank"
    );
  }, [model.purchaseProposalId?.id]);

  useEffect(() => {
    const id = history.location.pathname.split("/").pop();

    if (
      id &&
      history.location.pathname !== PURCHASE_REQUEST_DETAIL_ROUTE &&
      history.location.pathname !== PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE
    ) {
      handleGetDataDetail(id);
    } else {
      handleInitDataCreate();
    }
  }, []);

  const getInitDataUser = () => {
    return {
      user: store.getState().profile?.account,
      organization: store.getState().profile.organization,
      position: store.getState().profile.position,
      businessBranch: store.getState().profile.businessBranch,
      receiveBusinessDepartmentId: store.getState().profile.organization,
      receiveUser: store.getState().profile?.account,
    };
  };

  const handleInitDataCreate = () => {
    const dataPurchaseRequest = (
      history.location?.state as { dataPurchase?: PurchaseRequest }
    )?.dataPurchase;
    if (dataPurchaseRequest && isAdjust) {
      handleUpdateDataCreate({
        ...dataPurchaseRequest,
        ...getInitDataUser(),
        originalPurchaseRequestCode: dataPurchaseRequest.code,
        originalPurchaseRequestId: dataPurchaseRequest.id,
        id: undefined,
        isAdjust: true,
        status: undefined,
        purchaseOrganization: undefined,
        purchasingMethod: undefined,
        recipientInforJson: {
          receiveBusinessDepartment:
            store.getState().profile.businessDepartment,
          recipient: store.getState().profile?.account,
          address: dataPurchaseRequest?.recipientInforJson?.address,
          phoneNumber: dataPurchaseRequest?.recipientInforJson?.phoneNumber,
          note: dataPurchaseRequest?.recipientInforJson?.note,
        },
      });
      return;
    }
    const dataInit = {
      procurementPurpose: listPurposeShoppingEnum[0],
      ...getInitDataUser(),
    };
    handleChangeAllField(dataInit);
  };

  const handleGetDataDetail = (id: string) => {
    setLoading(true);
    purchaseRequestRepository
      .detail(id, isView)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: PurchaseRequest) => {
          handleUpdateDataCreate({
            ...response,
            id,
            isDetail,
            isAdjust,
          });
        },
        complete: () => {
          setLoading(false);
        },
      });
  };

  const handleUpdateDataCreate = (response: PurchaseRequest) => {
    const dataDetail = {
      ...response,
      purchaseProposalId: response.purchaseProposal,
      purchasingMethod: LIST_TYPE_PURCHASE_FROM.find(
        (item) => item.id == response?.purchasingMethod
      ),
      receiveBusinessDepartmentId:
        response.recipientInforJson.receiveBusinessDepartment,
      receiveUser: response.recipientInforJson.recipient,
      phoneNumber: response.recipientInforJson.phoneNumber,
      address: response.recipientInforJson.address,
      note: response.recipientInforJson.note,
    };
    handleChangeAllField(dataDetail);
  };

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatchModel);

  const convertPurchaseRequestBody = React.useCallback(
    (isDraft: boolean) => {
      const body: PurchaseRequestCreate = {
        id: model?.id,
        purchaseRequestType: isAdjust ? 1 : 0,
        originalPurchaseRequestId: model?.originalPurchaseRequestId,
        isDraft,
        name: model?.name,
        expectedReceiveDate: !isEmpty(model.expectedReceiveDate)
          ? dayjs(model.expectedReceiveDate).format()
          : null,
        description: model?.description,
        attachments: model?.attachments,
        purchaseOrganizationId: model?.purchaseOrganization?.id,
        purchaseProposalId: model?.purchaseProposalId?.id,
        purchasingMethod: model?.purchasingMethod?.id,
        purchaseItems: model?.purchaseItems?.map((item) => ({
          goodsId: item?.goodsId,
          branchId: item.branch?.id,
          unitId: item.unit?.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxId: item.tax?.id,
          taxAmount: item.taxAmount || 0,
          otherAmount: item.otherAmount,
          note: item?.note,
          totalConvertedAmount: item?.totalConvertedAmount,
          taxPercent: item.tax?.rate,
        })),
        recipientInforJson: {
          receiveBusinessDepartmentId: model?.receiveBusinessDepartmentId?.id,
          receiveUser: model.receiveUser?.email,
          phoneNumber: model.phoneNumber,
          address: model.address,
          note: model.note,
        },
        appointmentMethod:
          model?.purchaseProposalId?.contractorAppointment?.appointmentMethod ||
          null,
      };

      return body;
    },
    [model]
  );

  const handleSave = React.useCallback(
    ({ isDraft = false }) => {
      if (!model.purchaseProposalId) {
        return notifyToast({
          message: translate("PR.please_select_proposal"),
          type: "error",
        });
      }
      const requiredBody = convertPurchaseRequestBody(isDraft);

      if (model.id) {
        requiredBody.id = model.id;
      }

      const request = model.id
        ? purchaseRequestRepository.update(requiredBody)
        : purchaseRequestRepository.create(requiredBody);

      setLoading(true);
      request.pipe(finalize(() => setLoading(false))).subscribe({
        next: (response: PurchaseRequest) => {
          notifyToast();
          handleGoMaster();

          if (!isDraft && !isAdjust) {
            purchaseRequestRepository
              .autoCreatePurchasePlan({
                originalPurchaseRequestId: response?.id,
              })
              .subscribe();
          }
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            if (error.response?.data?.type === "Validate") {
              setErrorsModal({
                type: "SUBMIT_FAIL",
                errors: error?.response?.data?.tabErrors || [],
              });
              handleChangeAllField({
                ...model,
                errors: error.response?.data?.errors,
                errorTabs: error.response?.data?.tabs,
              });
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
        },
      });
    },
    [model, handleGoMaster, translate]
  );

  const changeListSelectedGoodsServices = useCallback(
    (data: GoodServiceByCategory) => {
      const purchaseItems = model?.purchaseItems || [];
      const index = purchaseItems.findIndex((item) => item.id === data.id);
      if (isEqual(index, -1)) {
        purchaseItems.push(data);
      } else {
        purchaseItems[index] = data;
      }
      handleChangeAllField({
        ...model,
        purchaseItems: purchaseItems,
        errors: {
          ...model?.errors,
          [`purchaseItems[${index}].branchId`]: null,
          [`purchaseItems[${index}].quantity`]: null,
        },
      });
    },
    [model]
  );

  const handleDownloadFileAttached = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (error.response?.status === 413) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleRemoveFileAttachment = (fileId: string | number) => {
    const listFile = model?.attachments?.filter(
      (p: RequestAttachment) => p?.systemFileId !== fileId
    );
    handleChangeSingleField({
      fieldName: "attachments",
    })(listFile);
  };

  const handleUpdateListAttachments = (listFile: FileModel[]) => {
    const newListFiles = [...(model?.attachments || []), ...listFile];
    handleChangeSingleField({
      fieldName: "attachments",
    })(newListFiles);
  };

  const handlePressEdit = () => {
    if (isAdjust) {
      history.push(`${PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE}/${model.id}`);
    } else {
      history.push(`${PURCHASE_REQUEST_DETAIL_ROUTE}/${model.id}`);
    }
  };

  const handleApplyButtonInConfirmModal = (
    model: PurchaseRequest,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelPurchaseRequest(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deletePurchaseRequest(model?.id, reason);
        return;
    }
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors?.["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  const deletePurchaseRequest = (PurchaseRequestId: string, reason: string) => {
    purchaseRequestRepository
      .deletePurchaseRequest(PurchaseRequestId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const cancelPurchaseRequest = (PurchaseRequestId: string, reason: string) => {
    purchaseRequestRepository
      .cancelPurchaseRequest(PurchaseRequestId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const refreshListAndHideModal = () => {
    notifyToast();
    setModelSelected(null);
    handleGoMaster();
  };

  const handleClickOriginalCode = (id: string) => {
    window.open(`${PURCHASE_REQUEST_VIEW_ROUTE}/${id}`, "_blank");
  };

  const valuesContext: PurchaseRequestDetailModel = {
    model,
    dispatchModel,
    loading,
    breadcrumbs,
    title,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleSave,
    handleDownloadFileAttached,
    handleChangeAllField,
    setLoading,
    notifyToast,
    handleGoMaster,
    handleUploadAttachmentError,
    handleRemoveFileAttachment,
    handleUpdateListAttachments,
    setIsShowModalProposal,
    isShowModalProposal,
    setIsShowModalGoodsServices,
    isShowModalGoodsServices,
    changeListSelectedGoodsServices,
    handleViewPurchaseProposal,
    handlePressEdit,
    modelSelected,
    setModelSelected,
    loadingModal: isLoadingModal,
    handleApplyButtonInConfirmModal,
    handleClickOriginalCode,
    errorsModal,
    setErrorsModal,
    exchangeRateNumberType,
    convertPurchaseRequestBody,
  };

  return {
    ...valuesContext,
    // not context
    tabRepositories,
  };
}
