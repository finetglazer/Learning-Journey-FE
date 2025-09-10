import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import ApprovalHistoryTab from "components/ApprovalHistoryTab/ApprovalHistoryTab";
import TabName from "components/TabName/TabName";
import { TOPIC_TYPE } from "config/const";
import {
  APP_OVERVIEW,
  CONTRACT_TERMINATION_MASTER_ROUTE,
  CONTRACT_TERMINATION_ROUTE_ENUM,
} from "config/route-const";
import { addZStringToDate } from "core/helpers/date-time";
import { ConfirmModalType } from "core/helpers/enum";
import { getLastPath } from "core/helpers/path";
import { validateFieldsClearError } from "core/helpers/validator";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { HttpStatusCode } from "core/services/service-types";
import { saveAs } from "file-saver";
import type { History } from "history";
import { isEmpty, isEqual, isNil, size } from "lodash";
import {
  Breadcrumbs,
  ContractRequestType,
  ContractTerminationContextModel,
  ContractTerminationDetailModel,
  ContractTerminationModel,
  ContractTerminationStatus,
  ContractTerminationSubmitModel,
  ModelSelect,
  TYPE_PAGE,
} from "models/ContractTermination";
import { TemporaryImportAssetStatus } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { finalize, lastValueFrom, tap } from "rxjs";
import { contractTerminationRepository } from "../ContractTerminationRepository";
import useRepositoriesTabHook from "../useRepositoriesTabHook/useRepositoriesTabHook";
import { ContractTerminationFile } from "./Components/ContractTerminationFile/Components/ContractTerminationFile/ContractTerminationFile";

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

export const DEFAULT_MODAL_TYPE: ModalType = { type: "NONE", id: undefined };

export const DEFAULT_ERROR_MODAL_TYPE: ModalType = { type: "NONE", errors: [] };

export const ContractTerminationDetailHookContext =
  createContext<ContractTerminationContextModel>({
    model: new ContractTerminationModel(),
    history: null,
    loading: false,
    handleChangeSingleField: null,
    handleChangeSelectField: null,
    handleChangeDateField: null,
    breadcrumbs: [],
    handleSave: null,
    loadingButtonConfirm: false,
    handleUploadFileError: null,
    handleDownloadFileAttached: null,
    handleChangeAllField: null,
    setLoading: null,
    notifyToast: null,
    handleApplyButtonInConfirmModal: null,
    errorsModal: null,
    setErrorsModal: null,
    setTabKey: null,
    tabKey: "0",
    handleUploadAttachmentError: null,
    handleGetContractDetail: null,
    handleApprove: null,
    handleUploadFileToContract: null,
    handleDownloadFile: null,
    modelSelected: null,
    setModelSelected: null,
    returnContractTermination: null,
    rejectContractTermination: null,
  });

export function useContractTerminationDetailHook(typePage?: TYPE_PAGE) {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<ContractTerminationModel>(ContractTerminationModel);
  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeListField,
  } = fieldService.useField(model, dispatchModel);
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [loading, setLoading] = React.useState<boolean>(false);
  const history: History = useHistory();
  const { tabRepositories: baseRepositories } = useRepositoriesTabHook(
    isEqual(typePage, TYPE_PAGE.VIEW) ? [] : model?.errorTabs,
    isEqual(typePage, TYPE_PAGE.VIEW)
  );

  const [errorsModal, setErrorsModal] = useState<ModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const queryParams = new URLSearchParams(location.search);
  const tabKeyParams = queryParams.get("tabKey");
  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : "0"
  );
  const { id: idDetail } = useParams<{ id: string }>();
  useEffect(() => {
    if (!isEmpty(idDetail)) {
      initView(idDetail);
    }
  }, [idDetail]);

  const disabledButtonOpinion = useMemo(() => {
    const nonApprovalStates: number[] = [
      TemporaryImportAssetStatus.CANCEL,
      TemporaryImportAssetStatus.REJECT,
      TemporaryImportAssetStatus.APPROVE,
    ];

    return nonApprovalStates.includes(model?.status);
  }, [model?.status]);

  const breadcrumbsInit = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate("CM.menu_title_contract_liquidation"),
      path: CONTRACT_TERMINATION_MASTER_ROUTE,
    },
    {
      name: "",
    },
  ];

  const [breadcrumbs, setBreadcrumbs] =
    useState<Breadcrumbs[]>(breadcrumbsInit);

  const typeContract = model?.contactOrderInfo?.contract?.contractRequestType;
  useEffect(() => {
    if (isEqual(typePage, TYPE_PAGE.CREATE)) {
      if (isNil(typeContract)) {
        setBreadcrumbs((prevState) => {
          const newBreadcrumbs = [...prevState];
          newBreadcrumbs[size(prevState) - 1] = {
            name: translate("contractTermination.create_new_liquidation"),
          };
          return newBreadcrumbs;
        });
      } else {
        if (isEqual(typeContract, ContractRequestType.Contract)) {
          setBreadcrumbs((prevState) => {
            const newBreadcrumbs = [...prevState];
            newBreadcrumbs[size(prevState) - 1] = {
              name: translate(
                "contractTermination.create_new_contract_liquidation"
              ),
            };
            return newBreadcrumbs;
          });
        } else {
          setBreadcrumbs((prevState) => {
            const newBreadcrumbs = [...prevState];
            newBreadcrumbs[size(prevState) - 1] = {
              name: translate(
                "contractTermination.create_new_order_liquidation"
              ),
            };
            return newBreadcrumbs;
          });
        }
      }
    } else {
      if (isEqual(typeContract, ContractRequestType.Contract)) {
        setBreadcrumbs((prevState) => {
          const newBreadcrumbs = [...prevState];
          newBreadcrumbs[size(prevState) - 1] = {
            name:
              translate("contractTermination.contract_liquidation") +
              " " +
              model?.code,
          };
          return newBreadcrumbs;
        });
      } else {
        setBreadcrumbs((prevState) => {
          const newBreadcrumbs = [...prevState];
          newBreadcrumbs[size(prevState) - 1] = {
            name:
              translate("contractTermination.order_liquidation") +
              " " +
              model?.code,
          };
          return newBreadcrumbs;
        });
      }
    }
  }, [typeContract]);

  const handleGoMaster = useCallback(() => {
    history.push(CONTRACT_TERMINATION_MASTER_ROUTE);
  }, [history]);

  const handleSave = (isDraft: boolean, callbackFc: () => void) => {
    setLoading(true);
    const dataSubmit = getDataSubmit(isDraft, model);
    if (isEmpty(model?.idDetail) && !model?.id) {
      //create
      contractTerminationRepository
        .create({
          ...dataSubmit,
          isHardValidate: !!(typeof callbackFc === "function"),
        })
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
          error: (error: AxiosError) => {
            handleErrorSubmit(error, model);
          },
        });
    } else {
      contractTerminationRepository
        .update({
          ...dataSubmit,
          idDetail: model?.idDetail || model?.id,
          isHardValidate: !!(typeof callbackFc === "function"),
        })
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
          error: (error: AxiosError) => {
            handleErrorSubmit(error, model);
          },
        });
    }
  };

  const getDataSubmit = (
    isDraft: boolean,
    modelPass: ContractTerminationModel
  ): ContractTerminationSubmitModel => {
    const dataSubmit = {
      idDetail: isEmpty(modelPass?.idDetail) ? undefined : modelPass?.idDetail,
      isDraft: isDraft,
      description: modelPass?.description,
      contractId: modelPass?.contactOrderInfo?.contract?.id,
      effectiveDate: modelPass?.effectiveDate,
      supplierName: modelPass?.supplierName,
      supplierTaxCode: modelPass?.supplierTaxCode,
      supplierAddress: modelPass?.supplierAddress,
      isSupplierAuthorized: modelPass?.isSupplierAuthorized,
      supplierRepresentative: modelPass?.supplierRepresentative,
      supplierPosition: modelPass?.supplierPosition,
      supplierAuthorizationLetter: modelPass?.isSupplierAuthorized
        ? modelPass?.supplierAuthorizationLetter
        : undefined,
      supplierContact: modelPass?.supplierContact,
      supplierEmail: modelPass?.supplierEmail,
      supplierPhone: modelPass?.supplierPhone,
      taskContent: modelPass?.taskContent,
      generalTerms: modelPass?.generalTerms,
      warrantyTerms: modelPass?.warrantyTerms,
      attachments: modelPass?.attachments,
      files: modelPass?.contractFiles?.map((file: ContractTerminationFile) => {
        const { id, ...rest } = file;
        return rest;
      }),
    };

    return dataSubmit;
  };

  const handleErrorSubmit = (
    error: AxiosError<any>,
    newModel: ContractTerminationModel
  ) => {
    if (error.response && error.response.status === 400) {
      if (error.response?.data?.type === "Validate") {
        setErrorsModal({
          type: "SUBMIT_FAIL",
          errors: error?.response?.data?.tabErrors || [],
        });
        handleChangeAllField({
          ...newModel,
          errors: error.response?.data?.errors,
          errorTabs: error.response?.data?.tabs,
        });
      } else if (error.response?.data?.type === "Bad Request") {
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

  const handleUploadFileError = (error: AxiosError<any>) => {
    if (error.response?.status === 413) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    }
    if (error.response?.status === 400) {
      if (error?.response?.data?.message) {
        notifyToast({
          message: error?.response?.data?.message,
          type: "error",
        });
      } else {
        setErrorsModal({
          type: "IMPORT_FAIL",
          errors: error?.response?.data?.sheetErrors || [],
        });
      }
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
      error: (err: any) => {
        console.error("Error downloading the file:", err);
      },
    });
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

  const handleGetContractDetail = useCallback(
    async (id: string, modelPass: ContractTerminationModel) => {
      try {
        setLoading(true);
        const response = await lastValueFrom(
          contractTerminationRepository.getContractDetail(id)
        );
        const modelNews = {
          contactOrderInfo: {
            ...response.data,
            contract: {
              ...response.data?.contract,
              endDate: addZStringToDate(response.data?.contract?.endDate),
              effectiveDate: addZStringToDate(
                response.data?.contract?.effectiveDate
              ),
            },
          },
          supplierName: response.data?.supplierName,
          supplierTaxCode: response.data?.supplierTaxCode,
          supplierAddress: response.data?.supplierAddress,
          supplierRepresentative: response.data?.supplierRepresentative,
          supplierPosition: response.data?.supplierPosition,
          supplierEmail: response.data?.supplierEmail,
          supplierPhone: response.data?.supplierPhone,
          supplierContact: response.data?.supplierContact,
          isSupplierAuthorized: response.data?.isSupplierAuthorized,
          supplierAuthorizationLetter:
            response.data?.supplierAuthorizationLetter,
        };
        const errorsNews = validateFieldsClearError(modelNews);
        handleChangeAllField({
          ...modelPass,
          ...modelNews,
          errors: {
            ...modelPass.errors,
            ...errorsNews,
          },
        });
        // handle response
      } catch (error: any) {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [model]
  );

  const initView = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const isView = !isEqual(
          getLastPath(location.pathname, id),
          CONTRACT_TERMINATION_ROUTE_ENUM.CONTRACT_TERMINATION_VIEW
        );
        const result = await lastValueFrom(
          contractTerminationRepository.getDetail(id, isView)
        );
        const response: ContractTerminationDetailModel = result.data;
        if (isEqual(typePage, TYPE_PAGE.VIEW)) {
          handleChangeDetailView(response, TYPE_PAGE.VIEW);
        } else {
          handleChangeDetailView(response, TYPE_PAGE.EDIT);
        }
      } catch (error: any) {
        setLoading(false);
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [idDetail]
  );

  const approvalHistoryTab = useMemo(
    () =>
      idDetail
        ? [
            {
              tabKey: "2",
              tabTitle: <TabName text={translate("CM.txt_approval_history")} />,
              children: (
                <ApprovalHistoryTab
                  isNewLayoutVersion
                  topicId={idDetail}
                  topicType={TOPIC_TYPE.CONTRACT_LIQUIDATION}
                  disabledButtonOpinion={disabledButtonOpinion}
                  processAfterFeedbackSubmission={() =>
                    isEqual(
                      model?.status,
                      ContractTerminationStatus.WAITING_FOR_APPROVE
                    )
                      ? initView(idDetail)
                      : undefined
                  }
                  model={model}
                />
              ),
            },
          ]
        : [],
    [disabledButtonOpinion, idDetail, initView, model, translate]
  );

  const tabRepositories = useMemo(
    () => [...baseRepositories, ...approvalHistoryTab],
    [approvalHistoryTab, baseRepositories]
  );

  const handleChangeDetailView = (
    data: ContractTerminationDetailModel,
    typePage: number
  ) => {
    handleChangeAllField({
      ...model,
      isView: isEqual(TYPE_PAGE.VIEW, typePage),
      isEdit: isEqual(TYPE_PAGE.EDIT, typePage),
      typePage: typePage,
      contactOrderInfo: data,
      supplierName: data?.supplierName,
      supplierTaxCode: data?.supplierTaxCode,
      supplierAddress: data?.supplierAddress,
      supplierRepresentative: data?.supplierRepresentative,
      supplierPosition: data?.supplierPosition,
      supplierEmail: data?.supplierEmail,
      supplierPhone: data?.supplierPhone,
      supplierContact: data?.supplierContact,
      isSupplierAuthorized: data?.isSupplierAuthorized,
      taskContent: data?.taskContent,
      generalTerms: data?.generalTerms,
      warrantyTerms: data?.warrantyTerms,
      attachments: data?.attachments,
      files: data?.files,
      contractFiles: data?.files,
      idDetail: data?.id,
      id: data?.id,
      description: data?.description,
      effectiveDate: addZStringToDate(data?.effectiveDate),
      createdOrganization: data?.createdOrganization,
      position: data?.position,
      creator: data?.creator,
      code: data?.code,
      status: data?.status,
      supplierAuthorizationLetter: data?.supplierAuthorizationLetter,
      contract: {
        ...data?.contract,
        endDate: addZStringToDate(data?.contract?.endDate),
        effectiveDate: addZStringToDate(data?.contract?.effectiveDate),
      },
      legalEntity: data?.contract?.legalEntity,
      contractPaymentValue: data.contractPaymentValue,
      currency: data.currency,
      canDelete: data.canDelete,
      canReturn: data.canReturn,
      canDecline: data.canDecline,
      canCancel: data.canCancel,
      canEdit: data.canEdit,
      canApprove: data.canApprove,
      commands: data?.commands,
      signedForm: data?.signedForm,
      isOpinionValid: data?.isOpinionValid,
    });
    setLoading(false);
  };

  const handleUploadFileToContract = useCallback(
    (file: ContractTerminationFile) => {
      setLoading(true);
      contractTerminationRepository
        .uploadContractFile(model?.idDetail, file)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (response) => {
            if (response) {
              handleChangeSingleField({ fieldName: "files" })(response?.files);
              notifyToast();
            }
          },
          error: (error: AxiosError) => {
            if (error.response && error.response.status === 400) {
              setErrorsModal({
                type: "SUBMIT_FAIL",
                errors: error?.response?.data?.tabErrors || [],
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
    [model?.id, notifyToast]
  );

  const handleDownloadFile = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const [loadingButtonConfirm, setLoadingButtonConfirm] =
    React.useState<boolean>(false);

  const handleHideModal = () => {
    handleGoMaster();
    notifyToast();
    setModelSelected(null);
  };

  const handleUpdateError = (error: AxiosError) => {
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

  //Return req
  const returnContractTermination = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractTerminationRepository
      .returnContractTermination(id, reason)
      .pipe(
        tap(() => setLoadingButtonConfirm(true)),
        finalize(() => setLoadingButtonConfirm(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const rejectContractTermination = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractTerminationRepository
      .rejectContractTermination(id, reason)
      .pipe(
        tap(() => setLoadingButtonConfirm(true)),
        finalize(() => setLoadingButtonConfirm(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const cancelContractTermination = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractTerminationRepository
      .cancelContractTermination(id, reason)
      .pipe(
        tap(() => setLoadingButtonConfirm(true)),
        finalize(() => setLoadingButtonConfirm(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const deleteContractTermination = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractTerminationRepository
      .deleteContractTermination(id, reason)
      .pipe(
        tap(() => setLoadingButtonConfirm(true)),
        finalize(() => setLoadingButtonConfirm(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const handleApprove = (id: string) => {
    setLoading(true);
    contractTerminationRepository
      .approveContractTermination(id)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: ContractTerminationModel,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelContractTermination(model.id, reason);
        break;
      case ConfirmModalType.DELETE:
        deleteContractTermination(model.id, reason);
        break;
      case ConfirmModalType.RETURN:
        returnContractTermination(model.id, reason);
        break;
      case ConfirmModalType.REJECT:
        rejectContractTermination(model.id, reason);
        break;
    }
  };

  const valuesContext: ContractTerminationContextModel = {
    model,
    loading,
    history,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeListField,
    breadcrumbs,
    handleSave,
    handleUploadFileError,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    handleChangeAllField,
    setLoading,
    notifyToast,
    errorsModal,
    setErrorsModal,
    setTabKey,
    tabKey,
    handleGetContractDetail,
    handleApprove,
    handleUploadFileToContract,
    handleDownloadFile,
    modelSelected,
    setModelSelected,
    returnContractTermination,
    rejectContractTermination,
    loadingButtonConfirm,
    handleApplyButtonInConfirmModal,
  };

  return {
    ...valuesContext,
    // not context
    tabRepositories,
  };
}
