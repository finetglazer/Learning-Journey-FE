/* eslint-disable import/no-unresolved */
import type { AxiosResponse } from "axios";

import { httpConfig } from "core/config/http";
import dayjs from "dayjs";
import { AppUser } from "models/AppUser";
import { BudgetFilter } from "models/Budget/BudgetFilter";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { ListResult } from "core/services/service-types";
import {
  Budget,
  BusinessDepartmentModel,
  RequesterModel,
  UserModel,
} from "models/Budget/Budget";
import { CostOwner, CostOwnerFilter } from "models/CostOwner";
import { BudgetPlan, BusinessBranch } from "models/CostOwner/BudgetPlan";
import { WorkflowAction } from "models/WorkflowAction";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map } from "rxjs/operators";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { kebabCase } from "lodash";
import nameof from "ts-nameof.macro";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { FileTemplate } from "models/FileTemplate";
import ConfigStore from "core/config/ConfigStore";

const API_BUDGET_PREFIX = "budget/request/getAll";
const API_MASTER_BUSINESS_DEPARTMENT = "master/businessDepartment";
const API_MASTER_USER = "auth/user";

export const API_GETALL = "budget/request/getAll";
export const API_BUSINESS_UNIT = "/master/businessUnit";
export const API_DOWNLOAD_TEMPLATE = "budget/template/download";
export const API_TEMPLATE_IMPORT = "budget/template/import";
export const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
export const API_BUDGET = "budget/request";
export const API_DOWNLOAD_FILE = "share/file/download";
export const API_DOWNLOAD_TEMPLATE_PAYMENT = "payment/request/downloadTemplate";
export const API_UPLOAD_SINGLE_FILE = "share/file/upload";
export const API_GET_PROJECTS_BY_CATEGORIES =
  "/budget/projectMaster/byCategories";
export class BudgetRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listAll = (filter: BudgetFilter): Observable<ListResult<Model>> => {
    const requestEmail = filter?.requesterValue?.map(
      (item: RequesterModel) => item?.email
    );

    const greaterEqualDate = filter?.createDate?.greaterEqual
      ? dayjs(filter.createDate.greaterEqual).toDate().toISOString()
      : undefined;

    const lessEqualDate = filter?.createDate?.lessEqual
      ? dayjs(filter.createDate.lessEqual).toDate().toISOString()
      : undefined;

    const body = {
      tab: filter?.tabKey ? Number(filter?.tabKey) : 0,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search?.trim(),
      code: filter?.code?.contain,
      name: filter?.name?.contain?.trim(),
      type: Number(filter?.typeId?.in),
      statuses: filter?.statusesId?.in?.map(Number),
      businessDepartmentIds: filter?.businessUnitIdId?.in,
      requesters: requestEmail,
      from: greaterEqualDate,
      to: lessEqualDate,
    };

    return this.http.post(API_BUDGET_PREFIX, body);
  };

  public listBusinessDepartment = (
    filter: BudgetFilter
  ): Observable<BusinessDepartmentModel[]> => {
    let search = filter?.name?.contain ?? filter?.name;
    if (typeof search === "object") {
      search = "";
    }

    const params = {
      search: search?.trim(),
      businessUnitId: filter?.businessUnitId,
      dropdown: filter?.dropdown,
      pageSize: 30,
      pageIndex: 1,
    };
    return this.http
      .get(API_MASTER_BUSINESS_DEPARTMENT, {
        params,
      })
      .pipe(Repository.responseDataMapper<BusinessDepartmentModel[]>());
  };

  public listMasterUser = (filter: BudgetFilter): Observable<UserModel[]> => {
    return this.http
      .get(API_MASTER_USER, {
        params: {
          search: filter?.name?.contain?.trim(),
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<UserModel[]>());
  };

  public exportTemplate = (): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_TEMPLATE, {
      responseType: "arraybuffer" as "json",
    });
  };

  public downloadFile = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer" as "json",
      params: {
        Path,
      },
    });
  };

  public downloadFileNew = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_TEMPLATE_PAYMENT, {
      responseType: "arraybuffer" as "json",
      params: {
        Path,
      },
    });
  };

  public import = (file: File[] | Blob[]): Observable<FileModel[]> => {
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

  public costOwnerList = (filter: CostOwnerFilter): Observable<CostOwner[]> => {
    return this.http
      .get<CostOwner[]>(API_BUSINESS_UNIT, {
        params: {
          search: filter?.name?.trim() || "",
          proposalId: filter?.paymentInheritanceId,
        },
      })
      .pipe(
        map((response) =>
          response?.data.map((item) => ({ ...item, key: item.id }))
        )
      );
  };

  public uploadFileBudget = (
    file: unknown,
    BusinessUnitCode: string,
    type?: string
  ): Observable<{ fileInfo: any; summary: BusinessBranch[] }> => {
    const formData: FormData = new FormData();
    formData.append("File", file as Blob);
    if (BusinessUnitCode) {
      formData.append("BusinessUnitCode", BusinessUnitCode);
    }
    if (type) {
      formData.append("Type", type);
    }
    return this.http
      .post<{ fileInfo: any; summary: BusinessBranch[] }>(
        API_TEMPLATE_IMPORT,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .pipe(
        Repository.responseDataMapper<{
          fileInfo: any;
          summary: BusinessBranch[];
        }>()
      );
  };

  public create = (data: AppUser): Observable<BudgetPlan> => {
    return this.http
      .post<BudgetPlan>(API_BUDGET, data)
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public detail = (
    id: number | string,
    isViewWaitingApprove = false
  ): Observable<BudgetPlan> => {
    return this.http
      .get<BudgetPlan>(
        `${API_BUDGET}/${id}?isViewWaitingApprove=${isViewWaitingApprove}`
      )
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public approve = (id: number | string): Observable<BudgetPlan> => {
    return this.http
      .put<BudgetPlan>(`${API_BUDGET}/${id}/approve`, {})
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public reject = (
    id: number | string,
    body: { reason: string }
  ): Observable<BudgetPlan> => {
    return this.http
      .put<BudgetPlan>(
        `${API_BUDGET}/${id}/decline?reason=${body.reason || ""}`,
        {}
      )
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public return = (
    id: number | string,
    body: { reason: string }
  ): Observable<BudgetPlan> => {
    return this.http
      .put<BudgetPlan>(
        `${API_BUDGET}/${id}/return?reason=${body.reason || ""}`,
        {}
      )
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public deleteBudget = (id: string, reason: string): Observable<string> => {
    return this.http
      .delete(`${API_BUDGET}/${id}`, { params: { reason } })
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelBudget = (id: string, reason: string): Observable<string> => {
    return this.http
      .put(`${API_BUDGET}/${id}/cancel?reason=${reason || ""}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public update = (requestBody: BudgetPlan): Observable<BudgetPlan> => {
    return this.http
      .put<BudgetPlan>(`${API_BUDGET}/${requestBody?.id}/update`, requestBody)
      .pipe(Repository.responseMapToModel<BudgetPlan>(BudgetPlan));
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_BUDGET + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };

  // Api for Signing Form
  public getSigningInfo = (id: number | string): Observable<SigningInfo> => {
    return this.http
      .post<SigningInfo>(kebabCase(nameof(this.getSigningInfo)), { id })
      .pipe(map((response: AxiosResponse<SigningInfo>) => response.data));
  };

  public digitalSign = (signatureInfo: SignatureInfo): Observable<Budget> => {
    return this.http
      .post<Budget>(kebabCase(nameof(this.digitalSign)), signatureInfo)
      .pipe(map((response: AxiosResponse<Budget>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_BUDGET}/template/listSignature`, {
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
        `${API_BUDGET}/template/form/${requestId}`,
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
      .get<RequestFormConfiguration>(`${API_BUDGET}/template/form/${requestId}`)
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
      `${API_BUDGET}/template/previewFormConfiguration`,
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

  public previewSignedForm = (item: Budget): Observable<AxiosResponse<any>> => {
    return this.http.post(`${API_BUDGET}/template/previewSignedForm`, item, {
      responseType: "arraybuffer",
    });
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_BUDGET}/template/listTemplate`,
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
      `${API_BUDGET}/template/previewDynamicTemplate/${param?.queryParams}`,
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

  public getProjectsByCategories = (
    filter?: ModelFilter
  ): Observable<Model[]> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim() ?? "",
      businessBranchId: filter?.businessBranchValue?.id,
      businessDepartmentId: filter?.businessDepartmentValue?.id,
      businessUnitId: filter?.businessUnitValue?.id,
    };

    return this.http
      .post(API_GET_PROJECTS_BY_CATEGORIES, body)
      .pipe(map((response) => response?.data?.items));
  };
}

export const budgetRepository = new BudgetRepository();
