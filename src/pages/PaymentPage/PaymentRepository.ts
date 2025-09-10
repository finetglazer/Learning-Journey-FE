import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import dayjs from "dayjs";
import { isEmpty, isUndefined, kebabCase } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { BudgetPlan, CostLine } from "models/CostOwner/BudgetPlan";
import { FileTemplate } from "models/FileTemplate";
import { GLAccount, GLAccountFilter } from "models/GLAccount";
import {
  COST_PERIODS,
  InvoiceRequestModel,
  MatchingFDA,
  ParamMatchingFDA,
  ParamsDownloadMatchingFDA,
  paramsGetBankModel,
  ParamsGetDetailInheritanceFromProposal,
  PaymentAdvancedFilters,
  PaymentInvoicesIdsObservableModel,
} from "models/Payment";
import { PaymentFilter } from "models/Payment/PaymentFilter";
import {
  AccountingAccountModel,
  BudgetOverViewStatusFilter,
  BudgetOverViewStatusResponseModel,
  CostDriverModel,
  CostLineFilterModel,
  CostTypeGroupFilterModel,
  CostTypeResModel,
  ExChangeRateModel,
  ExpenseReversalModel,
  FilterListCostCenter,
  InvoiceResponseModel,
  InvoiceResponseObservableModel,
  PaymentDetailTypeModel,
  PaymentGetListCostCenter,
  PaymentModel,
  PaymentTypeApplicationFilter,
  PaymentTypeApplicationResponseModel,
  PaymentTypeApplicationResponseObservableModel,
  PaymentValidCostCenterModel,
  PromotionModel,
  RequesterValueModel,
  SupplierFilter,
  SupplierModel,
  TaxTypeModel,
  TransferInformationModel,
  TypeFilterModel,
} from "models/Payment/PaymentRequestModel";
import { Project } from "models/Project/Project";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { ModelFilter, Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable, of } from "rxjs";
import nameof from "ts-nameof.macro";

const API_PAYMENT = "/payment/request";
const API_PAYMENT_PREFIX = "payment/request/getAll";
const API_PAYMENT_REQUEST_TYPE = "payment/request/type";
const API_PAYMENT_ACTION = "payment/request";
const API_PAYMENT_CURRENCY = "master/bank/currency";
const API_MASTER_BUSINESS_BRANCH = "master/businessBranch";
const API_MASTER_SUPPLIER = "master/supplier/list";
const API_MASTER_COST_TYPE = "master/cost/type";
const API_MASTER_BUSINESS_UNIT = "master/businessUnit";

//start api payment create information common
export const API_GET_ALL_TYPE_REQUEST = "payment/request/type";
export const API_GET_ALL_CURRENCY_TYPE = "master/bank/currency";
export const API_GET_ALL_COST_TYPE = "master/cost/type";
export const API_GET_ALL_COST_ITEM = "master/cost/group";
export const API_GET_BANK_EXCHANGE_RATE = "master/bank/exchange";
export const API_PROMOTION_PROGRAM = "master/promotion";
export const API_GET_SUPPLIER = "master/supplier";
export const API_GET_RECEIVING_BANK = "master/bank";
export const API_UPLOAD_ATTACHED_FILE_BANK_TRANFER =
  "payment/request/transferStatement";
export const API_GET_ALL_PROJECT = "budget/project/getAll";
export const API_GET_PROJECT_LIST = "budget/projectMaster";
export const API_GET_PROJECT_DROPDOWN = "budget/projectMaster/dropdown";
export const API_GET_DOCUMENT_TYPE = "master/documentType";
export const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
export const API_PAYMENT_REQUEST = "payment/request";
export const API_BUSINESS_DEPARTMENT = "master/businessDepartment";
export const API_GET_TAX_TYPE = "master/tax";
export const API_GET_PROJECT_BY_COST_CENTER =
  "budget/projectMaster/byCostCenter";
export const API_GET_COST_LINE_BY_PROJECT = "master/costline";
export const API_GET_COST_DRIVER = "master/costDriver";
export const API_GET_OVERVIEW_BUDGET_STATUS = "budget/projectMaster/status";
export const API_GET_PAYMENT_DETAIL = "payment/request";
export const API_GET_LIST_COST_CENTER_BY_ALLOCATION =
  "master/costCenterAllocation/getAll";
export const API_GET_INVOICE_LIST = "master/invoice";
export const API_GET_EXPENSE_LIST = "payment/request/getByType";
export const API_GET_EXPENSE_LIST_BY_ID = "payment/request/selected";
export const API_GET_ACCOUNTING_ACCOUNT = "master/accountingAccount";
export const API_GET_glACCOUNT = "master/glAccount";
export const API_GET_TRANSFER_INFORMATION = "master/payeeAccount/bank";
export const API_UPDATE_PAYMENT_REQUEST = "payment/request/update";
export const API_PAYMENT_INVOICE_CHECK_VALID =
  "master/invoice/checkValidInvoices";
export const API_VALID_COST_CENTER = "budget/projectMaster/validCostCenter";
export const API_GET_DETAIL_INHERITANCE_PROPOSAL =
  "/purchasing/inheritance/proposal";
export const API_CREATE_PAYMENT_CONTRACT = "purchasing/inheritance/contract";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
const API_MATCHING_FDA = "payment/request/matchingInvoiceFDA";
const API_DOWNLOAD_FILE_MATCHING_FDA = "payment/request/downloadMatchingFDA";
const API_CHECK_INTERNAL_BANK_NUMBER = "payment/request/checkIsInternalAccount";

//end api payment create information common

export class PaymentRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listAll = (filter: PaymentFilter): Observable<any> => {
    const requestEmail = filter?.requesterValue?.map(
      (item: any) => item?.email
    );

    const greaterEqualDate = filter?.createDate?.greaterEqual
      ? dayjs(filter.createDate.greaterEqual).toDate().toISOString()
      : undefined;

    const lessEqualDate = filter?.createDate?.lessEqual
      ? dayjs(filter.createDate.lessEqual).toDate().toISOString()
      : undefined;

    const numericAdvancedFilters = this.getListIds(filter?.advancedFiltersId);

    const body = {
      tab: filter?.tab ? Number(filter?.tab) : 0,
      pageIndex: filter.pageIndex,
      pageSize: filter.pageSize,
      orderBy: filter.orderBy,
      orderType: filter.orderType,
      search: filter.search?.trim(),
      code: filter?.code?.contain?.trim(),
      description: filter?.description?.contain?.trim(),
      requesters: requestEmail,
      paymentRequestTypeId: filter?.paymentRequestTypeIdId?.in,
      currencyIds: filter?.currencyIdId?.in,
      paymentMethod: filter?.paymentMethodId?.in,
      costTypeId: filter?.costTypeIdId?.in,
      costGroupId: filter?.costGroupIdId?.in,
      businessUnitId: filter?.businessUnitIdId?.in,
      businessBranchId: filter?.businessBranchIdId?.in,
      businessDepartmentId: filter?.businessDepartmentIdId?.in,
      purposeType: filter?.purposeTypeId?.in,
      supplierId: filter?.supplierIdId?.in,
      statuses: filter?.statusesId?.in?.map(Number),
      erpStatuses: filter?.erpStatusesId?.in?.map(Number),
      awaitingPayment: !!numericAdvancedFilters?.includes(
        PaymentAdvancedFilters.AWAITING_PAYMENT
      ),
      from: greaterEqualDate,
      to: lessEqualDate,
    };
    return this.http.post(API_PAYMENT_PREFIX, body);
  };

  public listBusinessUnit = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER_BUSINESS_UNIT, {
        params: {
          search: filter?.name?.contain?.trim(),
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public listPaymentCurrency = (filter: any): Observable<any> => {
    return this.http
      .get(API_PAYMENT_CURRENCY, {
        params: {
          search: filter?.name?.contain?.trim(),
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public listBusinessBranchId = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER_BUSINESS_BRANCH, {
        params: {
          search: filter?.name?.trim(),
          proposalId: filter?.paymentInheritanceId,
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public listBusinessBranch = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER_BUSINESS_BRANCH, {
        params: {
          search: filter?.name?.contain?.trim(),
          proposalId: filter?.paymentInheritanceId,
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public listBusinessBranchForDetailedSupplierPayables = (
    filter: any
  ): Observable<any> => {
    return this.http
      .get(API_MASTER_BUSINESS_BRANCH, {
        params: {
          search: filter?.name?.trim(),
          proposalId: filter?.paymentInheritanceId,
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public listRequestType = (filter: any): Observable<any> => {
    return this.http
      .get(API_PAYMENT_REQUEST_TYPE, {
        params: {
          search: filter?.name?.contain?.trim(),
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public listSupplier = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER_SUPPLIER, {
        params: {
          search: filter?.name?.contain?.trim(),
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public listCostType = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER_COST_TYPE, {
        params: {
          search: filter?.name?.contain?.trim(),
          isActive: true,
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<any>());
  };

  public deletePayment = (id: string, reason: string): Observable<string> => {
    return this.http
      .delete(`${API_PAYMENT_ACTION}/${id}`, { params: { reason } })
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelPayment = (id: string, reason: string): Observable<string> => {
    return this.http
      .put(`${API_PAYMENT_ACTION}/${id}/cancel?reason=${reason || ""}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  //api get values select
  public getRequestsTypeList = (
    filter: TypeFilterModel
  ): Observable<PaymentModel[]> => {
    return this.http
      .get<PaymentModel[]>(API_GET_ALL_TYPE_REQUEST, {
        params: {
          TypeGroup: filter?.typeGroup || "",
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<PaymentModel[]>());
  };

  //start api payment create information common

  public getBankExchangeRate = (
    currencyCode: string
  ): Observable<ExChangeRateModel> => {
    return this.http
      .get<ExChangeRateModel>(
        `${API_GET_BANK_EXCHANGE_RATE}/${currencyCode || ""}`
      )
      .pipe(Repository.responseDataMapper<ExChangeRateModel>());
  };

  public getCostTypeList = (
    filter: TypeFilterModel
  ): Observable<CostTypeResModel[]> => {
    return this.http
      .get<CostTypeResModel[]>(API_GET_ALL_COST_TYPE, {
        params: {
          search: filter?.name?.trim() || "",
          isActive: true,
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(
        map((response) =>
          response?.data.map((item) => ({ ...item, key: item.id }))
        )
      );
  };

  public businessDepartment = (
    filter: TypeFilterModel
  ): Observable<CostTypeResModel[]> => {
    return this.http
      .get<CostTypeResModel[]>(API_BUSINESS_DEPARTMENT, {
        params: {
          search: filter?.name?.trim() || "",
          businessUnitId: filter?.businessUnitId || "",
          proposalId: filter?.paymentInheritanceId,
        },
      })
      .pipe(
        map((response) =>
          response?.data.map((item) => ({ ...item, key: item.id }))
        )
      );
  };

  public getPromotionList = (
    filter: TypeFilterModel
  ): Observable<PromotionModel[]> => {
    return this.http
      .get<PromotionModel[]>(API_PROMOTION_PROGRAM, {
        params: {
          search: filter?.name?.trim() || "",
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(
        map((response) =>
          response?.data.map((item) => ({
            ...item,
            key: item.id,
            name: item.name,
            code: item.code,
          }))
        )
      );
  };

  public getCostTypeGroupList = (
    filter: CostTypeGroupFilterModel
  ): Observable<CostTypeResModel[]> => {
    return this.http
      .get<CostTypeResModel[]>(API_GET_ALL_COST_ITEM, {
        params: {
          search: filter?.name?.trim() || "",
          CostTypeId: filter?.costTypeId || "",
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(
        map((response) =>
          response?.data.map((item) => ({ ...item, key: item.id }))
        )
      );
  };

  public getSupplierList = (filter: SupplierFilter): Observable<any> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      SupplierType: filter?.supplierType?.id,
    };
    return this.http.get<SupplierModel[]>(API_GET_SUPPLIER, {
      params: {
        ...body,
      },
    });
  };

  public getCurrencyTypeList = (
    filter: TypeFilterModel
  ): Observable<PaymentModel[]> => {
    return this.http
      .get<PaymentModel[]>(API_GET_ALL_CURRENCY_TYPE, {
        params: {
          search: filter?.name?.trim() || "",
          isActive: true,
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<PaymentModel[]>());
  };

  public getReceivingBankList = (
    filter: TypeFilterModel
  ): Observable<PaymentModel[]> => {
    return this.http
      .get<PaymentModel[]>(API_GET_RECEIVING_BANK, {
        params: {
          search: filter?.name?.trim() || "",
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<PaymentModel[]>());
  };

  public import = (file: File[] | Blob[]): Observable<FileModel> => {
    const formData: FormData = new FormData();
    file.forEach((f) => {
      formData.append("File", f);
    });
    return this.http
      .post(API_UPLOAD_ATTACHED_FILE_BANK_TRANFER, formData)
      .pipe(map((response) => response?.data));
  };

  public uploadFileDocument = (
    file: File[] | Blob[]
  ): Observable<FileModel> => {
    const formData: FormData = new FormData();
    file.forEach((f) => {
      formData.append("Files", f);
    });
    return this.http
      .post(API_UPLOAD_ATTACHED_FILE, formData)
      .pipe(map((response) => response?.data));
  };

  public getAllProject = (filter: any): Observable<Project[]> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.name?.trim(),
      businessBranches: filter?.businessBranches,
    };
    return this.http
      .post(API_GET_ALL_PROJECT, body)
      .pipe(map((response) => response?.data?.items as Project[]));
  };

  public getProjectList = (
    filter: TypeFilterModel
  ): Observable<PaymentModel[]> => {
    return this.http
      .get<PaymentModel[]>(API_GET_PROJECT_LIST, {
        params: {
          search: filter?.name?.trim() || "",
          isProject: filter?.isProject || false,
          pageSize: 30,
          proposalId: filter?.paymentInheritanceId,
          isProposalSelection: filter?.isProposalSelection,
          businessUnitId: filter?.businessUnitValue?.id,
          businessBranchId: filter?.businessBranchValue?.id,
          businessDepartmentId: filter?.businessDepartmentValue?.id,
        },
      })
      .pipe(Repository.responseDataMapper<PaymentModel[]>());
  };

  public getProjectDropdown = (
    filter: ModelFilter
  ): Observable<OptionBaseModel[]> => {
    const params = {
      search: filter?.search?.trim() || undefined,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      ownerBusinessUnit: filter?.ownerBusinessUnit,
      ownerBusinessBranch: filter?.ownerBusinessBranch,
      ownerBusinessDepartment: filter?.ownerBusinessDepartment,
      isProject: filter?.isProject || false,
    };
    return this.http
      .get<OptionBaseModel[]>(API_GET_PROJECT_DROPDOWN, { params })
      .pipe(Repository.responseDataMapper<OptionBaseModel[]>());
  };

  public getDocumentTypeList = (
    filter: TypeFilterModel
  ): Observable<PaymentModel[]> => {
    return this.http
      .get<PaymentModel[]>(API_GET_DOCUMENT_TYPE, {
        params: {
          search: filter?.name?.trim() || "",
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<PaymentModel[]>());
  };

  public taxType = (filter: TypeFilterModel): Observable<TaxTypeModel[]> => {
    return this.http
      .get<TaxTypeModel[]>(API_GET_TAX_TYPE, {
        params: {
          search: filter?.name?.trim() || "",
          taxType: filter?.taxType || 0,
        },
      })
      .pipe(Repository.responseDataMapper<TaxTypeModel[]>());
  };

  public getInfoBank = (
    filter: paramsGetBankModel
  ): Observable<TransferInformationModel[]> => {
    return this.http
      .get<TransferInformationModel[]>(API_GET_TRANSFER_INFORMATION, {
        params: {
          code: filter?.search?.trim() || "",
          bankId: isEmpty(filter?.search)
            ? undefined
            : isEmpty(filter?.bankId)
            ? undefined
            : filter?.bankId,
          bankName: !isEmpty(filter?.search)
            ? isEmpty(filter?.bankId)
              ? filter?.bankName?.trim()
              : undefined
            : undefined,
        },
      })
      .pipe(Repository.responseDataMapper<TransferInformationModel[]>());
  };

  public costDriver = (
    filter: TypeFilterModel
  ): Observable<CostDriverModel[]> => {
    return this.http
      .get<CostDriverModel[]>(API_GET_COST_DRIVER, {
        params: {
          search: filter?.name?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<CostDriverModel[]>());
  };

  public projectByCostCenter = (
    filter: TypeFilterModel
  ): Observable<Project[]> => {
    return this.http
      .post<{
        items: Project[];
      }>(API_GET_PROJECT_BY_COST_CENTER, {
        search: filter?.name?.trim() || "",
        isProject: filter?.isProject || false,
        businessBranchId: filter?.businessBranchId || "",
        businessUnitId: filter?.businessUnitId || "",
        businessDepartmentId: filter?.businessDepartmentId || "",
        budgetId: filter?.budgetId || null,
        proposalId: filter?.paymentInheritanceId,
        costGroupId: filter?.costGroupId || null,
      })
      .pipe(map((response) => response?.data?.items));
  };

  public costLineByProject = (
    filter: CostLineFilterModel
  ): Observable<CostLine[]> => {
    const params: {
      search: string;
      budgetId?: string;
    } = {
      search: filter?.name?.trim() || "",
    };
    if (filter?.budgetId) {
      params.budgetId = filter.budgetId.toString();
    }
    return this.http
      .get<CostLine[]>(API_GET_COST_LINE_BY_PROJECT, {
        params,
      })
      .pipe(Repository.responseDataMapper<CostLine[]>());
  };

  public createPaymentRequest = (
    data: PaymentModel
  ): Observable<BudgetPlan> => {
    return this.http
      .post<BudgetPlan>(API_PAYMENT_REQUEST, data)
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public updatePaymentRequest = (
    data: PaymentModel
  ): Observable<BudgetPlan> => {
    const { idDetail, ...rest } = data;
    return this.http
      .put<BudgetPlan>(`${API_UPDATE_PAYMENT_REQUEST}/${idDetail}`, rest)
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public save = (data: PaymentModel): Observable<PaymentModel> => {
    return data?.id
      ? this.updatePaymentRequest(data)
      : this.createPaymentRequest(data);
  };

  // API FAKE Filter
  getListCostPeriods = (filter: TypeFilterModel) => {
    return of(COST_PERIODS).pipe(
      map((costPeriods) => {
        if (!filter.name?.trim()) {
          return costPeriods;
        } else {
          const searchName = filter.name.trim().toLowerCase();
          return costPeriods.filter((period) =>
            period.name.toLowerCase().includes(searchName)
          );
        }
      })
    );
  };

  //end api payment create information common
  public getBudgetOverViewStatus = (
    filter: BudgetOverViewStatusFilter
  ): Observable<BudgetOverViewStatusResponseModel> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      costCenterIds: filter?.costCenterIds,
      isProject: filter?.isProject,
    };
    return this.http
      .post<BudgetOverViewStatusResponseModel>(
        API_GET_OVERVIEW_BUDGET_STATUS,
        body
      )
      .pipe(Repository.responseDataMapper<BudgetOverViewStatusResponseModel>());
  };

  public getPaymentDetail = (
    id: string,
    isView = false
  ): Observable<PaymentDetailTypeModel> => {
    const endpoint = `${API_GET_PAYMENT_DETAIL}/${id}?isView=${isView}`;
    return this.http
      .get<PaymentDetailTypeModel>(endpoint)
      .pipe(Repository.responseDataMapper<PaymentDetailTypeModel>());
  };

  public getListCostCenter = (
    filter: FilterListCostCenter
  ): Observable<PaymentGetListCostCenter> => {
    return this.http
      .post<PaymentGetListCostCenter>(
        API_GET_LIST_COST_CENTER_BY_ALLOCATION,
        filter
      )
      .pipe(Repository.responseDataMapper<PaymentGetListCostCenter>());
  };

  public getInvoiceList = (
    filter: SupplierFilter
  ): Observable<InvoiceResponseObservableModel> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      isNew: filter?.isNew,
      topicType: filter?.topicType,
      currencyCode: filter?.currencyCode,
      taxCode: filter?.taxCode,
    };
    return this.http.get<InvoiceResponseModel>(API_GET_INVOICE_LIST, {
      params: {
        ...body,
      },
    });
  };

  public getExpenseReversalList = (
    filter: PaymentTypeApplicationFilter
  ): Observable<PaymentTypeApplicationResponseObservableModel> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      currencyId: filter?.currencyId ? filter?.currencyId : undefined,
      supplierId: filter?.supplierId ? filter?.supplierId : undefined,
      createUsers:
        filter?.requesterValue && filter?.requesterValue?.length > 0
          ? filter?.requesterValue?.map(
              (item: RequesterValueModel) => item.email
            )
          : undefined,
      ids: filter?.ids ? filter?.ids : undefined,
      paymentRequestTypeGroup: Number(filter?.paymentRequestTypeGroup),
      paymentRequestTypeId: filter?.paymentRequestTypeId,
      paymentInheritanceType: filter?.paymentInheritanceType,
      paymentInheritanceId: filter?.paymentInheritanceId,
    };
    return this.http.post<PaymentTypeApplicationResponseModel>(
      API_GET_EXPENSE_LIST,
      body
    );
  };

  public getExpenseReversalListById = (
    filter: string[]
  ): Observable<ExpenseReversalModel[]> => {
    return this.http
      .post<ExpenseReversalModel[]>(API_GET_EXPENSE_LIST_BY_ID, {
        ids: filter || [],
      })
      .pipe(Repository.responseDataMapper<ExpenseReversalModel[]>());
  };

  public getAccountingAcount = (
    filter: TypeFilterModel
  ): Observable<AccountingAccountModel[]> => {
    return this.http
      .get<AccountingAccountModel[]>(API_GET_ACCOUNTING_ACCOUNT, {
        params: {
          search: filter?.name?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<AccountingAccountModel[]>());
  };

  public getglAcountDropdown = (
    filter: GLAccountFilter
  ): Observable<GLAccount[]> => {
    return this.http
      .get<GLAccount[]>(API_GET_glACCOUNT + "/getDropdown", {
        params: {
          search: filter?.name?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<GLAccount[]>());
  };

  public approvePaymentRequest = (id: number | string): Observable<string> => {
    return this.http
      .put<string>(`${API_PAYMENT_ACTION}/${id}/approve`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public declinePaymentRequest = (
    id: number | string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put<string>(`${API_PAYMENT_ACTION}/${id}/decline?reason=${reason || ""}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public returnPaymentRequest = (
    id: number | string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put<string>(`${API_PAYMENT_ACTION}/${id}/return?reason=${reason || ""}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public getActiveIdsInvoice = (
    filter: InvoiceRequestModel | undefined
  ): Observable<PaymentInvoicesIdsObservableModel> => {
    return this.http
      .post<string[]>(API_PAYMENT_INVOICE_CHECK_VALID, filter)
      .pipe(
        map((response) => {
          return response?.data;
        })
      );
  };

  public validCostCenter = (
    data: PaymentValidCostCenterModel
  ): Observable<number[]> => {
    return this.http
      .post<number[]>(API_VALID_COST_CENTER, {
        costCenterIds: data,
      })
      .pipe(
        map((response) => {
          return response?.data;
        })
      );
  };

  public getDataDetailInheritanceFormProposal = (
    params: ParamsGetDetailInheritanceFromProposal
  ): Observable<any> => {
    return this.http
      .post<any>(API_GET_DETAIL_INHERITANCE_PROPOSAL, {
        ...params,
      })
      .pipe(
        map((response) => {
          return response?.data;
        })
      );
  };

  public createPaymentContract = (data: {
    contractId: string;
    paymentScheduleInfoId: string;
  }): Observable<number[]> => {
    const requestBody = {
      contractId: data?.contractId,
      paymentScheduleInfoId: data?.paymentScheduleInfoId,
    };
    return this.http
      .post<number[]>(API_CREATE_PAYMENT_CONTRACT, requestBody)
      .pipe(
        map((response) => {
          return response?.data;
        })
      );
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_PAYMENT_ACTION + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };

  // Api for Signing Form
  public getSigningInfo = (id: number | string): Observable<SigningInfo> => {
    return this.http
      .post<SigningInfo>(kebabCase(nameof(this.getSigningInfo)), { id })
      .pipe(map((response: AxiosResponse<SigningInfo>) => response.data));
  };

  public digitalSign = (
    signatureInfo: SignatureInfo
  ): Observable<PaymentModel> => {
    return this.http
      .post<PaymentModel>(kebabCase(nameof(this.digitalSign)), signatureInfo)
      .pipe(map((response: AxiosResponse<PaymentModel>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_PAYMENT}/template/listSignature`, {
        search: filter?.search,
        notIn: filter?.notIn,
        requestId: filter?.id,
      })
      .pipe(
        map((response: AxiosResponse<WorkflowState[]>) => {
          const newData = response.data?.map((item: WorkflowState) => {
            return {
              ...item,
              id: item.key,
            };
          });
          return newData;
        })
      );
  };

  public saveFormConfiguration = (
    requestId: string,
    model: RequestFormConfiguration
  ): Observable<RequestFormConfiguration> => {
    return this.http
      .post<RequestFormConfiguration>(
        `${API_PAYMENT}/template/form/${requestId}`,
        {
          ...model,
          requestId,
        }
      )
      .pipe(
        map(
          (response: AxiosResponse<RequestFormConfiguration>) => response.data
        )
      );
  };

  public getFormConfiguration = (
    requestId: string
  ): Observable<RequestFormConfiguration> => {
    return this.http
      .get<RequestFormConfiguration>(
        `${API_PAYMENT}/template/form/${requestId}`
      )
      .pipe(
        map(
          (response: AxiosResponse<RequestFormConfiguration>) => response.data
        )
      );
  };

  public updateFormConfiguration = (
    model: RequestFormConfiguration
  ): Observable<RequestFormConfiguration> => {
    return this.http
      .post<RequestFormConfiguration>(
        kebabCase(nameof(this.updateFormConfiguration)),
        model
      )
      .pipe(
        map(
          (response: AxiosResponse<RequestFormConfiguration>) => response.data
        )
      );
  };

  public previewFormConfiguration = (
    model: RequestFormConfiguration
  ): Observable<any> => {
    return this.http.post<RequestFormConfiguration>(
      `${API_PAYMENT}/template/previewFormConfiguration`,
      model,
      {
        responseType: "arraybuffer",
      }
    );
  };

  // public validateFormConfiguration = (
  //   model: RequestFormConfiguration
  // ): Observable<RequestFormConfiguration> => {
  //   return this.http
  //     .post<RequestFormConfiguration>(
  //       kebabCase(nameof(this.validateFormConfiguration)),
  //       model
  //     )
  //     .pipe(
  //       map(
  //         (response: AxiosResponse<RequestFormConfiguration>) => response.data
  //       )
  //     );
  // };

  public getFile = (Id: string): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer",
      params: {
        Id,
      },
    });
  };

  public previewSignedForm = (
    item: PaymentModel
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(`${API_PAYMENT}/template/previewSignedForm`, item, {
      responseType: "arraybuffer",
    });
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_PAYMENT}/template/listTemplate`,
        {},
        {
          params: {
            requestId: id,
          },
        }
      )
      .pipe(map((response: AxiosResponse<FileTemplate[]>) => response.data));
  };

  public dynamicTemplatePreview = (
    param: FileTemplateParams
  ): Observable<AxiosResponse<any>> => {
    return this.http.post<AxiosResponse<any>>(
      `${API_PAYMENT}/template/previewDynamicTemplate/${param?.queryParams}`,
      {
        requestId: param?.queryParams,
        templateId: param?.template?.id,
        inputs: param?.inputs,
      },
      {
        responseType: "arraybuffer",
      }
    );
  };

  public uploadFile = (
    file: File | Blob,
    fileName?: string
  ): Observable<FileModel> => {
    const formData: FormData = new FormData();
    formData.append("file", file, fileName);
    return this.http
      .post<FileModel>(API_UPLOAD_SINGLE_FILE, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(map((response) => response?.data));
  };

  public dynamicTemplateDownloadPdf = (
    param: FileTemplateParams
  ): Observable<AxiosResponse<any>> => {
    return this.http.post<AxiosResponse<any>>(
      kebabCase(nameof(this.dynamicTemplateDownloadPdf)),
      param,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateDownloadOriginal = (
    param: FileTemplateParams
  ): Observable<AxiosResponse<any>> => {
    return this.http.post<AxiosResponse<any>>(
      kebabCase(nameof(this.dynamicTemplateDownloadOriginal)),
      param,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public matchingFDA = (params: ParamMatchingFDA): Observable<MatchingFDA> => {
    return this.http
      .post<MatchingFDA>(API_MATCHING_FDA, {
        ...params,
      })
      .pipe(map((response: AxiosResponse<MatchingFDA>) => response.data));
  };

  public getFileMatchingFDA = (
    params: ParamsDownloadMatchingFDA
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.post<ArrayBuffer>(API_DOWNLOAD_FILE_MATCHING_FDA, params, {
      responseType: "arraybuffer",
    });
  };

  public checkIsAccountBankInternal = (
    accountNumber: string,
    accountName: string
  ): Observable<any> => {
    const body = {
      accountNumber: accountNumber,
      accountName: accountName,
    };
    return this.http.get<InvoiceResponseModel>(API_CHECK_INTERNAL_BANK_NUMBER, {
      params: {
        ...body,
      },
    });
  };

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };
}

export const paymentRepository = new PaymentRepository();
