/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { kebabCase } from "lodash";
import { ContractTempReceiptFilter } from "models/Contract";
import {
  GoodServiceFilter,
  GoodServiceResponseObservableModel,
} from "models/Proposal/GoodService";
import {
  ContractTempReceiptModel,
  RequestCreateTemporaryImportAsset,
  TemporaryImportAsset,
  TemporaryImportAssetModel,
  TemporaryImportAssetTypeModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import { TemporaryImportAssetFilter } from "models/TemporaryImportAsset/TemporaryImportAssetFilter";
import { Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";
import { FileTemplate } from "../../../models/FileTemplate";
import { RequestFormConfiguration } from "../../../models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "../../../models/SignatureInfo";
import { WorkflowAction } from "../../../models/WorkflowAction";
import {
  WorkflowState,
  WorkflowStateFilter,
} from "../../../models/WorkflowState";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";

const API_GETALL = "/purchasing/tempReceipt/getAll";
const API_GET_LIST_GOOD_SERVICES = "master/goodsServices/getAll";
const API_TEMPORARY_IMPORT_ASSET = "/purchasing/tempReceipt";
const API_GET_CONTRACT_TEMP_RECEIPT =
  "/purchasing/contract/getContractTempReceipt";
const API_DETAIL = `/purchasing/tempReceipt`;
const API_TEMPORARY_IMPORT_ASSETS = "purchasing/tempReceipt";
const API_APPROVE_TEMPORARY_ASSET = "purchasing/tempReceipt";
const API_GET_LIST_CONTRACT_OWNER = "purchasing/tempReceipt/GetAssetOwners";
const API_GET_LIST_GOOD_SERVICES_BY_CONTRACT_ID =
  "purchasing/tempReceipt/GetAssetGoods";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_INTERGRATION_ASSET =
  "/purchasing/intergrationAsset/tempReceiptSettlement";
const API_DOWNLOAD_FILE = "share/file/download";
export class TemporaryImportAssetRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listAll = (
    filter: TemporaryImportAssetFilter
  ): Observable<ListResult<TemporaryImportAsset>> => {
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
      status: filter?.statusId?.map(Number),
      code: filter?.code,
      note: filter?.note,
      assetCode: filter?.assetCode,
      totalRangeTo: Number(filter?.totalRangeTo?.greaterEqual),
      totalRangeFrom: Number(filter?.totalRangeFrom?.lessEqual),
      goodIds: filter?.goodsIdsId,
      contractCode: filter?.contractCode,
      contractNumber: filter?.contractNumber,
      contractName: filter?.contractName,
      supplierIds: filter?.supplierIdsId,
      createdUser: filter?.createUserId,
      organizationIdIds: filter?.businessUnitIdId,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
    };

    return this.http.post(API_GETALL, body);
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

    return this.http.post(`${API_GET_LIST_GOOD_SERVICES}`, body);
  };

  public getGoodServicesListByContractId = (
    id: string,
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

    return this.http.post(
      `${API_GET_LIST_GOOD_SERVICES_BY_CONTRACT_ID}/${id}`,
      body
    );
  };

  public getAssetOwnerList = (
    id: string,
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

    return this.http.post(`${API_GET_LIST_CONTRACT_OWNER}/${id}`, body);
  };

  public deleteTemporaryImportAsset = (
    id: string,
    data: string
  ): Observable<string> => {
    const params = { reason: data };

    const headers = {
      "Content-Type": "text/plain; charset=utf-8",
    };
    return this.http
      .delete(`${API_TEMPORARY_IMPORT_ASSET}/${id}`, { headers, params })
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelTemporaryImportAsset = (
    id: string,
    data: string
  ): Observable<string> => {
    const params = {
      reason: data,
    };

    const headers = {
      "Content-Type": "text/plain; charset=utf-8",
    };

    return this.http
      .put(`${API_TEMPORARY_IMPORT_ASSET}/${id}/cancel`, null, {
        params,
        headers,
      })
      .pipe(Repository.responseDataMapper<string>());
  };

  public actionTemporaryImportAsset = (
    id: string,
    data: string,
    action: number
  ): Observable<string> => {
    const params = {
      reason: data,
      actionType: action,
    };

    const headers = {
      "Content-Type": "text/plain; charset=utf-8",
    };

    return this.http
      .put(`${API_TEMPORARY_IMPORT_ASSET}/${id}/approval`, null, {
        params,
        headers,
      })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getContractTempReceipt = (
    filter: ContractTempReceiptFilter
  ): Observable<ListResult<ContractTempReceiptModel>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search,
      code: filter?.code,
      name: filter?.name,
      contractNo: filter?.contractNo,
    };

    return this.http.post(API_GET_CONTRACT_TEMP_RECEIPT, body);
  };

  public getTemporaryImportAssetDetail = (
    id: string,
    params?: { isViewWaitingApprove: boolean }
  ) => {
    const endpoint = `${API_DETAIL}/${id}`;
    return this.http
      .get(endpoint, { params })
      .pipe(Repository.responseDataMapper<TemporaryImportAssetModel>());
  };

  public createTemporaryImportAsset = (
    data: RequestCreateTemporaryImportAsset
  ): Observable<TemporaryImportAssetTypeModel> => {
    const body = {
      isDraft: data?.isDraft,
      contractId: data?.contractId,
      description: data?.description,
      tempReceiptItems: data?.tempReceiptItems,
      attachments: data?.attachments,
      isHardValidate: data?.isHardValidate,
    };

    return this.http
      .post<TemporaryImportAssetTypeModel>(API_TEMPORARY_IMPORT_ASSETS, body)
      .pipe(
        Repository.responseMapToModel<TemporaryImportAssetTypeModel>(
          TemporaryImportAssetTypeModel
        )
      );
  };

  public updateTemporaryImportAsset = (
    data: RequestCreateTemporaryImportAsset
  ): Observable<TemporaryImportAssetTypeModel> => {
    const body = {
      isDraft: data?.isDraft,
      contractId: data?.contractId,
      description: data?.description,
      tempReceiptItems: data?.tempReceiptItems,
      attachments: data?.attachments,
      isHardValidate: data?.isHardValidate,
    };

    return this.http
      .put<TemporaryImportAssetTypeModel>(
        `${API_TEMPORARY_IMPORT_ASSETS}/${data?.id}`,
        body
      )
      .pipe(
        Repository.responseMapToModel<TemporaryImportAssetTypeModel>(
          TemporaryImportAssetTypeModel
        )
      );
  };

  public getTemporaryAssetDetail = (id: string) => {
    return this.http.get(`${API_TEMPORARY_IMPORT_ASSETS}/${id}`);
  };

  public approveTemporaryAsset = (
    id: string,
    type?: number
  ): Observable<string> => {
    const body = {
      id: id,
      actionType: type,
    };
    return this.http
      .put(`${API_APPROVE_TEMPORARY_ASSET}/${id}/approval`, body)
      .pipe(Repository.responseDataMapper<string>());
  };
  public intergrationTempReceiptSettlement = (
    model: any
  ): Observable<GoodServiceResponseObservableModel> => {
    return this.http.post(API_INTERGRATION_ASSET, model);
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_DETAIL + "/actions", data)
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
  ): Observable<TemporaryImportAsset> => {
    return this.http
      .post<TemporaryImportAsset>(
        kebabCase(nameof(this.digitalSign)),
        signatureInfo
      )
      .pipe(
        map((response: AxiosResponse<TemporaryImportAsset>) => response.data)
      );
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_DETAIL}/template/listSignature`, {
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
        `${API_DETAIL}/template/form/${requestId}`,
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
      .get<RequestFormConfiguration>(`${API_DETAIL}/template/form/${requestId}`)
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
      `${API_DETAIL}/template/previewFormConfiguration`,
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
    item: TemporaryImportAsset
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(`${API_DETAIL}/template/previewSignedForm`, item, {
      responseType: "arraybuffer",
    });
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_DETAIL}/template/listTemplate`,
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
      `${API_DETAIL}/template/previewDynamicTemplate/${param?.queryParams}`,
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

export const temporaryImportAssetRepository =
  new TemporaryImportAssetRepository();
