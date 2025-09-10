import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { listStatusEnum } from "config/const";
import {
  APP_OVERVIEW,
  BUDGET_EDIT_SETTLEMENT_ROUTE,
  BUDGET_MASTER_ROUTE,
} from "config/route-const";
import { numberConstants, SLASH } from "core/config/consts";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { listService } from "core/services/page-services/list-service";
import {
  GeneralAction,
  GeneralActionEnum,
  HttpStatusCode,
} from "core/services/service-types";
import saveAs from "file-saver";
import { get, isEqual, isNil } from "lodash";
import { Budget } from "models/Budget/Budget";
import { BudgetSettlement } from "models/Budget/BugetSettlement";
import { BudgetPlan } from "models/CostOwner/BudgetPlan";
import { Project } from "models/Project/Project";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { ConfirmModalType } from "../BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { ModelSelect } from "../BudgetMaster/BudgetMasterHook";
import { budgetRepository } from "../BudgetRepository";
import { budgetSettlementRepository } from "./BudgetSettlementRepository";
import { FileModelExtend } from "./Components/AttachedFile/AttachedFile";

export type Modal = "ADD_PROJECT" | "DELETE" | "NONE";
export interface ModalType {
  type: Modal;
  id?: string;
}

export interface BudgetSettlementCreate {
  model: BudgetSettlement;
  title?: string;
  dispatchModel: Dispatch<GeneralAction<BudgetSettlement>>;
  loading: boolean;
  history: any;
  handleChangeSingleField: any;
  handleChangeSelectField: any;
  handleDownloadFileBudget?: () => void;
  handleToggleModalRemoveFileBudgetPlan?: () => void;
  handleRemoveFileBudgetPlan?: () => void;
  handleDownloadFileAttached?: (file?: FileModelExtend) => void;
  handleCancelUploadFileBudget?: () => void;
  handleUploadAttachmentError?: (error: any) => void;
  setModalType: Dispatch<SetStateAction<ModalType>>;
  canBulkAction: any;
  rowSelection: any;
  selectedRowKeys: any;
  setSelectedRowKeys: any;
  modalType: ModalType;
  saveDraft: () => void;
  saveAndSend: (isDraft: boolean, callbackFc: () => void) => void;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  handleApplyButtonInConfirmModal: (model: Budget, reason: string) => void;
  processAfterFeedbackSubmission?: () => void;
}

export const BudgetSettlementContext = createContext<BudgetSettlementCreate>({
  model: new BudgetSettlement(),
  dispatchModel: null,
  loading: false,
  history: null,
  handleChangeSingleField: null,
  handleChangeSelectField: null,
  setModalType: null,
  canBulkAction: null,
  rowSelection: null,
  selectedRowKeys: null,
  setSelectedRowKeys: null,
  modalType: { type: "NONE" },
  saveDraft: null,
  saveAndSend: null,
  modelSelected: null,
  setModelSelected: null,
  handleApplyButtonInConfirmModal: null,
});

const ZERO = 0;

export const useBudgetSettlementCreateHook = () => {
  const [translate] = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>({
    type: "NONE",
    id: null,
  });
  const { model, dispatch } = detailService.useModel<BudgetSettlement>(
    BudgetSettlement,
    {
      ...new BudgetSettlement(),
      budgetSettlementTypeValue: {
        id: 1,
        name: translate("BG.txt_close_budget"),
      },
    }
  );
  const { notifyToast } = appMessageService.useCRUDMessage();
  const isEditable = useRef<boolean>(false);
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);

  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<Project>("checkbox", [], true);

  const title = useMemo(() => {
    let translateKey = "BG.txt_settlement";
    if (isEditable.current) {
      translateKey = "BG.txt_edit_settlement";
    }

    return translate(translateKey);
  }, [isEditable, translate]);

  const breadcrumbs = useMemo(
    () => [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_budget"),
        path: BUDGET_MASTER_ROUTE,
      },
      {
        name: title,
      },
    ],
    [title, translate]
  );

  const handleDownloadFileAttached = (file?: FileModelExtend) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
      error: (err: any) => {
        console.error("Error downloading the file:", err);
      },
    });
  };

  const handleUploadAttachmentError = (error: AxiosError<any>) => {
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

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatch);

  const deleteProject = () => {
    let deleteIds = [];
    if (!isNil(modalType.id)) {
      deleteIds = [modalType.id] as KeyType[];
    } else {
      deleteIds = selectedRowKeys;
    }

    const remainingList = selectedRowKeys.filter(
      (item) => !deleteIds.includes(item)
    );

    const newList = [...model.budgetIds].filter(
      (item) => !deleteIds.includes(item.id)
    );

    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        budgetIds: newList,
      },
    });

    setSelectedRowKeys(remainingList);

    setModalType({ type: "NONE", id: null });
  };

  const handleGoMaster = useCallback(() => {
    history.push(BUDGET_MASTER_ROUTE);
  }, [history]);

  const handleSucceed = (response: BudgetSettlement) => {
    if (isEqual(response.status, 200)) {
      notifyToast();
      handleChangeAllField({
        ...model,
        id: response?.data?.id,
        code: response?.data?.code,
      });
    }
  };

  const saveDraft = () => {
    if (isEqual(isEditable.current, true)) {
      update(true);
      return;
    }

    budgetSettlementRepository
      .request(model, true)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: handleSucceed,
        error: (error: AxiosError) =>
          handleError<BudgetSettlement>({ model, error, handleChangeAllField }),
      });
  };

  const saveAndSend = (isDraft: boolean, callbackFc: () => void) => {
    if (isEqual(isEditable.current, true) || model?.id) {
      update(isDraft, callbackFc);
      return;
    }

    budgetSettlementRepository
      .request(
        {
          ...model,
          isHardValidate: !!(typeof callbackFc === "function"),
        },
        isDraft
      )
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: (res) => {
          handleSucceed(res);
          // nếu có callbackFc thì không out ra khỏi detail
          if (typeof callbackFc === "function") {
            callbackFc();
          } else {
            handleGoMaster();
          }
        },
        error: (error: AxiosError) =>
          handleError<BudgetSettlement>({ model, error, handleChangeAllField }),
      });
  };

  const prepareBeforeUpdate = useCallback(
    (response: BudgetPlan) => {
      const settlementNameType = isEqual(response.budgetSettlementType, ZERO)
        ? "BG.txt_open_budget"
        : "BG.txt_close_budget";
      const budgetSettlement: BudgetSettlement = {
        id: response.id,
        isDetail: false,
        name: response?.name,
        budgetIds: response.budgets,
        budgetSettlementTypeValue: {
          id: response.budgetSettlementType,
          name: translate(settlementNameType),
        },
        requestAttachments: response?.requestAttachments,
        status: response?.status,
        isReturn: response?.isReturn,
        code: response?.code,
        type: response?.type,
      };

      handleChangeAllField({
        ...budgetSettlement,
        businessUnitId: response?.businessUnit,
      });
    },
    [handleChangeAllField, translate]
  );

  const getDetail = useCallback(
    (id: string) => {
      budgetRepository
        .detail(id)
        .pipe(
          tap(() => setLoading(true)),
          finalize(() => setLoading(false))
        )
        .subscribe({
          next: prepareBeforeUpdate,
          error: () => {
            history.push(BUDGET_MASTER_ROUTE);
          },
        });
    },
    [history, prepareBeforeUpdate]
  );

  const update = (isDraft: boolean, callbackFc?: () => void) => {
    const BUDGET_SETTLEMENT_TYPE = 3;
    const requestBody: BudgetPlan = {
      id: model.id,
      budgetSettlementType: model.budgetSettlementTypeValue.id,
      name: model.name,
      budgetIds: model.budgetIds.map((item) => item?.id),
      requestAttachments: model.requestAttachments,
      businessUnitId: model.businessUnit?.id,
      isDraft,
      type: BUDGET_SETTLEMENT_TYPE,
      isHardValidate: !!(typeof callbackFc === "function"),
    };

    setLoading(true);
    budgetRepository
      .update(requestBody)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          // nếu có callbackFc thì không out ra khỏi detail
          if (typeof callbackFc === "function") {
            callbackFc();
          } else {
            handleGoMaster();
          }
        },
        error: (error: AxiosError) =>
          handleError<BudgetSettlement>({ model, error, handleChangeAllField }),
      });
  };

  const handleHideModal = () => {
    notifyToast();
    setModelSelected(null);
    handleGoMaster();
  };

  const handleUpdateBudgetError = (error: AxiosError) => {
    if (isEqual(error.response?.status, HttpStatusCode.BAD_REQUEST)) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  // Delete single budget
  const deleteBudget = (budgetId: string, reason: string) => {
    budgetRepository
      .deleteBudget(budgetId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateBudgetError,
      });
  };

  // Cancel budget request
  const cancelBudget = (budgetId: string, reason: string) => {
    budgetRepository
      .cancelBudget(budgetId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateBudgetError,
      });
  };

  const handleApplyButtonInConfirmModal = (model: Budget, reason: string) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelBudget(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteBudget(model?.id, reason);
        return;
    }
  };

  const processAfterFeedbackSubmission = useCallback(() => {
    if (
      isEqual(model?.status, get(listStatusEnum, `[${numberConstants.ONE}].id`))
    ) {
      const pathNames = history.location.pathname.split(SLASH);
      const id = pathNames.pop();
      getDetail(id);
    }
  }, [getDetail, history.location.pathname, model?.status]);

  useEffect(() => {
    const pathNames = history.location.pathname.split(SLASH);
    const id = pathNames.pop();
    const endpoint = pathNames.pop();

    if (isEqual(endpoint, BUDGET_EDIT_SETTLEMENT_ROUTE.split(SLASH).pop())) {
      isEditable.current = true;
      getDetail(id);
    }
  }, [getDetail, history.location.pathname]);

  return {
    model,
    title,
    dispatchModel: dispatch,
    loading,
    history,
    handleChangeSingleField,
    handleChangeSelectField,
    handleDownloadFileAttached,
    handleUploadAttachmentError,
    modalType,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    // non-context:
    breadcrumbs,
    translate,
    setModalType,
    deleteProject,
    saveDraft,
    saveAndSend,
    isEditable,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    isLoadingModal,
    processAfterFeedbackSubmission,
  };
};
