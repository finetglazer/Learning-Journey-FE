/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { ListResult } from "core/services/service-types";
import { isUndefined, kebabCase } from "lodash";
import CommonFilter from "models/CommonFilter";
import { FileTemplate } from "models/FileTemplate";
import {
  ProjectSettlementFilter,
  ProjectSettlementModel,
  ProjectSettlementProposal,
} from "models/ProjectSettlement";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { Settlement } from "models/Settlement/Settlement";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";

export const API_PROJECT_SETTLEMENT_BASE = "/purchasing/projectSettlement";
export const GENERAL_PROPOSAL_INFORMATION_API = "/byProposal";

const API_INTERGRATION_ASSET =
  "/purchasing/intergrationAsset/tempReceiptSettlement";

export class ProjectSettlementRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_PROJECT_SETTLEMENT_BASE}`;
  }

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };

  public getAll = (
    filter?: ProjectSettlementFilter
  ): Observable<ListResult<ProjectSettlementModel>> => {
    const createdDateFrom =
      getISOStringDate(filter?.createdDate?.greaterEqual) || undefined;
    const createdDateTo =
      getISOStringDate(filter?.createdDate?.lessEqual) || undefined;

    const effectiveDateFrom =
      getISOStringDate(filter?.effectiveDate?.greaterEqual) || undefined;
    const effectiveDateTo =
      getISOStringDate(filter?.effectiveDate?.lessEqual) || undefined;

    const requestBody = {
      tab: filter?.tab ? Number(filter?.tab) : numberConstants.ZERO,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,

      code: filter?.code,
      description: filter?.description,
      purchaseProposalCode: filter?.purchaseProposalCode,
      purchaseProposalName: filter?.purchaseProposalName,
      projectCode: filter?.projectCode,
      statuses: this.getListIds(filter?.statusesId),
      projectSettlementValueFrom:
        Number(filter?.projectSettlementFrom?.equal) || undefined,
      projectSettlementValueTo:
        Number(filter?.projectSettlementTo?.equal) || undefined,
      createdUserIds: filter?.createdUsersValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdDate:
        isUndefined(createdDateFrom) && isUndefined(createdDateTo)
          ? undefined
          : {
              from: createdDateFrom,
              to: createdDateTo,
            },
      effectiveDate:
        isUndefined(effectiveDateFrom) && isUndefined(effectiveDateTo)
          ? undefined
          : {
              from: effectiveDateFrom,
              to: effectiveDateTo,
            },

      organizationIds: filter?.organizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
    };
    return this.http.post(nameof(this.getAll), requestBody);
  };

  public getGeneralProposalInformation = (
    originalPurchaseProposalId: string
  ): Observable<ProjectSettlementProposal> => {
    return this.http
      .get(`${GENERAL_PROPOSAL_INFORMATION_API}/${originalPurchaseProposalId}`)
      .pipe(Repository.responseDataMapper<ProjectSettlementProposal>());
  };

  public getProjectSettlementDetail = (
    id: string,
    isView?: boolean
  ): Observable<ProjectSettlementProposal> => {
    return this.http
      .get(`/${id}`, { params: { isView } })
      .pipe(Repository.responseDataMapper<ProjectSettlementProposal>());
  };

  public create = (
    formData: ProjectSettlementProposal
  ): Observable<ProjectSettlementProposal> => {
    return this.http
      .post("", formData)
      .pipe(Repository.responseDataMapper<ProjectSettlementProposal>());
  };

  public edit = (
    formData: ProjectSettlementProposal
  ): Observable<ProjectSettlementProposal> => {
    return this.http
      .put(`/${formData?.id}`, formData)
      .pipe(Repository.responseDataMapper<ProjectSettlementProposal>());
  };

  // cancel
  public cancel = (id: string, reason: string): Observable<boolean> => {
    return this.http
      .put(`/${id}/cancel`, undefined, { params: { reason } })
      .pipe(Repository.responseDataMapper<boolean>());
  };

  // delete
  public delete = (id: string, reason: string): Observable<boolean> => {
    return this.http
      .delete(`/${id}`, { params: { reason } })
      .pipe(Repository.responseDataMapper<boolean>());
  };

  // reject
  public reject = (id: string, reason: string): Observable<boolean> => {
    return this.http
      .put(`/${id}/reject`, undefined, { params: { reason } })
      .pipe(Repository.responseDataMapper<boolean>());
  };

  // return
  public return = (id: string, reason: string): Observable<boolean> => {
    return this.http
      .put(`/${id}/return`, undefined, { params: { reason } })
      .pipe(Repository.responseDataMapper<boolean>());
  };

  // approve
  public approve = (id: string): Observable<boolean> => {
    return this.http
      .put(`/${id}/approval`)
      .pipe(Repository.responseDataMapper<boolean>());
  };

  public intergrationTempReceiptSettlement = (
    model: any
  ): Observable<ProjectSettlementProposal> => {
    return this.http.post("", model, {
      baseURL: new URL(
        API_INTERGRATION_ASSET,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
    });
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>("/actions", data)
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
  ): Observable<Settlement> => {
    return this.http
      .post<Settlement>(kebabCase(nameof(this.digitalSign)), signatureInfo)
      .pipe(map((response: AxiosResponse<Settlement>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`/template/listSignature`, {
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
      .post<RequestFormConfiguration>(`/template/form/${requestId}`, {
        ...model,
        requestId,
      })
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
      .get<RequestFormConfiguration>(`/template/form/${requestId}`)
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
      `/template/previewFormConfiguration`,
      model,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public getFile = (Id: string): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>("", {
      responseType: "arraybuffer",
      params: {
        Id,
      },
      baseURL: new URL(
        API_DOWNLOAD_FILE,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
    });
  };

  public previewSignedForm = (
    item: Settlement
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(`/template/previewSignedForm`, item, {
      responseType: "arraybuffer",
    });
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `/template/listTemplate`,
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
      `/template/previewDynamicTemplate/${param?.queryParams}`,
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
      .post<FileModel>("", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        baseURL: new URL(
          API_UPLOAD_SINGLE_FILE,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
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

export const projectSettlementRepository = new ProjectSettlementRepository();
