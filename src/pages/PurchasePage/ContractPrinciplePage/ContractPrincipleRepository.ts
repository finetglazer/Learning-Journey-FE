import { isUndefined, kebabCase } from "lodash";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

import { DEFAULT_PAGE_SIZE } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";

import { getISOStringDate } from "core/helpers/date-time";

import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import CommonFilter from "models/CommonFilter";
import { ManageSupplier } from "models/Contract";
import {
  ContractPrinciple,
  ContractPrincipleFilter,
} from "models/ContractPrinciple";
import { ContractNeedAdjustFilter } from "models/ContractPrincipleAppendix";
import { ContractNeedAdjust } from "models/ContractPrincipleAppendix/ContractPrincioleAppendix";
import { FileTemplate } from "models/FileTemplate";
import { GoodService } from "models/Proposal/GoodService";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import nameof from "ts-nameof.macro";

const CONTRACT_PRINCIPLE_GET_ALL_API = "/purchasing/principleContract/getAll";
const API_MASTER_BUSINESS_BRANCH = "master/businessBranch";
const API_MASTER_BUSINESS_UNIT = "master/businessUnit";
const MANAGE_SUPPLIER_GET_ALL_API = "/master/supplier/list";
const GOODS_SERVICES_GET_ALL_API = "/master/goodsServices/getAll";
const ORGANIZATION_GET_ALL_API = "/master/organization/getDropdown";
const AUTH_USER_API = "/auth/user";
const CONTRACT_PRINCIPLE_DELETE_API = "/purchasing/principleContract";
const GET_PRINCIPLE_CONTRACT_TO_APPENDIX_API =
  "/purchasing/contract/getPrincipleContractToAppendix";
const GET_BUSINESS_BRANCH_API = "/master/businessBranch";
const GET_BUSINESS_UNIT_API = "/master/businessUnit";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
const API_CONTRACT_PRINCIPLE = "/purchasing/contract";
export class ContractPrincipleRepository extends Repository {
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

  public getAll = (
    filter: ContractPrincipleFilter
  ): Observable<ListResult<ContractPrinciple>> => {
    const requestBody = {
      contractClassification: 1,
      tab: filter?.tab ? Number(filter?.tab) : 0,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      code: filter?.code,
      name: filter?.name,
      contractNo: filter?.contractNo,
      costGroupIds: filter?.costGroupId,
      supplierIds: filter?.suppliersId,
      goodsIds: filter?.goodsServicesId,
      purchasePlan: filter?.purchasePlanCode,
      organizationIds: filter?.managementUnitsValue?.map(
        (unit: { id: string }) => unit.id
      ),
      applicableOrganizationIds: filter?.applicableOrganizationIdsValue?.map(
        (unit: { id: string }) => unit.id
      ),
      applicableBranchIds: filter?.applicableBranchIdsValue?.map(
        (unit: { id: string }) => unit.id
      ),
      applicableUnitIds: filter?.applicableUnitIdsValue?.map(
        (unit: { id: string }) => unit.id
      ),

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
      organizationCreateIds: filter?.organizationCreateIdsValue?.map(
        (unit: { id: string }) => unit.id
      ),
      createdDateRange: {
        from: getISOStringDate(filter?.createdDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.createdDate?.lessEqual) || undefined,
      },
      createdUsers: this.getListEmails(filter?.createdUsersValue),
      status: this.getListIds(filter?.statusesId),
      types: this.getListIds(filter?.typesId),
    };

    return this.http.post(CONTRACT_PRINCIPLE_GET_ALL_API, requestBody);
  };

  public getListSupplier = (
    filter: ModelFilter
  ): Observable<ManageSupplier[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      isActive: true,
    };

    return this.http
      .get(MANAGE_SUPPLIER_GET_ALL_API, {
        params,
      })
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

  public getListUser = (filter: ModelFilter): Observable<CommonFilter[]> => {
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

  public listBusinessBranch = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(API_MASTER_BUSINESS_BRANCH, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public listBusinessUnit = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(API_MASTER_BUSINESS_UNIT, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public performContractPrincipleAction = (
    id: string,
    reason: string,
    action: "delete" | "cancel"
  ): Observable<string> => {
    const url =
      action === "delete"
        ? `${CONTRACT_PRINCIPLE_DELETE_API}/${id}`
        : `${CONTRACT_PRINCIPLE_DELETE_API}/${id}/cancel`;

    const request =
      action === "delete"
        ? this.http.delete(url, { params: { reason } })
        : this.http.put(url, {}, { params: { reason } });

    return request.pipe(Repository.responseDataMapper<string>());
  };

  public deleteContractPrinciple = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.performContractPrincipleAction(id, reason, "delete");
  };

  public cancelContractPrinciple = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.performContractPrincipleAction(id, reason, "cancel");
  };

  // Get principle contract to appendix
  public getPrincipleContractToAppendix = (
    filter: ContractNeedAdjustFilter
  ): Observable<ListResult<ContractNeedAdjust>> => {
    return this.http.post(GET_PRINCIPLE_CONTRACT_TO_APPENDIX_API, filter);
  };

  // Get business branch
  public getBusinessBranch = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      isDropdown: true,
    };

    return this.http
      .get(GET_BUSINESS_BRANCH_API, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  // Get business unit
  public getBusinessUnit = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      isDropdown: true,
    };

    return this.http
      .get(GET_BUSINESS_UNIT_API, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_CONTRACT_PRINCIPLE + "/actions", data)
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
  ): Observable<ContractPrinciple> => {
    return this.http
      .post<ContractPrinciple>(
        kebabCase(nameof(this.digitalSign)),
        signatureInfo
      )
      .pipe(map((response: AxiosResponse<ContractPrinciple>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(
        `${API_CONTRACT_PRINCIPLE}/template/listSignature`,
        {
          search: filter?.search,
          notIn: filter?.notIn,
          requestId: filter?.id,
        }
      )
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
        `${API_CONTRACT_PRINCIPLE}/template/form/${requestId}`,
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
        `${API_CONTRACT_PRINCIPLE}/template/form/${requestId}`
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
      `${API_CONTRACT_PRINCIPLE}/template/previewFormConfiguration`,
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
    item: ContractPrinciple
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(
      `${API_CONTRACT_PRINCIPLE}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_CONTRACT_PRINCIPLE}/template/listTemplate`,
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
      `${API_CONTRACT_PRINCIPLE}/template/previewDynamicTemplate/${param?.queryParams}`,
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

export const contractPrincipleRepository = new ContractPrincipleRepository();
