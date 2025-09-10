/* eslint-disable import/no-unresolved */
import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { kebabCase } from "lodash";
import { BusinessDepartmentModel, RequesterModel } from "models/Budget/Budget";
import { FileTemplate } from "models/FileTemplate";
import { BusinessDepartment } from "models/Project/Project";
import {
  GoodServiceFilter,
  GoodServiceResponseObservableModel,
} from "models/Proposal/GoodService";
import { ProposalAvailableFilter } from "models/Proposal/ProposalFilter";
import {
  EntitySelection,
  GoodsServices,
  GoodsServicesCategory,
  GoodsServicesFilter,
  PurchaseProposal,
  PurchaseProposalFilter,
  PurchaseRequest,
  PurchaseRequestBody,
  PurchaseRequestCreate,
} from "models/PurchaseRequest";
import { PurchaseRequestFilter } from "models/PurchaseRequest/PurchaseRequestFilter";
import { PurchasingPlanTypeModel } from "models/PurchasingPlan";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignedFormTypeRequirement } from "models/SignedFormTypeRequirement";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { Model, Repository } from "react-3layer-common";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
const API_PROPOSAL = "/purchasing/request";
const API_GETALL = "/purchasing/request/getAll";
const API_BUSINESS_DEPARTMENT = "/master/businessDepartment";
const API_PROPOSAL_AVAILABLE = "/purchasing/proposal/available";
const API_PROPOSAL_AVAILABLE_DETAIL = "/purchasing/proposal";
const API_GOODS_SERVICES = "/purchasing/proposal/remainingItems";
const API_GOODS_SERVICES_CATEGORY = "/purchasing/proposal";
const API_GET_LIST_GOOD_SERVICES = "master/goodsServices/getAll";
const API_AUTO_CREATE_PURCHASE_PLAN = "/purchasing/plan/autoCreatePurchasePlan";
const API_DOWNLOAD_FILE = "share/file/download";

export class PurchaseRequestRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listAll = (
    filter: PurchaseRequestFilter
  ): Observable<ListResult<Model>> => {
    const createdUser = filter?.createUserValue?.map(
      (item: RequesterModel) => item?.email
    );

    const goodsIds = filter?.goodsIdsValue?.map(
      (item: GoodsServicesCategory) => item?.id
    );

    const businessUnit = filter?.businessUnitIdValue?.map(
      (item: BusinessDepartment) => item?.id
    );

    const purchaseBusinessUnit = filter?.purchaseBusinessUnitIdValue?.map(
      (item: BusinessDepartment) => item?.id
    );

    const fromDate = filter?.createDate?.greaterEqual
      ? dayjs(filter.createDate.greaterEqual).toDate().toISOString()
      : undefined;

    const toDate = filter?.createDate?.lessEqual
      ? dayjs(filter.createDate.lessEqual).toDate().toISOString()
      : undefined;

    const organizationIds = filter?.businessUnitIdValue?.map(
      (item: Model) => item?.id
    );

    const body = {
      tab: filter?.tab ? Number(filter?.tab) : 0,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      code: filter?.code,
      purchaseProposalCode: filter?.proposalCode,
      purchasingMethods: filter?.purchasingMethodsId?.map(Number),
      name: filter?.name,
      status: filter?.statusesId?.map(Number),
      businessDepartmentIds: businessUnit,
      purchaseOrganizationIds: purchaseBusinessUnit,
      organizationIds,
      createdUser: createdUser,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      totalRange: {
        from: filter?.totalRange?.from?.toString(),
        to: filter?.totalRange?.to?.toString(),
      },
      goodsIds: goodsIds,
      description: filter?.description,
      purchaseRequestType: filter?.tabKey ? Number(filter?.tabKey) : 0,
      originalPurchaseRequestCode: filter?.originalPurchaseRequestCode,
    };

    return this.http.post(API_GETALL, body);
  };

  public detail = (
    id: string,
    isView: boolean
  ): Observable<PurchaseRequest> => {
    const endpoint = `${API_PROPOSAL}/${id}`;
    return this.http
      .get<PurchaseRequest>(endpoint, {
        params: {
          isView,
        },
      })
      .pipe(Repository.responseDataMapper<PurchaseRequest>());
  };

  public proposalAvailable = (
    filter: ProposalAvailableFilter
  ): Observable<ListResult<PurchaseProposal>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      search: filter?.search?.trim(),
      createdDateRange: {
        from: filter.createdDateRange?.[0]?.toDate(),
        to: filter.createdDateRange?.[1]?.endOf("day")?.toDate(),
      },
      totalRange: {
        from: filter?.totalRangeFrom,
        to: filter?.totalRangeTo,
      },
      entitySelection: filter?.entitySelection,
    };

    return this.http.post(API_PROPOSAL_AVAILABLE, body);
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

  public create = (
    data: PurchaseRequestCreate
  ): Observable<PurchaseRequest> => {
    return this.http
      .post<PurchaseRequest>(API_PROPOSAL, data)
      .pipe(Repository.responseMapToModel<PurchaseRequest>(PurchaseRequest));
  };

  public update = (
    data: PurchaseRequestCreate
  ): Observable<PurchaseRequest> => {
    const endpoint = `${API_PROPOSAL}/${data.id}`;
    return this.http
      .put<PurchaseRequest>(endpoint, data)
      .pipe(Repository.responseMapToModel<PurchaseRequest>(PurchaseRequest));
  };

  public save = (data: PurchaseRequestCreate): Observable<PurchaseRequest> => {
    return data.id ? this.update(data) : this.create(data);
  };

  public deletePurchaseRequest = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .delete(`${API_PROPOSAL}/${id}`, { params: { reason } })
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelPurchaseRequest = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put(`${API_PROPOSAL}/${id}/cancel?reason=${reason || ""}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public getListPurchaseProposal = (
    filter: PurchaseProposalFilter
  ): Observable<BusinessDepartmentModel[]> => {
    return this.http
      .get<BusinessDepartmentModel[]>(API_BUSINESS_DEPARTMENT, {
        params: {
          search: filter?.name?.trim() || "",
          purchasingMethod: filter?.purchasingMethod?.id || "",
          businessUnitId: filter?.businessUnitId || "",
        },
      })
      .pipe(Repository.responseDataMapper<BusinessDepartmentModel[]>());
  };

  public detailProposalAvailable = (
    id: string,
    entitySelection = EntitySelection.TTCT
  ): Observable<PurchaseProposal> => {
    const endpoint = `${API_PROPOSAL_AVAILABLE_DETAIL}/${id}/available?entitySelection=${entitySelection}`;
    return this.http
      .get<PurchaseProposal>(endpoint)
      .pipe(Repository.responseDataMapper<PurchaseProposal>());
  };

  public listGoodsServices = (
    filter: GoodsServicesFilter
  ): Observable<ListResult<GoodsServices>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      search: filter?.search?.trim(),
      categoryIds: filter?.categoryIds?.map((i) => i.id),
      id: filter?.id,
      isFullQuantity: filter?.isFullQuantity,
    };

    return this.http.post(API_GOODS_SERVICES, body);
  };

  public getFormConfiguration = (
    requestId: string
  ): Observable<RequestFormConfiguration> => {
    return this.http
      .get<RequestFormConfiguration>(
        `${API_PROPOSAL}/template/form/${requestId}`
      )
      .pipe(
        map(
          (response: AxiosResponse<RequestFormConfiguration>) => response.data
        )
      );
  };

  public goodsServiceCategory = (
    filter?: GoodsServicesFilter
  ): Observable<GoodsServicesCategory[]> => {
    const endpoint = `${API_GOODS_SERVICES_CATEGORY}/${filter?.id}/goods`;
    return this.http
      .get<GoodsServicesCategory[]>(endpoint, {
        params: {
          search: filter?.name?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<GoodsServicesCategory[]>());
  };

  public getGoodServicesList = (
    filter: GoodServiceFilter
  ): Observable<GoodServiceResponseObservableModel> => {
    const body = {
      search: filter?.search?.trim() || "",
      goodsServicesCategoryIds: filter?.goodsServicesCategoryId || [],
      costTypeId: filter?.costTypeId,
      costGroupId: filter?.costGroupId,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
    };

    return this.http.post(API_GET_LIST_GOOD_SERVICES, body);
  };

  public autoCreatePurchasePlan = ({
    originalPurchaseRequestId,
  }: {
    originalPurchaseRequestId?: string;
  }): Observable<PurchasingPlanTypeModel> =>
    this.http
      .post(API_AUTO_CREATE_PURCHASE_PLAN, {
        originalPurchaseRequestId,
      })
      .pipe(Repository.responseDataMapper<PurchasingPlanTypeModel>());

  // model sign
  public dynamicTemplatePreview = (
    param: FileTemplateParams
  ): Observable<AxiosResponse<any>> => {
    return this.http.post<AxiosResponse<any>>(
      `${API_PROPOSAL}/template/previewDynamicTemplate/${param?.queryParams}`,
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

  public saveFormConfiguration = (
    requestId: string,
    model: RequestFormConfiguration
  ): Observable<RequestFormConfiguration> => {
    return this.http
      .post<RequestFormConfiguration>(
        `${API_PROPOSAL}/template/form/${requestId}`,
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

  public getTypeRequirement = (
    requestId: string
  ): Observable<SignedFormTypeRequirement> => {
    return this.http
      .post<SignedFormTypeRequirement>(
        `${API_PROPOSAL}/template/getTypeRequirement`,
        null,
        {
          params: {
            requestId,
          },
        }
      )
      .pipe(
        map(
          (response: AxiosResponse<SignedFormTypeRequirement>) => response.data
        )
      );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_PROPOSAL}/template/listTemplate`,
        {},
        {
          params: {
            requestId: id,
          },
        }
      )
      .pipe(map((response: AxiosResponse<FileTemplate[]>) => response.data));
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

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_PROPOSAL}/template/listSignature`, {
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

  public getFile = (Id: string): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer",
      params: {
        Id,
      },
    });
  };

  public previewFormConfiguration = (
    model: RequestFormConfiguration
  ): Observable<any> => {
    return this.http.post<RequestFormConfiguration>(
      `${API_PROPOSAL}/template/previewFormConfiguration`,
      model,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_PROPOSAL + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };
}

export const purchaseRequestRepository = new PurchaseRequestRepository();
