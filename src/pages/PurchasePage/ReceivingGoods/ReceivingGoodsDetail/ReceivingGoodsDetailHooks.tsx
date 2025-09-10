import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  APP_OVERVIEW,
  CONTRACT_ROUTE_VIEW,
  RECEIVING_GOODS_CREATE_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  RECEIVING_GOODS_EDIT_ROUTE,
  RECEIVING_GOODS_ROUTE,
  RECEIVING_GOODS_ROUTE_MASTER,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { ErrorType, handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import {
  convertDataToHaveIndexBeforeValidate,
  detailService,
} from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { GeneralActionEnum, HttpStatusCode } from "core/services/service-types";
import saveAs from "file-saver";
import { isEmpty, isEqual, isNil } from "lodash";
import { DocumentGroup } from "models/DocumentGroup";
import { ReceivingGoodFilter } from "models/ReceivingGood";
import { GoodsReceipt } from "models/ReceivingGood/GoodsReceipt";
import { APPROVE_TYPE } from "pages/BudgetPage/BudgetCreate/BudgetCreateHook";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { AcceptanceFile } from "pages/PurchasePage/Acceptance/AcceptanceFile/AcceptanceFile";
import {
  AcceptanceFileModel,
  TopicType,
} from "pages/PurchasePage/Acceptance/AcceptanceFile/types";
import { LOCAL_STORAGE_ACTION_STATE } from "pages/PurchasePage/constants";
import ReceivedInformationDetail from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/ReceivedInformationDetail";
import SupplierEvaluationDetail from "pages/PurchasePage/ReceivingGoods/Components/SupplierEvaluationDetail/SupplierEvaluationDetail";
import {
  ModalType,
  ModelSelect,
  TabKeyDetailEnum,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { ConfirmModalType } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import { STATUS_RECEIVED_REQUEST } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsView/ReceivingGoodsViewContext";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import TabName from "components/TabName/TabName";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router";
import { finalize, tap } from "rxjs";
import HistoryApprovalDetail from "../Components/HistoryApprovalDetail/HistoryApprovalDetail";
import ReceivedGoodsDetailIntergration from "../Components/ReceivedGoodsDetailIntergration/ReceivedGoodsDetailIntergration";
import { receivedGoodsRepository } from "../ReceivedGoodRepository";
import { useAcceptanceViewHooks } from "pages/PurchasePage/Acceptance/AcceptanceView/AcceptanceViewHooks";
import { useAcceptanceDetailHooks } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailHooks";

const VALIDATE = "Validate";
const REASON = "reason";
const ERROR_TYPE = "error";
const PARAMS_APPROVE_TYPE = "approveType";
const ROUTE_SLASH = "/";

export const DEFAULT_ERROR_MODAL_TYPE: ModalType = { type: "NONE", errors: [] };

interface Parameters {
  id: string;
}

type State = {
  mode?: "CLONE" | "VIEW" | "EDIT" | "CREATE";
};

const IS_VIEW_PARAM = "isView";

export const useReceivingGoodsDetailHooks = ({ isDetail = false }) => {
  const { id } = useParams<Parameters>();
  const [goodsReceiptIdSelect, setGoodsReceiptIdSelect] = useState<
    string | null
  >(null);
  const { model, dispatch } = detailService.useModel(GoodsReceipt);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [translate] = useTranslation();
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const [modalConfirm, setModalConfirm] = useState<ConfirmModalType | null>(
    null
  );
  const [errorsModal, setErrorsModal] = useState<ModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );
  const [modalType, setModalType] = useState<ModalType>({
    type: "NONE",
    id: null,
  });
  const { ...contextValue } = useAcceptanceViewHooks();
  const { ...contextDetail } = useAcceptanceDetailHooks();

  const mapContextWithDetail = useMemo(
    () => ({
      ...contextValue,
      ...contextDetail,
    }),
    [contextDetail, contextValue]
  );

  useEffect(() => {
    if (isDetail) {
      const id = history.location.pathname.split(ROUTE_SLASH).pop();
      const searchParams = new URLSearchParams(history.location.search);
      const approveType = searchParams.get(PARAMS_APPROVE_TYPE);
      if (approveType) {
        handleGetDataDetail(id, approveType);
      }
    }
  }, []);

  const {
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatch);

  const state = useMemo(() => {
    const state = localStorage.getItem(LOCAL_STORAGE_ACTION_STATE) as string;

    return state as State["mode"];
  }, []);

  const actionPageDetail = useRouteMatch([RECEIVING_GOODS_DETAIL_ROUTE]);

  const isEditable = useMemo(() => {
    return (
      isEqual("EDIT", state) ||
      isEqual("CLONE", state) ||
      isEqual("CREATE", state)
    );
  }, [state]);

  const title = useMemo(() => {
    if (isDetail) {
      return translate("RG.txt_header_detail", {
        code: model?.code,
      });
    }

    if (isEqual(state, "EDIT")) {
      return translate("RG.txt_header_detail", {
        code: model?.code,
      });
    }

    return translate("RG.txt_create_new");
  }, [isDetail, model?.code, state, translate]);

  const breadcrumbs = useMemo(() => {
    return [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_procurement"),
      },
      {
        name: translate("CM.menu_title_receiving_goods"),
        path: RECEIVING_GOODS_ROUTE,
      },
      {
        name: title,
      },
    ];
  }, [title, translate]);

  const onAcceptanceFileChange = useCallback(
    (documentGroups: DocumentGroup[]) => {
      dispatch({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          documentGroups: documentGroups || [],
        },
      });
    },
    [dispatch, model]
  );

  // Tab
  const tabRepositories = useMemo<RepoState[]>(() => {
    const data: AcceptanceFileModel = {
      id: model?.id,
      documentGroups: model?.documentGroups,
      status: model?.status,
      code: model?.code,
      name: model?.name,
      mode: state,
    };

    const list: (RepoState & { children: ReactNode })[] = [
      {
        tabKey: TabKeyDetailEnum.RECEIVED_INFORMATION,
        tabTitle: (
          <TabName
            text={translate("RG.tab_detail_received_information")}
            isShowIconError={model.errorTabs?.includes(
              Number(TabKeyDetailEnum.RECEIVED_INFORMATION)
            )}
          />
        ),
        children: <ReceivedInformationDetail />,
        list: undefined,
      },
      {
        tabKey: TabKeyDetailEnum.SUPPLIER_EVALUATION,
        tabTitle: (
          <TabName
            text={translate("RG.tab_detail_supplier_evaluation")}
            isShowIconError={model.errorTabs?.includes(
              Number(TabKeyDetailEnum.SUPPLIER_EVALUATION)
            )}
          />
        ),
        children: <SupplierEvaluationDetail />,
        list: undefined,
      },
      {
        tabKey: TabKeyDetailEnum.ACCEPTANCE_FILES,
        tabTitle: (
          <TabName
            text={translate("RG.tab_receiving_files")}
            isShowIconError={model.errorTabs?.includes(
              Number(TabKeyDetailEnum.ACCEPTANCE_FILES)
            )}
          />
        ),
        children: (
          <AcceptanceFile
            topicType={TopicType.RECEIVING_GOODS}
            title={translate("RG.txt_signed_file")}
            data={data}
            modalTitle={translate("RG.txt_modal_add_receipt_file")}
            onChange={onAcceptanceFileChange}
            {...mapContextWithDetail}
          />
        ),
        list: undefined,
      },
      {
        tabKey: TabKeyDetailEnum.INTEGRATION,
        tabTitle: (
          <TabName
            text={translate("RG.tab_detail_intergration")}
            isShowIconError={model.errorTabs?.includes(
              Number(TabKeyDetailEnum.INTEGRATION)
            )}
          />
        ),
        children: <ReceivedGoodsDetailIntergration />,
        list: undefined,
      },
      {
        tabKey: TabKeyDetailEnum.HISTORY_APPROVAL,
        tabTitle: (
          <TabName
            text={translate("RG.tab_detail_history_approval")}
            isShowIconError={model.errorTabs?.includes(
              Number(TabKeyDetailEnum.HISTORY_APPROVAL)
            )}
          />
        ),
        children: <HistoryApprovalDetail />,
        list: undefined,
      },
    ];

    if (["CREATE", "CLONE"].includes(state)) {
      list.splice(-numberConstants.TWO);
    }

    if (isEqual(state, "EDIT")) {
      return list.filter(
        (tab) => !isEqual(tab.tabKey, TabKeyDetailEnum.INTEGRATION)
      );
    }

    return list;
  }, [
    model?.id,
    model?.documentGroups,
    model?.status,
    model?.code,
    model?.name,
    model.errorTabs,
    state,
    translate,
    onAcceptanceFileChange,
    mapContextWithDetail,
  ]);

  const [filter, dispatchFilter] =
    queryStringService.useQueryString(ReceivingGoodFilter);

  const handleViewContract = useCallback(() => {
    window.open(`${CONTRACT_ROUTE_VIEW}/${model.contractId}`, "_blank");
  }, [model.contractId]);

  const { repo, handleChangeTab } = masterService.useTabRepository(
    tabRepositories,
    dispatchFilter
  );

  const isViewFromUrl = new URLSearchParams(history.location.search).get(
    IS_VIEW_PARAM
  );
  const isView = isNil(actionPageDetail)
    ? true
    : isEqual(isViewFromUrl, "true");

  const getGoodsDetail = useCallback(() => {
    setLoading(true);
    receivedGoodsRepository
      .getDetail(id, isView)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: GoodsReceipt) => {
          let data = {};
          if (isEqual(state, "CLONE")) {
            const newListEvaluation =
              response?.supplierEvaluation?.evaluationDetails?.map((data) => ({
                ...data,
                score: null,
              }));
            const newListGoodsReceiptRequestItems =
              response?.goodsReceiptRequestItems?.map((p) => ({
                ...p,
                quantity: null,
                serialNumber: null,
                note: null,
                amountBeforeTax: 0,
                convertedTotalAmount: 0,
                totalAmount: 0,
              }));
            data = {
              ...response,
              receiptDate: null,
              attachments: [],
              documentGroups: [],
              goodsReceiptRequestItems: newListGoodsReceiptRequestItems,
              supplierEvaluation: {
                ...response.supplierEvaluation,
                evaluationDetails: newListEvaluation,
              },
            };
          } else {
            data = {
              ...response,
            };
          }
          dispatch({
            type: GeneralActionEnum.UPDATE,
            payload: {
              ...data,
              id: isEqual(state, "CLONE") ? undefined : response?.id,
              status: isEqual(state, "CLONE")
                ? numberConstants.ZERO
                : response.status,
            },
          });
        },
        error: (error: AxiosError) => {
          const message = error?.response?.data?.message;
          notifyToast({
            type: "error",
            message: message || translate("CM.message_system_error"),
          });
        },
      });
  }, [id, isView, dispatch, state, notifyToast, translate]);

  const processAfterFeedbackSubmission = useCallback(() => {
    if (isEqual(model?.status, STATUS_RECEIVED_REQUEST.WAITING_FOR_APPROVAL)) {
      getGoodsDetail();
    }
  }, [getGoodsDetail, model?.status]);

  const handleErrorResponse = (error: AxiosError, newModel: GoodsReceipt) => {
    if (
      error.response &&
      isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)
    ) {
      if (
        error?.response?.data?.tabErrors?.length > 0 ||
        error.response?.data?.tabs > 0
      ) {
        setErrorsModal({
          type: "SUBMIT_FAIL",
          errors: error?.response?.data?.tabErrors || [],
        });
      }

      if (isEqual(error.response?.data?.type, ErrorType.VALIDATE)) {
        handleChangeAllField({
          ...newModel,
          errors: error.response?.data?.errors,
          errorTabs: error.response?.data?.tabs,
        });
      } else if (isEqual(error.response?.data?.type, ErrorType.BAD_REQUEST)) {
        handleChangeAllField({
          ...newModel,
          errorTabs: error.response?.data?.tabs,
        });
        if (error.response?.data?.message) {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        }
      }
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const getContactDetail = useCallback(() => {
    setLoading(true);
    receivedGoodsRepository
      .getContactDetailBy(id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: GoodsReceipt) => {
          dispatch({
            type: GeneralActionEnum.UPDATE,
            payload: { ...response, id: undefined },
          });
        },
        error: (error: AxiosError) => {
          const message = error?.response?.data?.message;
          notifyToast({
            type: "error",
            message: message || translate("CM.message_system_error"),
          });
        },
      });
  }, [id, translate]);

  const createRequest = (isDraft: boolean, callbackFn?: () => void) => {
    setLoading(true);
    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
    receivedGoodsRepository
      .sendApproval(
        {
          ...model,
          isHardValidate: !!(typeof callbackFn === "function"),
        },
        isDraft
      )
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response) => {
          notifyToast();
          handleChangeAllField({
            ...model,
            id: response?.id,
            code: response?.code,
          });
          // nếu có callbackFc thì không out ra khỏi detail
          if (typeof callbackFn === "function") {
            callbackFn();
          } else {
            history.push(RECEIVING_GOODS_ROUTE);
          }
        },
        error: (error: AxiosError) => {
          handleErrorResponse(error, newModel);
        },
      });
  };

  const updateRequest = (isDraft: boolean, callbackFn?: () => void) => {
    setLoading(true);
    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
    receivedGoodsRepository
      .sendApprovalEdited(
        {
          ...model,
          isHardValidate: !!(typeof callbackFn === "function"),
        },
        isDraft
      )
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          if (typeof callbackFn === "function") {
            callbackFn();
          } else {
            history.push(RECEIVING_GOODS_ROUTE);
          }
        },
        error: (error: AxiosError) => {
          handleErrorResponse(error, newModel);
        },
      });
  };

  const handleSendRequest = (isDraft = false, callbackFn?: () => void) => {
    if (
      (state === "CREATE" || state === "CLONE") &&
      (isEmpty(model?.id) ||
        model?.id === "00000000-0000-0000-0000-000000000000")
    ) {
      createRequest(isDraft, callbackFn);
    } else updateRequest(isDraft, callbackFn);
  };

  const handleApproval = () => {
    if (isNil(model?.id)) return;

    setLoading(true);
    receivedGoodsRepository
      .approval(model?.id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          history.push(RECEIVING_GOODS_ROUTE);
        },
        error: (error: AxiosError) => {
          const message = error?.response?.data?.message;
          notifyToast({
            type: "error",
            message: message || translate("CM.message_system_error"),
          });
        },
      });
  };

  const handleErrorModal = (error: AxiosError) => {
    if (
      error.response &&
      isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)
    ) {
      const type = error?.response?.data?.type;
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors[REASON],
        }));
      } else {
        notifyToast({
          type: ERROR_TYPE,
          message: error?.response?.data?.message,
        });
      }
    }
  };

  const onConfirmSuccess = useCallback(() => {
    setModelSelected(null);
    notifyToast();
    history.push(RECEIVING_GOODS_ROUTE_MASTER);
  }, [history, setModelSelected, notifyToast]);

  //  Delete received good
  const deleteReceivedGood = (id: string, reason: string) => {
    if (isNil(id)) return;
    receivedGoodsRepository
      .deleteReceivedGood(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: onConfirmSuccess,
        error: handleErrorModal,
      });
  };

  // Cancel received good
  const cancelReceivedGood = (id: string, reason?: string) => {
    if (isNil(id)) return;
    receivedGoodsRepository
      .cancelReceivedGood(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: onConfirmSuccess,
        error: handleErrorModal,
      });
  };

  const handleReturn = (id: string, reason: string) => {
    if (isNil(id)) return;
    setLoading(true);
    receivedGoodsRepository
      .returnReceivedGood(id, reason)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: onConfirmSuccess,
        error: (error: AxiosError) =>
          handleError({ model, error, handleChangeAllField }),
      });
  };

  const handelReject = (id: string, reason: string) => {
    if (isNil(id)) return;
    setLoading(true);
    receivedGoodsRepository
      .reject(id, reason)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => onConfirmSuccess(),
        error: (error: AxiosError) =>
          handleError({ model, error, handleChangeAllField }),
      });
  };

  const handleUpdateTypeModal = (type: ConfirmModalType | null) => {
    setModalConfirm(type);
  };

  const handleGetDataDetail = (
    id: string,
    approveType: APPROVE_TYPE | string
  ) => {
    setLoading(true);
    receivedGoodsRepository.getDetail(id).subscribe({
      next: (response: GoodsReceipt) => {
        handleChangeAllField({
          ...response,
          isDetail: true,
        });
        if (
          approveType &&
          isEqual(response.status, STATUS_RECEIVED_REQUEST.WAITING_FOR_APPROVAL)
        ) {
          switch (approveType) {
            case APPROVE_TYPE.REJECT:
              handleUpdateTypeModal(ConfirmModalType.REJECT);
              break;
            case APPROVE_TYPE.RETURN:
              handleUpdateTypeModal(ConfirmModalType.RETURN);
              break;
            default:
              break;
          }
        }
      },
      error: () => {
        history.push(RECEIVING_GOODS_ROUTE_MASTER);
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  // Apply button in confirm modal
  const handleApplyButtonInConfirmModal = (
    model: GoodsReceipt,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelReceivedGood(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteReceivedGood(model?.id, reason);
        return;
      case ConfirmModalType.REJECT:
        handelReject(model?.id, reason);
        return;
      case ConfirmModalType.RETURN:
        handleReturn(model?.id, reason);
        return;
    }
  };

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (isEqual(error.response?.status, HttpStatusCode.PAYLOAD_TOO_LARGE)) {
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

  // Get model detail
  const match = useRouteMatch([RECEIVING_GOODS_CREATE_ROUTE]);

  useEffect(() => {
    if (!id) return;

    if (!isEmpty(match) && !isEqual(state, "CLONE")) {
      getContactDetail();
    } else {
      getGoodsDetail();
    }
  }, [state, id]);

  return {
    filter,
    breadcrumbs,
    title,
    model,
    dispatch,
    tabRepositories,
    repo,
    isLoading,
    isEditable,
    state,
    loadingModal: isLoadingModal,
    modelSelected,
    modalConfirm,
    goodsReceiptIdSelect,
    errorsModal,
    modalType,
    setModalType,
    setErrorsModal,
    dispatchFilter,
    handleViewContract,
    handleUpdateTypeModal,
    setGoodsReceiptIdSelect,
    setModelSelected,
    handleChangeTab,
    processAfterFeedbackSubmission,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleSendRequest,
    handleApproval,
    handleReturn,
    handelReject,
    handleApplyButtonInConfirmModal,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    handleErrorResponse,
  };
};
