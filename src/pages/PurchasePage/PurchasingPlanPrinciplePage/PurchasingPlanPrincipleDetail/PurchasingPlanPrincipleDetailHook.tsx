/* eslint-disable import/no-unresolved */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  APP_OVERVIEW,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_DETAIL_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
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
import { isEmpty, isEqual, isUndefined } from "lodash";
import {
  childText,
  ConfirmModalType,
  DEFAULT_ERROR_MODAL_TYPE,
  PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS,
  PURCHASING_PLAN_STATUS,
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
import { budgetRepository } from "../../../BudgetPage/BudgetRepository";
import ApprovalHistoryTab from "./ApprovalHistoryTab/ApprovalHistoryTab";
import useRepositoriesStepTabHook from "./useRepositoriesStepTabHook/useRepositoriesStepTabHook";

import { ModalTypeError } from "core/models/Common/ErrorModal";
import {
  AttachmentFileModel,
  BodyApprovePrincipleSupplier,
  EmailRecipient,
  GoodsPrice,
  IPurchaseRequest,
  PurchasePlanGoodsServicesModel,
  PurchasePlanTypeRouter,
  PurchasingPlan,
  PurchasingPlanModel,
  PurchasingPlanRequest,
  PurchasingPlanTypeModel,
  QuotationDetailIdType,
  SupplierModel,
  SupplierQuotationDetail,
} from "models/PurchasingPlan";
import { DataForm } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { v4 as uuidv4 } from "uuid";
import useRepositoriesStepTabHookView from "../PurchasingPlanPrincipleView/useRepositoriesStepTabHookView/useRepositoriesStepTabHookView";

export const PurchasingPlanPrincipleDetailHookContext =
  createContext<PurchasingPlanModel>({
    model: new PurchasingPlanTypeModel(),
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
    titlePageHeader: "",
    getPurchasePlanTypeByRouter: null,
    selectedDetailSupplier: null,
    selectedDetailSupplierId: null,
    setSelectedDetailSupplierId: null,
    purchaseRequest: null,
    loadingConfirm: false,
    getDataSubmit: null,
  });

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";

export function usePurchasingPlanPrincipleDetailHook(planIsView?: boolean) {
  const location = useLocation();
  const { id: idDetail } = useParams<{ id: string }>();
  const purchaseRequest = location.state as IPurchaseRequest;

  const queryParams = new URLSearchParams(location.search);
  const isViewWaitingApprove =
    queryParams.get("isViewWaitingApprove") === "true";

  const tabKeyParams = queryParams.get("tabKey");
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
  const [loadingConfirm, setLoadingConfirm] = React.useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isDrawerSupplier, setIsDrawerSupplier] = useState<boolean>(false);
  const [isDrawerQuote, setIsDrawerQuote] = useState<boolean>(false);
  const [currentPurchasePlanId, setCurrentPurchasePlanId] = useState<
    string | undefined
  >(undefined);
  const [step, setStep] = useState<number>(0);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isOpenModalQuoteAgain, setIsOpenModalQuoteAgain] =
    useState<boolean>(false);

  const [selectedDetailSupplierId, setSelectedDetailSupplierId] = useState("");

  const mappingStatusToProcess = useCallback((status: number) => {
    const statusMap = new Map([
      [
        PURCHASING_PLAN_STATUS.DRAFT,
        PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.DRAFT,
      ],
      [
        PURCHASING_PLAN_STATUS.SELECT_SUPPLIER,
        PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.SELECT_SUPPLIER,
      ],
      [
        PURCHASING_PLAN_STATUS.SELECTED_SUPPLIER,
        PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.SELECTED_SUPPLIER,
      ],
      [
        PURCHASING_PLAN_STATUS.APPROVED,
        PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.SELECTED_SUPPLIER,
      ],
    ]);

    if (statusMap.has(status)) {
      return statusMap.get(status);
    }
    return PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS.DRAFT;
  }, []);

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

  const titlePageHeader = useMemo(() => {
    return isEmpty(model?.id)
      ? translate("PL.purchasing_plan_title_create")
      : `${translate("PL.purchase_plan")} ${model?.code}`;
  }, [model?.code, model?.id, translate]);

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
      name: titlePageHeader,
    },
  ];

  const shouldShowApprovalHistoryTab = useMemo(
    () => !isUndefined(idDetail),
    [idDetail]
  );

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
            status={mappingStatusToProcess(step)}
            model={model}
          />
        ),
      },
    ],
    [
      idDetail,
      mappingStatusToProcess,
      model,
      opinionId,
      opinionType,
      step,
      translate,
    ]
  );

  const { tabRepositories: baseRepository } = useRepositoriesStepTabHook(
    model?.errorTabs,
    idDetail,
    step
  );

  const tabRepositories = useMemo(() => {
    return baseRepository
      ? [
          ...baseRepository,
          ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
        ]
      : baseRepository;
  }, [baseRepository, shouldShowApprovalHistoryTab, approvalHistoryTab]);

  const pathname = history.location.pathname;

  const { tabRepositoriesView: baseRepositoryView } =
    useRepositoriesStepTabHookView(idDetail, step, pathname);

  const tabRepositoriesView = useMemo(() => {
    return baseRepositoryView
      ? [
          ...baseRepositoryView,
          ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
        ]
      : baseRepository;
  }, [
    shouldShowApprovalHistoryTab,
    baseRepositoryView,
    approvalHistoryTab,
    baseRepository,
  ]);

  const selectedDetailSupplier = model?.supplierPrincipleContracts?.find(
    (item: SupplierModel) => item?.id === selectedDetailSupplierId
  );

  const handleViewOriginPurchaseProposal = useCallback(() => {
    window.open(
      `${PROPOSAL_DETAIL_ROUTE}/${model.purchaseProposalId?.originalPurchaseProposalId}`,
      "_blank"
    );
  }, [model.purchaseProposalId?.originalPurchaseProposalId]);

  const handleViewPurchaseProposal = useCallback(() => {
    window.open(
      `${PURCHASE_REQUEST_VIEW_ROUTE}/${model.purchaseProposalId?.id}`,
      "_blank"
    );
  }, [model.purchaseProposalId?.id]);

  const handleChangeGoodsServices = useCallback(
    async (purchaseProposalId: string) => {
      const data = await lastValueFrom(
        purchasingPlanRepository.getGoodServiceGroup({
          id: purchaseProposalId,
          purchasePlanId: idDetail,
          pageIndex: 1,
          pageSize: 99999999,
          purchasePlanType: TYPE_PURCHASING_PLAN.FROM_CONTRACT_PRINCIPLE,
        })
      );
      return flattenPurchaseItems(data?.data?.items);
    },
    []
  );

  const flattenPurchaseItems = (
    data: PurchasePlanGoodsServicesModel[]
  ): PurchasePlanGoodsServicesModel[] => {
    const result = data?.reduce((acc, item) => {
      if (item?.childrens) {
        return [...acc, ...(item?.childrens ?? [])];
      }
      return [...acc, item];
    }, [] as PurchasePlanGoodsServicesModel[]);
    return result;
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

  const handleInitialPlan = useCallback(() => {
    if (!isEmpty(idDetail)) {
      setLoading(true);
      purchasingPlanRepository
        ?.getPlanDetail(idDetail, planIsView, isViewWaitingApprove)
        .subscribe({
          next: (data) => {
            if (!data) return;
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
              purchaseItems: data?.goodsItems.map((item) => {
                return {
                  ...item,
                  remainingRequestQuantity: item?.quantity,
                  branchId: item?.branch?.id || "",
                  originalQuantity: item?.originalTotalAmount || 0,
                  registeredQuantity: item?.registeredQuantity || 0,
                  manufacturer: item?.branch,
                  id: `${item?.purchaseItemId}${childText}`,
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
              commands:
                data?.commands?.filter(
                  (command) => command?.icon !== "REJECT"
                ) || [],
            };

            handleGetQuotationSupplierInformation()
              .then((res) => {
                const {
                  quotationSupplier,
                  biddingSupplier,
                  quotationBiddingRounds,
                  currentBiddingRound,
                  biddingExchangeRate,
                  goodPrices,
                } = res;

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
          },
        });
    }
  }, [idDetail]);

  const handleInitPurchasePlan = useCallback(
    async (data: PurchasingPlan) => {
      if (isEmpty(data?.code)) {
        return { purchaseProposal: [], purchaseItems: [] };
      }
      const purchaseItems = await handleChangeGoodsServices(data?.id);
      const listPurchaseItems = purchaseItems?.map((item) => ({
        ...item,
        purchaseItemId: item?.id,
        id: `${uuidv4()}${childText}`,
      }));
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
    [handleChangeGoodsServices, idDetail]
  );

  const handleGoMaster = React.useCallback(
    (searchParams?: string) => {
      history.push({
        pathname: PURCHASING_PLAN_MASTER_ROUTE,
        search: searchParams ? `?${searchParams}` : "",
      });
    },
    [history]
  );

  const getPurchasePlanTypeByRouter = useCallback(
    (id?: TYPE_PURCHASING_PLAN) => {
      let itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
        (el) => el.pathEdit === pathname
      );

      if (id) {
        itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
          (el) => el.id === id
        );
      }

      return new PurchasePlanTypeRouter(itemPurchasePlanType);
    },
    [pathname]
  );

  const getGoodsItems = useCallback(
    (purchaseItems: PurchasePlanGoodsServicesModel[]) => {
      return purchaseItems?.map((item) => {
        if (!item) return;

        const purchaseItemId = item.id.includes(childText)
          ? item.id.slice(0, item.id.indexOf(childText))
          : item.id;

        return {
          goodsId: item.goodsId,
          code: item.code,
          name: item.name,
          unitId: item.unitId,
          manufacturerId: item.manufacturer?.id,
          quantity: item.remainingRequestQuantity,
          description: item.description,
          note: item.note,
          unit: item.unit,
          purchaseItemId,
        };
      });
    },
    []
  );

  const getDataSubmit = useCallback(
    (isDraft: boolean) => {
      if (!model) return;
      const goodsItems = getGoodsItems(model.purchaseItems);
      const dataForm = {
        id: model?.id,
        isDraft: isDraft,
        attachments: model.attachments,
        name: model.name,
        purchasePlanType:
          getPurchasePlanTypeByRouter().id || model.purchasePlanType?.id,
        note: model.note,
        estimatedDelivery: model.estimatedDelivery,
        reason: model.reason,
        startDate:
          !isEmpty(model.startDate) && dayjs(model.startDate).isValid()
            ? dayjs(model.startDate).format()
            : undefined,
        endDate:
          !isEmpty(model.endDate) && dayjs(model.endDate).isValid()
            ? dayjs(model.endDate).format()
            : undefined,
        originalPurchaseRequestId: model.purchaseProposalId?.id,
        goodsItems,
      };
      return dataForm;
    },
    [getGoodsItems, getPurchasePlanTypeByRouter, idDetail, model]
  );

  const handleValidateError = useCallback(
    (error: AxiosError, newModel: PurchasingPlanTypeModel) => {
      if (error?.response && error.response.status === 400) {
        setErrorsModal({
          type: "SUBMIT_FAIL",
          errors: error.response?.data?.tabErrors || [],
        });

        if (error.response?.data?.type === "Validate") {
          handleChangeAllField({
            ...newModel,
            errors: error.response?.data?.errors,
            errorTabs: error.response?.data?.tabs,
          });
          return;
        }

        if (error.response?.data?.type === "Bad Request") {
          handleChangeAllField({
            ...newModel,
            errorTabs: error.response?.data?.tabs,
          });
          return;
        }
        return;
      }
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    },
    [handleChangeAllField, notifyToast]
  );

  const handleSubmitFormValidate = useCallback(
    (body: PurchasingPlanRequest) => {
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);

      const repoCreateOrEdit = isEmpty(model?.id)
        ? purchasingPlanRepository.createPurchasingPlanRequest
        : purchasingPlanRepository.updatePurchasingPlanRequest;

      repoCreateOrEdit(body)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (res) => {
            if (body.isDraft) {
              notifyToast();
              handleGoMaster();
              return;
            }

            if (idDetail) {
              handleInitialPlan();
              history.push(
                `${PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE}/${res?.id}?tabKey=1`
              );
              setTabKey("1");
              return;
            }

            history.replace(
              `${PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE}/${res?.id}?tabKey=1`
            );
            setTabKey("1");
          },
          error: (error: AxiosError) => {
            handleValidateError(error, newModel);
          },
        });
    },
    [
      handleGoMaster,
      handleInitialPlan,
      handleValidateError,
      history,
      idDetail,
      model,
      notifyToast,
    ]
  );

  const handleSave = (isDraft: boolean) => {
    const dataSubmit = getDataSubmit(isDraft);
    setLoading(true);
    handleSubmitFormValidate(dataSubmit);
    setIsSubmit(false);
  };

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const handleHideModal = (searchParams?: string) => {
    handleGoMaster(searchParams);
    notifyToast();
    setModelSelected(null);
  };

  const handleError = useCallback(
    (error: AxiosError) => {
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
    },
    [notifyToast]
  );

  const handleApplyButtonInConfirmModal = (
    model: PurchasingPlan,
    data: DataForm
  ) => {
    // Base on ConfirmModalType to call API and handle Apply button
    const mapActionByModelType = new Map([
      [
        ConfirmModalType.DELETE,
        () => purchasingPlanRepository.deletePurchasingPlan(model?.id, data),
      ],
      [
        ConfirmModalType.CANCEL,
        () => purchasingPlanRepository.cancelPurchasingPlan(model?.id, data),
      ],
      [
        ConfirmModalType.RETURN,
        () => purchasingPlanRepository.returnPurchasingPlan(model?.id, data),
      ],
      [
        ConfirmModalType.REJECT,
        () => purchasingPlanRepository.rejectPurchasingPlan(model?.id, data),
      ],
    ]);

    if (modelSelected?.type === ConfirmModalType.SEND_APPROVE) {
      return handleSubmitApproval(false);
    }

    if (!mapActionByModelType.has(modelSelected?.type)) return;
    setLoadingConfirm(true);
    const repoByType = mapActionByModelType.get(modelSelected.type);

    repoByType()
      .pipe(finalize(() => setLoadingConfirm(false)))
      .subscribe({
        next: () => {
          handleHideModal(
            modelSelected?.type === ConfirmModalType.REJECT ? "tab=2" : ""
          );
        },
        error: handleError,
      });
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

  const handleApproveCancellationPurchasingPlan = useCallback(
    (id: string, callBack?: () => void) => {
      purchasingPlanRepository
        .approveCancellationPurchasingPlan(id)
        .pipe(
          tap(() => setLoading(true)),
          finalize(() => {
            setLoading(false);
            if (callBack) {
              callBack();
            }
          })
        )
        .subscribe({
          next: () => {
            notifyToast();
            handleGoMaster();
          },
          error: handleError,
        });
    },
    [handleError, handleGoMaster, notifyToast]
  );

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
    (isDraft: boolean) => {
      setLoading(true);
      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model);
      const body: BodyApprovePrincipleSupplier =
        getDataSubmitApproveSupplier(model);

      purchasingPlanRepository
        .approveContractSupplier({
          ...body,
          purchasePlanId: model?.id,
          isDraft,
        })
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            notifyToast();
            handleGoMaster();
          },
          error: (error: AxiosError) => {
            handleValidateError(error, newModel);
          },
        });
    },
    [handleGoMaster, handleValidateError, model, notifyToast]
  );

  const getDataSubmitApproveSupplier = (model: PurchasingPlanTypeModel) => {
    if (!model) return;

    return {
      purchasePlanId: model.idDetail,
      purchasePlanType: TYPE_PURCHASING_PLAN.FROM_CONTRACT_PRINCIPLE,
      supplierPurchasePlans: model.supplierPrincipleContracts.map(
        (el: SupplierModel) => {
          return {
            contactPerson: el.contactPerson,
            principleContractId: el.contractId,
            rate: el.exchangeRate,
            contractGoodsPrices: el.contractGoodsItems.map(
              (item: GoodsPrice) => ({
                quantity: item.quantity,
                taxAmount: item.taxAmount,
                taxId: item.tax?.id,
                goodsId: item.goodsId,
                unitId: item.unitId,
                manufacturerId: item.branchId,
                contractGoodsItemId: item.id,
              })
            ),
          };
        }
      ),
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

  useEffect(() => {
    if (isEmpty(idDetail) || model?.isSelectPurchaseProposalId) {
      handleChangeGoodsServices(model?.purchaseProposalId?.id).then((res) => {
        const listPurchaseItems = res?.map((item) => ({
          ...item,
          purchaseItemId: item?.id,
          id: `${uuidv4()}${childText}`,
        }));
        handleChangeSingleField({
          fieldName: "purchaseItems",
        })(listPurchaseItems);
      });
    }
  }, [
    handleChangeGoodsServices,
    handleChangeSingleField,
    idDetail,
    model?.isSelectPurchaseProposalId,
    model?.purchaseProposalId?.id,
  ]);

  useEffect(() => {
    if (!isEmpty(purchaseRequest) && isEmpty(idDetail)) {
      const data = purchaseRequest?.purchaseRequest;
      handleInitPurchasePlan(data).then((res) => {
        const { purchaseProposal, purchaseItems } = res;
        const listPurchaseItems = purchaseItems.map((item) => ({
          ...item,
          id: `${uuidv4()}${childText}`,
        }));
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
          purchasePlanType: getPurchasePlanTypeByRouter(),
        });
      });
    }
  }, [
    purchaseRequest,
    getPurchasePlanTypeByRouter,
    idDetail,
    handleInitPurchasePlan,
    handleChangeAllField,
    handleChangeSingleField,
  ]);

  useEffect(() => {
    handleInitialPlan();
  }, [handleInitialPlan]);

  useEffect(() => {
    if (
      isEqual(model?.status, PURCHASING_PLAN_STATUS.WAITING_CANCEL) ||
      isEqual(model?.status, PURCHASING_PLAN_STATUS.CANCELLED) ||
      isEqual(model?.status, PURCHASING_PLAN_STATUS.DECLINED)
    ) {
      setStep(model?.preCancelStatus);
    } else {
      setStep(model?.status);
    }
  }, [model?.preCancelStatus, model?.status]);

  const valuesContext: PurchasingPlanModel = {
    model,
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
    titlePageHeader,
    getPurchasePlanTypeByRouter,
    selectedDetailSupplier,
    selectedDetailSupplierId,
    setSelectedDetailSupplierId,
    purchaseRequest,
    loadingConfirm,
    step,
    getDataSubmit,
    handleGoMaster,
  };

  return {
    ...valuesContext,
  };
}
