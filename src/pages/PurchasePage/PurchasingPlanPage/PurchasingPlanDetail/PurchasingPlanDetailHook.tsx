/* eslint-disable import/no-unresolved */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { listPurchasingPlanStatusEnum } from "config/const";
import {
  APP_OVERVIEW,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_DETAIL_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import appMessageService from "core/services/common-services/app-message-service";
import {
  convertDataToHaveIndexBeforeValidate,
  detailService,
} from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  HttpStatusCode,
  NETWORK_ERROR_MESSAGE,
} from "core/services/service-types";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import type { History } from "history";
import { get, isEmpty, isEqual, isUndefined } from "lodash";
import {
  AttachmentFileModel,
  EmailReceiverInformation,
  EmailRecipient,
  GoodsPrice,
  goodsPricesSubmitModel,
  IPurchaseRequest,
  ParamsApproveModel,
  PurchasePlanGoodsServicesModel,
  PurchasingPlan,
  PurchasingPlanModel,
  PurchasingPlanRequest,
  PurchasingPlanTypeModel,
  QuotationDetailIdType,
  SupplierModel,
  SupplierQuotationDetail,
} from "models/PurchasingPlan";
import {
  childText,
  ConfirmModalType,
  DEFAULT_ERROR_MODAL_TYPE,
  PURCHASING_PLAN_STATUS,
  PURCHASING_PLAN_STATUS_PROCESS,
  TYPE_OF_ATTACHMENTS,
  TYPE_PURCHASING_PLAN,
  TYPE_PURCHASING_PLAN_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { finalize, lastValueFrom, tap } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { budgetRepository } from "../../../BudgetPage/BudgetRepository";
import { DataForm } from "../PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { ModelSelect } from "../PurchasingPlanMaster/PurchasingPlanMasterHook";
import { purchasingPlanRepository } from "../PurchasingPlanRepository";
import useRepositoriesStepTabHookView from "../PurchasingPlanView/useRepositoriesStepTabHookView/useRepositoriesStepTabHookView";
import ApprovalHistoryTab from "./ApprovalHistoryTab/ApprovalHistoryTab";
import useRepositoriesStepTabHook from "./useRepositoriesStepTabHook/useRepositoriesStepTabHook";

export const PurchasingPlanDetailHookContext =
  createContext<PurchasingPlanModel>({
    model: new PurchasingPlanTypeModel(),
    purchaseRequest: null,
    dispatchModel: null,
    translate: null,
    breadcrumbs: [],
    tabRepositories: [],
    handleChangeSelectField: null,
    handleChangeSingleField: null,
    handleChangeDateField: null,
    handleChangeAllField: null,
    handleViewPurchaseProposal: null,
    handleViewOriginPurchaseProposal: null,
    path: null,
    notifyToast: null,
    errorsModal: DEFAULT_ERROR_MODAL_TYPE,
    setErrorsModal: null,
    handleSave: null,
    handleValidateCreate: null,
    loading: false,
    setLoading: null,
    isSubmit: false,
    setIsSubmit: null,
    handleUploadAttachmentError: null,
    handleDownloadFileAttached: null,
    mappingStatusToProcess: null,
    tabRepositoriesView: null,
    modelSelected: null,
    setModelSelected: null,
    handleApplyButtonInConfirmModal: null,
    handleChangeMultipleSelectField: null,
    handleApprovePurchasingPlan: null,
    handleApproveCancellationPurchasingPlan: null,
    selectSupplierAction: null,
    isDrawerSupplier: false,
    isDrawerQuote: false,
    handleClickDrawerSupplier: null,
    handleClickDrawerQuote: null,
    setIsDrawerSupplier: null,
    setIsDrawerQuote: null,
    quoteAgainAction: null,
    handleOpenSupplierDrawerByRecord: null,
    isOpenModalQuoteAgain: false,
    setIsOpenModalQuoteAgain: null,
    handleSubmitApproval: null,
    tabKey: "0",
    setTabKey: null,
    handleValidateSendApproval: null,
    loadingConfirm: false,
  });

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";

export function usePurchasingPlanDetailHook(planIsView?: boolean) {
  const location = useLocation();
  const { id: idDetail } = useParams<{ id: string }>();

  const purchaseRequest = location.state as IPurchaseRequest;

  const queryParams = new URLSearchParams(location.search);

  const tabKeyParams = queryParams.get("tabKey");
  const isViewWaitingApprove =
    queryParams.get("isViewWaitingApprove") === "true";
  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : "0"
  );

  const opinionType = queryParams.get(OPINION_TYPE_PARAM);
  const opinionId = queryParams.get(OPINION_ID_PARAM);

  const [translate] = useTranslation();
  const history: History = useHistory();
  const [errorsModal, setErrorsModal] = useState<ModalTypeError>(
    DEFAULT_ERROR_MODAL_TYPE
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isDrawerSupplier, setIsDrawerSupplier] = useState<boolean>(false);
  const [isDrawerQuote, setIsDrawerQuote] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [currentPurchasePlanId, setCurrentPurchasePlanId] = useState<
    string | undefined
  >(undefined);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isOpenModalQuoteAgain, setIsOpenModalQuoteAgain] =
    useState<boolean>(false);

  const handleClickDrawerSupplier = (status?: boolean) => {
    setIsDrawerSupplier(() => {
      const newStatus = status ?? false; // Nếu không truyền `status`, mặc định là `false`
      if (newStatus) {
        setIsDrawerQuote(false);
      }
      return newStatus;
    });
  };

  const handleOpenSupplierDrawerByRecord = (record: SupplierModel) => {
    handleChangeSingleField({ fieldName: "supplierDrawerDetail" })(record);
    if (isDrawerQuote) {
      setIsDrawerQuote(false);
    }
    setIsDrawerSupplier(true);
  };

  const { model, dispatch: dispatchModel } =
    detailService.useModel<PurchasingPlanTypeModel>(PurchasingPlanTypeModel);

  const title = useMemo(
    () =>
      isEmpty(model?.idDetail)
        ? translate("PL.purchasing_plan_title_create")
        : `${translate("PL.purchase_plan")} ${model?.code}`,
    [model?.code, model?.idDetail, translate]
  );

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate("CM.menu_title_purchasing_plan"),
      path: PURCHASING_PLAN_MASTER_ROUTE,
    },
    {
      name: title,
    },
  ];

  const shouldShowApprovalHistoryTab = useMemo(
    () => !isUndefined(idDetail),
    [idDetail]
  );

  let step: number;
  if (
    isEqual(model?.status, PURCHASING_PLAN_STATUS.WAITING_CANCEL) ||
    isEqual(model?.status, PURCHASING_PLAN_STATUS.CANCELLED) ||
    isEqual(model?.status, PURCHASING_PLAN_STATUS.DECLINED)
  ) {
    step = model?.preCancelStatus;
  } else {
    step = model?.status;
  }

  const handleViewOriginPurchaseProposal = React.useCallback(() => {
    window.open(
      `${PROPOSAL_DETAIL_ROUTE}/${model.purchaseProposalId?.originalPurchaseProposalId}`,
      "_blank"
    );
  }, [model.purchaseProposalId?.originalPurchaseProposalId]);

  const handleViewPurchaseProposal = React.useCallback(() => {
    window.open(
      `${PURCHASE_REQUEST_VIEW_ROUTE}/${model.purchaseProposalId?.id}`,
      "_blank"
    );
  }, [model.purchaseProposalId?.id]);

  const handleChangeGoodsServices = async (purchaseProposalId: string) => {
    const data = await lastValueFrom(
      purchasingPlanRepository.getGoodServiceGroup({
        id: purchaseProposalId,
        purchasePlanId: idDetail,
        pageIndex: 1,
        pageSize: 99999999,
        purchasePlanType: TYPE_PURCHASING_PLAN.DIRECT_CONTACTING,
      })
    );
    return flattenPurchaseItems(data?.data?.items);
  };

  const flattenPurchaseItems = (
    data: PurchasePlanGoodsServicesModel[]
  ): PurchasePlanGoodsServicesModel[] => {
    return data?.reduce((acc, item) => {
      if (item?.childrens) {
        return [...acc, ...(item?.childrens ?? [])];
      }
      return [...acc, item];
    }, [] as PurchasePlanGoodsServicesModel[]);
  };

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (
      isEqual(error?.response?.status, HttpStatusCode?.PAYLOAD_TOO_LARGE) ||
      isEqual(error?.message, NETWORK_ERROR_MESSAGE)
    ) {
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

  const handleGetQuotationSupplierInformation = async () => {
    try {
      const quotationSuppliers = await lastValueFrom(
        purchasingPlanRepository.getSupplierByPurchasePlanId(idDetail)
      );
      if (isEmpty(quotationSuppliers)) {
        return {};
      }
      const approvedSupplier = quotationSuppliers.find(
        (supplier) => supplier.isApproval
      );

      const selectedSupplier = approvedSupplier
        ? { ...approvedSupplier, id: approvedSupplier.supplierId }
        : {
            ...quotationSuppliers[numberConstants.ZERO],
            id: quotationSuppliers[numberConstants.ZERO].supplierId,
          };

      const quotationBiddingRounds = selectedSupplier.quotationRounds || [];

      const approvedBiddingRound = quotationBiddingRounds.find(
        (round) => round.isApproval
      );

      const selectedBiddingRound = approvedBiddingRound
        ? {
            ...approvedBiddingRound,
            id: approvedBiddingRound.quotationRoundId,
            name: approvedBiddingRound.quotationRoundName,
          }
        : !isEmpty(quotationBiddingRounds)
        ? {
            ...quotationBiddingRounds[numberConstants.ZERO],
            id: quotationBiddingRounds[numberConstants.ZERO].quotationRoundId,
            name: quotationBiddingRounds[numberConstants.ZERO]
              .quotationRoundName,
          }
        : null;
      return {
        quotationSupplier: quotationSuppliers,
        biddingSupplier: selectedSupplier,
        quotationBiddingRounds: quotationBiddingRounds,
        currentBiddingRound: selectedBiddingRound,
        biddingExchangeRate: selectedBiddingRound?.quotations?.exchangeRate,
        goodPrices: selectedBiddingRound?.quotations?.goodsPrices,
      };
    } catch (error: any) {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(model, dispatchModel);

  const handleClickDrawerQuote = async (
    quotationId?: QuotationDetailIdType["quotationId"],
    status?: boolean
  ) => {
    setIsDrawerQuote(() => {
      const newStatus = status ?? false;
      if (newStatus) {
        setIsDrawerSupplier(false);

        if (quotationId !== currentPurchasePlanId) {
          fetchingDataQuotation({
            purchasePlanId: model?.id,
            quotationId: quotationId,
          });
          setCurrentPurchasePlanId(quotationId);
        }
      }
      return newStatus;
    });
  };

  useEffect(() => {
    if (!isEmpty(purchaseRequest) && isEmpty(idDetail)) {
      const data = purchaseRequest?.purchaseRequest;
      handleInitPurchasePlan(data).then((res) => {
        const { purchaseProposal, purchaseItems } = res;
        const listPurchaseItems = purchaseItems.map((item, index) => {
          return {
            ...item,
            id: `${uuidv4()}${childText}`,
          };
        });
        const purchaseProposalId = purchaseProposal[0];
        handleChangeAllField({
          ...model,
          note: data?.name,
          name: data?.name,
          estimatedDelivery: isEmpty(data?.estimatedDelivery)
            ? undefined
            : data?.estimatedDelivery,
          reason: isEmpty(data?.reason) ? undefined : data?.reason,
          purchaseProposalId: isEmpty(purchaseProposalId)
            ? undefined
            : purchaseProposalId,
          listSupplier: data?.supplier ? [data?.supplier] : [],
          purchaseItems: listPurchaseItems,
        });
      });
    }
  }, [purchaseRequest]);

  useEffect(() => {
    handleInitialPlan();
  }, [model.isLoadDataDetail, idDetail]);

  const handleInitialPlan = useCallback(() => {
    if (!isEmpty(idDetail)) {
      setLoading(true);
      purchasingPlanRepository
        ?.getPlanDetail(idDetail, planIsView, isViewWaitingApprove)
        .subscribe({
          next: (data) => {
            const dataPassToDetail = {
              ...data,
              preCancelStatus: data?.preCancelStatus,
              isView: true,
              idDetail: idDetail,
              code: data?.code,
              status: data?.status,
              id: data?.id,
              purchasePlanType: TYPE_PURCHASING_PLAN_OPTIONS.find(
                (option) => option?.id === data?.purchasePlanType
              ),
              startDate: dayjs(data?.startDate),
              endDate: dayjs(data?.endDate),
              purchaseItems: data?.goodsItems.map((item, index) => {
                return {
                  ...item,
                  remainingRequestQuantity: item?.quantity,
                  branchId: item?.branch?.id || "",
                  originalQuantity: item?.originalTotalAmount || 0,
                  registeredQuantity: item?.registeredQuantity || 0,
                  manufacturer: item?.branch,
                  purchaseItemId: item?.id,
                  id: `${uuidv4()}${childText}`,
                };
              }),
              attachments: (data?.attachments as AttachmentFileModel[])?.filter(
                (item: AttachmentFileModel) =>
                  item?.purchasePlanAttachmentType ===
                  TYPE_OF_ATTACHMENTS?.ATTACHMENT
              ),
              supplierAttachments: (
                data?.attachments as AttachmentFileModel[]
              )?.filter(
                (item: AttachmentFileModel) =>
                  item?.purchasePlanAttachmentType ===
                  TYPE_OF_ATTACHMENTS?.SUPPLIER_ATTACHMENT
              ),
              userPosition: data?.userPosition,
              userDepartment: data?.userDepartment,
              purchaseProposalId: {
                ...data?.originalPurchaseRequest,
                createdDate: dayjs(data?.originalPurchaseRequest?.createdDate),
                purchaseProposalCode:
                  data?.originalPurchaseRequest?.purchaseProposalCode,
                purchaseProposalName:
                  data?.originalPurchaseRequest?.purchaseProposalName,
                createUserName: data?.originalPurchaseRequest?.createUserName,
                createUser: data?.originalPurchaseRequest?.createUser,
                name: data?.originalPurchaseRequest?.name,
                code: data?.originalPurchaseRequest?.code,
                id: data?.originalPurchaseRequest?.id,
                originalPurchaseProposalId:
                  data?.originalPurchaseRequest?.originalPurchaseProposalId,
                currency: data?.originalPurchaseRequest?.currency,
                businessDepartment:
                  data?.originalPurchaseRequest?.businessDepartment,
                position: data?.originalPurchaseRequest?.position,
              },
              listSupplier: data?.supplierPurchasePlans?.map((item) => {
                return {
                  ...item,
                  id: item?.supplierId,
                  emailRecipients: item?.emailRecipients?.map(
                    (emailRecipient: EmailRecipient) => {
                      return {
                        email: emailRecipient?.email,
                        name: emailRecipient?.name,
                        id: uuidv4(),
                      };
                    }
                  ),
                };
              }),
            };

            handleGetQuotationSupplierInformation()
              .then((data) => {
                const {
                  quotationSupplier,
                  biddingSupplier,
                  quotationBiddingRounds,
                  currentBiddingRound,
                  biddingExchangeRate,
                  goodPrices,
                } = data;
                handleChangeAllField({
                  ...model,
                  ...dataPassToDetail,
                  quotationSupplier,
                  biddingSupplier,
                  quotationBiddingRounds,
                  currentBiddingRound,
                  biddingExchangeRate,
                  goodPrices,
                  errorTabs: [],
                });
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
                handleChangeAllField({
                  ...model,
                  ...dataPassToDetail,
                  errorTabs: [],
                });
              });
          },
          error: () => {
            setLoading(false);
            history.replace(PURCHASING_PLAN_DETAIL_ROUTE);
          },
        });
    }
  }, [
    handleChangeAllField,
    handleGetQuotationSupplierInformation,
    history,
    idDetail,
    isViewWaitingApprove,
    model,
    planIsView,
  ]);

  const processAfterFeedbackSubmission = useCallback(() => {
    if (
      isEqual(
        model?.status,
        get(listPurchasingPlanStatusEnum, `[${numberConstants.ONE}].id`)
      )
    ) {
      handleInitialPlan();
    }
  }, [handleInitialPlan, model?.status]);

  const approvalHistoryTab = useMemo(
    () => [
      {
        tabKey: "2",
        tabTitle: (
          <TabName
            text={translate("CM.txt_approval_history")}
            isShowIconError={model.errorTabs?.includes(2)}
          />
        ),
        children: (
          <ApprovalHistoryTab
            topicId={idDetail}
            opinionType={opinionType}
            opinionId={opinionId}
            status={model?.status}
            processAfterFeedbackSubmission={processAfterFeedbackSubmission}
            model={model}
          />
        ),
      },
    ],
    [
      idDetail,
      model.errorTabs,
      model?.status,
      opinionId,
      opinionType,
      processAfterFeedbackSubmission,
      translate,
    ]
  );

  const { tabRepositories: baseRepository } = useRepositoriesStepTabHook(
    model?.errorTabs,
    idDetail,
    step
  );

  const tabRepositories = useMemo(
    () =>
      baseRepository
        ? [
            ...baseRepository,
            ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
          ]
        : baseRepository,
    [baseRepository, shouldShowApprovalHistoryTab, approvalHistoryTab]
  );

  const pathname = history.location.pathname;

  const { tabRepositoriesView: baseRepositoryView } =
    useRepositoriesStepTabHookView(idDetail, step, pathname);

  const tabRepositoriesView = useMemo(
    () =>
      baseRepositoryView
        ? [...baseRepositoryView, ...approvalHistoryTab]
        : baseRepositoryView,
    [baseRepositoryView, approvalHistoryTab]
  );

  useEffect(() => {
    if (isEmpty(idDetail)) {
      handleChangeGoodsServices(model?.purchaseProposalId?.id).then((res) => {
        const listPurchaseItems = res?.map((item, index) => {
          return {
            ...item,
            purchaseItemId: item?.id,
            id: `${uuidv4()}${childText}`,
          };
        });
        handleChangeAllField({
          ...model,
          purchaseItems: listPurchaseItems,
        });
      });
    } else {
      if (model?.isSelectPurchaseProposalId) {
        handleChangeGoodsServices(model?.purchaseProposalId?.id).then((res) => {
          const listPurchaseItems = res?.map((item, index) => {
            return {
              ...item,
              purchaseItemId: item?.id,
              id: `${uuidv4()}${childText}`,
            };
          });
          handleChangeAllField({
            ...model,
            purchaseItems: listPurchaseItems,
          });
        });
      }
    }
  }, [model.purchaseProposalId, model?.status]);

  const handleInitPurchasePlan = useCallback(
    async (data: PurchasingPlan) => {
      if (isEmpty(data?.code)) {
        return { purchaseProposal: [], purchaseItems: [] };
      }
      const purchaseItems = await handleChangeGoodsServices(data?.id);
      const listPurchaseItems = purchaseItems.map((item, index) => {
        return {
          ...item,
          id: `${uuidv4()}${childText}`,
        };
      });
      const res = await lastValueFrom(
        purchasingPlanRepository.getProposalPurchase({
          search: data?.code,
          pageIndex: 1,
          pageSize: 10,
          purchasePlanId: isEmpty(idDetail) ? undefined : idDetail,
        })
      );
      return {
        purchaseProposal: res?.data?.items,
        purchaseItems: listPurchaseItems,
      };
    },
    [purchaseRequest]
  );

  const handleGoMaster = React.useCallback(() => {
    history.push(PURCHASING_PLAN_MASTER_ROUTE);
  }, [history]);

  const getGoodsItems = useCallback(
    (purchaseItems: PurchasePlanGoodsServicesModel[]) => {
      return purchaseItems?.map((item) => {
        return {
          goodsId: item?.goodsId,
          code: item?.code,
          name: item?.name,
          unitId: item?.unitId,
          manufacturerId: item?.manufacturer?.id,
          quantity: item?.remainingRequestQuantity,
          description: item?.description,
          note: item?.note,
          unit: item?.unit,
          purchaseItemId: item?.purchaseItemId,
        };
      });
    },
    [model.purchaseItems]
  );

  const getDataSubmit = useCallback(
    (isDraft: boolean) => {
      const goodsItems = getGoodsItems(model.purchaseItems);
      const dataForm = {
        id: idDetail,
        isDraft: isDraft,
        supplierPurchasePlans: model.listSupplier?.map(
          (supplier: SupplierModel) => {
            return {
              supplierId: supplier?.id ? supplier.id : supplier?.supplierId,
              name: supplier?.name,
              taxCode: supplier?.taxCode,
              address: supplier?.address,
              quoteEmail: supplier?.quoteEmail,
              quoteName: supplier?.quoteName,
              phoneNumber: supplier?.phoneNumber,
              emailRecipients: supplier?.emailRecipients?.map(
                (item: EmailReceiverInformation) => {
                  return {
                    email: item?.email,
                    name: item?.name,
                  };
                }
              ),
              supplierContacts: supplier?.supplierContacts,
            };
          }
        ),
        supplierAttachments: model?.supplierAttachments,
        attachments: model?.attachments,
        goodsItems: goodsItems,
        name: model?.name,
        purchasePlanType: model?.purchasePlanType?.id,
        note: model?.note,
        estimatedDelivery: model?.estimatedDelivery,
        reason: model?.reason,
        startDate:
          !isEmpty(model?.startDate) && dayjs(model?.startDate).isValid()
            ? dayjs(model?.startDate).format()
            : undefined,
        endDate:
          !isEmpty(model?.endDate) && dayjs(model?.endDate).isValid()
            ? dayjs(model?.endDate).format()
            : undefined,
        originalPurchaseRequestId: model?.purchaseProposalId?.id,
      };
      return dataForm;
    },
    [model]
  );

  const handleValidateCreate = (isDraft: boolean) => {
    const dataSubmit = getDataSubmit(isDraft);
    setLoading(true);
    handleSubmitFormValidate(dataSubmit);
  };

  const handleValidateError = (
    error: AxiosError,
    newModel: PurchasingPlanTypeModel
  ) => {
    if (error.response && error.response.status === 400) {
      if (
        error?.response?.data?.tabErrors?.length > 0 ||
        error.response?.data?.tabs > 0
      ) {
        setErrorsModal({
          type: "SUBMIT_FAIL",
          errors: error?.response?.data?.tabErrors || [],
        });
      }

      if (error.response?.data?.type === "Validate") {
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

  const handleSubmitFormValidate = useCallback(
    (body: PurchasingPlanRequest) => {
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);

      purchasingPlanRepository
        .createValidatePurchasingPlanRequest(body)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            setIsSubmit(true);
          },
          error: (error: AxiosError) => {
            handleValidateError(error, newModel);
          },
        });
    },
    [model, translate]
  );

  const handleSave = (isDraft: boolean) => {
    const dataSubmit = getDataSubmit(isDraft);
    handleSubmitForm(dataSubmit);
    setIsSubmit(false);
  };

  const handleSubmitForm = useCallback(
    (body: PurchasingPlanRequest) => {
      setLoading(true);

      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      if (isEmpty(idDetail)) {
        purchasingPlanRepository
          .createPurchasingPlanRequest(body)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: (res) => {
              if (body.isDraft) {
                notifyToast();
                handleGoMaster();
              } else {
                history.push(`${PURCHASING_PLAN_DETAIL_ROUTE}/${res?.id}`);
              }
            },
            error: (error: AxiosError) => {
              handleValidateError(error, newModel);
            },
          });
      } else {
        purchasingPlanRepository
          .updatePurchasingPlanRequest(body)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: () => {
              if (body.isDraft) {
                notifyToast();
                handleGoMaster();
              } else {
                handleInitialPlan();
              }
            },
            error: (error: any) => {
              handleValidateError(error, newModel);
            },
          });
      }
    },
    [model, translate]
  );

  const mappingStatusToProcess = useCallback(
    (status: number) => {
      switch (status) {
        case PURCHASING_PLAN_STATUS.DRAFT:
          return PURCHASING_PLAN_STATUS_PROCESS.DRAFT;
        case PURCHASING_PLAN_STATUS.WAITING_QUOTATION:
        case PURCHASING_PLAN_STATUS.QUOTED:
          return PURCHASING_PLAN_STATUS_PROCESS.QUOTING;
        case PURCHASING_PLAN_STATUS.SELECT_SUPPLIER:
        case PURCHASING_PLAN_STATUS.SELECTED_SUPPLIER:
          return PURCHASING_PLAN_STATUS_PROCESS.SELECT_SUPPLIER;
        case PURCHASING_PLAN_STATUS.WAITING_FOR_APPROVAL:
        case PURCHASING_PLAN_STATUS.WAITING_CANCEL:
          return PURCHASING_PLAN_STATUS_PROCESS.AWAITING_APPROVAL;
        case PURCHASING_PLAN_STATUS.APPROVED:
        case PURCHASING_PLAN_STATUS.CANCELLED:
        case PURCHASING_PLAN_STATUS.DECLINED:
          return PURCHASING_PLAN_STATUS_PROCESS.APPROVED;
        default:
          return PURCHASING_PLAN_STATUS_PROCESS.DRAFT;
      }
    },
    [model?.status]
  );

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const cancelPurchasingPlan = (id: string, data: DataForm) => {
    setLoadingConfirm(true);
    purchasingPlanRepository
      .cancelPurchasingPlan(id, data)
      .pipe(finalize(() => setLoadingConfirm(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  // Delete single budget
  const deletePurchasingPlan = (id: string, data: DataForm) => {
    setLoadingConfirm(true);
    purchasingPlanRepository
      .deletePurchasingPlan(id, data)
      .pipe(finalize(() => setLoadingConfirm(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  const handleHideModal = () => {
    handleGoMaster();
    notifyToast();
    setModelSelected(null);
  };

  const handleError = (error: AxiosError) => {
    setLoading(false);
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors,
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    } else {
      notifyToast({
        type: "error",
        message: error?.response?.data?.message,
      });
    }
  };

  const handleOpenModalSendApprove = () => {
    setModelSelected({
      type: ConfirmModalType.SEND_APPROVE,
      model: {
        id: model.id,
        code: model.code,
        name: model.name,
      },
    });
  };

  const handleValidateSendApproval = () => {
    setLoading(true);
    const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
    const body: ParamsApproveModel = getDataSubmitApproval(model);
    purchasingPlanRepository
      .validateSendApproval(body)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleOpenModalSendApprove();
        },
        error: (error: AxiosError) => {
          handleValidateError(error, newModel);
        },
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: PurchasingPlan,
    data: DataForm,
    handleOpenModalSignProcess: () => void
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.DELETE:
        setLoading(true);
        deletePurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.CANCEL:
        setLoading(true);
        cancelPurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.RETURN:
        setLoading(true);
        handleReturnPurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.REJECT:
        setLoading(true);
        handleRejectPurchasingPlan(model.id, data);
        break;
      case ConfirmModalType.SEND_APPROVE:
        handleSubmitApproval(true, handleOpenModalSignProcess);
        break;
      default:
        break;
    }
  };

  const handleApprovePurchasingPlan = (id: string) => {
    setLoading(true);
    purchasingPlanRepository
      .approvePurchasingPlan(id)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: handleError,
      });
  };

  const handleApproveCancellationPurchasingPlan = (id: string) => {
    setLoading(true);
    purchasingPlanRepository.approveCancellationPurchasingPlan(id).subscribe({
      next: () => {
        notifyToast();
        handleGoMaster();
        setLoading(false);
      },
      error: handleError,
    });
  };

  const handleReturnPurchasingPlan = (id: string, data: DataForm) => {
    purchasingPlanRepository
      .returnPurchasingPlan(id, data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  const handleRejectPurchasingPlan = (id: string, data: DataForm) => {
    purchasingPlanRepository
      .rejectPurchasingPlan(id, data)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: handleHideModal,
        error: handleError,
      });
  };

  const selectSupplierAction = async (model: PurchasingPlanTypeModel) => {
    setLoading(true);
    try {
      await lastValueFrom(
        purchasingPlanRepository.updateStatusPlan({
          status: PURCHASING_PLAN_STATUS.SELECT_SUPPLIER,
          id: model?.id,
        })
      );
      handleInitialPlan();
      setLoading(false);
      notifyToast();
    } catch (error) {
      handleError(error as AxiosError);
      setLoading(false);
    }
  };

  const quoteAgainAction = async (model: PurchasingPlanTypeModel) => {
    setLoading(true);
    try {
      await lastValueFrom(
        purchasingPlanRepository.updateStatusPlan({
          status: PURCHASING_PLAN_STATUS.QUOTED,
          id: model?.id,
        })
      );
      setIsOpenModalQuoteAgain(false);
      handleInitialPlan();
      history.push(`${PURCHASING_PLAN_DETAIL_ROUTE}/${idDetail}?tabKey=1`);
      setTabKey("1");
      setLoading(false);
      notifyToast();
    } catch (error) {
      handleError(error as AxiosError);
      setLoading(false);
      setIsOpenModalQuoteAgain(false);
    }
  };

  const handleSubmitApproval = useCallback(
    (isDraft: boolean, callbackFc: () => void) => {
      setLoading(true);
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      const body: ParamsApproveModel = getDataSubmitApproval(model);
      purchasingPlanRepository
        .submitApproval({
          ...body,
          isDraft: isDraft,
          isHardValidate: !!(typeof callbackFc === "function"),
        })
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (res) => {
            notifyToast();
            handleChangeAllField({
              ...newModel,
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
            handleValidateError(error, newModel);
          },
        });
    },
    [
      handleChangeAllField,
      handleGoMaster,
      handleValidateError,
      model,
      notifyToast,
    ]
  );

  const getDataSubmitApproval = (model: PurchasingPlanTypeModel) => {
    const goodPricesSubmit = model?.goodPrices?.map((item: GoodsPrice) => {
      const itemSubmit: goodsPricesSubmitModel = {
        id: item?.id,
        supplyQuantityUser: item?.supplyQuantityUser,
        taxAmountQuotation: item?.taxAmountQuotation,
        taxId: item?.taxId,
        price: item?.price,
        otherCost: item?.otherCost,
        goodsItemId: item?.goodsItemId,
        description: item?.description,
      };
      return itemSubmit;
    });

    return {
      goodsPrices: goodPricesSubmit,
      quotationRoundId: model?.currentBiddingRound?.quotationRoundId,
      quotationId: model?.currentBiddingRound?.quotations?.quotationId,
      currencyId: model?.currentBiddingRound?.quotations?.currency?.id,
      exchangeRate: model?.biddingExchangeRate,
      purchasePlanId: model?.idDetail,
      supplierPurchasePlanId: model?.biddingSupplier?.id,
    };
  };

  const fetchingDataQuotation = ({
    purchasePlanId,
    quotationId,
  }: QuotationDetailIdType) => {
    purchasingPlanRepository
      .getSupplierQuotation({
        purchasePlanId,
        quotationId,
      })
      .pipe()
      .subscribe({
        next: (response: SupplierQuotationDetail) => {
          handleChangeAllField({
            ...model,
            drawerQuotationDetail: response,
          });
        },
      });
  };

  const valuesContext: PurchasingPlanModel = {
    model,
    purchaseRequest,
    title,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
    handleViewPurchaseProposal,
    handleViewOriginPurchaseProposal,
    dispatchModel,
    tabRepositories,
    breadcrumbs,
    translate,
    path: pathname,
    notifyToast,
    handleSave,
    errorsModal,
    setErrorsModal,
    handleValidateCreate,
    loading,
    setLoading,
    isSubmit,
    setIsSubmit,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    mappingStatusToProcess,
    tabRepositoriesView,
    handleApplyButtonInConfirmModal,
    modelSelected,
    setModelSelected,
    handleChangeMultipleSelectField,
    handleApprovePurchasingPlan,
    handleApproveCancellationPurchasingPlan,
    selectSupplierAction,
    isDrawerSupplier,
    isDrawerQuote,
    handleClickDrawerSupplier,
    handleClickDrawerQuote,
    setIsDrawerSupplier,
    setIsDrawerQuote,
    quoteAgainAction,
    handleOpenSupplierDrawerByRecord,
    isOpenModalQuoteAgain,
    setIsOpenModalQuoteAgain,
    handleSubmitApproval,
    tabKey,
    setTabKey,
    handleValidateSendApproval,
    loadingConfirm,
  };

  return {
    ...valuesContext,
  };
}
