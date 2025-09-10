import { isNil, isObject, isUndefined, kebabCase } from "lodash";
import {
  ContractDetailBodyRequest,
  ContractDetailFormModel,
  ContractFile,
  ContractOrganizationModel,
  ContractSupplierModel,
  ModelConfirmType,
  ResponseBusinessUnitByOrganization,
  ResponseOriginalPurchaseShoppingPlan,
  WaitForReceiveGoodsByUser,
} from "models/Contract/Contract";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { BusinessDepartmentModel, RequesterModel } from "models/Budget/Budget";
import {
  Contract,
  ManageSupplier,
  PurchaseRequestItemModel,
  RelateShoppingPlan,
  RelateShoppingPlanModel,
} from "models/Contract";
import {
  BaseShoppingPlanFilter,
  BaseShoppingPlanRequestResponseModel,
  ContractAdvancedFilters,
  ContractFilter,
  ContractModalBudgetFilter,
  GoodsServicesModalFilter,
  PersonalTypePlansModel,
  PurchaseRequestResponseModel,
  WaitForReceiveGoodsModalFilter,
} from "models/Contract/ContractFilter";
import { BusinessDepartment } from "models/Project/Project";
import { GoodService } from "models/Proposal/GoodService";
import { PurchaseRequestFilter } from "models/PurchaseRequest/PurchaseRequestFilter";
import { Supplier } from "models/Supplier/Supplier";

import { getISOStringDate } from "core/helpers/date-time";

import CommonFilter from "models/CommonFilter";
import { ContractClassification } from "models/ContractClassification/ContractClassification";
import { GoodsServices } from "models/PurchaseRequest";
import { UserModel } from "models/SystemAdministration";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import type { AxiosResponse } from "axios";
import nameof from "ts-nameof.macro";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { FileTemplate } from "models/FileTemplate";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import ConfigStore from "core/config/ConfigStore";

const CONTRACT_CREATE_API = "/purchasing/contract";
const CONTRACT_GET_ALL_API = "/purchasing/contract/getAll";
const CONTRACT_PLAN_GET_ALL_API = "/purchasing/plan/getListApproved";
const PURCHASE_REQUEST = "/purchasing/request/getAll";
const GOODS_SERVICES_MODAL_API = "/purchasing/plan/remainingItems";
const GOODS_AWAITING_API = "/purchasing/contract/goodsAwaiting";
const TAX_LIST_API = "/master/tax";

const MANAGE_SUPPLIER_GET_ALL_API = "/master/supplier/list";
const GOODS_SERVICES_GET_ALL_API = "/master/goodsServices/getAll";
const ORGANIZATION_GET_ALL_API = "/master/organization/getAll";
const AUTH_USER_API = "/auth/user";
const API_MASTER_BUSINESS_DEPARTMENT = "master/businessDepartment/get";
const API_MASTER_USER = "auth/user/getByCondition";
const API_GET_CONTRACT_TYPE_SHOW_PERCENTAGE = "master/contractType/getAll";
const API_GET_CONTRACT_METHOD_SHOW_PERCENTAGE = "master/contractMethod/getAll";
const API_GET_WARRANTY_TYPE = "/master/warrantyType/getDropdown";
const API_GET_WARRANTY_TERM = "/master/warrantyMethod/getDropdown";
const API_GET_GUARANTEE_TYPE = "/master/guaranteeType/getDropdown";
const CONTRACT_TYPE_LIST_API = "/master/contractType";
const COST_ITEM_LIST_API = "/master/cost/group";
const COST_TYPE_LIST_API = "/master/cost/type";
const PROMOTION_LIST_API = "/master/promotion/getDropdown";
const APPLICABLE_ORGANIZATION_GET_ALL_API = "/master/organization/getDropdown";
const APPLICABLE_BRANCH_LIST_API = "/master/businessBranch/getDropdown";
const APPLICABLE_UNIT_LIST_API = "/master/businessUnit/getDropdown";
const API_GET_LEGAL_ENTITY = "/master/legalEntity/getDropDown";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
const API_CONTRACT = "/purchasing/contract";
const CONTRACT_PRINCIPLE_API = "/purchasing/principleContract";
export const API_USER = "auth/user";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GET_SUPPLIER_CHOOSE_SHOPPING_PLAN = (id: string) =>
  `/purchasing/plan/getOriginal/${id}`;

const GET_DETAIL_SUPPLIER = (id: string) => `/master/supplier/${id}`;

const GET_RELATE_SHOPPING_PLAN = (id: string) =>
  `/purchasing/plan/getRelated/${id}`;

const GET_CONTRACT_TYPE_SHOW_PERCENTAGE_BY_ID = (id: string) =>
  `/master/contractType/${id}`;

const GET_ORGANIZATION_DETAIL_BY_ID = (id: string) =>
  `/master/organization/${id}`;

const ACTION_CONTRACT_BY_ID = (id: string, action?: string) =>
  `purchasing/contract/${id}${action ? `/${action}` : ""}`;

const API_GET_BUSINESS_UNIT_BY_ORGANIZATION = (id: string) =>
  `master/departmentSegmentMapping/byOrganization/${id}`;

const UPLOAD_CONTRACT_FILE = (id: string) =>
  `purchasing/contract/${id}/uploadContractFile`;

export class ContractRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };

  private getListEmails = (
    value?: Array<{ email: string }>
  ): string[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item) => item.email);
  };

  private getProposalCode = (
    value?: Array<{ code: string }>
  ): string[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item) => item?.code);
  };

  public getAll = (
    filter: ContractFilter
  ): Observable<ListResult<Contract>> => {
    const numericAdvancedFilters = this.getListIds(filter?.advancedFiltersId);
    const requestBody = {
      contactTab: filter?.tabKey ? Number(filter?.tabKey) : 0,
      tab: filter?.tab ? Number(filter?.tab) : 0,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,

      code: filter?.contractCode,
      name: filter?.contractName,
      contractNo: filter?.contractNo,
      contractTypeIds: filter?.contractTypeId,
      costGroupIds: filter?.costGroupId,
      amountRange: {
        from: Number(filter?.totalAmountFrom?.equal) || undefined,
        to: Number(filter?.totalAmountTo?.equal) || undefined,
      },
      supplierIds: filter?.suppliersId,
      goodsIds: filter?.goodsServicesId,
      purchasePlan: filter?.purchasePlanCode,
      organizationIds: filter?.managementUnitsId,
      managers: this.getListEmails(filter?.managersValue),
      effectiveDateRange: {
        from:
          getISOStringDate(filter?.effectiveDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.effectiveDate?.lessEqual) || undefined,
      },
      endDateRange: {
        from: getISOStringDate(filter?.endDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.endDate?.lessEqual) || undefined,
      },
      organizationCreateIds: filter?.organizationCreateId,
      createdDateRange: {
        from: getISOStringDate(filter?.createdDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.createdDate?.lessEqual) || undefined,
      },
      createdUsers: this.getListEmails(filter?.createdUsersValue),
      status: this.getListIds(filter?.statusesId),
      types: this.getListIds(filter?.typesId),
      purchaseProposalCode: this.getProposalCode(
        filter?.purchaseProposalCodeValue
      ),
      awaitingDelivery: !!(numericAdvancedFilters?.includes(ContractAdvancedFilters.AWAITING_DELIVERY)),
      lateDelivery: !!(numericAdvancedFilters?.includes(ContractAdvancedFilters.LATE_DELIVERY)),
    };
    
    return this.http.post(CONTRACT_GET_ALL_API, requestBody);
  };

  public getContractPlanAll = (
    filter: ContractFilter
  ): Observable<ListResult<Contract>> => {
    const createdUser = filter?.createUserValue?.map(
      (item: RequesterModel) => item?.email
    );

    const purchasePlanTypes = filter?.purchasePlanTypesValue?.map(
      (el: PersonalTypePlansModel) => Number(el.id)
    );

    const costGroupIds = filter?.costGroupIdsValue?.map(
      (el: PersonalTypePlansModel) => el.id
    );

    const fromDate = filter?.createdDate?.greaterEqual
      ? dayjs(filter.createdDate.greaterEqual).toDate().toISOString()
      : undefined;

    const toDate = filter?.createdDate?.lessEqual
      ? dayjs(filter.createdDate.lessEqual).toDate().toISOString()
      : undefined;

    const originPurchaseRequestIds = filter?.originPurchaseRequestIdsValue?.map(
      (el: PurchaseRequestItemModel) => el.id
    );
    const supplierIds = filter?.supplierIdsValue?.map((el: Supplier) => el.id);

    const goodIds = filter?.goodIdsValue?.map((el: GoodService) => el.id);
    const organizationIds = filter?.businessUnitIdValue?.map(
      (item: Model) => item?.id
    );
    const body = {
      code: filter?.code?.trim(),
      name: filter?.name?.trim(),
      note: filter?.note?.trim(),
      tab: filter?.tab ? Number(filter?.tab) : 0,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      status: filter?.statusesId?.in?.map(Number),
      businessDepartmentIds: filter?.businessDepartmentIdsValue?.map(
        (el: BusinessDepartment) => el.businessUnitId
      ),
      createdUser,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      totalRange: {
        from: filter?.totalRangeFrom?.equal,
        to: filter?.totalRangeTo?.equal,
      },
      goodIds,
      supplierIds,
      purchasePlanTypes,
      originPurchaseRequestIds,
      costGroupIds,
      organizationIds,
    };

    return this.http.post(CONTRACT_PLAN_GET_ALL_API, body);
  };

  public getListPurchaseRequest = (
    filter: PurchaseRequestFilter
  ): Observable<PurchaseRequestFilter> => {
    let search = "";
    if (filter) {
      search = filter?.search?.trim();
    }

    return this.http
      .post(PURCHASE_REQUEST, {
        search,
      })
      .pipe(Repository.responseDataMapper<PurchaseRequestResponseModel[]>());
  };

  public getListSupplier = (
    filter: ModelFilter
  ): Observable<ManageSupplier[]> => {
    return this.http
      .get(`/purchasing/plan/${filter.purchasePlanId}/Suppliers`)
      .pipe(map((response) => response?.data));
  };

  public getListGoodsServices = (
    filter: ModelFilter
  ): Observable<GoodService[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .post(GOODS_SERVICES_GET_ALL_API, requestBody)
      .pipe(map((response) => response?.data?.items));
  };

  public getListContractType = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(CONTRACT_TYPE_LIST_API, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getListCostGroup = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(COST_ITEM_LIST_API, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getListCostType = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(COST_TYPE_LIST_API, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getListPromotion = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(PROMOTION_LIST_API, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getListOrganization = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim() || filter?.name?.trim(),
      purchasingMethod: filter?.purchasingMethod,
      isActive: filter?.isActive,
    };
    if (filter?.pageSize) {
      Object.assign(requestBody, { pageSize: filter?.pageSize });
    }

    return this.http
      .post(ORGANIZATION_GET_ALL_API, requestBody)
      .pipe(map((response) => response?.data?.items));
  };

  public getListApplicableOrganization = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.trim(),
    };

    return this.http
      .post(APPLICABLE_ORGANIZATION_GET_ALL_API, requestBody)
      .pipe(map((response) => response?.data));
  };

  public getListApplicableBranch = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(APPLICABLE_BRANCH_LIST_API, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getListApplicableUnit = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(APPLICABLE_UNIT_LIST_API, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getListUser = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const name = filter?.name;
    const params = {
      search: isObject(name)
        ? (name as CommonFilter)?.contain?.trim()
        : name?.trim(),
      pageSize: filter?.pageSize || DEFAULT_PAGE_SIZE,
      isActive: filter?.isActive ?? true,
      organizationId: filter?.organizationId,
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

  public getContractPlanModal = (
    filter: BaseShoppingPlanFilter
  ): Observable<BaseShoppingPlanRequestResponseModel> => {
    const createdUser = filter?.createUserValue?.email
      ? [filter.createUserValue.email]
      : [];

    const organizationIds = filter?.businessDepartmentIdValue?.id
      ? [filter.businessDepartmentIdValue.id]
      : [];

    let createdDateRange = {};

    const createDateFrom =
      getISOStringDate(filter?.createdDate?.greaterEqual) || undefined;
    const createDateTo =
      getISOStringDate(filter?.createdDate?.lessEqual) || undefined;

    if (!isNil(createDateFrom) || !isNil(createDateTo)) {
      createdDateRange = {
        from: createDateFrom,
        to: createDateTo,
      };
    }

    const requestBody = {
      search: filter?.search?.trim(),
      createdUser,
      organizationIds,
      createdDateRange,
      isPrincipleContract: filter?.isPrincipleContract,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
    };

    return this.http.post(CONTRACT_PLAN_GET_ALL_API, requestBody);
  };

  public getRelateShoppingPlan = (
    id: string
  ): Observable<RelateShoppingPlanModel[]> => {
    return this.http.get(GET_RELATE_SHOPPING_PLAN(id)).pipe(
      map((response) => {
        return response.data.map(
          (item: RelateShoppingPlanModel) => new RelateShoppingPlan(item)
        );
      })
    );
  };

  public listBusinessDepartmentModal = (
    filter: ContractModalBudgetFilter
  ): Observable<BusinessDepartmentModel[]> => {
    return this.http
      .post(API_MASTER_BUSINESS_DEPARTMENT, {
        search: filter?.name?.trim() || "",
        pageSize: DEFAULT_PAGE_SIZE,
      })
      .pipe(Repository.responseDataMapper<BusinessDepartmentModel[]>());
  };

  public listCreateUserModal = (
    filter: ContractModalBudgetFilter
  ): Observable<UserModel[]> => {
    const requestBody = {
      search: filter?.name?.trim() || "",
      pageSize: DEFAULT_PAGE_SIZE,
      organizationId: filter?.organizationId,
      isActive: true,
    };

    if (filter?.isActive) {
      Object.assign(requestBody, { isActive: filter?.isActive });
    }
    return this.http.post(API_MASTER_USER, requestBody).pipe(
      map((response) => {
        return response?.data?.items;
      })
    );
  };

  public getGoodsServicesListByPurchasePlan = (
    filter: GoodsServicesModalFilter
  ): Observable<ListResult<GoodsServices>> => {
    const requestBody = {
      id: filter?.purchasePlanId,
      supplierId: filter?.supplierId,
      search: filter?.search,
      categoryIds: filter?.purchaseCategory?.id && [filter.purchaseCategory.id],
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
    };

    return this.http.post(GOODS_SERVICES_MODAL_API, requestBody);
  };

  public getWaitForReceiveGoodsListByUser = (
    contractId: string,
    filter: WaitForReceiveGoodsModalFilter
  ): Observable<ListResult<WaitForReceiveGoodsByUser>> => {
    const requestBody = {
      receipter: filter?.receipter,
      search: filter?.search,
      categoryId: filter?.purchaseCategory?.id,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
    };

    return this.http
      .post(`${GOODS_AWAITING_API}/${contractId}`, requestBody)
      .pipe(
        map((response) => {
          return {
            data: {
              items: response?.data,
              totalRecords: response?.data?.length || 0,
            },
          };
        })
      );
  };

  public getPurchaseCategoryList = (
    filter: ModelFilter,
    purchasePlanId: string
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(`/purchasing/plan/${purchasePlanId}/goods`, {
        params: {
          search: filter?.name?.contain?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getWaitReceivePurchaseCategoryList = (
    filter: ModelFilter,
    contractId: string
  ): Observable<CommonFilter[]> => {
    return this.http
      .post(`/purchasing/contract/${contractId}/goods`, {
        search: filter?.name?.contain?.trim(),
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getTaxList = (filter: ModelFilter): Observable<CommonFilter[]> => {
    return this.http
      .get(TAX_LIST_API, {
        params: {
          search: filter?.name?.contain?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public listContractTypeShowPercentage = (
    filter: ContractModalBudgetFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .post(API_GET_CONTRACT_TYPE_SHOW_PERCENTAGE, {
        search: filter?.name?.trim() || "",
        pageSize: DEFAULT_PAGE_SIZE,
        status: [numberConstants.ONE],
      })
      .pipe(map((response) => response?.data?.items));
  };

  public listContractMethodShowPercentage = (
    filter: ContractModalBudgetFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .post(API_GET_CONTRACT_METHOD_SHOW_PERCENTAGE, {
        search: filter?.name?.trim() || "",
        pageSize: DEFAULT_PAGE_SIZE,
        status: [filter?.status],
      })
      .pipe(map((response) => response?.data?.items));
  };

  public detailContractTypeShowPercentage = (
    id: string
  ): Observable<ContractClassification> => {
    return this.http.get(GET_CONTRACT_TYPE_SHOW_PERCENTAGE_BY_ID(id));
  };

  public detailOrganizationById = (
    id: string
  ): Observable<ContractOrganizationModel> => {
    return this.http.get(GET_ORGANIZATION_DETAIL_BY_ID(id));
  };

  public create = (
    data: ContractDetailBodyRequest
  ): Observable<ContractDetailFormModel> => {
    const endpoint = data?.isPrinciple
      ? CONTRACT_PRINCIPLE_API
      : CONTRACT_CREATE_API;
    return this.http
      .post<ContractDetailFormModel>(endpoint, data)
      .pipe(
        Repository.responseMapToModel<ContractDetailFormModel>(
          ContractDetailFormModel
        )
      );
  };

  public update = (
    data: ContractDetailBodyRequest
  ): Observable<ContractDetailFormModel> => {
    const endpoint = `${
      data?.isPrinciple ? CONTRACT_PRINCIPLE_API : CONTRACT_CREATE_API
    }/${data.id}`;
    return this.http
      .put<ContractDetailFormModel>(endpoint, data)
      .pipe(
        Repository.responseMapToModel<ContractDetailFormModel>(
          ContractDetailFormModel
        )
      );
  };

  public detail = (
    id: string,
    isViewWaitingApprove = false,
    isPrinciple = false
  ): Observable<ContractDetailFormModel> => {
    return this.http
      .get<ContractDetailFormModel>(
        `${
          isPrinciple ? CONTRACT_PRINCIPLE_API : CONTRACT_CREATE_API
        }/${id}?isViewWaitingApprove=${isViewWaitingApprove}`
      )
      .pipe(Repository.responseDataMapper<ContractDetailFormModel>());
  };

  public getDetailSupplier = (
    id: string
  ): Observable<ContractSupplierModel> => {
    return this.http
      .get(GET_DETAIL_SUPPLIER(id))
      .pipe(map((response) => response.data));
  };

  public actionContract = (
    id: string,
    action = ModelConfirmType.APPROVE,
    body = {}
  ): Observable<CommonFilter> => {
    if (action === ModelConfirmType.DELETE) {
      return this.http
        .delete(ACTION_CONTRACT_BY_ID(id), { params: body })
        .pipe(Repository.responseDataMapper<CommonFilter>());
    }

    return this.http
      .put(ACTION_CONTRACT_BY_ID(id, action), {}, { params: body })
      .pipe(Repository.responseDataMapper<CommonFilter>());
  };

  public getListSupplierByOriginalId = (
    filter?: ModelFilter
  ): Observable<ResponseOriginalPurchaseShoppingPlan> => {
    return this.http
      .get(GET_SUPPLIER_CHOOSE_SHOPPING_PLAN(filter?.id), {
        params: {
          supplierSearch: filter?.supplierSearch?.trim(),
        },
      })
      .pipe(map((response) => response?.data));
  };

  public getBusinessUnitByOrganization = (
    id: string
  ): Observable<ResponseBusinessUnitByOrganization> => {
    return this.http
      .get(API_GET_BUSINESS_UNIT_BY_ORGANIZATION(id))
      .pipe(map((response) => response.data));
  };

  public getWarrantyType = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(API_GET_WARRANTY_TYPE, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getWarrantyTerm = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(API_GET_WARRANTY_TERM, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getGuaranteeType = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(API_GET_GUARANTEE_TYPE, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public uploadContractFile = (
    id: string,
    contractFile: ContractFile
  ): Observable<ContractDetailFormModel> => {
    const endpoint = UPLOAD_CONTRACT_FILE(id);
    return this.http
      .put(endpoint, {
        contractFile: contractFile,
      })
      .pipe(Repository.responseDataMapper<ContractDetailFormModel>());
  };

  public getLegalEntity = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .post(API_GET_LEGAL_ENTITY, requestBody)
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_CONTRACT + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };

  // Api for Signing Form
  public getSigningInfo = (id: number | string): Observable<SigningInfo> => {
    return this.http
      .post<SigningInfo>(kebabCase(nameof(this.getSigningInfo)), { id })
      .pipe(map((response: AxiosResponse<SigningInfo>) => response.data));
  };

  public digitalSign = (signatureInfo: SignatureInfo): Observable<Contract> => {
    return this.http
      .post<Contract>(kebabCase(nameof(this.digitalSign)), signatureInfo)
      .pipe(map((response: AxiosResponse<Contract>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_CONTRACT}/template/listSignature`, {
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
        `${API_CONTRACT}/template/form/${requestId}`,
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
        `${API_CONTRACT}/template/form/${requestId}`
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
      `${API_CONTRACT}/template/previewFormConfiguration`,
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
    item: Contract
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(`${API_CONTRACT}/template/previewSignedForm`, item, {
      responseType: "arraybuffer",
    });
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_CONTRACT}/template/listTemplate`,
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
      `${API_CONTRACT}/template/previewDynamicTemplate/${param?.queryParams}`,
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

  public listUser = (filter: ModelFilter): Observable<UserModel[]> => {
    return this.http
      .get(API_USER, {
        params: { ...filter },
      })
      .pipe(Repository.responseDataMapper<UserModel[]>());
  };
}

export const contractRepository = new ContractRepository();
