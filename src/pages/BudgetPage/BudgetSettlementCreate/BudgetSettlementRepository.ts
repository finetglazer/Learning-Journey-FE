import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { isEmpty, kebabCase } from "lodash";
import { BudgetSettlement } from "models/Budget/BugetSettlement";
import { FileTemplate } from "models/FileTemplate";
import { ProjectFilter } from "models/Project/ProjectFilter";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
const API_BUDGET_PREFIX = "budget/project/";
const API_MASTER = "master/";
const API_BUDGET = "budget/";
const API_MASTER_DEPARTMENT = "master/businessDepartment/get";
const API_BUDGET_REQUEST = "/budget/request";

interface Item {
  id: string;
  code: string;
  value: string;
  businessUnitId?: string;
}

export class BudgetSettlementRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getAll = (body: ProjectFilter): Observable<any> => {
    const businessUnits = body?.businessUnitsValue?.map(
      (item: Item) => item?.id
    );
    const businessBranches = body?.businessBranchValue?.map(
      (item: Item) => item?.id
    );
    const businessDepartment = body?.businessDepartmentValue?.map(
      (item: Item) => item?.id
    );

    const addedProjectIds = isEmpty(body?.addedProjectIds)
      ? undefined
      : body.addedProjectIds;

    const requestBody: ProjectFilter = {
      pageIndex: body.pageIndex,
      pageSize: body.pageSize,
      search: body.search,
      businessUnits: isEmpty(businessUnits) ? undefined : businessUnits,
      businessBranches: isEmpty(businessBranches)
        ? undefined
        : businessBranches,
      businessDepartment: isEmpty(businessDepartment)
        ? undefined
        : businessDepartment,
      budgetSettlementType: body?.budgetSettlementType,
      addedProjectIds,
    };

    return this.http.post(API_BUDGET_PREFIX + nameof(this.getAll), requestBody);
  };

  public businessBranch = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER + nameof(this.businessBranch), {
        params: {
          search: filter?.name?.contain,
          dropdown: filter?.dropdown,
          pageSize: filter?.pageSize,
        },
      })
      .pipe(
        map((response) =>
          response?.data.map((item: any) => ({
            ...item,
            name: `${item?.code} - ${item?.name}`,
          }))
        )
      );
  };

  public businessDepartment = (bodyData: any): Observable<any> => {
    return this.http.post(API_MASTER_DEPARTMENT, bodyData).pipe(
      map((response) =>
        response?.data.map((item: any) => ({
          ...item,
          name: `${item?.code} - ${item?.name}`,
        }))
      )
    );
  };

  public businessUnit = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER + nameof(this.businessUnit), {
        params: {
          search: filter?.name?.contain,
          dropdown: filter?.dropdown,
          pageSize: filter?.pageSize,
        },
      })
      .pipe(map((response) => response?.data));
  };

  public getSelected = (body: any): Observable<any> => {
    return this.http.post(API_BUDGET_PREFIX + nameof(this.getSelected), {
      ids: body,
    });
  };

  public request = (
    body: BudgetSettlement,
    isDraft: boolean
  ): Observable<any> => {
    const requestBody = {
      type: 3,
      name: body?.name,
      isDraft,
      budgetIds: body?.budgetIds?.map((item) => item?.id),
      budgetSettlementType: body?.budgetSettlementTypeValue?.id,
      requestAttachments: body?.requestAttachments,
      isHardValidate: body?.isHardValidate,
    };
    return this.http.post(API_BUDGET + nameof(this.request), requestBody);
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_BUDGET_REQUEST + "/actions", data)
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
  ): Observable<BudgetSettlement> => {
    return this.http
      .post<BudgetSettlement>(
        kebabCase(nameof(this.digitalSign)),
        signatureInfo
      )
      .pipe(map((response: AxiosResponse<BudgetSettlement>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_BUDGET_REQUEST}/template/listSignature`, {
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
        `${API_BUDGET_REQUEST}/template/form/${requestId}`,
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
        `${API_BUDGET_REQUEST}/template/form/${requestId}`
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
      `${API_BUDGET_REQUEST}/template/previewFormConfiguration`,
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
    item: BudgetSettlement
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(
      `${API_BUDGET_REQUEST}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_BUDGET_REQUEST}/template/listTemplate`,
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
      `${API_BUDGET_REQUEST}/template/previewDynamicTemplate/${param?.queryParams}`,
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
}

export const budgetSettlementRepository = new BudgetSettlementRepository();
