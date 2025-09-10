/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { listStatusEnum } from "config/const";
import {
  APP_OVERVIEW,
  BUDGET_EDIT_ROUTE,
  BUDGET_MASTER_ROUTE,
} from "config/route-const";
import { numberConstants, SLASH } from "core/config/consts";
import { ErrorType } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  ConfigField,
  FieldValue,
  GeneralAction,
  HttpStatusCode,
} from "core/services/service-types";
import { saveAs } from "file-saver";
import { get, isEqual, multiply } from "lodash";
import { AppUser } from "models/AppUser";
import { Budget } from "models/Budget/Budget";
import {
  BudgetPlan,
  BudgetPlanTemplate,
  StatusBudgetPlan,
} from "models/CostOwner/BudgetPlan";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Model } from "react-3layer-common";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, Subscription, tap } from "rxjs";
import { ImportFileErrorModal } from "../BudgetAdjustPage/BudgetAdjustCreate/BudgetAdjustHook";
import { ConfirmModalType } from "../BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { ModelSelect } from "../BudgetMaster/BudgetMasterHook";
import { budgetRepository } from "../BudgetRepository";

export enum MODEL_CONFIRM_TYPE {
  RETURN = "RETURN",
  REJECT = "REJECT",
  CLOSE = "CLOSE",
}

export enum APPROVE_TYPE {
  RETURN = "0",
  REJECT = "1",
  APPROVE = "2",
}

export interface CreateBudget {
  model: BudgetPlan;
  title?: string;
  dispatchModel: React.Dispatch<GeneralAction<AppUser>>;
  loading: boolean;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeSelectField?: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleGoMaster?: () => void;
  handleDownloadFileTemplate?: () => void;
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave?: (value?: {
    isDraft?: boolean;
    callbackFc?: () => void;
    isSend?: boolean;
  }) => void;
  handleDownloadFileBudget?: () => void;
  handleToggleModalRemoveFileBudgetPlan?: () => void;
  handleRemoveFileBudgetPlan?: () => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;
  handleCancelUploadFileBudget?: () => void;
  handleUploadAttachmentError?: (error: any) => void;
  modalConfirm?: string;
  handleUpdateTypeModal?: (type: string) => void;
  handleApproveBudget?: () => void;
  handleRejectBudget?: () => void;
  handleReturnBudget?: () => void;
  handleChangeAllField?: (value: BudgetPlan) => void;
  modelSelected: ModelSelect | null;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  handleApplyButtonInConfirmModal: (model: Budget) => void;
  importErrorModal?: ImportFileErrorModal;
  setImportErrorModal?: React.Dispatch<
    React.SetStateAction<ImportFileErrorModal>
  >;
  processAfterFeedbackSubmission?: () => void;
}

export const CreateBudgetContext = createContext<CreateBudget>({
  model: new BudgetPlan(),
  dispatchModel: null,
  loading: false,
  modalConfirm: null,
  modelSelected: null,
  setModelSelected: null,
  handleApplyButtonInConfirmModal: null,
});

export function useBudgetCreateHook({ isDetail = false }) {
  const [translate] = useTranslation();
  const { model, dispatch } = detailService.useModel<BudgetPlan>(BudgetPlan);
  const [loading, setLoading] = React.useState<boolean>(false);
  const subscriptionRef = useRef<Subscription | null>(null);
  const [modalConfirm, setModalConfirm] =
    React.useState<MODEL_CONFIRM_TYPE | null>(null);
  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);
  const [importErrorModal, setImportErrorModal] =
    React.useState<ImportFileErrorModal>({ open: false });
  const isEditable = useRef<boolean>(false);

  const history = useHistory();
  const isViewWaitingApprove = useMemo(
    () => history.location.search.includes("isViewWaitingApprove=true"),
    []
  );

  const title = useMemo(() => {
    if (isDetail) {
      let title = "";
      if (isEqual(model.type, 3)) {
        title = `${translate("BG.txt_settlement")} ${model?.code}`;
      } else {
        title = `${translate("BG.budget_plan")} - ${model?.code}`;
      }

      return title;
    }

    const translateKey = isEqual(isEditable.current, true)
      ? "BG.edit_budget_plan"
      : "BG.create_new_budget_plan";

    return translate(translateKey);
  }, [isDetail, model.type, model?.code]);

  const breadcrumbs = [
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
  ];

  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatch);

  const handleUpdateTypeModal = (type: MODEL_CONFIRM_TYPE | null) => {
    setModalConfirm(type);
  };

  const handleGoMaster = React.useCallback(() => {
    history.push(BUDGET_MASTER_ROUTE);
  }, [history]);

  const handleDownloadFileTemplate = () => {
    budgetRepository.exportTemplate().subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "template.xlsx");
      },
    });
  };

  const handleDownloadFileBudget = () => {
    budgetRepository
      .downloadFile(model?.fileInfo?.path || model?.filePath)
      .subscribe({
        next: (response: AxiosResponse<ArrayBuffer>) => {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "budget_plan.xlsx");
        },
      });
  };

  const handleCancelUploadFileBudget = () => {
    handleChangeSingleField({
      fieldName: "loadingFileBudget",
    })(false);
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
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

  const handleErrors = (error: AxiosError) => {
    if (isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)) {
      type ErrorType = {
        type: string;
        message?: string;
        sheetErrors?: string[];
      };
      const data = error?.response.data as ErrorType;
      const { type, sheetErrors, message } = data;

      switch (type) {
        case ErrorType.VALIDATE:
          handleChangeAllField({
            ...model,
            errors: error.response?.data?.errors,
          });
          break;
        case ErrorType.BAD_REQUEST:
          notifyToast({
            type: "error",
            message,
          });
          break;
        case ErrorType.SYSTEM_ERROR:
          setImportErrorModal({ open: true, value: sheetErrors });
          break;
        default:
          break;
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const MAX_FILE_LENGTH = 30; // Mb
    const BYTE_VALUE = 1024;
    const MEGABYTE = multiply(BYTE_VALUE, BYTE_VALUE);

    if (file && file.size > MAX_FILE_LENGTH * MEGABYTE) {
      notifyToast({
        message: translate("CM.input_file_size_validation", {
          maxSize: MAX_FILE_LENGTH,
        }),
        type: "error",
      });
      event.target.value = "";
    } else if (file) {
      handleChangeSingleField({
        fieldName: "loadingFileBudget",
      })(true);
      subscriptionRef.current = budgetRepository
        .uploadFileBudget(file, model.businessUnitId?.code)
        .subscribe({
          next: (response: BudgetPlanTemplate) => {
            handleChangeAllField({
              ...model,
              summary: response.summary,
              fileInfo: response.fileInfo,
              loadingFileBudget: false,
            });
          },
          error: (error: AxiosError) => {
            handleErrors(error);
            handleChangeSingleField({
              fieldName: "loadingFileBudget",
            })(false);
          },
        });
      event.target.value = "";
    }
  };

  const updateBudget = (isDraft: boolean, callbackFc?: () => void) => {
    const body = {
      type: 0,
      id: model.id,
      businessUnitId: model.businessUnitId?.id,
      name: model.name,
      fileName: model.fileInfo?.name,
      filePath: model.fileInfo?.path,
      // summary: model.summary || [],
      requestAttachments: model.requestAttachments || [],
      isDraft,
      isHardValidate: !!(typeof callbackFc === "function"),
    };

    setLoading(true);
    budgetRepository
      .update(body)
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
        error: handleErrors,
      });
  };

  const handleSave = React.useCallback(
    ({
      isDraft = false,
      callbackFc,
      isSend = false,
    }: {
      isDraft?: boolean;
      callbackFc?: () => void;
      isSend?: boolean;
    }) => {
      if (isEditable.current || isSend || model?.id) {
        updateBudget(isDraft, callbackFc);
        return;
      }

      setLoading(true);
      const body = {
        type: 0,
        businessUnitId: model.businessUnitId?.id,
        name: model.name,
        fileName: model.fileInfo?.name,
        filePath: model.fileInfo?.path,
        // summary: model.summary || [],
        requestAttachments: model.requestAttachments || [],
        id: model?.id,
        isDraft,
        isHardValidate: !!(typeof callbackFc === "function"),
      };
      budgetRepository
        .create(body)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (res) => {
            notifyToast();
            handleChangeAllField({
              ...model,
              id: res?.id,
              code: res?.code,
            });
            // nếu có callbackFc thì không out ra khỏi detail
            if (typeof callbackFc === "function") {
              callbackFc();
            } else {
              handleGoMaster();
            }
          },
          error: handleErrors,
        });
    },
    [model, handleGoMaster, translate]
  );

  const getDetail = useCallback((id: string) => {
    budgetRepository
      .detail(id, isViewWaitingApprove)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: (response: BudgetPlan) => {
          handleChangeAllField({
            ...response,
            businessUnitId: response?.businessUnit,
            summary: response?.summary,
            fileInfo: {
              name: response?.fileName,
              path: response?.filePath,
            },
          });
        },
        error: () => {
          history.push(BUDGET_MASTER_ROUTE);
        },
      });
  }, []);

  const handleGetDataDetail = (
    id: string,
    approveType: APPROVE_TYPE | string
  ) => {
    setLoading(true);
    budgetRepository.detail(id, isViewWaitingApprove).subscribe({
      next: (response: BudgetPlan) => {
        let businessUnitId = response?.businessUnit;
        if (isEqual(response?.type, 3)) {
          businessUnitId = isEqual(response.budgetSettlementType, 0)
            ? {
                id: 0,
                name: translate("BG.txt_open_budget"),
              }
            : {
                id: 1,
                name: translate("BG.txt_close_budget"),
              };
        }

        handleChangeAllField({
          ...response,
          businessUnitId,
          isDetail: true,
        });
        if (approveType && response.status == StatusBudgetPlan.IN_PROGRESS) {
          switch (approveType) {
            case APPROVE_TYPE.REJECT:
              handleUpdateTypeModal(MODEL_CONFIRM_TYPE.REJECT);
              break;
            case APPROVE_TYPE.RETURN:
              handleUpdateTypeModal(MODEL_CONFIRM_TYPE.RETURN);
              break;
            default:
              break;
          }
        }
      },
      error: () => {
        history.push(BUDGET_MASTER_ROUTE);
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  const processAfterFeedbackSubmission = useCallback(() => {
    if (
      isEqual(model?.status, get(listStatusEnum, `[${numberConstants.ONE}].id`))
    ) {
      const id = history.location.pathname.split("/").pop();
      handleGetDataDetail(id, undefined);
    }
  }, [isDetail, history.location.pathname, handleGetDataDetail]);

  const handleToggleModalRemoveFileBudgetPlan = () => {
    handleChangeSingleField({
      fieldName: "isConfirmDeleteBudgetPlan",
    })(!model?.isConfirmDeleteBudgetPlan);
  };

  const handleRemoveFileBudgetPlan = () => {
    handleChangeAllField({
      ...model,
      summary: null,
      fileInfo: null,
      isConfirmDeleteBudgetPlan: false,
    });
    notifyToast({
      message: translate("BG.message.delete_success"),
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

  const handleApproveBudget = () => {
    setLoading(true);
    budgetRepository
      .approve(model.id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          setModalConfirm(null);
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const handleRejectBudget = () => {
    setLoading(true);
    budgetRepository
      .reject(model.id, { reason: model.reason })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          setModalConfirm(null);
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            if (error.response?.data?.type === "Validate") {
              handleChangeAllField({
                ...model,
                errors: error.response?.data?.errors,
              });
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
        },
      });
  };

  const handleReturnBudget = () => {
    setLoading(true);
    budgetRepository
      .return(model.id, { reason: model.reason })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            if (error.response?.data?.type === "Validate") {
              handleChangeAllField({
                ...model,
                errors: error.response?.data?.errors,
              });
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
        },
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

  useEffect(() => {
    const pathNames = history.location.pathname.split(SLASH);
    const id = pathNames.pop();
    const endpoint = pathNames.pop();

    if (isEqual(endpoint, BUDGET_EDIT_ROUTE.split(SLASH).pop())) {
      isEditable.current = true;
      getDetail(id);
    }
    if (isDetail) {
      const id = history.location.pathname.split("/").pop();
      const searchParams = new URLSearchParams(history.location.search);
      const approveType = searchParams.get("approveType");
      handleGetDataDetail(id, approveType);
    }
  }, []);

  return {
    loading,
    history,
    translate,
    title,
    dispatchModel: dispatch,
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleGoMaster,
    handleDownloadFileTemplate,
    handleFileChange,
    handleSave,
    handleDownloadFileBudget,
    breadcrumbs,
    handleToggleModalRemoveFileBudgetPlan,
    handleRemoveFileBudgetPlan,
    handleDownloadFileAttached,
    handleCancelUploadFileBudget,
    handleUploadAttachmentError,
    handleUpdateTypeModal,
    modalConfirm,
    handleApproveBudget,
    handleRejectBudget,
    handleReturnBudget,
    handleChangeAllField,
    isEditable,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    isLoadingModal,
    importErrorModal,
    setImportErrorModal,
    processAfterFeedbackSubmission,
  };
}
