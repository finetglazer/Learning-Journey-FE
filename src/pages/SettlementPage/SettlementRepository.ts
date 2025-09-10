/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { isEmpty, isNil, kebabCase } from "lodash";
import { ContractDetailFormModel } from "models/Contract";
import {
  contactDetailInListModel,
  ContractDataSubmitModel,
  ContractSettlementFilter,
} from "models/Settlement";
import { Settlement } from "models/Settlement/Settlement";
import { SettlementFilter } from "models/Settlement/SettlementFilter";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { SettlementFile } from "./SettlementDetail/components/SettlementFileTab/components/SettlementFile/SettlementFile";

import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { DEFAULT_PAGE_SIZE } from "core/config/consts";
import { FileTemplate } from "core/models/FileTemplate";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import CommonFilter from "models/CommonFilter";
import { Manufacturer, ManufacturerFilter } from "models/Manufacturer";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import nameof from "ts-nameof.macro";

const API_GETALL = "/purchasing/contractSettlement/getAll";
const APT_GET_DETAIL_SETTLEMENT = "/purchasing/contractSettlement";
const API_GET_ALL_CONTRACT = "purchasing/contractSettlement/getContract";
const API_GET_CONTRACT_DETAIL = "purchasing/contractSettlement/getContractInfo";
const API_SETTLEMENT = "/purchasing/contractSettlement";
const APT_SUBMIT_SETTLEMENT = "/purchasing/contractSettlement";
const API_GET_LIST_GOOD_SERVICES = "master/goodsServices/getAll";
const API_MANUFACTURE_PREFIX = "master/manufacturers";
const ORGANIZATION_GET_ALL_API = "/master/organization/getDropdown";
const AUTH_USER_API = "/auth/user";
const API_CHECK_ASSET = "/purchasing/intergrationAsset/getAssetInfo";
const ASSET_CLASSIFY_INFO_API =
  "/purchasing/contractSettlement/getAssetClassifyInfo";
const UPLOAD_CONTRACT_FILE = (id: string) =>
  `purchasing/contractSettlement/${id}/uploadFile`;

const API_INTERGRATION_ASSET =
  "/purchasing/intergrationAsset/tempReceiptSettlement";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
export class SettlementRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listAll = (
    filter: SettlementFilter
  ): Observable<ListResult<Settlement>> => {
    const fromDate = filter?.createDate?.greaterEqual
      ? dayjs(filter?.createDate?.greaterEqual)?.toDate()?.toISOString()
      : undefined;

    const toDate = filter?.createDate?.lessEqual
      ? dayjs(filter?.createDate?.lessEqual)?.toDate()?.toISOString()
      : undefined;

    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      tab: filter?.tab ? Number(filter?.tab) : 0,
      search: filter?.search?.trim(),
      code: filter?.code,
      description: filter?.description,
      effectiveDateRange: {
        from:
          getISOStringDate(filter?.effectiveDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.effectiveDate?.lessEqual) || undefined,
      },
      totalRangeFrom: Number(filter?.totalRangeFrom?.lessEqual),
      totalRangeTo: Number(filter?.totalRangeTo?.greaterEqual),
      supplierIds: filter?.supplierIdsId,
      contractCode: filter?.contractCode,
      contractNumber: filter?.contractNumber,
      contractName: filter?.contractName,
      costGroupIds: filter?.costGroupId,
      goodIds: filter?.goodsIdsId,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      createdUser: filter?.createUserId,
      organizationIds: filter?.organizationIdId,
      status: filter?.statusId,
    };

    return this.http.post(API_GETALL, body);
  };

  public getContractSettlement = (
    filter: ContractSettlementFilter
  ): Observable<ListResult<contactDetailInListModel>> => {
    const isContractValueEmpty =
      isNil(filter?.totalRangeFrom) && isNil(filter?.totalRangeTo);
    const isCreatedDateEmpty =
      isNil(filter?.createdDateRange?.[0]) &&
      isNil(filter?.createdDateRange?.[1]);
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      search: filter?.search,
      createDateRange: isCreatedDateEmpty
        ? undefined
        : {
            from: !isEmpty(filter?.createdDateRange)
              ? dayjs(filter?.createdDateRange[0]).format()
              : undefined,
            to: !isEmpty(filter?.createdDateRange)
              ? dayjs(filter?.createdDateRange[1]).format()
              : undefined,
          },
      contractValue: isContractValueEmpty
        ? undefined
        : {
            from: filter?.totalRangeFrom,
            to: filter?.totalRangeTo,
          },
    };
    return this.http.post(API_GET_ALL_CONTRACT, {
      ...body,
    });
  };

  public getContractDetail = (id: string) => {
    return this.http.get(`${API_GET_CONTRACT_DETAIL}/${id}`);
  };

  public deleteSettlement = (id: string, data: string): Observable<string> => {
    const params = {
      reason: data,
    };
    return this.http
      .delete(`${API_SETTLEMENT}/${id}`, { params })
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelSettlement = (id: string, data: string): Observable<string> => {
    if (isNil(data)) return;

    return this.http
      .put(`${API_SETTLEMENT}/${id}/cancel?reason=${data}`, null)
      .pipe(Repository.responseDataMapper<string>());
  };

  public returnSettlement = (id: string, data: string): Observable<string> => {
    if (isNil(data)) return;

    return this.http
      .put(`${API_SETTLEMENT}/${id}/return?reason=${data}`, null)
      .pipe(Repository.responseDataMapper<string>());
  };

  public rejectSettlement = (id: string, data: string): Observable<string> => {
    if (isNil(data)) return;

    return this.http
      .put(`${API_SETTLEMENT}/${id}/reject?reason=${data}`, null)
      .pipe(Repository.responseDataMapper<string>());
  };

  public getSettlementDetail = (id: string, isView?: boolean) => {
    return this.http.get(`${APT_GET_DETAIL_SETTLEMENT}/${id}?isView=${isView}`);
  };

  public getGoodServicesList = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.trim(),
      purchasingMethod: filter?.purchasingMethod,
    };

    return this.http
      .post(API_GET_LIST_GOOD_SERVICES, requestBody)
      .pipe(map((response) => response?.data?.items));
  };

  public getDropdownManufacturer = (
    data?: ManufacturerFilter
  ): Observable<Manufacturer[]> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_MANUFACTURE_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Manufacturer[]>());
  };

  public getListOrganization = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.trim(),
      isIncludeRelation: false,
    };

    return this.http
      .post(ORGANIZATION_GET_ALL_API, requestBody)
      .pipe(map((response) => response?.data));
  };

  public getListUser = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.trim(),
      pageSize: DEFAULT_PAGE_SIZE,
      isActive: true,
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
            organizationId: item?.organizationId,
          }));
        })
      );
  };

  public createSettlement = (
    data: ContractDataSubmitModel
  ): Observable<Model> => {
    return this.http
      .post<Model>(APT_SUBMIT_SETTLEMENT, data)
      .pipe(Repository.responseMapToModel<Model>(Model));
  };

  public approveSettlement = (id: string): Observable<string> => {
    return this.http
      .put(`${API_SETTLEMENT}/${id}/approve`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public getAssetClassifyInfo = (
    data: ModelFilter
  ): Observable<Manufacturer> => {
    return this.http.post(ASSET_CLASSIFY_INFO_API, data).pipe((response) => {
      return response;
    });
  };

  public uploadContractFile = (
    id: string,
    file: SettlementFile
  ): Observable<ContractDetailFormModel> => {
    const endpoint = UPLOAD_CONTRACT_FILE(id);
    return this.http
      .put(endpoint, {
        file: file,
      })
      .pipe(Repository.responseDataMapper<ContractDetailFormModel>());
  };

  public updateSettlement = (
    data: ContractDataSubmitModel
  ): Observable<Model> => {
    const { idEdit, ...body } = data;
    return this.http
      .put<Model>(`${APT_SUBMIT_SETTLEMENT}/${idEdit}`, body)
      .pipe(Repository.responseMapToModel<Model>(Model));
  };

  public intergrationTempReceiptSettlement = (
    model: any
  ): Observable<ContractDetailFormModel> => {
    return this.http.post(API_INTERGRATION_ASSET, model);
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_SETTLEMENT + "/actions", data)
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
      .post<WorkflowState[]>(`${API_SETTLEMENT}/template/listSignature`, {
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
        `${API_SETTLEMENT}/template/form/${requestId}`,
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
        `${API_SETTLEMENT}/template/form/${requestId}`
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
      `${API_SETTLEMENT}/template/previewFormConfiguration`,
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
    item: Settlement
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(
      `${API_SETTLEMENT}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_SETTLEMENT}/template/listTemplate`,
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
      `${API_SETTLEMENT}/template/previewDynamicTemplate/${param?.queryParams}`,
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

  public checkAsset = (assetCodes: string[]): Observable<any> => {
    return this.http.post(API_CHECK_ASSET, assetCodes);
  };
}

export const settlementRepository = new SettlementRepository();
