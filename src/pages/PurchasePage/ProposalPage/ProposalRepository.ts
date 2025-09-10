/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import type { AxiosResponse } from "axios";

import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { User } from "models/AppUser";
import { RequesterModel, UserModel } from "models/Budget/Budget";
import { CostTypeResModel } from "models/Payment";
import { BusinessDepartment, Project } from "models/Project/Project";
import {
  ContentHtml,
  CostAllocation,
  CostDriverModel,
  CostType,
  DownloadFileProposalProps,
  ExChangeRateModel,
  FilterListCostCenter,
  Proposal,
  ProposalGetListCostCenter,
  ProposalModel,
  ProposalRequestModel,
  ProposalValidCostCenterModel,
  Supplier,
  SupplierItem,
  TypeFilterModel,
} from "models/Proposal";
import {
  Currency,
  GoodServiceCategory,
  GoodServiceFilter,
  GoodServiceResponseObservableModel,
  GoodServiceValue,
  UploadFileGoodsServices,
} from "models/Proposal/GoodService";
import { ProposalFilter } from "models/Proposal/ProposalFilter";
import { WorkflowAction } from "models/WorkflowAction";
import { GoodsServicesCategory } from "models/PurchaseRequest";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { kebabCase } from "lodash";
import nameof from "ts-nameof.macro";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { FileTemplate } from "models/FileTemplate";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { SignedFormTypeRequirement } from "models/SignedFormTypeRequirement";
import ConfigStore from "core/config/ConfigStore";

export const API_GET_ALL_CURRENCY_TYPE = "master/bank/currency";
const API_MASTER_COST_TYPE = "master/cost/type";
const API_GET_BANK_EXCHANGE_RATE = "master/bank/exchange";
const API_GET_LIST_GOOD_SERVICES = "master/goodsServices/getAll";
const API_GET_LIST_GOOD_CATEGORY = "master/goodsServicesCategory/getAll";
const APi_GET_LIST_MANUFACTURER = "master/manufacturers";
const API_GET_LIST_UNIT = "master/goodsServicesUnit/getAll";
const API_GET_LIST_TYPE_TAX = "master/tax";
const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_UPLOAD_GOODS_SERVICES_FILE = "purchasing/proposal/goodsService";
const API_DOWNLOAD_GOODS_SERVICES_TEMPLATE =
  "purchasing/proposal/downloadTemplate";
const API_PROPOSAL = "/purchasing/proposal";
const API_GETALL = "/purchasing/proposal/getAll";
const API_MASTER_SUPPLIER = "/master/supplier";
const API_MASTER_BUSINESS_BRANCH = "/master/businessBranch";
const API_MASTER_BUSINESS_UNIT = "/master/businessUnit";
const API_GET_PROJECT_LIST = "budget/projectMaster";
const API_MASTER_BUSINESS_DEPARTMENTID = "/master/businessDepartment";
const API_GET_LIST_COST_CENTER_BY_ALLOCATION =
  "master/costCenterAllocation/getAll";
const API_GET_APPROVAL_POSITION = "/master/position";
const API_GET_APPROVE_POSITION_FOR_ADJUST =
  "/purchasing/proposal/approvePositions";
const API_GET_PROJECT_BY_COST_CENTER = "budget/projectMaster/byCostCenter";
const API_GET_COST_DRIVER = "master/costDriver";
const API_MASTER_USER = "auth/user";
const API_VALID_COST_CENTER = "budget/projectMaster/validCostCenter";
const API_DOWNLOAD_FILE = "share/file/download";
const API_CONTENT_HTML = "/purchasing/contentHtml/getByIds";

const API_INTERGRATION_ASSET = "/purchasing/intergrationAsset/checkInventory";

const API_CHECK_ASSET = "/purchasing/intergrationAsset/getAssetInfo";

export class ProposalRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listAll = (filter: ProposalFilter): Observable<ListResult<Model>> => {
    const createdUser = filter?.createUserValue?.map(
      (item: RequesterModel) => item?.email
    );

    const businessDepartment = filter?.businessDepartmentValue?.map(
      (item: BusinessDepartment) => item?.id
    );

    const goodsIds = filter?.goodsIdsValue?.map(
      (item: GoodsServicesCategory) => item?.id
    );

    const fromDate = filter?.createDate?.greaterEqual
      ? dayjs(filter.createDate.greaterEqual).toISOString()
      : undefined;

    const toDate = filter?.createDate?.lessEqual
      ? dayjs(filter.createDate.lessEqual).toISOString()
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
      code: filter?.code?.trim(),
      originalCode: filter?.originalCode?.trim(),
      name: filter?.name?.trim(),
      description: filter?.description,
      adjustmentDescription: filter?.adjustmentDescription?.trim(),
      status: filter?.statusesId?.map(Number),
      goodsIds: goodsIds,
      createdUser: createdUser,
      receiveUser: createdUser,
      organizationIds: organizationIds ?? businessDepartment,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      totalRange: {
        from: filter?.totalRange?.from?.toString(),
        to: filter?.totalRange?.to?.toString(),
      },
      purchaseProposalType: filter?.tabKey ? Number(filter?.tabKey) : 0,
    };

    return this.http.post(API_GETALL, body);
  };

  public detail = (id: string): Observable<Proposal> => {
    const endpoint = `${API_PROPOSAL}/${id}`;
    return this.http
      .get<Proposal>(endpoint)
      .pipe(Repository.responseDataMapper<Proposal>());
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
    data: ProposalRequestModel
  ): Observable<ProposalRequestModel> => {
    return this.http
      .post<ProposalRequestModel>(API_PROPOSAL, data)
      .pipe(
        Repository.responseMapToModel<ProposalRequestModel>(
          ProposalRequestModel
        )
      );
  };

  public update = (
    data: ProposalRequestModel
  ): Observable<ProposalRequestModel> => {
    const endpoint = `${API_PROPOSAL}/${data.id}`;
    return this.http
      .put<ProposalRequestModel>(endpoint, data)
      .pipe(
        Repository.responseMapToModel<ProposalRequestModel>(
          ProposalRequestModel
        )
      );
  };

  public save = (
    data: ProposalRequestModel
  ): Observable<ProposalRequestModel> => {
    return data?.id ? this.update(data) : this.create(data);
  };

  public deleteProposal = (id: string, reason: string): Observable<string> => {
    return this.http
      .delete(`${API_PROPOSAL}/${id}`, { params: { reason } })
      .pipe(Repository.responseDataMapper<string>());
  };

  public checkAsset = (assetCodes: string[]): Observable<any> => {
    return this.http.post(API_CHECK_ASSET, assetCodes);
  };

  public getListSupplier = (
    filter: ModelFilter
  ): Observable<SupplierItem[]> => {
    const searchValue = filter?.supplier?.contain?.trim();

    return this.http
      .get<Supplier>(API_MASTER_SUPPLIER, {
        params: {
          search: searchValue,
        },
      })
      .pipe(map((response) => response?.data?.items));
  };

  public listCostType = (filter: ModelFilter): Observable<CostType[]> => {
    return this.http
      .get(API_MASTER_COST_TYPE, {
        params: {
          search: filter?.search?.trim() || "",
          isActive: filter?.isActive,
        },
      })
      .pipe(Repository.responseDataMapper<CostType[]>());
  };

  public getCurrencyTypeList = (
    filter: ModelFilter
  ): Observable<Currency[]> => {
    return this.http
      .get(API_GET_ALL_CURRENCY_TYPE, {
        params: {
          search: filter?.search?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<Currency[]>());
  };

  public getBankExchangeRate = (
    currencyCode: string
  ): Observable<ExChangeRateModel> => {
    return this.http
      .get<ExChangeRateModel>(
        `${API_GET_BANK_EXCHANGE_RATE}/${currencyCode || ""}`
      )
      .pipe(Repository.responseDataMapper<ExChangeRateModel>());
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
      isGetForProposal: filter?.isGetForProposal || false,
    };

    return this.http.post(API_GET_LIST_GOOD_SERVICES, body);
  };

  public getGoodCategoryList = (
    filter: ModelFilter
  ): Observable<GoodServiceCategory[]> => {
    return this.http
      .get(API_GET_LIST_GOOD_CATEGORY, {
        params: {
          search: filter?.search?.trim() || "",
          isActive: filter?.isActive,
        },
      })
      .pipe(
        map((response) => {
          return response?.data?.items;
        })
      );
  };

  public getManufactureList = (
    filter: ModelFilter
  ): Observable<GoodServiceValue[]> => {
    return this.http
      .get(APi_GET_LIST_MANUFACTURER, {
        params: { ...filter },
      })
      .pipe(Repository.responseDataMapper<GoodServiceValue[]>());
  };

  public getUnitList = (
    filter: ModelFilter
  ): Observable<GoodServiceValue[]> => {
    return this.http
      .get(API_GET_LIST_UNIT, {
        params: {
          ...filter,
        },
      })
      .pipe(Repository.responseDataMapper<GoodServiceValue[]>());
  };

  public getTypeTaxList = (
    filter: ModelFilter
  ): Observable<GoodServiceValue[]> => {
    return this.http
      .get(API_GET_LIST_TYPE_TAX, {
        params: {
          search: filter?.search?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<GoodServiceValue[]>());
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

  public approvalPosition = (filter: ProposalModel): Observable<Proposal[]> => {
    return this.http
      .get<Proposal[]>(API_GET_APPROVAL_POSITION, {
        params: {
          search: filter?.name?.trim() || "",
          pageSize: 30,
        },
      })
      .pipe(Repository.responseDataMapper<Proposal[]>());
  };

  public approvalPositionForAdjust = (
    filter: ProposalModel
  ): Observable<Proposal[]> => {
    return this.http
      .get<Proposal[]>(API_GET_APPROVE_POSITION_FOR_ADJUST, {
        params: {
          search: filter?.name?.trim() || "",
          pageSize: 30,
          originalPurchaseProposalId: filter?.originalPurchaseProposalId || "",
        },
      })
      .pipe(Repository.responseDataMapper<Proposal[]>());
  };

  public listBusinessBranchId = (
    filter: ProposalModel
  ): Observable<CostAllocation[]> => {
    return this.http
      .get<CostAllocation[]>(API_MASTER_BUSINESS_BRANCH, {
        params: {
          search: filter?.name?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<CostAllocation[]>());
  };

  public listBusinessUnitId = (
    filter: TypeFilterModel
  ): Observable<CostAllocation[]> => {
    return this.http
      .get<CostAllocation[]>(API_MASTER_BUSINESS_UNIT, {
        params: {
          search: filter?.name?.trim() || "",
        },
      })
      .pipe(Repository.responseDataMapper<CostAllocation[]>());
  };

  public listBusinessDepartmentId = (
    filter: TypeFilterModel
  ): Observable<CostTypeResModel[]> => {
    return this.http
      .get<CostTypeResModel[]>(API_MASTER_BUSINESS_DEPARTMENTID, {
        params: {
          search: filter?.name?.trim() || "",
          businessUnitId: filter?.businessUnitId || "",
        },
      })
      .pipe(
        map((response) =>
          response?.data.map((item) => ({ ...item, key: item.id }))
        )
      );
  };

  public getProjectList = (
    filter: TypeFilterModel
  ): Observable<ProposalModel[]> => {
    return this.http
      .get<ProposalModel[]>(API_GET_PROJECT_LIST, {
        params: {
          search: filter?.name?.trim() || "",
          isProject: filter?.isProject || false,
          projectId: filter?.projectId || null,
          pageSize: 30,
        },
      })
      .pipe(Repository.responseDataMapper<ProposalModel[]>());
  };

  public getListCostCenter = (
    filter: FilterListCostCenter
  ): Observable<ProposalGetListCostCenter> => {
    return this.http
      .post<ProposalGetListCostCenter>(
        API_GET_LIST_COST_CENTER_BY_ALLOCATION,
        filter
      )
      .pipe(Repository.responseDataMapper<ProposalGetListCostCenter>());
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
        costGroupId: filter?.costGroupId || null,
      })
      .pipe(map((response) => response?.data?.items));
  };

  public approve = (id: number | string): Observable<Proposal> => {
    return this.http
      .put<Proposal>(`${API_PROPOSAL}/${id}/approve`, {})
      .pipe(Repository.responseMapToModel<Proposal>(Proposal));
  };

  public reject = (
    id: number | string,
    body: { reason: string }
  ): Observable<Proposal> => {
    return this.http
      .put<Proposal>(
        `${API_PROPOSAL}/${id}/reject?reason=${body.reason || ""}`,
        {}
      )
      .pipe(Repository.responseMapToModel<Proposal>(Proposal));
  };

  public return = (
    id: number | string,
    body: { reason: string }
  ): Observable<Proposal> => {
    return this.http
      .put<Proposal>(
        `${API_PROPOSAL}/${id}/return?reason=${body.reason || ""}`,
        {}
      )
      .pipe(Repository.responseMapToModel<Proposal>(Proposal));
  };

  public cancelProposal = (id: string, reason: string): Observable<string> => {
    return this.http
      .put(`${API_PROPOSAL}/${id}/cancel?reason=${reason || ""}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public closeProposal = (id: string): Observable<string> => {
    return this.http
      .put(`${API_PROPOSAL}/${id}/close`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public uploadFileGoodsServices = (
    file: File,
    currency?: string,
    costGroup?: string,
    purchaseProposalId?: string,
    isEdit?: boolean,
    purchaseItems: any[] = []
  ): Observable<UploadFileGoodsServices> => {
    const formData: FormData = new FormData();
    formData.append("File", file as Blob);

    if (currency) {
      formData.append("Currency", currency);
    }
    if (costGroup) {
      formData.append("CostGroup", costGroup);
    }

    if (purchaseProposalId) {
      formData.append("PurchaseProposalId", purchaseProposalId);
    }

    if (isEdit) {
      formData.append("IsEdit", "true");
    }

    if (purchaseItems.length > 0) {
      formData.append(
        "PurchaseItems",
        "'" + JSON.stringify(purchaseItems) + "'"
      );
    }

    return this.http
      .post<UploadFileGoodsServices>(API_UPLOAD_GOODS_SERVICES_FILE, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(Repository.responseDataMapper<UploadFileGoodsServices>());
  };

  public downloadFile = ({
    CostTypeId,
    CostGroupId,
  }: DownloadFileProposalProps): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_GOODS_SERVICES_TEMPLATE, {
      responseType: "arraybuffer" as "json",
      params: {
        CostTypeId,
        CostGroupId,
      },
    });
  };

  public listMasterUser = (filter: User): Observable<UserModel[]> => {
    return this.http
      .get(API_MASTER_USER, {
        params: {
          search: filter?.name?.trim(),
          isActive: filter?.isActive,
          isSupplier: filter?.isSupplier,
          pageSize: filter?.pageSize,
          pageIndex: filter?.pageIndex,
        },
      })
      .pipe(Repository.responseDataMapper<UserModel[]>());
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_PROPOSAL + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };

  public validCostCenter = (
    data: ProposalValidCostCenterModel[]
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

  // Api for Signing Form
  public getSigningInfo = (id: number | string): Observable<SigningInfo> => {
    return this.http
      .post<SigningInfo>(kebabCase(nameof(this.getSigningInfo)), { id })
      .pipe(map((response: AxiosResponse<SigningInfo>) => response.data));
  };

  public digitalSign = (signatureInfo: SignatureInfo): Observable<Proposal> => {
    return this.http
      .post<Proposal>(kebabCase(nameof(this.digitalSign)), signatureInfo)
      .pipe(map((response: AxiosResponse<Proposal>) => response.data));
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
      `${API_PROPOSAL}/template/previewFormConfiguration`,
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

  public getFileByPath = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer",
      params: {
        Path,
      },
    });
  };

  public previewSignedForm = (
    item: Proposal
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(`${API_PROPOSAL}/template/previewSignedForm`, item, {
      responseType: "arraybuffer",
    });
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
  public multiUpload = (
    files: File[] | Blob[] | FileList
  ): Observable<FileModel[]> => {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const fileClone = files[i] as File;
      const fileName = fileClone?.name || `file${i}`;
      formData.append("files", files[i] as Blob, fileName);
    }
    return this.http
      .post(kebabCase(nameof(this.multiUpload)), formData)
      .pipe(Repository.responseMapToList<FileModel>(Model));
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

  public contentHtml = (data: string): Observable<ContentHtml[]> => {
    const body = {
      ids: [data],
    };
    return this.http
      .post<ContentHtml[]>(API_CONTENT_HTML, body)
      .pipe(map((response) => response.data));
  };

  public checkInventory = (model: Model): Observable<AxiosResponse<Model>> => {
    return this.http.post<AxiosResponse<Model>>(API_INTERGRATION_ASSET, model);
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
}

export const proposalRepository = new ProposalRepository();
