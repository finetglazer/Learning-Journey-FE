/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { APP_OVERVIEW, PAYMENT_MASTER_ROUTE } from "config/route-const";
import appMessageService from "core/services/common-services/app-message-service";
import {
  convertDataToHaveIndexBeforeValidate,
  detailService,
} from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum, HttpStatusCode } from "core/services/service-types";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import type { History } from "history";
import _, { isEmpty, isEqual, isNil, set } from "lodash";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import { JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT } from "core/config/consts";
import { roundNumberDecimal } from "core/helpers/number";
import {
  AccountingEntryModel,
  AutoCostAllocationDocumentAttachModel,
  CODE_TYPE_ACCOUNTING_ENTRY,
  CODE_TYPE_ADVANCE_TUCN,
  CODE_TYPE_ADVANCE_TUNCC,
  CODE_TYPE_DEPOSIT,
  CODE_TYPE_EXPENSE_DCNCC,
  CODE_TYPE_PAYMENT_REQUEST_PER,
  COST_DRIVER_TYPE,
  COST_PERIODS,
  COST_PERIODS_ENUM,
  CostAllocation,
  CostCenters,
  CurrencyModel,
  DataCheckingInternal,
  InitSearchParamInvoiceModel,
  InvoiceModel,
  InvoiceRequestModel,
  InvoicesOtherDocumentModel,
  listPuchasingDocumentInitial,
  ModelSelect,
  OutputInvoiceModel,
  ParamMatchingFDA,
  ParamsDownloadMatchingFDA,
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  PAYMENT_METHOD_ENUM,
  PAYMENT_METHOD_TYPES,
  PaymentCreateModel,
  PaymentDetailTypeModel,
  PaymentInformationModel,
  PaymentListCostCenterAllocation,
  PaymentModel,
  PaymentPurposeModel,
  PaymentRequestModel,
  PaymentTypeApplicationModel,
  PaymentValidateInvoiceModel,
  PurchasingDocumentAttachModel,
  PURPOSE_OF_PURCHASE_TYPES,
  RateInfoModel,
  SHOPPING_PURPOSES,
  SupplierModel,
  TAX_TYPE_ENUM,
  TOPIC_TYPE,
  TransferDetail,
  TYPE_OF_INVOICES,
  TYPE_OF_PAYMENT_TYPE,
  TYPE_OF_PROPOSAL,
  TypeFilterModel,
  TypeOfInvoice,
  VND_CURRENCY,
} from "models/Payment";
import { Project } from "models/Project/Project";
import { ProposalRequestModel } from "models/Proposal";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { ModelFilter } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { finalize, forkJoin, lastValueFrom, tap } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { ConfirmModalType } from "../PaymentConfirmModal/PaymentConfirmModal";
import { paymentRepository } from "../PaymentRepository";
import useRepositoriesTabHook from "./PaymentCreateTypes/useRepositoriesTabHook/useRepositoriesTabHook";
import { getPaymentRequestTypeName } from "./PaymentUtils";
import { integrateRepository } from "core/repositories/IntegrateRepository";
import { ACCESS_TOKEN } from "config/const";
import { useAppSelector } from "rtk/useRedux";
import { PaymentIntegrateERP } from "components/IntegrateERP/IntegrateERP";
import { PaymentIntegrateECM } from "components/IntegrateECM/IntegrateECM";

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

export const PaymentCreateHookContext = createContext<PaymentCreateModel>({
  model: new PaymentRequestModel(),
  listPuchasingDocument: [],
  dispatchModel: null,
  history: null,
  loading: false,
  handleChangeSingleField: null,
  handleChangeSelectField: null,
  handleChangeDateField: null,
  breadcrumbs: [],
  translate: null,
  PaymentType: null,
  formatNumberToCurrency: null,
  handleSave: null,
  modal: null,
  setModalType: null,
  listInformationTransfer: [],
  setListInformationTransfer: null,
  handleUploadFileError: null,
  handleDownloadFileAttached: null,
  handleChangeAllField: null,
  forceUpdateModal: null,
  updateModal: null,
  setLoading: null,
  typeGroup: null,
  getBankExchangeRate: null,
  handleClickAddCostAllocationLine: null,
  notifyToast: null,
  getForeignCurrencyAmount: null,
  modalCostAllocation: DEFAULT_MODAL_TYPE,
  setModalCostAllocation: null,
  handleGetListCostCenterByAllocationMonth: null,
  isLoadingButtonGetListCostCenter: null,
  setIsLoadingButtonGetListCostCenter: null,
  handleUpdateListCostCenterByAllocationMonth: null,
  endPath: null,
  path: null,
  initSearchInvoiceParams: null,
  handleGetTransferInfo: null,
  idDetail: null,
  getLastPath: null,
  setModelSelected: null,
  modelSelected: null,
  handleApplyButtonInConfirmModal: null,
  errorsModal: DEFAULT_ERROR_MODAL_TYPE,
  setErrorsModal: null,
  handleApplyInvoiceFDA: null,
  isDisableAllocationMonth: false,
  setIsDisableAllocationMonth: null,
  setAcceptInvoiceWarning: null,
  setInitSearchInvoiceParams: null,
  inheritanceType: null,
  handleClickResetCostAllocationLine: null,
  handleMatchingInvoice: null,
  checkInternalAccount: null,
});

type props = {
  idDetail?: string;
};

export function usePaymentCreateHook({ idDetail }: props) {
  const location = useLocation();
  const idClone = (location?.state as { idClone: string })?.idClone;
  const stateInheritance = location?.state as {
    result: ProposalRequestModel;
    paymentInheritanceType?: PAYMENT_INHERITANCE_TYPE_SUBMIT;
    paymentInheritanceId?: string;
    paymentScheduleInfoId?: string;
  };
  const profile = useAppSelector((state) => state.profile);

  const { model, dispatch: dispatchModel } =
    detailService.useModel<PaymentRequestModel>(PaymentRequestModel);

  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [modalType, setModalType] = useState<string>("NONE");
  const [listInformationTransfer, setListInformationTransfer] = useState<
    TransferDetail[]
  >([]);
  const [updateModal, forceUpdateModal] = useReducer((x) => x + 1, 0);
  const history: History = useHistory();

  const [modalCostAllocation, setModalCostAllocation] =
    useState<ModalType>(DEFAULT_MODAL_TYPE);
  const [errorsModal, setErrorsModal] = useState<ModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const [loading, setLoading] = React.useState<boolean>(false);
  const [typeGroup, setTypeGroup] = useState<TypeFilterModel>();
  const [
    isLoadingButtonGetListCostCenter,
    setIsLoadingButtonGetListCostCenter,
  ] = useState<boolean>(false);
  const [isDisableAllocationMonth, setIsDisableAllocationMonth] =
    useState<boolean>(false);

  const [endPath, setEndPath] = useState("");
  const [costAllocationDefault, setCostAllocationDefault] = useState(null);
  const [costDriverDefault, setCodeDriverDefault] = useState(null);

  const initSearchInvoice = useCallback(
    (endPath: string) => {
      const enumValues = Object.values(TYPE_OF_PAYMENT_TYPE);
      const enumKeys = Object.keys(TYPE_OF_PAYMENT_TYPE);
      const index = enumValues.indexOf(endPath as TYPE_OF_PAYMENT_TYPE);
      const key = enumKeys[index];
      const topicType = TOPIC_TYPE[key as keyof typeof TOPIC_TYPE];
      return {
        isNew: isEqual(
          Number(model?.invoiceType?.id),
          TypeOfInvoice?.NEW_INVOICE
        ),
        topicType: topicType,
      };
    },
    [endPath, model?.invoiceType]
  );

  const [initSearchInvoiceParams, setInitSearchInvoiceParams] =
    useState<InitSearchParamInvoiceModel>();

  const isVNDOrJPY = useMemo(
    () =>
      isEqual(model?.currency?.code, VND_CURRENCY_UNIT) ||
      isEqual(model?.currency?.code, JPY_CURRENCY_UNIT),
    [model?.currency?.code]
  );

  const paymentInheritanceInformation = useMemo(
    () => ({
      paymentInheritanceId: isEqual(
        model?.paymentInheritanceType,
        PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL
      )
        ? model?.paymentInheritanceId
        : model?.proposalId,
    }),
    [
      model?.paymentInheritanceId,
      model?.paymentInheritanceType,
      model?.proposalId,
    ]
  );

  useEffect(() => {
    const endPath = getLastPath(history.location.pathname, idDetail);
    setInitSearchInvoiceParams(initSearchInvoice(endPath));
  }, [model?.invoiceType?.id]);

  useEffect(() => {
    setValueTypeGroup();
    const endPathPass = getLastPath(history.location.pathname, idDetail);
    setEndPath(endPathPass);
    const typeDefault = handleGetTypeRequestInitDefault(
      history.location.pathname
    );
    if (isNil(stateInheritance?.paymentInheritanceType)) {
      handleInitValueForm(typeDefault, idDetail, idClone);
    } else {
      handleInitValueFormInheritanceProposal({
        ...stateInheritance?.result,
        paymentInheritanceType: stateInheritance?.paymentInheritanceType,
        paymentInheritanceId: stateInheritance?.paymentInheritanceId,
        paymentScheduleInfoId: stateInheritance?.paymentScheduleInfoId,
      });
    }
  }, []);

  useEffect(() => {
    if (model.project) {
      updateProjectCostAllocation();
    }
  }, [model.project]);

  useEffect(() => {
    return () => {
      const state = location?.state as { idClone: string };
      if (state && state?.idClone) {
        // Clear the state by replacing it with a new location object
        history.replace({
          // pathname: location.pathname,
          state: {}, // Clear the state
        });
      }
    };
  }, [location, history]);

  const updateProjectCostAllocation = () => {
    const newCostAllocation = model.costAllocation.map((item) => {
      if (item?.businessBranchId && item?.businessUnitId) {
        if (
          item?.businessBranchId?.id === model.project?.businessBranch?.id &&
          item?.businessBranchId?.id === model.project?.businessUnit?.id
        ) {
          return {
            ...item,
            project: model.project,
          };
        }
        return item;
      } else {
        return item;
      }
    });

    handleChangeSingleField({
      fieldName: "costAllocation",
    })(newCostAllocation);
  };

  const handleGetTypeRequestInitDefault = (path: string) => {
    const pathType = getLastPath(path);
    switch (pathType) {
      case TYPE_OF_PAYMENT_TYPE.PAYMENT:
        return CODE_TYPE_PAYMENT_REQUEST_PER;
      case TYPE_OF_PAYMENT_TYPE.ADVANCE:
        return CODE_TYPE_ADVANCE_TUNCC;
      case TYPE_OF_PAYMENT_TYPE.EXPENSE:
        return CODE_TYPE_EXPENSE_DCNCC;
      case TYPE_OF_PAYMENT_TYPE.ACCOUNTING_ENTRY:
        return CODE_TYPE_ACCOUNTING_ENTRY;
      case TYPE_OF_PAYMENT_TYPE.DEPOSIT:
        return CODE_TYPE_DEPOSIT;
      default:
        return CODE_TYPE_PAYMENT_REQUEST_PER;
    }
  };

  const getFilterApply = (
    data: PaymentTypeApplicationModel[],
    paymentGroup: number
  ) => {
    const filter = new ModelFilter();
    filter.pageIndex = 1;
    filter.pageSize = 1000;
    filter.ids = data?.map((item: PaymentTypeApplicationModel) => item?.id);
    filter.paymentRequestTypeGroup = paymentGroup;
    return filter;
  };

  const handleDownloadFileAttached = (file?: FileModel) => {
    budgetRepository.downloadFileNew(file?.path).subscribe({
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

  const handleInitValueForm = (
    typeRequest: string,
    idDetail?: string,
    idClone?: string
  ) => {
    setLoading(true);
    forkJoin(
      [
        paymentRepository.getRequestsTypeList(typeGroup),
        paymentRepository.getCurrencyTypeList({}),
        !_.isNil(idDetail)
          ? paymentRepository.getPaymentDetail(idDetail, false)
          : null,
        !_.isNil(idClone)
          ? paymentRepository.getPaymentDetail(idClone, false)
          : null,
      ].filter(Boolean)
    )
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: ([requestTypeResult, currencyResult, detailInformationRes]) => {
          const detailInformation =
            detailInformationRes as PaymentDetailTypeModel;
          const findTypeRequestInit = requestTypeResult.find(
            (item: PaymentModel) => item.code === typeRequest
          );
          const findCurrencyInit = currencyResult.find(
            (item: PaymentModel) => item.code === VND_CURRENCY
          );
          if (_.isNil(detailInformation)) {
            dispatchModel({
              type: GeneralActionEnum.SET,
              payload: {
                ...model,
                paymentRequestType: findTypeRequestInit,
                currency: findCurrencyInit,
              },
            });
          } else {
            if (!isEmpty(idClone)) {
              let invoices = [];
              const paymentGroup =
                detailInformation?.paymentRequestType?.paymentGroup;
              const invoiceIds = detailInformation?.invoices?.map(
                (item: InvoiceModel) => item.invoiceId
              );
              const filterInvoiceApply: InvoiceRequestModel = {
                invoiceIds: invoiceIds,
                topicType: paymentGroup,
                currencyCode: detailInformation?.currencyDTO?.code,
              };
              lastValueFrom(
                paymentRepository.getActiveIdsInvoice(filterInvoiceApply)
              )
                .then((response) => {
                  invoices = detailInformation?.invoices?.filter(
                    (item: InvoiceModel) => {
                      return response?.includes(item.invoiceId);
                    }
                  );
                  const newModel: PaymentDetailTypeModel = {
                    ...detailInformation,
                    invoices: invoices,
                    id: undefined,
                  };
                  changeDataDetailModel(newModel, idClone);
                })
                .catch((error) => {
                  changeDataDetailModel({
                    ...detailInformation,
                    invoices: [],
                  });
                });
            } else {
              changeDataDetailModel(detailInformation);
            }
          }
        },
      });
  };

  const paymentInheritanceType = useRef<PAYMENT_INHERITANCE_TYPE_SUBMIT>(
    stateInheritance?.paymentInheritanceType
  );
  const handleInitValueFormInheritanceProposal = (
    dataInheritance: ProposalRequestModel
  ) => {
    const costAllocationLinesDefault =
      dataInheritance?.costAllocation?.costAllocationLines?.map(
        (item: CostAllocation) => {
          return {
            businessBranchDTO: item?.businessBranch,
            businessDepartmentDTO: item?.businessDepartment,
            businessUnitDTO: item?.businessUnit,
            projectDTO: item?.projectDTO,
            costLineDTO: item?.costLine,
            taxTypeDTO: item?.tax,
            businessBranchId: item?.businessBranch,
            businessUnitId: item?.businessUnit,
            businessDepartmentId: item?.businessDepartment,
            projectId: {
              ...item?.projectDTO,
              costLines: [
                {
                  ...item?.costLine,
                },
              ],
            },
            preTaxAmount: item?.preTaxAmount,
            taxAmount: item?.taxAmount || 0,
            taxId: item?.taxId,
            taxDTO: item?.tax,
            expenseDetail: item?.expenseDetail,
            id: uuidv4(),
          };
        }
      );

    setCostAllocationDefault(costAllocationLinesDefault);

    setCodeDriverDefault(dataInheritance?.costAllocation?.costDriver?.code);

    const detailInformationInheritance: PaymentDetailTypeModel = {
      ...model,
      costTypeDTO: {
        id: dataInheritance?.costTypeModel?.id,
        name: dataInheritance?.costTypeModel?.name,
        code: dataInheritance?.costTypeModel?.code,
      },
      costGroupDTO: {
        id: dataInheritance?.costGroupModel?.id,
        name: dataInheritance?.costGroupModel?.name,
        code: dataInheritance?.costGroupModel?.code,
      },
      invoiceType: TypeOfInvoice.NEW_INVOICE?.toString(),
      costPeriod: COST_PERIODS_ENUM.ONCE?.toString(),
      amount: dataInheritance?.amount,
      currencyDTO: {
        id: dataInheritance?.currency?.id ?? "",
        code: dataInheritance?.currency?.code,
        name: dataInheritance?.currency?.name,
      },
      status: dataInheritance?.status,
      paymentMethod: dataInheritance?.paymentMethod,
      description: dataInheritance?.description,
      paymentPurpose: {
        type: dataInheritance?.paymentPurpose?.type,
        note: dataInheritance?.paymentPurpose?.note,
        promotionDTO: dataInheritance?.paymentPurpose?.promotionDTO,
        projectDTO: dataInheritance?.paymentPurpose?.projectDTO,
        assetCode: dataInheritance?.paymentPurpose?.assetCode,
        projectId: dataInheritance?.paymentPurpose?.projectId,
        promotionId: dataInheritance?.paymentPurpose?.promotionId,
      },
      paymentInformation: {
        description:
          dataInheritance?.paymentInformation?.description || undefined,
        transferAmount: dataInheritance?.amount || undefined,
        accountName:
          dataInheritance?.paymentInformation?.accountName || undefined,
        accountNumber:
          dataInheritance?.paymentInformation?.accountNumber || undefined,
        bankId: dataInheritance?.paymentInformation?.bankId || undefined,
        bankName: dataInheritance?.paymentInformation?.bankName || undefined,
      },
      invoices: [],
      otherDocuments: [],
      costAllocation: {
        costAllocationLines:
          dataInheritance?.costAllocation?.costAllocationLines?.map(
            (item: CostAllocation) => {
              return {
                businessBranchDTO: item?.businessBranch,
                businessDepartmentDTO: item?.businessDepartment,
                businessUnitDTO: item?.businessUnit,
                projectDTO: item?.projectDTO,
                costLineDTO: item?.costLine,
                taxTypeDTO: item?.tax,
                businessBranchId: item?.businessBranchId,
                businessUnitId: item?.businessUnitId,
                businessDepartmentId: item?.businessDepartmentId,
                projectId: item?.projectId,
                preTaxAmount: item?.preTaxAmount,
                taxAmount: item?.taxAmount || 0,
                taxId: item?.taxId,
                taxDTO: item?.tax,
                expenseDetail: item?.expenseDetail,
                id: uuidv4(),
              };
            }
          ),
        costDriverDTO: dataInheritance?.costAllocation?.costDriver,
        taxType: dataInheritance?.costAllocation?.taxType,
      },
      supplierDTO: dataInheritance?.supplierModel,
      paymentRequestType: dataInheritance?.paymentRequestType,
      paymentInheritanceType: dataInheritance?.paymentInheritanceType,
      paymentInheritanceId: dataInheritance?.paymentInheritanceId,
      paymentScheduleInfoId: dataInheritance?.paymentScheduleInfoId,
      purchasingDocuments: dataInheritance?.purchasingDocuments,
      proposalId: dataInheritance?.proposalId,
      inheritContractSettlement: dataInheritance?.inheritContractSettlement,
    };

    if (
      dataInheritance?.currency?.code &&
      dataInheritance?.currency?.code !== VND_CURRENCY
    ) {
      paymentRepository
        .getBankExchangeRate(dataInheritance?.currency?.code)
        .subscribe({
          next: (res) => {
            if (res) {
              const rateInfoValue = {
                rate: res.rate,
                date: res.date,
                source: res.source,
              };
              changeDataDetailModel({
                ...detailInformationInheritance,
                rateInfo: {
                  ...detailInformationInheritance.rateInfo,
                  ...rateInfoValue,
                },
              });
            }
          },
          error: () => {
            changeDataDetailModel(detailInformationInheritance);
          },
        });
    } else {
      changeDataDetailModel(detailInformationInheritance);
    }
  };

  const handleGetTransferInfo = (
    search: string,
    bankId?: string,
    bankName?: string
  ) => {
    paymentRepository.getInfoBank({ search, bankId, bankName }).subscribe({
      next: (response) => {
        if (response) {
          const infoBank = response && response?.length > 0 && response[0];
          let accountNumberErrors = null;
          if (isNil(infoBank?.isActive) || infoBank?.isActive) {
            accountNumberErrors = {
              "paymentInformation.accountNumber": null,
            };
          } else {
            accountNumberErrors = {
              "paymentInformation.accountNumber": translate(
                "PM.payment_account_number_error"
              ),
            };
          }
          if (infoBank?.bankId) {
            handleChangeAllField({
              ...model,
              receivingBank: {
                id: infoBank?.bank.id || model?.receivingBank?.id,
                name: infoBank?.bank.name || model?.receivingBank?.name,
              },
              nameAccountBank: infoBank?.name || model?.nameAccountBank,
              errors: {
                ...model?.errors,
                "paymentInformation.bankId": null,
                "paymentInformation.accountName": null,
                ...accountNumberErrors,
              },
            });
          } else {
            handleChangeAllField({
              ...model,
              bankName: infoBank?.bankName || model?.bankName,
              nameAccountBank: infoBank?.name || model?.nameAccountBank,
              receivingBank: {
                id: model?.receivingBank?.id,
                name: model?.receivingBank?.name,
              },
              errors: {
                ...model?.errors,
                "paymentInformation.bankName": null,
                "paymentInformation.accountName": null,
                ...accountNumberErrors,
              },
            });
          }
        }
      },
      error: (error) => {
        console.log("Error get transfer info: ", error);
      },
    });
  };

  const setValueTypeGroup = () => {
    let key = null;
    if (_.isNil(idDetail)) {
      key = Object.values(TYPE_OF_PAYMENT_TYPE).indexOf(
        getLastPath(history.location.pathname) as TYPE_OF_PAYMENT_TYPE
      );
    } else {
      key = Object.values(TYPE_OF_PAYMENT_TYPE).indexOf(
        getLastPath(history.location.pathname, idDetail) as TYPE_OF_PAYMENT_TYPE
      );
    }

    const typeGroup = new TypeFilterModel();
    typeGroup.typeGroup = key?.toString();
    setTypeGroup(typeGroup);
  };

  const formatNumberToCurrency = (
    value: number,
    shouldRound = false,
    code = model?.currency?.code
  ): string => {
    if (isNil(value) || isNaN(value) || value === 0) {
      return "0";
    }
    const isVNDOrJPY =
      isEqual(code, VND_CURRENCY) || isEqual(code, JPY_CURRENCY_UNIT);
    const formattedValue = isVNDOrJPY
      ? roundNumberDecimal(value, 0)
      : shouldRound
      ? roundNumberDecimal(value, 2)
      : roundNumberDecimal(value, 4);
    const [integerPartRaw, decimalPartRaw = ""] =
      _.toString(formattedValue).split(".");
    const integerPart = _.replace(integerPartRaw, /\B(?=(\d{3})+(?!\d))/g, ".");
    if (isVNDOrJPY || _.isInteger(value)) {
      return integerPart;
    }
    // Loại bỏ các số 0 thừa ở cuối phần thập phân
    const decimalPartTrimmed = decimalPartRaw.replace(/0+$/, "");
    // Nếu phần thập phân còn lại rỗng thì chỉ trả về phần nguyên
    if (!decimalPartTrimmed) {
      return integerPart;
    }
    return `${integerPart},${decimalPartTrimmed}`;
  };

  const getForeignCurrencyAmount = useCallback(
    (modelContext: PaymentRequestModel) => {
      if (modelContext?.rateInfo?.rate && modelContext?.amount) {
        const number =
          parseFloat(modelContext?.rateInfo?.rate?.toString()) || 0;
        const result = number * modelContext?.amount;
        handleChangeSingleField({
          fieldName: "foreignCurrencyAmount",
        })(Math.round(result));
      } else {
        handleChangeSingleField({
          fieldName: "foreignCurrencyAmount",
        })(0);
      }
    },
    [model?.rateInfo?.rate, model?.amount]
  );

  const getBankExchangeRate = useCallback(
    (
      currency: CurrencyModel,
      modelContext: PaymentRequestModel,
      isExchangeRate: boolean
    ) => {
      if (!isNil(currency) && currency?.code !== VND_CURRENCY) {
        paymentRepository.getBankExchangeRate(currency?.code).subscribe({
          next: (res) => {
            if (res) {
              const rateInfoValue = {
                rate: res.rate,
                date: res.date,
                source: res.source,
              };
              handleChangeAllField({
                ...modelContext,
                currency: currency,
                isExchangeRate: isNil(isExchangeRate)
                  ? modelContext?.isExchangeRate
                  : isExchangeRate,
                rateInfo: {
                  ...modelContext.rateInfo,
                  ...rateInfoValue,
                },
                receivingBank: null,
                errors: {
                  ...modelContext?.errors,
                  "rateInfo.rate": null,
                  "rateInfo.date": null,
                  "rateInfo.source": null,
                },
              });
            }
          },
          error: (err) => {
            if (err) {
              handleChangeAllField({
                ...modelContext,
                currency: currency,
                isExchangeRate: isNil(isExchangeRate)
                  ? modelContext?.isExchangeRate
                  : isExchangeRate,
                rateInfo: {
                  ...modelContext.rateInfo,
                  rate: null,
                  date: null,
                  source: null,
                },
                receivingBank: null,
                errors: {
                  ...modelContext?.errors,
                  "rateInfo.rate": null,
                  "rateInfo.date": null,
                  "rateInfo.source": null,
                },
              });
            }
          },
        });
      } else {
        handleChangeAllField({
          ...modelContext,
          currency: currency,
          isExchangeRate: isEmpty(isExchangeRate)
            ? model?.isExchangeRate
            : isExchangeRate,
          receivingBank: null,
          errors: {
            ...modelContext?.errors,
            "rateInfo.rate": null,
            "rateInfo.date": null,
            "rateInfo.source": null,
          },
        });
      }
    },
    []
  );

  useEffect(() => {
    if (model.currency?.code === "VND") {
      const costAllocations = model?.costAllocation?.map((item) => {
        const valuePreTaxAmount = item.preTaxAmount
          ?.toString()
          .replace(/[.,]/g, "")
          .substring(0, 13);
        const valueTaxAmount = item.taxAmount
          ?.toString()
          .replace(/[.,]/g, "")
          .substring(0, 13);
        return {
          ...item,
          preTaxAmount: Number(valuePreTaxAmount),
          taxAmount: Number(valueTaxAmount),
        };
      });
      handleChangeAllField({
        ...model,
        costAllocation: costAllocations,
        amount: Math.round(model?.amount),
      });
    }
  }, [model.currency?.code]);

  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const paymentRequestType = model?.paymentRequestType;
    const code = model?.code;
    if (isEmpty(paymentRequestType)) {
      return;
    }
    if (isEmpty(idDetail)) {
      setTitle(() => {
        return (
          translate("PM.payment_create_txt") +
          " " +
          getPaymentRequestTypeName(paymentRequestType?.name)
        );
      });
    } else {
      setTitle(() => {
        return (
          translate("PM.payment_vote_txt") +
          " " +
          paymentRequestType?.name +
          " " +
          code
        );
      });
    }
  }, [idDetail, model?.code, model?.paymentRequestType, translate]);

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_payment"),
      path: PAYMENT_MASTER_ROUTE,
    },
    {
      name: title,
    },
  ];

  const handleGoMaster = React.useCallback(() => {
    history.push(PAYMENT_MASTER_ROUTE);
  }, [history]);

  const [acceptInvoiceWarning, setAcceptInvoiceWarning] =
    useState<PaymentValidateInvoiceModel>({
      acceptInvoiceWarning: false,
      isDraft: false,
    });

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatchModel);

  const listPuchasingDocument = listPuchasingDocumentInitial;

  const handleConvertRequestBodyPayment = (isDraft: boolean) => {
    const documentGroups = getDocumentGroups();
    const paymentPurpose = getValuePurchaseShopping(
      Number(model.purposeOfPurchase?.id)
    );
    const paymentInformation = getPaymentInformation();
    const rateInfo = getRateInfo(model);
    let outputInvoice = {};
    if (model.paymentRequestType?.code === CODE_TYPE_ACCOUNTING_ENTRY) {
      outputInvoice = {
        name: model?.outputInvoice?.name || undefined,
        taxCode: model?.outputInvoice?.taxCode || undefined,
        address: model?.outputInvoice?.address || undefined,
        description: model?.outputInvoice?.description || undefined,
        amount: model?.outputInvoice?.amount || undefined,
      };
    } else {
      outputInvoice = {};
    }

    const invoices = getInvoiceList();
    const otherDocuments = getOtherDocuments();
    const formSubmit = {
      isRefundedToCompany: model?.isRefundedToCompany,
      paymentDueDate: model?.paymentDueDate
        ? dayjs(model?.paymentDueDate).format()
        : undefined,
      isExchangeRate: model?.isExchangeRate,
      taxType: isEqual(model?.invoiceType?.id, TypeOfInvoice.OLD_INVOICE)
        ? TAX_TYPE_ENUM.VAT
        : model?.taxTypeInvoiceSubmit,
      invoices: invoices,
      otherDocuments: otherDocuments,
      isTransferByStatement: model.isCheckImport,
      phoneNumber: model.phoneNumber,
      outputInvoice: outputInvoice,
      description: model.proposalExplanation,
      paymentRequestTypeId: model.paymentRequestType?.id as string,
      costTypeId: model.costType?.id,
      costGroupId: model.costGroup?.id,
      invoiceType: Number(model.invoiceType?.id),
      costPeriod: Number(model.costPeriod?.id),
      allocationDate:
        model?.allocationDate && model?.isShowAllocation
          ? dayjs(model.allocationDate).format()
          : undefined,
      startPeriod:
        model?.service_usage_time?.filter(Boolean)?.length > 0 &&
        dayjs(model?.service_usage_time?.[0])?.isValid()
          ? dayjs(model?.service_usage_time[0]).format()
          : undefined,
      endPeriod:
        model?.service_usage_time?.filter(Boolean)?.length > 0 &&
        dayjs(model?.service_usage_time?.[1])?.isValid()
          ? dayjs(model?.service_usage_time[1]).format()
          : undefined,
      currencyId: model.currency?.id,
      amount: model.amount,
      paymentMethod: Number(model.paymentMethod?.id),
      supplierId: model?.supplier ? model?.supplier.id : null,
      retention: model?.retentionAmount,
      retentionNote: model?.retentionNote,
      isDraft: isDraft,
      paymentPurpose: paymentPurpose,
      paymentInformation: paymentInformation,
      documentGroups: documentGroups,
      rateInfo: rateInfo,
      actionDate: model?.actionDate
        ? dayjs(model?.actionDate).format()
        : undefined,
      costAllocation: {
        costDriverId: model?.costDriver?.id,
        taxType: isEqual(model?.invoiceType?.id, TypeOfInvoice.OLD_INVOICE)
          ? TAX_TYPE_ENUM.VAT
          : model?.taxTypeInvoiceSubmit,
        costAllocationLines: model.costAllocation?.map((item) => {
          return {
            businessBranchId: item.businessBranchId?.id,
            businessDepartmentId: item.businessDepartmentId?.id,
            businessUnitId: item.businessUnitId?.id,
            expenseDetail: item.expenseDetail,
            preTaxAmount: item.preTaxAmount,
            taxId: item.taxType?.id,
            taxAmount: item.taxAmount,
            projectId: item.projectId?.id,
            costLineId: item.costLineId?.id,
          };
        }),
      },
      journalEntries: model?.accountingEntry?.map((item) => {
        return {
          businessBranchId: item.businessBranchId?.id,
          businessUnitId: item.businessUnitId?.id,
          businessDepartmentId: item.businessDepartmentId?.id,
          description: item.description ?? undefined,
          accountEntry: item.accountEntry?.id,
          debitAmount: item.debitAmount,
          creditAmount: item.creditAmount,
        };
      }),
      applyAdvances:
        model?.advancePaymentList && model?.advancePaymentList?.length > 0
          ? model?.advancePaymentList?.map((item) => item.id)
          : undefined,
      refundPlanToSpents:
        model?.expenseApplicationList &&
        model?.expenseApplicationList?.length > 0
          ? model.expenseApplicationList?.map((item) => item.id)
          : undefined,
      applyDeposits:
        model?.depositApplicationList &&
        model?.depositApplicationList?.length > 0
          ? model?.depositApplicationList?.map((item) => item.id)
          : undefined,
      acceptInvoiceWarning: acceptInvoiceWarning?.acceptInvoiceWarning,
      paymentInheritanceId: model?.paymentInheritanceId,
      paymentInheritanceType: model?.paymentInheritanceType,
      paymentScheduleInfoId: model?.paymentScheduleInfoId,
      id: model?.id,
      proposalId: model?.proposalId,
      matchingFdaStatus: !isNil(model?.matchingInvoiceStatus)
        ? model?.matchingInvoiceStatus
        : undefined,
      invoiceMatchingResultIds: !isNil(model?.invoiceMatchingResultIds)
        ? model?.invoiceMatchingResultIds
        : undefined,
    };

    return formSubmit;
  };

  const handleSave = (
    isDraft: boolean,
    idDetail: string,
    // call back này hiện tại dùng để mở modal eform sau khi save xong
    callbackFc?: () => void
  ) => {
    const formSubmit = handleConvertRequestBodyPayment(isDraft);
    // thêm requireWorkflowConfiguration để BE check requireWorkflowConfiguration (BE yêu cầu)
    if (typeof callbackFc === "function") {
      handleSubmitForm(
        {
          ...formSubmit,
          requireWorkflowConfiguration: true,
        },
        idDetail,
        isDraft,
        callbackFc
      );
    } else {
      handleSubmitForm(formSubmit, idDetail, isDraft);
    }
  };

  const handleErrorSubmit = (
    error: AxiosError<any>,
    newModel: PaymentRequestModel,
    isDraft?: boolean
  ) => {
    if (error.response && error.response.status === 400) {
      // Cho trường hợp chỉ check luồng duyệt workflow
      if (
        error.response?.data?.type === "Bad Request" &&
        error.response?.data?.message &&
        isEmpty(error.response?.data?.errors) &&
        isEmpty(error.response?.data?.tabs)
      ) {
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
      } else if (error.response?.data?.type !== "Invoice") {
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
      } else if (error.response?.data?.type === "Invoice") {
        setModelSelected({
          type: ConfirmModalType.WARNING_INVOICE,
          model: {
            ...model,
            code: error.response?.data?.message,
          } as PaymentRequestModel,
        });
        setAcceptInvoiceWarning({
          acceptInvoiceWarning: true,
          isDraft: isDraft,
        });
      }
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleSubmitForm = React.useCallback(
    async (
      body: any,
      idDetail?: string,
      isDraft?: boolean,
      callbackFc?: () => void
    ) => {
      setLoading(true);
      // tạo model mới với indexBeforeValidate trong các mảng dữ liệu

      const newModel = convertDataToHaveIndexBeforeValidate(model, [], model, [
        "service_usage_time",
        "invoiceMatchingResultIds",
      ]);

      if (isEmpty(idDetail)) {
        paymentRepository
          .createPaymentRequest({
            ...body,
            id: undefined,
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
            error: (error) => {
              handleErrorSubmit(error, newModel, isDraft);
            },
          });
      } else {
        paymentRepository
          .updatePaymentRequest({
            ...body,
            idDetail: idDetail,
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
            error: (error) => {
              handleErrorSubmit(error, newModel, isDraft);
            },
          });
      }
    },
    [model, translate]
  );

  const getInvoiceList = () => {
    if (model?.invoices?.length === 0) {
      return undefined;
    }
    return model?.invoices?.map((item) => {
      return {
        invoiceId: item.id,
        paymentAmount: item.paymentAmountSubmit,
        description: item.descriptionSubmit,
        taxType: isEqual(model?.invoiceType?.id, TypeOfInvoice.OLD_INVOICE)
          ? TAX_TYPE_ENUM.VAT
          : model?.taxTypeInvoiceSubmit,
        hold: item?.hold,
        paid: item?.paidSubmit,
      };
    });
  };

  const getOtherDocuments = () => {
    if (model?.invoicesOtherDocument?.length === 0) {
      return undefined;
    }
    const otherDocumentListSave = model?.invoicesOtherDocument?.map((item) => {
      return {
        description: item.description,
        netAmount: item.netAmount,
        taxId: item?.taxType?.id,
        taxAmount: item.taxAmount,
        paymentAmount: item.paymentAmount,
        documentNumber: item.documentNumber,
        documentDate: item.documentDate
          ? dayjs(item.documentDate).format()
          : null,
        supplierTaxCode: item.supplierTaxCode,
        supplierName: item.supplierName,
        supplierCode: item.supplierCode,
      };
    });
    return otherDocumentListSave;
  };

  const getDocumentGroups = () => {
    const documentGroupList =
      model.PurchasingDocumentsAttach as PurchasingDocumentAttachModel[];
    if (documentGroupList?.length > 0) {
      const documentGroup = documentGroupList.map((item, index) => {
        return {
          documentTypeId: item.documentTypeId,
          description: item.description,
          requestDocuments: item.fileInfo?.length ? item.fileInfo : null,
          group: index,
        };
      });
      return documentGroup;
    }
    return undefined;
  };

  const getValuePurchaseShopping = (purposeId: number) => {
    let paymentPurpose: PaymentPurposeModel = null;
    switch (purposeId) {
      case SHOPPING_PURPOSES.NORMAL_SHOPPING:
      case SHOPPING_PURPOSES.OTHER:
      case SHOPPING_PURPOSES.STORAGE_PURCHASING:
      case SHOPPING_PURPOSES.FINANCIAL_LEASE:
      case SHOPPING_PURPOSES.OPERATING_LEASE:
      case SHOPPING_PURPOSES.SOFTWARE_LEASE:
      case SHOPPING_PURPOSES.NOT_PROMOTIONAL_PURCHASING:
      case SHOPPING_PURPOSES.UNIFORM_PURCHASING:
        paymentPurpose = {
          type: purposeId,
          note: model?.purposeOfPurchaseNote,
          assetCode: null,
          projectId: null,
        };
        break;
      case SHOPPING_PURPOSES.PROMOTION_PROGRAM:
        paymentPurpose = {
          type: purposeId,
          note: null,
          promotionId: model?.promoCode?.id,
          assetCode: null,
          projectId: null,
        };
        break;
      case SHOPPING_PURPOSES.ACCORDING_PROJECT:
        paymentPurpose = {
          type: purposeId,
          note: null,
          promotionId: null,
          assetCode: null,
          projectId: model?.project?.id?.toString(),
        };
        break;
      case SHOPPING_PURPOSES.REPAIR_MAINTENANCE:
        paymentPurpose = {
          type: purposeId,
          note: null,
          promotionId: null,
          assetCode: model?.assetCode,
          projectId: null,
        };
        break;
      default:
        paymentPurpose = null;
        break;
    }
    return paymentPurpose;
  };

  const getPaymentInformation = () => {
    let paymentInformation: PaymentInformationModel = null;
    let transferInfos: TransferDetail[] = undefined;
    const idPaymentMethod = Number(model?.paymentMethod?.id);
    if (
      isEqual(idPaymentMethod, PAYMENT_METHOD_ENUM.NO_PAYMENT) ||
      isEqual(idPaymentMethod, PAYMENT_METHOD_ENUM.BANK_REIMBURSEMENT)
    ) {
      paymentInformation = {
        transferAmount: model?.paymentBankAmount ?? undefined,
      };
    } else if (
      model.isCheckImport &&
      model?.currency?.code === VND_CURRENCY &&
      (isEqual(
        model?.paymentRequestType?.code,
        CODE_TYPE_PAYMENT_REQUEST_PER
      ) ||
        isEqual(model?.paymentRequestType?.code, CODE_TYPE_ADVANCE_TUCN))
    ) {
      transferInfos = model?.infoFileTransferBank?.transferDetails;
      paymentInformation = {
        transferInfos: transferInfos,
        systemFileId:
          model?.infoFileTransferBank?.fileInfo?.systemFileId || undefined,
        description: undefined,
        transferAmount: model?.paymentBankAmount || undefined,
        bankId: undefined,
        accountNumber: undefined,
        accountName: undefined,
      };
    } else {
      paymentInformation = {
        transferInfos: undefined,
        systemFileId: undefined,
        description: model?.transferContent || undefined,
        transferAmount: model?.paymentBankAmount || undefined,
        bankId:
          model.currency?.code === VND_CURRENCY
            ? model?.receivingBank?.id?.toString()
            : undefined,
        bankName:
          model.currency?.code !== VND_CURRENCY ? model?.bankName : undefined,
        accountNumber: model?.bankAccountNumber || undefined,
        accountName: model?.nameAccountBank || undefined,
      };
    }

    return paymentInformation;
  };

  const getRateInfo = (model: PaymentRequestModel) => {
    if (model.currency?.code === VND_CURRENCY) {
      return undefined;
    }
    const rateInfo: RateInfoModel = {
      rate: model?.rateInfo?.rate || undefined,
      date: dayjs(model?.rateInfo?.date)?.isValid()
        ? dayjs(model?.rateInfo?.date).format()
        : undefined,
      source: model?.rateInfo?.source || undefined,
    };
    return rateInfo;
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

  const handleClickAddCostAllocationLine = () => {
    const newCostAllocation: CostAllocation = {
      id: dayjs().valueOf().toString(),
      taxAmount: 0,
    };
    let costAllocation = [];
    if (model.costAllocation) {
      costAllocation = [...model.costAllocation, newCostAllocation];
    } else {
      costAllocation = [newCostAllocation];
    }
    handleChangeSingleField({
      fieldName: "costAllocation",
    })(costAllocation);
  };

  const handleGetListCostCenterByAllocationMonth = () => {
    const month = dayjs(model.allocationMonth).hour(12);
    const filter = {
      allocateMonth: model.allocationMonth && month.toISOString(),
      costCenters: [
        {
          businessBranchId: model?.businessBranchId?.id,
          businessUnitId: model?.businessUnitId?.id,
          businessDepartmentId: model?.businessDepartmentId?.id,
        },
      ],
      type:
        model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA
          ? 0
          : model.costDriver?.code ===
            COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY
          ? 1
          : null,
      proposalId: paymentInheritanceInformation?.paymentInheritanceId,
    };
    paymentRepository.getListCostCenter(filter).subscribe({
      next: (response) => {
        if (response?.items?.length > 0) {
          setIsDisableAllocationMonth(true);
          let listAutoCostAllocationDocumentsAttach: AutoCostAllocationDocumentAttachModel[] =
            [];
          const dataList = response?.items?.map(
            (item: PaymentListCostCenterAllocation, index: number) => {
              return {
                id: dayjs().valueOf().toString() + index,
                businessBranchId: item.businessBranch,
                businessUnitId: item.businessUnit,
                businessDepartmentId: item.businessDepartment,
                value: item.value,
                month: item.month,
                year: item.year,
                type: item.type,
              };
            }
          );
          if (model.autoCostAllocationDocumentsAttach) {
            listAutoCostAllocationDocumentsAttach = [
              ...model.autoCostAllocationDocumentsAttach,
              ...dataList,
            ];
          } else {
            listAutoCostAllocationDocumentsAttach = [...dataList];
          }
          dispatchModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...model,
              autoCostAllocationDocumentsAttach:
                listAutoCostAllocationDocumentsAttach,
            },
          });
        } else {
          notifyToast({
            type: "error",
            message: translate(
              "PM.payment_no_unit_of_responsibility_satisfied"
            ),
          });
        }
      },
      error: (error) => {
        console.log("Error get list cost center: ", error);
      },
    });
  };

  const handleUpdateListCostCenterByAllocationMonth = () => {
    const listCostCenter: CostCenters[] =
      model.autoCostAllocationDocumentsAttach &&
      model.autoCostAllocationDocumentsAttach.map(
        (item: AutoCostAllocationDocumentAttachModel) => {
          return {
            businessBranchId: String(item.businessBranchId?.id) || null,
            businessUnitId: String(item.businessUnitId?.id) || null,
            businessDepartmentId: String(item.businessDepartmentId?.id) || null,
          };
        }
      );
    const month = dayjs(model.allocationMonth).hour(12);
    const filter = {
      allocateMonth: model.allocationMonth && month.toISOString(),
      costCenters: listCostCenter,
      type:
        model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA
          ? 0
          : model.costDriver?.code ===
            COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY
          ? 1
          : null,
    };
    if (
      model?.autoCostAllocationDocumentsAttach?.length > 0 &&
      model.allocationMonth
    ) {
      paymentRepository.getListCostCenter(filter).subscribe({
        next: (response) => {
          if (response?.items?.length > 0) {
            let listAutoCostAllocationDocumentsAttach: AutoCostAllocationDocumentAttachModel[] =
              [];
            if (model.autoCostAllocationDocumentsAttach) {
              const dataList: AutoCostAllocationDocumentAttachModel[] =
                model.autoCostAllocationDocumentsAttach.map(
                  (item: AutoCostAllocationDocumentAttachModel) => {
                    const matchedItem = response.items.find(
                      (itemRes: PaymentListCostCenterAllocation) =>
                        item?.businessBranchId?.id ===
                          itemRes?.businessBranch?.id &&
                        item?.businessDepartmentId?.id ===
                          itemRes?.businessDepartment?.id &&
                        item?.businessUnitId?.id === itemRes?.businessUnit?.id
                    );

                    return matchedItem
                      ? {
                          id: item.id,
                          businessBranchId: item.businessBranchId,
                          businessUnitId: item.businessUnitId,
                          businessDepartmentId: item.businessDepartmentId,
                          value: matchedItem.value,
                        }
                      : {
                          id: item.id,
                          businessBranchId: item.businessBranchId,
                          businessUnitId: item.businessUnitId,
                          businessDepartmentId: item.businessDepartmentId,
                        };
                  }
                );
              listAutoCostAllocationDocumentsAttach = [...dataList];
            }
            dispatchModel({
              type: GeneralActionEnum.SET,
              payload: {
                ...model,
                autoCostAllocationDocumentsAttach:
                  listAutoCostAllocationDocumentsAttach,
              },
            });
          }
        },
        error: (error) => {
          console.log("Error get list cost center: ", error);
        },
      });
    }
  };

  const handlePushIntegrateERP = () => {
    const tokenLogin = localStorage.getItem(ACCESS_TOKEN);
    const param = {
      paymentRequestId: idDetail,
      userEmail: profile?.account?.email,
      tokenLogin: tokenLogin,
    };
    integrateRepository.pushIntegrateERP(param).subscribe();
  };

  const handlePushIntegrateECM = () => {
    const tokenLogin = localStorage.getItem(ACCESS_TOKEN);
    const param = {
      paymentRequestId: idDetail,
      userEmail: profile?.account?.email,
      tokenLogin: tokenLogin,
    };
    integrateRepository.pushIntegrateECM(param).subscribe();
  };

  const [listERP, setListERP] = useState<PaymentIntegrateERP[]>([]);
  const [listECM, setListECM] = useState<PaymentIntegrateECM[]>([]);

  const handleGetIntegrateData = () => {
    forkJoin({
      erp: integrateRepository.getListERP(idDetail),
      ecm: integrateRepository.getListECM(idDetail),
    }).subscribe({
      next: (response) => {
        // Update ERP data if available
        if (response.erp) {
          setListERP(response.erp);
        }

        // Update ECM data if available
        if (response.ecm) {
          setListECM(response.ecm);
        }
      },
      error: (error) => {
        console.log("Error fetching integrate data:", error);
      },
    });
  };

  const updateIntegrateData = useCallback(() => {
    handleGetIntegrateData();
  }, [idDetail, listERP]);

  // Replace separate useEffects with a single one
  useEffect(() => {
    if (idDetail) {
      handleGetIntegrateData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDetail]);

  const { tabRepositories, getLastPath } = useRepositoriesTabHook(
    model?.errorTabs,
    history.location.pathname,
    idDetail,
    model?.taxTypeInvoiceSubmit,
    listERP,
    listECM,
    handlePushIntegrateERP,
    handlePushIntegrateECM,
    updateIntegrateData
  );

  useEffect(() => {
    setCalculateAmount(typeGroup?.typeGroup, model);
  }, [
    model?.invoices,
    model?.invoicesOtherDocument,
    model?.advancePaymentList,
    model?.costAllocation,
    model?.depositApplicationList,
    model?.expenseApplicationList,
    model?.amount,
  ]);

  const setCalculateAmount = (
    typeGroup: string,
    paymentRequest: PaymentRequestModel
  ) => {
    switch (Number(typeGroup)) {
      case TYPE_OF_PROPOSAL.PAYMENT:
        if (
          paymentRequest?.invoices?.length > 0 ||
          paymentRequest?.invoicesOtherDocument?.length > 0 ||
          paymentRequest?.advancePaymentList?.length > 0 ||
          paymentRequest?.depositApplicationList?.length > 0 ||
          paymentRequest?.expenseApplicationList?.length > 0
        ) {
          const totalAmountOtherDocumentRetained =
            paymentRequest?.invoicesOtherDocument?.reduce(
              (total, item) =>
                total + ((item?.totalAmount || 0) - (item?.paymentAmount || 0)),
              0
            );

          const totalAmountInvoiceRetained = paymentRequest?.invoices?.reduce(
            (total, item) => total + (item?.retainedAmount || 0),
            0
          );

          const advancePaymentListIncludeInvoice =
            paymentRequest?.advancePaymentList?.filter(
              (item) => item?.invoices?.length > 0
            );

          const totalAdvanceApplicationIncludeInvoices =
            advancePaymentListIncludeInvoice?.length > 0
              ? advancePaymentListIncludeInvoice?.reduce(
                  (total, item) => total + (item?.amount || 0),
                  0
                )
              : 0;

          const totalAdvanceApplicationAll =
            paymentRequest?.advancePaymentList?.reduce(
              (total, item) => total + (item?.amount || 0),
              0
            );
          const totalDepositApplicationAll =
            paymentRequest?.depositApplicationList?.reduce(
              (total, item) => total + (item?.amount || 0),
              0
            );

          const totalAmountInvoicePay = paymentRequest?.invoices?.reduce(
            (total, item) => total + (item.paymentAmountSubmit || 0),
            0
          );

          const totalAmountOtherDocumentPay =
            paymentRequest?.invoicesOtherDocument?.reduce(
              (total, item) => total + (item.paymentAmount || 0),
              0
            );

          const totalAdvanceApplicationNotIncludeInvoicesPay =
            paymentRequest?.advancePaymentList
              ?.filter((item) => item?.invoices?.length === 0)
              ?.reduce((total, item) => total + (item?.amount || 0), 0) || 0;

          const totalRetainedAmountAdvanceApplicationAllPay =
            paymentRequest?.advancePaymentList?.reduce(
              (total, item) => total + (item?.retention || 0),
              0
            );

          const totalAmountPayable =
            totalAmountOtherDocumentPay +
            totalAmountInvoicePay -
            totalAdvanceApplicationNotIncludeInvoicesPay +
            totalRetainedAmountAdvanceApplicationAllPay;

          const depositReversalAmount =
            totalAdvanceApplicationAll + totalDepositApplicationAll;

          const expenseReversalAmount =
            paymentRequest?.expenseApplicationList?.reduce(
              (total, item) => total + (item?.amount || 0),
              0
            );

          const retentionAmount =
            totalAmountOtherDocumentRetained +
            totalAmountInvoiceRetained -
            totalAdvanceApplicationIncludeInvoices;

          handleChangeAllField({
            ...model,
            retentionAmount: retentionAmount || 0,
            totalAmountPayable: totalAmountPayable - totalDepositApplicationAll,
            paymentBankAmount: totalAmountPayable - totalDepositApplicationAll,
            depositReversalAmount: depositReversalAmount,
            expenseReversalAmount: expenseReversalAmount,
            foreignCurrencyAmount:
              parseFloat(paymentRequest?.rateInfo?.rate?.toString()) *
              paymentRequest?.amount,
          });
        } else {
          handleChangeAllField({
            ...model,
            retentionAmount: 0,
            totalAmountPayable: 0,
            paymentBankAmount: 0,
            depositReversalAmount: 0,
            expenseReversalAmount: 0,
            foreignCurrencyAmount:
              parseFloat(paymentRequest?.rateInfo?.rate?.toString()) *
              paymentRequest?.amount,
          });
        }

        break;
      case TYPE_OF_PROPOSAL.ADVANCE:
        if (
          paymentRequest?.invoices?.length > 0 ||
          paymentRequest?.invoicesOtherDocument?.length > 0
        ) {
          const totalAmountOtherDocumentRetained =
            paymentRequest?.invoicesOtherDocument?.reduce(
              (total, item) =>
                total + ((item?.totalAmount || 0) - (item?.paymentAmount || 0)),
              0
            );
          const totalAmountInvoiceRetained = paymentRequest?.invoices?.reduce(
            (total, item) => total + (item?.retainedAmount || 0),
            0
          );

          const totalPaymentAmountInvoice = paymentRequest?.invoices?.reduce(
            (total, item) => total + (item?.paymentAmountSubmit || 0),
            0
          );
          const totalPaymentAmountOtherDocument =
            paymentRequest?.invoicesOtherDocument?.reduce(
              (total, item) => total + (item?.paymentAmount || 0),
              0
            );
          const totalAmountPayable =
            totalPaymentAmountInvoice + totalPaymentAmountOtherDocument;

          const totalDepositApplicationAll =
            paymentRequest?.depositApplicationList?.reduce(
              (total, item) => total + (item?.amount || 0),
              0
            );

          handleChangeAllField({
            ...model,
            totalAmountPayable: totalAmountPayable - totalDepositApplicationAll,
            paymentBankAmount: totalAmountPayable - totalDepositApplicationAll,
            retentionAmount:
              totalAmountOtherDocumentRetained + totalAmountInvoiceRetained,
            foreignCurrencyAmount:
              parseFloat(paymentRequest?.rateInfo?.rate?.toString()) *
              paymentRequest?.amount,
          });
        } else if (paymentRequest?.costAllocation?.length > 0) {
          const totalAmountCostAllocationRetained =
            paymentRequest?.costAllocation?.reduce((total, item) => {
              if (item?.taxType?.isHold) {
                return total + (item?.taxAmount || 0);
              }
              return total;
            }, 0);

          const totalDepositApplicationAll =
            paymentRequest?.depositApplicationList?.reduce(
              (total, item) => total + (item?.amount || 0),
              0
            );

          handleChangeAllField({
            ...model,
            retentionAmount: totalAmountCostAllocationRetained,
            totalAmountPayable: Math.max(
              paymentRequest?.amount -
                totalAmountCostAllocationRetained -
                totalDepositApplicationAll,
              0
            ),
            paymentBankAmount: Math.max(
              paymentRequest?.amount -
                totalAmountCostAllocationRetained -
                totalDepositApplicationAll,
              0
            ),
            foreignCurrencyAmount:
              parseFloat(paymentRequest?.rateInfo?.rate?.toString()) *
              paymentRequest?.amount,
          });
        } else {
          handleChangeAllField({
            ...model,
            retentionAmount: 0,
            totalAmountPayable: paymentRequest?.amount,
            foreignCurrencyAmount:
              parseFloat(paymentRequest?.rateInfo?.rate?.toString()) *
              paymentRequest?.amount,
          });
        }
        break;
      default:
        break;
    }
  };

  const getActionDateClone = (
    dataModel: PaymentDetailTypeModel,
    idClone?: string
  ): string => {
    const typeGroup = dataModel?.paymentRequestType?.paymentGroup;
    const actionDate = dataModel?.actionDate;
    if (isEmpty(idClone) || typeGroup === TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY) {
      return actionDate;
    }
    if (
      isEmpty(actionDate) ||
      !dayjs(actionDate).isValid() ||
      dayjs(actionDate).isBefore(dayjs(), "day")
    ) {
      return undefined;
    }
    return actionDate;
  };

  const getDueDateClone = (
    dataModel: PaymentDetailTypeModel,
    idClone?: string
  ): string => {
    const paymentDueDate = dataModel?.paymentDueDate;
    if (isEmpty(idClone)) {
      return paymentDueDate;
    }
    if (
      isEmpty(paymentDueDate) ||
      !dayjs(paymentDueDate).isValid() ||
      dayjs(paymentDueDate).isBefore(dayjs(), "day")
    ) {
      return undefined;
    }
    return paymentDueDate;
  };

  const getCostCenterList = async (
    project: CostAllocation[],
    paymentDetail: PaymentDetailTypeModel
  ) => {
    const listAPi = project?.map((record) => {
      return paymentRepository?.projectByCostCenter({
        name: "",
        businessBranchId: record?.businessBranchId,
        businessUnitId: record?.businessUnitId,
        businessDepartmentId: record?.businessDepartmentId,
        isProject: !isEmpty(paymentDetail?.paymentPurpose?.projectId),
        budgetId:
          paymentDetail?.type === SHOPPING_PURPOSES.ACCORDING_PROJECT
            ? record?.projectId
            : "",
      });
    });
    return await lastValueFrom(forkJoin(listAPi));
  };

  const changeDataDetailModel = async (
    data: PaymentDetailTypeModel,
    idClone?: string
  ) => {
    try {
      let resultCostLines: Project[][] = [];
      if (!isEmpty(data?.costAllocation?.costAllocationLines)) {
        try {
          resultCostLines = await getCostCenterList(
            data?.costAllocation?.costAllocationLines,
            data
          );
        } catch (error) {
          console.log("Error get cost center: ", error);
        }
      }
      const typeGroup = data?.paymentRequestType?.paymentGroup;

      const createdDateNew = dayjs()?.toISOString();
      const actionDateNew = getActionDateClone(data, idClone);
      const dueDateNew = getDueDateClone(data, idClone);
      const dataModel: PaymentRequestModel = {
        ...model,
        id: data?.id,
        code: data?.code,
        paymentMethod: PAYMENT_METHOD_TYPES.find(
          (item) => item?.id === data?.paymentMethod
        ),
        paymentRequestType: data?.paymentRequestType,
        costType: data?.costTypeDTO,
        costGroup: data?.costGroupDTO,
        invoiceType: TYPE_OF_INVOICES?.find(
          (item) => item.id === Number(data?.invoiceType)
        ),
        costPeriod: COST_PERIODS?.find(
          (item) => item?.id === Number(data?.costPeriod)
        ),
        currency: data?.currencyDTO,
        amount: data?.amount,
        proposalExplanation: data?.description,
        purposeOfPurchase: PURPOSE_OF_PURCHASE_TYPES?.find(
          (item) => item?.id === data?.paymentPurpose?.type
        ),
        purposeOfPurchaseNote: data?.paymentPurpose?.note,
        promoCode: data?.paymentPurpose?.promotionDTO,
        assetCode: data?.paymentPurpose?.assetCode,
        project: data?.paymentPurpose?.projectDTO,
        service_usage_time:
          !_.isNil(data?.startPeriod) && !_.isNil(data?.endPeriod)
            ? [dayjs(data?.startPeriod), dayjs(data?.endPeriod)]
            : [null, null],
        allocationDate: _.isNil(data?.allocationDate)
          ? undefined
          : dayjs(data?.allocationDate),
        paymentBankAmount: data?.paymentInformation?.transferAmount,
        totalAmountPayable: data?.paymentInformation?.transferAmount,
        receivingBank: {
          id: data?.paymentInformation?.bankId,
          name: data?.paymentInformation?.bankName,
        },
        bankAccountNumber: data?.paymentInformation?.accountNumber,
        nameAccountBank: data?.paymentInformation?.accountName,
        transferContent: data?.paymentInformation?.description,
        retentionAmount: data?.retention,
        retentionNote: data?.retentionNote,
        PurchasingDocumentsAttach: data?.documentGroups?.map((item, index) => {
          return {
            documentType: item?.documentType,
            documentTypeId: item?.documentType?.id,
            description: item?.description,
            fileInfo: item?.requestDocuments,
            id: uuidv4(),
            indexBeforeValidate: index,
          };
        }),
        invoices: data?.invoices?.map((item: InvoiceModel, index: number) => {
          const hold = item?.invoiceDetail?.hold;
          const paid = item?.invoiceDetail?.paid;
          const paidTotal =
            typeGroup === TYPE_OF_PROPOSAL.PAYMENT
              ? hold > 0
                ? hold
                : paid
              : hold;
          const paymentAmountSubmit =
            item?.invoiceDetail?.totalAmount - paidTotal;
          const retainedAmount =
            item?.invoiceDetail?.totalAmount - paymentAmountSubmit;
          return {
            ...item?.invoiceDetail,
            paymentAmountSubmit: isEmpty(idClone)
              ? item?.paymentAmount
              : paymentAmountSubmit,
            descriptionSubmit: item.description,
            retainedAmount: isEmpty(idClone)
              ? item?.invoiceDetail?.totalAmount - item.paymentAmount
              : retainedAmount,
            indexBeforeValidate: index,
            hold: hold,
            paidSubmit: item?.invoiceDetail?.paid,
            paid: item?.hold,
          };
        }),
        invoicesOtherDocument: data?.otherDocuments?.map(
          (item: InvoicesOtherDocumentModel, index: number) => {
            return {
              ...item,
              taxType: item?.tax,
              totalAmount: item?.netAmount + item?.taxAmount,
              documentDate: _.isNil(item?.documentDate)
                ? undefined
                : dayjs(item?.documentDate),
              indexBeforeValidate: index,
            };
          }
        ),
        taxTypeEnum: _.isNil(data?.costAllocation?.costAllocationLines)
          ? 0
          : data?.costAllocation?.costAllocationLines?.length > 0
          ? data?.costAllocation?.costAllocationLines[0]?.taxDTO?.taxType
          : 0,
        costAllocation: data?.costAllocation?.costAllocationLines?.map(
          (item: CostAllocation, index: number) => {
            return {
              ...item,
              businessBranchId: item?.businessBranchDTO,
              businessDepartmentId: item?.businessDepartmentDTO,
              businessUnitId: item?.businessUnitDTO,
              taxType: item?.taxDTO,
              projectId: {
                ...item?.projectDTO,
                costLines: !isEmpty(resultCostLines)
                  ? resultCostLines[index]?.filter(
                      (record) => record?.id === item?.projectDTO?.id
                    )?.[0]?.costLines
                  : [],
              },
              costLineId: item?.costLineDTO,
            };
          }
        ),
        costDriver: data?.costAllocation?.costDriverDTO,
        depositReversalAmount:
          data?.applyAdvancesTotal + data?.applyDepositsTotal,
        expenseReversalAmount: data?.refundPlanToSpents_Total,
        advancePaymentList:
          data?.applyAdvances?.map((item: PaymentTypeApplicationModel) => {
            return {
              ...item,
              currencyDTO: item?.currency,
            };
          }) || [],
        depositApplicationList:
          data?.applyDeposits?.map((item: PaymentTypeApplicationModel) => {
            return {
              ...item,
              currencyDTO: item?.currency,
            };
          }) || [],
        expenseApplicationList:
          data?.refundPlanToSpents?.map((item: PaymentTypeApplicationModel) => {
            return {
              ...item,
              currencyDTO: item?.currency,
            };
          }) || [],
        rateInfo: {
          rate: data?.rateInfo?.rate,
          date: data?.rateInfo?.date,
          source: data?.rateInfo?.source,
        },
        isExchangeRate: data?.isExchangeRate,
        bankName: data?.paymentInformation?.bankName,
        phoneNumber: data?.phoneNumber,
        actionDate: isEmpty(actionDateNew) ? undefined : dayjs(actionDateNew),
        isCheckImport: data?.paymentInformation?.transferInfos?.length > 0,
        infoFileTransferBank:
          !isNil(data?.paymentInformation?.systemFileId) &&
          !isEmpty(data?.paymentInformation?.transferInfos)
            ? {
                fileInfo: {
                  systemFileId: data?.paymentInformation?.systemFileId,
                },
                transferDetails: data?.paymentInformation?.transferInfos,
              }
            : undefined,
        createUser: data?.createUser,
        createUserName: data?.createUserName,
        isShowAllocation: !isNil(data?.allocationDate),
        supplier: data?.supplierDTO as never as SupplierModel,
        outputInvoice: data?.outputInvoice as never as OutputInvoiceModel,
        isRefundedToCompany: data?.isRefundedToCompany,
        accountingEntry: isEmpty(data?.journalEntries)
          ? []
          : data?.journalEntries.map((item: AccountingEntryModel) => {
              return {
                ...item,
                businessBranchId: item?.businessBranchDTO,
                businessUnitId: item?.businessUnitDTO,
                businessDepartmentId: item?.businessDepartmentDTO,
                accountEntry: item?.accountEntryDTO,
              };
            }),
        paymentGroup: data?.paymentRequestType?.paymentGroup,
        canEdit: data?.canEdit,
        canCancel: data?.canCancel,
        canDelete: data?.canDelete,
        canSaveDraft: isEmpty(idClone) ? data?.canSaveDraft : true,
        canWaitingForApprove: isEmpty(idClone)
          ? data?.canWaitingForApprove
          : true,
        canApproved: data?.canApproved,
        canDeclined: data?.canDeclined,
        foreignCurrencyAmount: data?.rateInfo?.rate * data?.amount,
        paymentDueDate: isEmpty(dueDateNew) ? undefined : dayjs(dueDateNew),
        taxTypeInvoiceSubmit: Number(data?.costAllocation?.taxType),
        createdDate: isEmpty(idClone) ? data?.createdDate : createdDateNew,
        statusTopic: data?.status,
        status: data?.status,
        paymentInheritanceType: data?.paymentInheritanceType,
        paymentInheritanceId: data?.paymentInheritanceId,
        paymentScheduleInfoId: data?.paymentScheduleInfoId,
        listPuchasingDocument: data?.purchasingDocuments,
        proposalId: data?.proposalId,
        isShowPurchaseDocumentsAttached: !isNil(data?.paymentInheritanceType),
        isShowButtonMapPo: isEqual(
          data?.paymentInheritanceType,
          PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
        ),
        isShowDepositApplication: isEqual(
          data?.paymentInheritanceType,
          PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
        ),
        inheritContractSettlement: data?.inheritContractSettlement,
      };
      paymentInheritanceType.current = data?.paymentInheritanceType;
      setLoading(false);
      handleChangeAllField(dataModel);

      const costAllocation = data?.costAllocation?.costAllocationLines?.map(
        (item: CostAllocation, index: number) => {
          return {
            ...item,
            businessBranchId: item?.businessBranchDTO,
            businessDepartmentId: item?.businessDepartmentDTO,
            businessUnitId: item?.businessUnitDTO,
            taxType: item?.taxDTO,
            projectId: {
              ...item?.projectDTO,
              costLines: !isEmpty(resultCostLines)
                ? resultCostLines[index]?.filter(
                    (record) => record?.id === item?.projectDTO?.id
                  )?.[0]?.costLines
                : [],
            },
            costLineId: item?.costLineDTO,
          };
        }
      );
      setCostAllocationDefault(costAllocation);
      setCodeDriverDefault(data?.costAllocation?.costDriverDTO?.code);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const handleHideModal = () => {
    handleGoMaster();
    notifyToast();
    setModelSelected(null);
  };

  const handleUpdatePaymentError = (error: AxiosError) => {
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

  const handleApplyButtonInConfirmModal = (
    model: PaymentRequestModel,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelPayment(model?.id?.toString(), reason);
        return;
      case ConfirmModalType.DELETE:
        deletePayment(model?.id?.toString(), reason);
        return;
      case ConfirmModalType.WARNING_INVOICE:
        handleSave(acceptInvoiceWarning?.isDraft, idDetail || model?.id);
    }
  };

  // Cancel payment request
  const cancelPayment = (id: string, reason: string) => {
    paymentRepository
      .cancelPayment(id, reason)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdatePaymentError,
      });
  };

  // Delete single payment
  const deletePayment = (id: string, reason: string) => {
    paymentRepository
      .deletePayment(id, reason)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdatePaymentError,
      });
  };

  const handleApplyInvoiceFDA = (data: InvoiceModel[], isReturn = false) => {
    const dataSave = data.map((item) => {
      const type = Number(typeGroup?.typeGroup);
      const paid =
        type === TYPE_OF_PROPOSAL.PAYMENT
          ? item?.hold > 0
            ? item?.hold
            : item?.paid
          : item?.hold;

      const paymentAmountSubmit = item?.totalAmount - paid;

      return {
        ...item,
        paymentAmountSubmit: paymentAmountSubmit,
        descriptionSubmit: item?.description,
        retainedAmount: item?.totalAmount - paymentAmountSubmit,
        paid: paid,
        hold: item?.hold,
        paidSubmit: item?.paid,
      };
    });
    const dataInvoiceModel = model.invoices;
    const dataPassInvoiceModel: InvoiceModel[] = [];
    dataSave.forEach((item) => {
      if (dataInvoiceModel.findIndex((x) => x.id === item.id) === -1) {
        dataPassInvoiceModel.push(item);
      } else {
        dataPassInvoiceModel.push(
          dataInvoiceModel.find((x) => x.id === item.id) as InvoiceModel
        );
      }
    });
    const dataPassInvoiceModelAddIndex = dataPassInvoiceModel.map(
      (item, index) => {
        return {
          ...item,
          indexBeforeValidate: index,
        };
      }
    );
    if (isReturn) {
      return dataPassInvoiceModelAddIndex;
    } else {
      handleChangeSingleField({
        fieldName: "invoices",
      })(dataPassInvoiceModelAddIndex);
    }
  };

  const handleClickResetCostAllocationLine = () => {
    model.costAllocation = costAllocationDefault;

    handleChangeSingleField({
      fieldName: "costAllocation",
    })(model.costAllocation);
  };

  const isDifferentInvoiceMatching = (
    invoicesIds: string[],
    invoicesIdsSave: string[]
  ) => {
    return isEqual(invoicesIds, invoicesIdsSave);
  };

  const handleMatchingInvoice = (modelPass: PaymentRequestModel) => {
    setLoading(true);
    if (
      isDifferentInvoiceMatching(
        modelPass?.invoices?.map((item) => item?.id) ?? [],
        modelPass?.invoicesIdsSaveMatching ?? []
      )
    ) {
      const params: ParamsDownloadMatchingFDA = {
        contractId: modelPass?.paymentInheritanceId,
        invoiceMatchingResultIds: modelPass?.invoiceMatchingResultIds,
      };
      downloadMatchingFDAFile(params);
      return;
    }
    const invoiceDtos =
      modelPass?.invoices?.map((item) => {
        return {
          invoiceId: item?.id,
          invoiceFdaId: item?.idFDA,
        };
      }) ?? [];
    const params: ParamMatchingFDA = {
      supplierId: modelPass?.supplier?.id,
      contractId: modelPass?.paymentInheritanceId,
      invoiceDtos: invoiceDtos,
    };
    // Call the matchingFDA API and handle the file download
    paymentRepository.matchingFDA(params).subscribe({
      next: (response) => {
        // Download the generated file
        setLoading(false);
        const params: ParamsDownloadMatchingFDA = {
          invoiceMatchingResultIds: response?.invoiceMatchingResultIds ?? [],
          contractId: modelPass?.paymentInheritanceId,
        };
        handleChangeAllField({
          ...model,
          invoicesIdsSaveMatching: modelPass?.invoices?.map((item) => item?.id),
          invoiceMatchingResultIds: response?.invoiceMatchingResultIds,
          matchingInvoiceStatus: response?.status,
        });
        downloadMatchingFDAFile(params);
      },
      error: (error) => {
        handleMatchingFDAError(error);
        setLoading(false);
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  // Helper function to download the FDA matching file
  const downloadMatchingFDAFile = (params: ParamsDownloadMatchingFDA) => {
    paymentRepository.getFileMatchingFDA(params).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        setLoading(false);
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const nameFile = `result_matching_${uuidv4()}.xlsx`;
        saveAs(blob, nameFile);
      },
      error: (error) => {
        setLoading(false);
        handleMatchingFDAError(error);
      },
    });
  };

  // Helper function to handle errors in the FDA matching process
  const handleMatchingFDAError = (error: any) => {
    const errorMessage = isEmpty(error?.response?.data?.message)
      ? translate("CM.message_system_error")
      : error?.response?.data?.message;

    notifyToast({
      type: "error",
      message: errorMessage,
    });
  };

  const checkInternalAccount = (accountNumber: string, accountName: string) => {
    if (!accountNumber || !accountName) {
      return;
    }
    setLoading(true);
    paymentRepository
      .checkIsAccountBankInternal(accountNumber, accountName)
      .subscribe({
        next: (response) => {
          const data = response?.data as DataCheckingInternal;
          if (!data?.isInternalAccount) {
            handleChangeAllField({
              ...model,
              internalAccount: data,
              errors: {
                ...model?.errors,
                "paymentInformation.accountNumber": data?.message,
              },
            });
          } else {
            handleChangeAllField({
              ...model,
              internalAccount: data,
              errors: {
                ...model?.errors,
                "paymentInformation.accountNumber": null,
              },
            });
            notifyToast({
              type: "success",
              message: data?.message,
            });
          }
          setLoading(false);
        },
        error: (error) => {
          setLoading(false);
          const messageErr = isEmpty(error?.response?.data?.message)
            ? translate("CM.message_system_error")
            : error?.response?.data?.message;
          notifyToast({
            type: "error",
            message: messageErr,
          });
        },
        complete: () => {
          setLoading(false);
        },
      });
  };

  const valuesContext: PaymentCreateModel = {
    loading,
    history,
    translate,
    isVNDOrJPY,
    paymentInheritanceInformation,
    dispatchModel,
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    breadcrumbs,
    listPuchasingDocument,
    formatNumberToCurrency,
    handleSave,
    PaymentType: "",
    modal: modalType,
    setModalType,
    listInformationTransfer,
    setListInformationTransfer,
    handleUploadFileError,
    handleDownloadFileAttached,
    handleChangeAllField,
    forceUpdateModal,
    updateModal,
    setLoading,
    typeGroup,
    getBankExchangeRate,
    handleClickAddCostAllocationLine,
    notifyToast,
    getForeignCurrencyAmount,
    modalCostAllocation,
    setModalCostAllocation,
    handleGetListCostCenterByAllocationMonth,
    isLoadingButtonGetListCostCenter,
    setIsLoadingButtonGetListCostCenter,
    handleUpdateListCostCenterByAllocationMonth,
    endPath,
    path: history.location.pathname,
    initSearchInvoiceParams,
    handleGetTransferInfo,
    idDetail,
    getLastPath,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    errorsModal,
    setErrorsModal,
    handleApplyInvoiceFDA,
    isDisableAllocationMonth,
    setIsDisableAllocationMonth,
    setAcceptInvoiceWarning,
    inheritanceType: paymentInheritanceType?.current,
    setInitSearchInvoiceParams,
    handleClickResetCostAllocationLine,
    costDriverDefault,
    handleGoMaster,
    handleConvertRequestBodyPayment,
    handleMatchingInvoice,
    checkInternalAccount,
  };

  return {
    ...valuesContext,
    // not context
    tabRepositories,
    title,
  };
}
