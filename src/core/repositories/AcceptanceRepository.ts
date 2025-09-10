/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { kebabCase } from "lodash";
import { AcceptanceModel, GoodItemsModel } from "models/Acceptance/Acceptance";
import { GoodsReceiptModel } from "models/Acceptance/GoodsReceipt";
import { FileTemplate } from "models/FileTemplate";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { ModelFilter, Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const ACCEPTANCE_BASE_API = "/purchasing/acceptance";
const GENERAL_INFORMATION_API = "/getContractById";
const CANCEL_ACCEPTANCE_API = "cancel";
const APPROVE_ACCEPTANCE_API = "approve";
const API_EVALUATION_SUPPLIER = "/getSupplierEvaluation";
const RETURN_ACCEPTANCE_API = "return";
const REJECT_ACCEPTANCE_API = "reject";
const API_DOWNLOAD_FILE = "share/file/download";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
export class AcceptanceRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${ACCEPTANCE_BASE_API}`;
  }

  public getGeneralInformation = (
    contractId: string
  ): Observable<AcceptanceModel> => {
    const params = {
      id: contractId,
    };
    return this.http
      .get(GENERAL_INFORMATION_API, { params })
      .pipe(Repository.responseDataMapper<AcceptanceModel>());
  };

  public deleteAcceptance = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .delete(`/${id}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelAcceptance = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put(`/${id}/${CANCEL_ACCEPTANCE_API}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public returnAcceptance = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put(`/${id}/${RETURN_ACCEPTANCE_API}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public rejectAcceptance = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put(`/${id}/${REJECT_ACCEPTANCE_API}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public approval = (id: string): Observable<string> => {
    return this.http
      .put(`/${id}/${APPROVE_ACCEPTANCE_API}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public goodsReceiptRequest = (
    filter: ModelFilter
  ): Observable<ListResult<GoodsReceiptModel>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      code: filter?.code,
      contractId: filter?.contractId,
      goodsReceiptRequestIds: filter?.goodsReceiptRequestIds,
      receiptOrganizationId: filter?.receiptOrganizationId,
      receiptDepartmentId: filter?.receiptDepartmentId,
      receiptPersonId: filter?.receiptPersonId,
    };
    return this.http.post(nameof(this.goodsReceiptRequest), requestBody);
  };

  public getGoodItems = (
    goodItemIds: string[]
  ): Observable<GoodItemsModel[]> => {
    return this.http
      .post(nameof(this.getGoodItems), goodItemIds)
      .pipe(map((response) => response?.data));
  };

  public getAcceptanceDetail = (
    id: string,
    isView = false
  ): Observable<AcceptanceModel> => {
    return this.http
      .get(`/${id}?isView=${isView}`)
      .pipe(Repository.responseDataMapper<AcceptanceModel>());
  };

  public create = (formData: {
    isDraft: boolean;
  }): Observable<AcceptanceModel> => {
    return this.http
      .post("", formData)
      .pipe(Repository.responseDataMapper<AcceptanceModel>());
  };

  public edit = (formData: {
    isDraft: boolean;
    acceptanceId?: string;
  }): Observable<AcceptanceModel> => {
    return this.http
      .put(`/${formData?.acceptanceId}`, formData)
      .pipe(Repository.responseDataMapper<AcceptanceModel>());
  };

  public getEvaluationSupplier = (supplierIds: string[]) => {
    return this.http
      .post(API_EVALUATION_SUPPLIER, supplierIds)
      .pipe(Repository.responseDataMapper());
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
  ): Observable<AcceptanceModel> => {
    return this.http
      .post<AcceptanceModel>(kebabCase(nameof(this.digitalSign)), signatureInfo)
      .pipe(map((response: AxiosResponse<AcceptanceModel>) => response.data));
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
    item: AcceptanceModel
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

export const acceptanceRepository = new AcceptanceRepository();
