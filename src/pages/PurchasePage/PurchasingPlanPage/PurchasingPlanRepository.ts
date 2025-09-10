import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { DEFAULT_PAGE_SIZE } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { isEmpty, isNil, kebabCase } from "lodash";
import { BusinessDepartmentModel, UserModel } from "models/Budget/Budget";
import CommonFilter from "models/CommonFilter";
import { FileTemplate } from "models/FileTemplate";
import { ManufacturerCategoriesCode } from "models/ManufacturerCategories/ManufacturerCategoriesFilter";
import { ListOpinionFilter } from "models/OpinionCollector";
import { Organization } from "models/Organization";
import {
  SupplierFilter,
  SupplierModel,
} from "models/Payment/PaymentRequestModel";
import { RequestAttachment, TypeFilterModel } from "models/Proposal";
import { GoodsServices, GoodsServicesFilter } from "models/PurchaseRequest";
import {
  BodyApprovePrincipleSupplier,
  BodyApprovePurchasingPlan,
  ClarificationRequestModel,
  ClarificationResponseBody,
  ConvertibleGoodsItems,
  CriteriaItemModel,
  CriteriaType,
  EditEvaluation,
  EvaluationCriteria,
  EvaluationCriteriaModel,
  EvaluationMethod,
  EvaluationResultsBody,
  ExtensionOfTime,
  GoodsServicesCategory,
  GoodsServicesCategoryResponseModel,
  IPurchaseRequest,
  LastRoundSupplier,
  ListApprovedSupplier,
  ListApprovedSupplierModel,
  ListPurchaseRequest,
  ListPurchaseRequestModel,
  NegotiationSupplier,
  OpinionTopicFinancial,
  OptionNoEnumModel,
  ParamsApproveModel,
  ParamsConfirmAddingNegotiationRound,
  ParamsConfirmCreateRound,
  ParamsSelectSupplierPrioritize,
  ParamsSubmitSelectSupplierForNegotiation,
  ParamsUpdateStatus,
  PointScaleModel,
  PurchasePlanBidModel,
  PurchasePlanGoodsServicesModel,
  PurchaseProposalModel,
  PurchaseRequestWaitingForPlanFilterModel,
  PurchasingPlanDetailModel,
  PurchasingPlanRequest,
  PurchasingPlanTypeModel,
  QuotationClarificationRequest,
  QuotationDetailIdType,
  QuotationSupplier,
  RequestNextRoundBid,
  RequestSendEmail,
  SaveDraftSelectSupplierPayload,
  SearchingFilterModel,
  SendResultBiddingPayload,
  SendResultPayload,
  SupplierPurchasePlansModel,
  SupplierQuotationDetail,
} from "models/PurchasingPlan";
import { PurchasingSelectModalFilter } from "models/PurchasingPlan/Filter";
import {
  GoodsServicesByPrincipleContractFilter,
  PurchasingPlanFilter,
} from "models/PurchasingPlan/PurchasingPlanFilter";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";
import { NextRoundBidRequestBody } from "../PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/Components/ModalNextRoundBid/helper";
import { DataForm } from "./PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { GoodServiceFilter } from "models/Proposal/GoodService";

const API_GETALL = "/purchasing/plan/getAll";
const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
const API_GET_PROPOSAL = "/purchasing/request/originalPurchase";
const API_GET_GROUP_GOODS_SERVICES = "/purchasing/request/purchaseItemGroup";
const API_GOODS_SERVICES_CATEGORY = "/master/goodsServicesCategory/getAll";
const API_GET_LIST_MANUFACTURERS = "/master/manufacturers";
const API_GET_LIST_GOOD_SERVICES = "master/goodsServices/getAll";
const API_GET_LIST_COST_ITEM = "/master/cost/group";

export const API_PURCHASING_PLAN_CREATE = "/purchasing/plan";
export const API_PURCHASING_PLAN_UPDATE = "/purchasing/plan/update";

export const API_PURCHASING_PLAN_CREATE_CHCT = "/purchasing/plan/typeCHCT";
export const API_PURCHASING_PLAN_UPDATE_CHCT =
  "/purchasing/plan/update/typeCHCT";

export const API_PURCHASING_PLAN_CREATE_DT = "/purchasing/plan/typeDT";
export const API_PURCHASING_PLAN_UPDATE_DT = "/purchasing/plan/update/typeDT";

const API_GET_ALL_EVALUATION_CRITERIA =
  "/purchasing/plan/getAllEvaluationCriteria";
const API_GET_ALL_EVALUATION_CRITERIA_WITH_DESCRIPTION =
  "/purchasing/plan/getAllEvaluationCriteriaWithDecription";

export const API_PURCHASING_PLAN_CREATE_VALIDATE =
  "/purchasing/plan/validateCreatePurchasePlan";
const PURCHASING_REQUEST_ENDPOINT = "/purchasing/request/getListApproved";
const API_MASTER_BUSINESS_DEPARTMENT = "master/businessDepartment";
const API_MASTER_ORGANIZATION = "/master/organization/getAll";
export const API_MASTER_USER = "auth/user";
export const API_MASTER_USER_POST = "/auth/user/getAll ";

const API_GET_REQUEST_PURCHASING = "/purchasing/request/originPurchase";
const API_GET_SUPPLIER_DROPDOWN = "/master/supplier/getDropdown";
const API_GET_SUPPLIER = "master/supplier/getByCategoryIds";
const API_PLAN_DETAIL = "/purchasing/plan";
const API_UPDATE_EXTENSION_OF_TIME = "purchasing/plan/extendQuotationTime";
const API_SEND_EMAIL_TO_SUPPLIER = "purchasing/plan/sendEmailToSupplier";
const API_CHANGE_STATUS = "purchasing/plan/updateStatus";
const API_QUOTATION_SUPPLIER_INFORMATION = `${API_PLAN_DETAIL}/getSupplierByPurchasePlanId`;
const API_GET_PRINCIPLE_CONTRACT_OF_SUPPLIER =
  "purchasing/contract/getChoosePrincipleContractOfSupplier";
const TAX_LIST_API = "/master/tax";
const API_GET_PRINCIPLE_CONTRACT_BY_SUPPLIER =
  "purchasing/contract/getPrincipleContractBySupplier";
const API_NEXT_ROUND_BID = "purchasing/plan/createRound";
const API_GET_GOODS_SERVICES_BY_PRINCIPLE_CONTRACT =
  "purchasing/contract/getGoodsByPrincipleContract";
const API_CONTRACT_SUPPLIER_APPROVE = "purchasing/plan/contractSupplierApprove"; // Duyệt nhà cung cấp
const API_GET_BIDDING_SUPPLIER = "/master/supplier/getAll";
const API_GET_NEGOTIATION_SUPPLIER = "/purchasing/plan/getNegotiationSupplier";
const API_GET_BIDDING_SUPPLIER_TYPE = "/master/supplierType/getAll";
const API_PURCHASE_PLAN_ADJUST_BID_DETAIL =
  "/purchasing/plan/getAdjustmentInfo";
const API_PURCHASE_GET_SUGGEST_EVALUATION_CRITERIA =
  "/purchasing/plan/getSuggestEvaluationCriteria";
const API_PUT_SELECT_SUPPLIER_FOR_PLAN = "purchasing/plan/selectSupplier";
const API_ADD_CLARIFICATION_REQUEST = "/purchasing/evaluation/clarification";
const API_SUBMIT_RESULT = "/purchasing/evaluation/submitResult";
const API_UPDATE_RESULTS = "/purchasing/evaluation/updateResults";
const API_LIST_OPINIONS = "/share/opinionResponse/getByTopic";

const ORGANIZATION_GET_ALL_API = "/master/organization/getDropdown";
const API_DOWNLOAD_TEMPLATE_EVALUATION =
  "/purchasing/evaluation/downloadTemplate";
const API_IMPORT_PURCHASING_EVALUATION = "/purchasing/evaluation/import";
const AUTH_USER_API = "/auth/user";
const GATHER_OPINION = "/purchasing/evaluation/gather-opinion";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
const API_EVALUATION_CONFIRM = "/purchasing/evaluation/confirmResult";
const API_EVALUATION_SUMMARIZE = "/purchasing/evaluation/summarizeResult";
const API_SUBMIT_SUPPLIER_FOR_NEGOTIATION =
  "/purchasing/plan/approveSupplierForNegotiation";
const API_GET_SUPPLIER_FOR_NEGOTIATION =
  "/purchasing/plan/supplierForNegotiation";
const API_RENEGOTIATION = "/purchasing/plan/renegotiation";
const API_SAVE_PLAN_DRAFT = "/purchasing/plan/saveDraftSelectSupplier";
const API_DROPDOWN_SUPPLIER = "/purchasing/clarification/dropDown";
const API_CREATE_CONVERTIBLE_GOODS = "/purchasing/plan/createConvertibleGoods";

const API_SUBMIT_CONFIRM_ADDING_NEGOTIATION_ROUND = (id: string) =>
  `/purchasing/quotation/${id}/createRound`;

const API_SUBMIT_CONFIRM_ADDING_NEGOTIATION_ROUND_BIDDING = (id: string) =>
  `/purchasing/quotation/${id}/createBidRound`;

const API_SELECT_SUPPLIER_PRIORITY = "/purchasing/plan/selectSupplier";

const API_GET_SUPPLIER_LAST_ROUND = (id: string) =>
  `/purchasing/quotation/${id}/getSupplierLastRound`;

const API_CREATE_NEXT_ROUND = (id: string) =>
  `purchasing/quotation/${id}/createRound`;

const API_GET_CLARIFICATION_DETAIL = (id: string) =>
  `/purchasing/clarification/${id}`;

const API_SEND_CLARIFICATION_REQUEST = "/purchasing/clarification/request";

const API_APPROVED_POINT = "/purchasing/evaluation/approveResult";
const API_REQUEST_RE_MARK = "/purchasing/evaluation/requestEvaluateAgain";
const API_SEND_POINT = "/purchasing/evaluation/sendResultApproval";

const QUOTATION_COMPARISON_API = (id: string) =>
  `/purchasing/quotation/${id}/quotationComparison`;

export class PurchasingPlanRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listAll = (
    filter: PurchasingPlanFilter
  ): Observable<ListResult<Model>> => {
    const fromDate = filter?.createDate?.greaterEqual
      ? dayjs(filter?.createDate?.greaterEqual)?.toDate()?.toISOString()
      : undefined;

    const toDate = filter?.createDate?.lessEqual
      ? dayjs(filter?.createDate?.lessEqual)?.toDate()?.toISOString()
      : undefined;
    const body = {
      tab: filter?.tab ? Number(filter?.tab) : 0,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      name: filter?.name?.trim(),
      status: filter?.statusesId?.map(Number),
      code: filter?.code?.trim(),
      originalPurchasePlanCode: filter?.originalPurchasePlanCode?.trim(),
      adjustmentDescription: filter?.adjustmentDescription?.trim(),
      note: filter?.note?.trim(),
      purchasePlanTypes: filter?.purchasePlanTypesId?.map(Number),
      costGroupIds: filter?.costGroupId,
      goodIds: filter?.goodsIdsId,
      supplierIds: filter?.listApprovedId,
      originPurchaseRequestIds: filter?.originPurchaseRequestIdsId,
      createdUser: filter?.createUserValue?.map(
        (item: { email: string }) => item.email
      ),
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      totalRange: {
        from: filter?.totalRangeFrom?.lessEqual,
        to: filter?.totalRangeTo?.greaterEqual,
      },
      businessDepartmentIds: filter?.businessUnitIdId,
      organizationIds: filter?.organizationIdId,
      type: filter?.tabKey
        ? Number(filter?.tabKey) === 2
          ? 1
          : Number(filter?.tabKey)
        : 0,
    };

    return this.http.post(API_GETALL, body);
  };

  public getProposalPurchase = (
    filter: PurchasingSelectModalFilter
  ): Observable<ListResult<PurchaseProposalModel>> => {
    let body = {};

    if (filter) {
      body = {
        pageIndex: filter.pageIndex,
        pageSize: filter.pageSize,
        orderBy: filter.orderBy,
        search: filter.search?.trim(),
        TotalPriceTo: filter.totalRangeFrom,
        TotalPriceEnd: filter.totalRangeTo,
        StartDate: isEmpty(filter.createdDateRange?.[0])
          ? undefined
          : dayjs(filter.createdDateRange?.[0])?.format(),
        EndDate: isEmpty(filter.createdDateRange?.[1])
          ? undefined
          : dayjs(filter.createdDateRange?.[1])?.format(),
        isPurchaseRequestAdjustment: filter.isPurchaseRequestAdjustment,
        idExit: filter.idExit,
        purchasePlanId: filter.purchasePlanId,
        purchasePlanType: filter.purchasePlanType,
      };
    }
    return this.http.post(API_GET_PROPOSAL, body);
  };

  public getGoodServiceGroup = (
    filter: PurchasingSelectModalFilter
  ): Observable<ListResult<PurchasePlanGoodsServicesModel>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      search: filter?.search?.trim(),
      OriginalPurchaseRequestId: filter?.id,
      purchasePlanType: filter?.purchasePlanType,
      categoryIds: filter?.categoryIds?.map(
        (item: OptionNoEnumModel) => item.id
      ),
      purchasePlanId: filter?.purchasePlanId,
      goods: filter?.goods,
    };
    return this.http.post(API_GET_GROUP_GOODS_SERVICES, body).pipe(
      map((response) => {
        return {
          ...response,
          data: {
            ...response.data,
            items: response.data.items.map(
              (item: PurchasePlanGoodsServicesModel) => {
                return {
                  ...item,
                };
              }
            ),
          },
        };
      })
    );
  };

  public getListCostGroup = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(API_GET_LIST_COST_ITEM, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public goodsServiceCategory = (
    filter?: GoodsServicesFilter
  ): Observable<GoodsServicesCategory[]> => {
    return this.http
      .get<GoodsServicesCategoryResponseModel>(API_GOODS_SERVICES_CATEGORY, {
        params: {
          search: filter?.name?.trim() || "",
          status: filter?.status,
        },
      })
      .pipe(
        map((response) => {
          return response?.data?.items;
        })
      );
  };

  public uploadFileDocument = (
    file: File[] | Blob[]
  ): Observable<FileModel[]> => {
    const formData: FormData = new FormData();
    file.forEach((f) => formData.append("Files", f));
    return this.http
      .post<FileModel[]>(API_UPLOAD_ATTACHED_FILE, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(map((response) => response?.data));
  };

  public createPurchasingPlanRequest = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .post<PurchasingPlanTypeModel>(API_PURCHASING_PLAN_CREATE, data)
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public createPurchasingPlanRequestDT = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .post<PurchasingPlanTypeModel>(API_PURCHASING_PLAN_CREATE_DT, data)
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public updatePurchasingPlanRequestDT = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .put<PurchasingPlanTypeModel>(
        `${API_PURCHASING_PLAN_UPDATE_DT}/${data?.id}`,
        data
      )
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public validatePurchasingPlanRequestDT = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .post<PurchasingPlanTypeModel>(
        `${API_PURCHASING_PLAN_CREATE_VALIDATE}/typeDT `,
        data
      )
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public createPurchasingPlanRequestCHCT = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .post<PurchasingPlanTypeModel>(API_PURCHASING_PLAN_CREATE_CHCT, data)
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public validatePurchasingPlanRequestCHCT = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .post<PurchasingPlanTypeModel>(
        `${API_PURCHASING_PLAN_CREATE_VALIDATE}/typeCHCT `,
        data
      )
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public updatePurchasingPlanRequestCHCT = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .put<PurchasingPlanTypeModel>(
        `${API_PURCHASING_PLAN_UPDATE_CHCT}/${data?.id}`,
        data
      )
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public updatePurchasingPlanRequest = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .put<PurchasingPlanTypeModel>(
        `${API_PURCHASING_PLAN_UPDATE}/${data?.id}`,
        data
      )
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public createValidatePurchasingPlanRequest = (
    data: PurchasingPlanRequest
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .post<PurchasingPlanTypeModel>(API_PURCHASING_PLAN_CREATE_VALIDATE, data)
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public submitApproval = (
    data: ParamsApproveModel | BodyApprovePrincipleSupplier
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .put<PurchasingPlanTypeModel>(
        `${API_PURCHASING_PLAN_CREATE}/sendApproval`,
        data
      )
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public getPaymentRequestWaitingForPlanList = (
    filter: PurchaseRequestWaitingForPlanFilterModel
  ): Observable<ListResult<IPurchaseRequest>> => {
    const totalRange =
      !isNil(filter?.totalRange?.lessEqual) ||
      !isNil(filter?.totalRange?.greaterEqual)
        ? {
            from: Number(filter?.totalRange?.lessEqual),
            to: Number(filter?.totalRange?.greaterEqual),
          }
        : undefined;

    const createdDateRange =
      !isNil(filter?.createdDateRange?.lessEqual) ||
      !isNil(filter?.createdDateRange?.greaterEqual)
        ? {
            from: filter?.createdDateRange?.greaterEqual,
            to: filter?.createdDateRange?.lessEqual,
          }
        : undefined;

    const createdUser = filter?.createdUserValue?.map(
      (item: CommonFilter) => item?.email
    );

    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search,
      code: filter?.code,
      name: filter?.name,
      purchaseProposalCode: filter?.purchaseProposalCode,
      purchasingMethods: filter?.purchasingMethodsId?.map(Number),
      directAppointmentMethods: filter?.appointmentMethodsId?.map(Number),
      costGroupIds: filter?.costGroupId,
      organizationIds: filter?.organizationIdValue?.map(
        (el: Organization) => el.id
      ),
      purchaseOrganizationIds: filter?.purchaseOrganizationId,
      goodsIds: filter?.goodsId,
      createdUser,
      totalRange,
      createdDateRange,
    };

    return this.http.post(PURCHASING_REQUEST_ENDPOINT, body);
  };

  public listBusinessDepartment = (
    filter: SearchingFilterModel
  ): Observable<BusinessDepartmentModel[]> => {
    return this.http
      .get(API_MASTER_BUSINESS_DEPARTMENT, {
        params: {
          search: !isEmpty(filter?.searchText?.contain?.trim())
            ? filter?.searchText?.contain?.trim()
            : undefined,
        },
      })
      .pipe(Repository.responseDataMapper<BusinessDepartmentModel[]>());
  };

  public listOrganization = (
    filter: SearchingFilterModel
  ): Observable<CommonFilter[]> => {
    return this.http
      .post(API_MASTER_ORGANIZATION, {
        search: !isEmpty(filter?.searchText?.contain?.trim())
          ? filter?.searchText?.contain?.trim()
          : undefined,
      })
      .pipe(map((response) => response?.data?.items));
  };

  public getGoodServicesList = (
    filter: SearchingFilterModel
  ): Observable<CommonFilter[]> => {
    return this.http
      .post(API_GET_LIST_GOOD_SERVICES, {
        search: filter?.name?.trim() ? filter?.name?.trim() : undefined,
      })
      .pipe(
        map((response) =>
          Array.isArray(response?.data?.items) ? response?.data?.items : []
        )
      );
  };

  /**
   * Retrieves a list of master users based on the provided filter criteria.
   *
   * @param filter - The search filter model containing criteria for filtering users
   * @returns An Observable that emits an array of UserModel objects
   */
  public listMasterUser = (
    filter: SearchingFilterModel
  ): Observable<UserModel[]> => {
    return this.http
      .get(API_MASTER_USER, {
        params: {
          // Include search text if provided, otherwise undefined
          search: filter?.searchText?.contain?.trim() || undefined,

          // Include pagination parameters if provided
          pageIndex: isNil(filter?.pageIndex) ? undefined : filter?.pageIndex,
          pageSize: isNil(filter?.pageSize) ? undefined : filter?.pageSize,

          // Include filter for active status if provided
          isActive: isNil(filter?.isActive) ? undefined : filter?.isActive,

          // Include filter for supplier status if provided
          isSupplier: isNil(filter?.isSupplier)
            ? undefined
            : filter?.isSupplier,
        },
      })
      .pipe(
        // Transform the API response into an array of UserModel objects
        Repository.responseDataMapper<UserModel[]>()
      );
  };

  /**
   * Retrieves a list of master users based on the provided filter criteria.
   *
   * @param filter - The search filter model containing criteria for filtering users
   * @returns An Observable that emits an array of UserModel objects
   */
  public listMasterUserPost = (
    filter: SearchingFilterModel
  ): Observable<UserModel[]> => {
    const payload = {
      search: filter.searchText?.contain?.trim(),
      pageIndex: filter.pageIndex,
      pageSize: filter.pageSize,
      isActive: filter.isActive,
      isSupplier: filter.isSupplier,
      userIgnoreIds: filter.userIgnoreIds,
    };
    return this.http
      .post<UserModel[]>(API_MASTER_USER_POST, payload)
      .pipe(map((response) => (response?.data as any)?.items));
  };

  public getListManufacturers = (
    filter: TypeFilterModel
  ): Observable<ManufacturerCategoriesCode[]> => {
    return this.http
      .get<ManufacturerCategoriesCode[]>(API_GET_LIST_MANUFACTURERS, {
        params: {
          search: filter?.name?.trim() || "",
          isActive: filter?.isActive || false,
        },
      })
      .pipe(Repository.responseDataMapper<ManufacturerCategoriesCode[]>());
  };

  public getRequestPurchasing = (
    filter: ListPurchaseRequestModel
  ): Observable<ListPurchaseRequest[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.get(API_GET_REQUEST_PURCHASING, { params }).pipe(
      map((response) => {
        return response?.data?.map((item: ListPurchaseRequest) => ({
          id: item?.id,
          name: item?.name,
          code: item?.code,
        }));
      })
    );
  };

  public getDropdownSupplier = (
    filter: ListApprovedSupplierModel
  ): Observable<ListApprovedSupplier[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.get(API_GET_SUPPLIER_DROPDOWN, { params }).pipe(
      map((response) => {
        return response?.data?.map((item: ListApprovedSupplier) => ({
          id: item?.id,
          name: item?.name,
        }));
      })
    );
  };

  public getSupplierList = (
    filter: SupplierFilter
  ): Observable<ListResult<SupplierModel>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      categoryIds: filter?.categoryIds,
    };
    return this.http.post(API_GET_SUPPLIER, body);
  };

  public getListPrincipleContractOfSupplier = (
    filter: SupplierFilter
  ): Observable<ListResult<SupplierPurchasePlansModel>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      purchasePlanId: filter?.purchasePlanId,
      supplierPrincipleContracts: filter?.supplierPrincipleContracts,
    };
    return this.http.post(API_GET_PRINCIPLE_CONTRACT_OF_SUPPLIER, body);
  };

  public deletePurchasingPlan = (
    id: string,
    data: DataForm
  ): Observable<string> => {
    const params = {
      reason: data?.reason,
    };

    return this.http
      .delete(`${API_PURCHASING_PLAN_CREATE}/${id}`, { params })
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelPurchasingPlan = (
    id: string,
    data: DataForm
  ): Observable<string> => {
    const params = {
      user: data?.email,
      reason: data?.reason,
    };

    return this.http
      .put(
        `${API_PURCHASING_PLAN_CREATE}/${id}/waitingCancel`,
        {},
        {
          params,
        }
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  public getPlanDetail = (
    id: string,
    isView: boolean,
    isViewWaitingApprove?: boolean,
    isViewBid?: boolean,
    isPerform?: boolean,
    isSaveAndPreview?: boolean
  ): Observable<PurchasingPlanDetailModel> => {
    const endpoint = `${API_PLAN_DETAIL}/${id}`;
    return this.http
      .get<PurchasingPlanDetailModel>(endpoint, {
        params: {
          isView: isView,
          isViewWaitingApprove: isViewWaitingApprove,
          isViewBid: isViewBid,
          isPerform: isPerform,
          isSaveAndPreview,
        },
      })
      .pipe(Repository.responseDataMapper<PurchasingPlanDetailModel>());
  };

  public getPurchasePlanAdjustBidEditPage = (
    purchasePlanId: string
  ): Observable<PurchasePlanBidModel> => {
    return this.http
      .get<PurchasePlanBidModel>(API_PURCHASE_PLAN_ADJUST_BID_DETAIL, {
        params: {
          id: purchasePlanId,
        },
      })
      .pipe(Repository.responseDataMapper<PurchasePlanBidModel>());
  };

  public getPurchasePlanAdjustBidDetail = (
    purchasePlanId: string,
    isView: boolean,
    isViewWaitingApprove?: boolean
  ): Observable<PurchasePlanBidModel> => {
    return this.http
      .get<PurchasePlanBidModel>(
        `${API_PLAN_DETAIL}/${purchasePlanId}?isView=${isView}&isViewWaitingApprove=${isViewWaitingApprove}`
      )
      .pipe(map((response) => response?.data));
  };

  public updateExtensionOfTime = (data: ExtensionOfTime): Observable<any> => {
    const requestBody = {
      id: data?.id,
      extendTime: data?.extendTime,
    };
    return this.http.put(API_UPDATE_EXTENSION_OF_TIME, requestBody);
  };

  public sendEmailToSupplier = (data: RequestSendEmail): Observable<any> => {
    const bodyRequest = {
      tos: data?.tos,
      ccs: data?.ccs,
      subject: data?.subject,
      textBody: data?.textBody,
      attachmentFiles: data?.attachmentFiles,
      supplierPurchasePlanId: data?.supplierPurchasePlanId,
    };
    return this.http.put(API_SEND_EMAIL_TO_SUPPLIER, bodyRequest);
  };

  public approvePurchasingPlan = (
    id: string,
    body?: BodyApprovePurchasingPlan
  ): Observable<string> => {
    return this.http
      .put(`${API_PLAN_DETAIL}/${id}/approve`, body)
      .pipe(Repository.responseDataMapper<string>());
  };

  public approvePurchasingPlanBid = (
    id: string,
    body?: BodyApprovePurchasingPlan
  ): Observable<string> => {
    return this.http
      .put(`/purchasing/evaluation/${id}/approve`, body)
      .pipe(Repository.responseDataMapper<string>());
  };

  public sendApprovePurchasingPlan = (
    id: string,
    body?: BodyApprovePurchasingPlan
  ): Observable<string> => {
    return this.http
      .put(`/purchasing/evaluation/${id}/sendApprove`, body)
      .pipe(Repository.responseDataMapper<string>());
  };

  public approveContractSupplier = (body?: any): Observable<string> => {
    return this.http
      .put(`${API_CONTRACT_SUPPLIER_APPROVE}`, body)
      .pipe(Repository.responseDataMapper<string>());
  };

  public returnPurchasingPlan = (
    id: string,
    data: DataForm
  ): Observable<string> => {
    const params = {
      reason: data?.reason,
    };
    return this.http
      .put(
        `${API_PLAN_DETAIL}/${id}/return`,
        {},
        {
          params,
        }
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  public updateResults = (data: {
    evaluationResults: EvaluationResultsBody[];
  }): Observable<string> => {
    return this.http
      .put(`${API_UPDATE_RESULTS}`, data)
      .pipe(Repository.responseDataMapper<string>());
  };

  public rejectPurchasingPlan = (
    id: string,
    data: DataForm
  ): Observable<string> => {
    const params = {
      reason: data?.reason,
    };
    return this.http
      .put(
        `${API_PLAN_DETAIL}/${id}/reject-cancellation`,
        {},
        {
          params,
        }
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  public sendResultPurchasingPlan = (
    sendResultPayload: SendResultPayload
  ): Observable<string> => {
    if (isEmpty(sendResultPayload)) return;

    return this.http
      .post(API_SUBMIT_RESULT, sendResultPayload)
      .pipe(Repository.responseDataMapper<string>());
  };

  public sendResultBidding = (
    sendResultPayload: SendResultBiddingPayload
  ): Observable<string> => {
    if (isEmpty(sendResultPayload)) return;

    return this.http
      .post(API_SUBMIT_RESULT, sendResultPayload)
      .pipe(Repository.responseDataMapper<string>());
  };

  public approveCancellationPurchasingPlan = (
    id: string
  ): Observable<string> => {
    return this.http
      .put(`${API_PLAN_DETAIL}/${id}/approve-cancellation`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public updateStatusPlan = (
    params: ParamsUpdateStatus
  ): Observable<string> => {
    return this.http
      .put(API_CHANGE_STATUS, {
        ...params,
      })
      .pipe(Repository.responseDataMapper<string>());
  };

  public updateNextRoundBid = (
    data: RequestNextRoundBid
  ): Observable<string> => {
    const bodyRequest = {
      supplierId: data?.supplierId,
      name: data?.name,
      taxCode: data?.taxCode,
      address: data?.address,
      type: data?.type,
      quoteEmail: data?.quoteEmail,
      quoteName: data?.quoteName,
      phoneNumber: data?.phoneNumber,
      content: data?.content,
      emailRecipients: data?.emailRecipients,
      purchasePlanId: data?.purchasePlanId,
      roundStartDate: data?.roundStartDate,
      roundEndDate: data?.roundEndDate,
    };
    return this.http
      .put(`${API_NEXT_ROUND_BID}/${data.id}`, bodyRequest)
      .pipe(Repository.responseDataMapper<string>());
  };

  public getListTaxCodeSupplier = (filter: SupplierFilter) => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.name?.trim(),
      categoryIds: filter?.categoryIds,
    };
    return this.http.post(API_GET_SUPPLIER, body).pipe(
      map((response) => {
        return response?.data?.items?.map(
          (item: {
            id: string;
            name: string;
            taxCode: string;
            address: string;
            type: string;
          }) => {
            return {
              id: item.id,
              name: item.name,
              code: item.taxCode,
              address: item.address,
              type: item.type,
            };
          }
        );
      })
    );
  };

  public getSupplierByPurchasePlanId = (
    purchasePlanId?: string
  ): Observable<QuotationSupplier[]> =>
    this.http
      .get<QuotationSupplier[]>(API_QUOTATION_SUPPLIER_INFORMATION, {
        params: {
          purchasePlanId,
        },
      })
      .pipe(Repository.responseDataMapper<QuotationSupplier[]>());

  public getSupplierQuotation = (quotationDetailId: QuotationDetailIdType) => {
    return this.http
      .post(`${API_PLAN_DETAIL}/supplierQuotation`, quotationDetailId)
      .pipe(Repository.responseDataMapper<SupplierQuotationDetail>());
  };

  public validateSendApproval = (
    data: ParamsApproveModel | BodyApprovePrincipleSupplier
  ): Observable<PurchasingPlanTypeModel> => {
    return this.http
      .put<PurchasingPlanTypeModel>(
        `${API_PURCHASING_PLAN_CREATE}/validatorSendApproval`,
        data
      )
      .pipe(
        Repository.responseMapToModel<PurchasingPlanTypeModel>(
          PurchasingPlanTypeModel
        )
      );
  };

  public getTaxList = (filter: ModelFilter): Observable<CommonFilter[]> => {
    return this.http
      .get(TAX_LIST_API, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getSuggestEvaluationCriteria = (
    purchasePlanId: string,
    evaluationMethod: EvaluationMethod,
    criteriaType: CriteriaType,
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(API_PURCHASE_GET_SUGGEST_EVALUATION_CRITERIA, {
        params: {
          id: purchasePlanId,
          evaluationMethod,
          criteriaType,
          search: filter?.name?.trim(),
        },
      })
      .pipe(map((response) => response?.data));
  };

  public getAllEvaluationCriteria = (
    purchasePlanId: string,
    evaluationMethod: EvaluationMethod,
    criteriaType: CriteriaType,
    filter: ModelFilter
  ): Observable<EvaluationCriteriaModel[]> => {
    return this.http
      .get(API_GET_ALL_EVALUATION_CRITERIA, {
        params: {
          id: purchasePlanId,
          evaluationMethod,
          criteriaType,
          search: filter?.name?.trim() || undefined,
        },
      })
      .pipe(
        map((response) => {
          return response?.data?.map(
            (item: EvaluationCriteriaModel, index: number) => {
              const criteriaItems = (
                item?.criteriaItems as CriteriaItemModel[]
              )?.map(
                (
                  criteriaItem: CriteriaItemModel,
                  criteriaItemIndex: number
                ) => {
                  const maximumPointScales = (
                    criteriaItem?.maximumPointScales as PointScaleModel[]
                  )?.map(
                    (
                      maximumPointScale: PointScaleModel,
                      maximumPointScaleIndex: number
                    ) => {
                      const minimumPointScales = (
                        maximumPointScale?.minimumPointScales as PointScaleModel[]
                      )?.map(
                        (
                          minimumPointScale: PointScaleModel,
                          minimumPointScaleIndex: number
                        ) => {
                          return {
                            ...minimumPointScale,
                            id: `${minimumPointScaleIndex + 1}`,
                          };
                        }
                      );

                      return {
                        ...maximumPointScale,
                        id: `${maximumPointScaleIndex + 1}`,
                        minimumPointScales,
                      };
                    }
                  );
                  return {
                    ...criteriaItem,
                    id: `${criteriaItemIndex + 1}`,
                    maximumPointScales,
                  };
                }
              );

              return {
                ...item,
                id: item?.name ?? `${index + 1}`,
                criteriaItems,
              };
            }
          );
        })
      );
  };

  public getAllEvaluationCriteriaWithDescription = (
    purchasePlanId: string,
    evaluationMethod: EvaluationMethod,
    criteriaType: CriteriaType,
    filter: ModelFilter
  ): Observable<EvaluationCriteriaModel[]> => {
    return this.http
      .get(API_GET_ALL_EVALUATION_CRITERIA_WITH_DESCRIPTION, {
        params: {
          id: purchasePlanId,
          evaluationMethod,
          criteriaType,
          search: filter?.name?.trim() || undefined,
        },
      })
      .pipe(
        map((response) => {
          return response?.data?.map(
            (item: EvaluationCriteriaModel, index: number) => {
              const criteriaItems = (
                item?.criteriaItems as CriteriaItemModel[]
              )?.map(
                (
                  criteriaItem: CriteriaItemModel,
                  criteriaItemIndex: number
                ) => {
                  const maximumPointScales = (
                    criteriaItem?.maximumPointScales as PointScaleModel[]
                  )?.map(
                    (
                      maximumPointScale: PointScaleModel,
                      maximumPointScaleIndex: number
                    ) => {
                      const minimumPointScales = (
                        maximumPointScale?.minimumPointScales as PointScaleModel[]
                      )?.map(
                        (
                          minimumPointScale: PointScaleModel,
                          minimumPointScaleIndex: number
                        ) => {
                          return {
                            ...minimumPointScale,
                            id: `${minimumPointScaleIndex + 1}`,
                          };
                        }
                      );

                      return {
                        ...maximumPointScale,
                        id: `${maximumPointScaleIndex + 1}`,
                        minimumPointScales,
                      };
                    }
                  );
                  return {
                    ...criteriaItem,
                    id: `${criteriaItemIndex + 1}`,
                    maximumPointScales,
                  };
                }
              );

              return {
                ...item,
                id: item?.name ?? `${index + 1}`,
                criteriaItems,
              };
            }
          );
        })
      );
  };

  public getPrincipleContractBySupplier = (
    contractId: string,
    supplierId: string,
    purchasePlanId: string
  ): Observable<SupplierModel> => {
    return this.http
      .get<SupplierModel>(API_GET_PRINCIPLE_CONTRACT_BY_SUPPLIER, {
        params: {
          contractId,
          supplierId,
          purchasePlanId,
        },
      })
      .pipe(Repository.responseDataMapper<SupplierModel>());
  };

  public getGoodsServicesByPrincipleContractList = (
    filter: GoodsServicesByPrincipleContractFilter
  ): Observable<ListResult<GoodsServices>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      contractId: filter?.contractId,
      supplierId: filter?.supplierId,
      purchasePlanId: filter?.purchasePlanId,
      selectedGoods: filter?.selectedGoods,
      supplierPrincipleContracts: filter?.supplierPrincipleContracts,

      search: filter?.search?.trim(),
    };
    return this.http.post(API_GET_GOODS_SERVICES_BY_PRINCIPLE_CONTRACT, body);
  };

  public getSupplierBidding = (
    filter: ModelFilter
  ): Observable<ListResult<Model>> => {
    const body: ModelFilter = {
      supplierTypeIds: filter?.supplierTypeIds,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      categoryIds: filter?.categoryIds,
    };

    return this.http.post(API_GET_BIDDING_SUPPLIER, body);
  };

  public getSupplierNegotiationSupplier = (
    filter: ModelFilter
  ): Observable<ListResult<Model>> => {
    const body: ModelFilter = {
      supplierTypeIds: filter?.supplierTypeIds,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      id: filter?.id,
    };

    return this.http.post(API_GET_NEGOTIATION_SUPPLIER, body);
  };

  public getSupplierBiddingType = (
    filter?: ModelFilter
  ): Observable<Model[]> => {
    const requestBody = {
      search: filter?.name?.trim(),
    };

    return this.http.post(API_GET_BIDDING_SUPPLIER_TYPE, requestBody).pipe(
      map((response) => {
        return response?.data?.items;
      })
    );
  };

  public selectSupplierForPlan = (
    planId: string,
    supplierId: string,
    attachments: RequestAttachment[]
  ): Observable<Model> => {
    const requestBody = {
      id: planId,
      supplierId: supplierId,
      attachments: attachments,
    };
    return this.http.put(API_PUT_SELECT_SUPPLIER_FOR_PLAN, requestBody);
  };

  public addClarificationRequest = (
    data: ClarificationRequestModel
  ): Observable<ClarificationRequestModel> => {
    return this.http
      .post(API_ADD_CLARIFICATION_REQUEST, data)
      .pipe(map((response) => response?.data));
  };

  public getOpinionTopicFinancial = (
    body?: ListOpinionFilter
  ): Observable<OpinionTopicFinancial[]> => {
    return this.http
      .post(`${API_LIST_OPINIONS}`, body)
      .pipe(Repository.responseDataMapper<OpinionTopicFinancial[]>());
  };

  public getListMasterUser = (filter: ModelFilter): Observable<UserModel[]> => {
    return this.http
      .get(API_MASTER_USER, {
        params: {
          search: filter?.name?.trim(),
          pageIndex: filter?.filter?.pageIndex ?? 1,
          pageSize: filter?.filter?.pageSize ?? 30,
        },
      })
      .pipe(Repository.responseDataMapper<UserModel[]>());
  };

  public downloadFileTemplateEvaluation(
    params?: ModelFilter,
    type?: number,
    evaluationTeamUserIds?: string[],
    evaluationMethod?: number
  ): Observable<AxiosResponse<ArrayBuffer>> {
    const body = {
      ...params,
      type,
      evaluationMethod,
      evaluationTeamUserIds,
    };

    return this.http.post<ArrayBuffer>(API_DOWNLOAD_TEMPLATE_EVALUATION, body, {
      responseType: "arraybuffer" as const,
    });
  }

  public uploadFileTemplateEvaluation = (
    formData: FormData
  ): Observable<EvaluationCriteria[]> => {
    return this.http
      .post(API_IMPORT_PURCHASING_EVALUATION, formData)
      .pipe(map((response) => response?.data));
  };

  public getListUserEvaluation = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      pageSize: DEFAULT_PAGE_SIZE,
      isActive: true,
    };

    return this.http
      .get(AUTH_USER_API, {
        params,
      })
      .pipe(
        map((response) => {
          return response?.data?.map((item: CommonFilter) => ({
            id: item?.id,
            name: item?.name,
            email: item?.email,
            code: item?.email,
          }));
        })
      );
  };

  public getListOrganization = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .post(ORGANIZATION_GET_ALL_API, requestBody)
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public gatherOpinion = (data: {
    quotationRequestId: string;
    gatherOpinionEndDate: string;
  }): Observable<string> => {
    return this.http
      .post(GATHER_OPINION, data)
      .pipe(Repository.responseDataMapper<string>());
  };

  public getSupplierLastRound = (
    purchasePlanId: string
  ): Observable<LastRoundSupplier[]> => {
    return this.http
      .get(API_GET_SUPPLIER_LAST_ROUND(purchasePlanId))
      .pipe(Repository.responseDataMapper<LastRoundSupplier[]>());
  };

  public createNextRound = (
    purchasePlanId: string,
    body: NextRoundBidRequestBody
  ): Observable<string> => {
    return this.http
      .post(API_CREATE_NEXT_ROUND(purchasePlanId), body)
      .pipe(Repository.responseDataMapper<string>());
  };

  // Api for WF
  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_PLAN_DETAIL + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };

  public actionsPurchasePlanPrinciple = (
    data: WorkflowAction
  ): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(
        API_PLAN_DETAIL + "/actions/contractSupplierPlan",
        data
      )
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
  ): Observable<PurchasingPlanRequest> => {
    return this.http
      .post<PurchasingPlanRequest>(
        kebabCase(nameof(this.digitalSign)),
        signatureInfo
      )
      .pipe(
        map((response: AxiosResponse<PurchasingPlanRequest>) => response.data)
      );
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_PLAN_DETAIL}/template/listSignature`, {
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
        `${API_PLAN_DETAIL}/template/form/${requestId}`,
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
        `${API_PLAN_DETAIL}/template/form/${requestId}`
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

  public previewFormConfiguration = (
    model: RequestFormConfiguration
  ): Observable<any> => {
    return this.http.post<RequestFormConfiguration>(
      `${API_PLAN_DETAIL}/template/previewFormConfiguration`,
      model,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public getFile = (Id: string): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer",
      params: {
        Id,
      },
    });
  };

  public previewSignedForm = (
    item: PurchasingPlanRequest
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(
      `${API_PLAN_DETAIL}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_PLAN_DETAIL}/template/listTemplate`,
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
      `${API_PLAN_DETAIL}/template/previewDynamicTemplate/${param?.queryParams}`,
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

  public submitSelectSupplierForNegotiation = (
    params: ParamsSubmitSelectSupplierForNegotiation
  ): Observable<string> => {
    return this.http
      .post(`${API_SUBMIT_SUPPLIER_FOR_NEGOTIATION}`, params)
      .pipe(Repository.responseDataMapper<string>());
  };

  public getListSupplierForNegotiation = (
    id: string
  ): Observable<NegotiationSupplier[]> => {
    return this.http
      .get(`${API_GET_SUPPLIER_FOR_NEGOTIATION}/${id}`)
      .pipe(map((response) => response?.data));
  };

  public renegotiationSupplier = (
    sendResultPayload: SendResultPayload
  ): Observable<string> => {
    if (isEmpty(sendResultPayload)) return;

    return this.http
      .post(API_RENEGOTIATION, { id: sendResultPayload.id })
      .pipe(Repository.responseDataMapper<string>());
  };

  public validateSaveDraft = (payload: SaveDraftSelectSupplierPayload) => {
    const body = {
      ...payload,
    };
    return this.http.post(API_SAVE_PLAN_DRAFT, body).pipe(
      map((response) => {
        return {
          ...response,
        };
      })
    );
  };

  public submitConfirmAddingNegotiationRound = (
    params: ParamsConfirmCreateRound,
    id: string
  ): Observable<string> => {
    return this.http
      .post(`${API_SUBMIT_CONFIRM_ADDING_NEGOTIATION_ROUND(id)}`, params)
      .pipe(Repository.responseDataMapper<string>());
  };

  public submitConfirmAddingNegotiationRoundBiding = (
    params: ParamsConfirmCreateRound,
    id: string
  ): Observable<string> => {
    return this.http
      .post(
        `${API_SUBMIT_CONFIRM_ADDING_NEGOTIATION_ROUND_BIDDING(id)}`,
        params
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  public submitCreateNextQuotationRound = (
    params: ParamsConfirmCreateRound,
    id: string
  ): Observable<string> => {
    return this.http
      .post(`${API_SUBMIT_CONFIRM_ADDING_NEGOTIATION_ROUND(id)}`, params)
      .pipe(Repository.responseDataMapper<string>());
  };

  //chọn nhà cung cấp ưu tiên đàm phán
  public selectSupplierForNegotiation = (
    params: ParamsSelectSupplierPrioritize
  ): Observable<string> => {
    return this.http
      .put(`${API_SELECT_SUPPLIER_PRIORITY}`, params)
      .pipe(Repository.responseDataMapper<string>());
  };

  public postEvaluationSummarizeResult = (quotationRoundId: {
    quotationRoundId: string;
  }): Observable<any> => {
    return this.http.post(API_EVALUATION_SUMMARIZE, quotationRoundId);
  };

  public postEvaluationConfirmResult = (body: any): Observable<any> => {
    return this.http.post(API_EVALUATION_CONFIRM, body);
  };

  public updateSelectSupplier = (
    body: ConvertibleGoodsItems
  ): Observable<string> => {
    return this.http
      .post(API_CREATE_CONVERTIBLE_GOODS, body)
      .pipe(map((response) => response?.data));
  };

  public waitingForApprovalSelectSupplier = (
    id: string
  ): Observable<string> => {
    return this.http
      .put(`${API_PLAN_DETAIL}/${id}/waitingApproval`)
      .pipe(Repository.responseDataMapper<string>());
  };

  /**
   * Lấy chi tiết clarification của purchasing plan
   * @param id ID của clarification
   * @returns Observable chứa chi tiết clarification
   */
  public getClarificationDetail(id: string): Observable<any> {
    return this.http.get(API_GET_CLARIFICATION_DETAIL(id));
  }

  /**
   * Gửi phản hồi cho yêu cầu clarification
   * @param body Thông tin phản hồi
   * @returns Observable chứa kết quả phản hồi
   */
  public sendClarificationResponse(
    body: ClarificationResponseBody,
    id: string
  ): Observable<any> {
    return this.http.post(
      `${API_GET_CLARIFICATION_DETAIL(`${id}`)}/response`,
      body
    );
  }

  /**
   * Gửi yêu cầu làm rõ báo giá
   * @param data - Thông tin yêu cầu làm rõ báo giá
   * @returns Observable chứa kết quả của request
   */
  public sendClarificationRequest(
    data: QuotationClarificationRequest
  ): Observable<QuotationClarificationRequest> {
    return this.http
      .post<QuotationClarificationRequest>(API_SEND_CLARIFICATION_REQUEST, data)
      .pipe(map((response) => response?.data));
  }

  public getListSupplierDropdown = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      id: filter?.id,
    };

    return this.http
      .get(API_DROPDOWN_SUPPLIER, {
        params,
      })
      .pipe(map((response) => response.data));
  };

  public approvedPoint(
    quotationRequestId: string
  ): Observable<QuotationClarificationRequest> {
    return this.http
      .put<QuotationClarificationRequest>(API_APPROVED_POINT, {
        quotationRequestId: quotationRequestId,
      })
      .pipe(map((response) => response?.data));
  }

  public requestReMark(
    quotationRequestId: string
  ): Observable<QuotationClarificationRequest> {
    return this.http
      .put<QuotationClarificationRequest>(API_REQUEST_RE_MARK, {
        quotationRequestId: quotationRequestId,
      })
      .pipe(map((response) => response?.data));
  }

  public sendPoint(
    quotationRequestId: string
  ): Observable<QuotationClarificationRequest> {
    return this.http
      .put<QuotationClarificationRequest>(API_SEND_POINT, {
        quotationRequestId: quotationRequestId,
      })
      .pipe(map((response) => response?.data));
  }

  public getGoodServicesListByModal = (
    filter: GoodServiceFilter
  ): Observable<ListResult<GoodsServices>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim(),
      isGetForProposal: false,
      goodsServicesCategoryIds: filter?.goodsServicesCategoryId
        ? filter?.goodsServicesCategoryId
        : [],
      costTypeId: filter?.costTypeId,
    };

    return this.http.post(API_GET_LIST_GOOD_SERVICES, requestBody);
  };

  public downloadQuotationComparison = (id: string): Observable<any> => {
    return this.http.post<any>(
      QUOTATION_COMPARISON_API(id),
      {},
      {
        responseType: "arraybuffer" as "json",
      }
    );
  };
}

export const purchasingPlanRepository = new PurchasingPlanRepository();
