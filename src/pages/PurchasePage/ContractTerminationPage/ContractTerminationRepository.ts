import { httpConfig } from "core/config/http";
import { Model, Repository } from "react-3layer-common";
import { ContractDetailFormModel } from "models/Contract";
import { map, Observable } from "rxjs";
import { ListResult } from "core/services/service-types";
import { isEmpty, isNil, kebabCase } from "lodash";
import dayjs from "dayjs";
import {
  contactDetailInListTerminationModel,
  ContractSettlementFilter,
  ContractTerminationSubmitModel,
} from "models/ContractTermination";
import { ContractLiquidationFilter } from "models/ContractLiquidation/ContractLiquidationFilter";
import { ContractLiquidation } from "models/ContractLiquidation";
import { ContractTerminationFile } from "./ContractTerminationDetail/Components/ContractTerminationFile/Components/ContractTerminationFile/ContractTerminationFile";
import type { AxiosResponse } from "axios";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import nameof from "ts-nameof.macro";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { FileTemplate } from "models/FileTemplate";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import ConfigStore from "core/config/ConfigStore";

const API_GET_CONTRACT_DETAIL =
  "purchasing/contractLiquidation/getContractInfo";
const API_GET_ALL_CONTRACT = "purchasing/contractLiquidation/getContract";
const API_GET_CONTRACT_TERMINATION_DETAIL = "purchasing/contractLiquidation";
const API_GET_ALL = "/purchasing/contractLiquidation/getAll";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
const UPLOAD_CONTRACT_FILE = (id: string) =>
  `purchasing/contractLiquidation/${id}/uploadFile`;

export class ContractTerminationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getContractDetail = (id: string) => {
    return this.http.get(`${API_GET_CONTRACT_DETAIL}/${id}`);
  };

  public getContractTermination = (
    filter: ContractSettlementFilter
  ): Observable<ListResult<contactDetailInListTerminationModel>> => {
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

  public uploadContractFile = (
    id: string,
    file: ContractTerminationFile
  ): Observable<ContractDetailFormModel> => {
    const endpoint = UPLOAD_CONTRACT_FILE(id);
    return this.http
      .put(endpoint, {
        file: file,
      })
      .pipe(Repository.responseDataMapper<ContractDetailFormModel>());
  };

  public create = (data: ContractTerminationSubmitModel): Observable<Model> => {
    return this.http
      .post<Model>(API_GET_CONTRACT_TERMINATION_DETAIL, data)
      .pipe(Repository.responseMapToModel<Model>(Model));
  };

  public update = (data: ContractTerminationSubmitModel): Observable<Model> => {
    const { idDetail, ...body } = data;
    return this.http
      .put<Model>(`${API_GET_CONTRACT_TERMINATION_DETAIL}/${idDetail}`, body)
      .pipe(Repository.responseMapToModel<Model>(Model));
  };

  public getDetail = (id: string, isView?: boolean) => {
    return this.http.get(
      `${API_GET_CONTRACT_TERMINATION_DETAIL}/${id}?isView=${isView}`
    );
  };

  public listAll = (
    filter: ContractLiquidationFilter
  ): Observable<ListResult<ContractLiquidation>> => {
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
      description: filter?.description,
      contractCode: filter?.contractCode,
      contractNumber: filter?.contractNumber,
      contractName: filter?.contractName,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      createdUser: filter?.createUserValue?.map(
        (item: { email: string }) => item?.email
      ),
      organizationIds: filter?.organizationIdId,
      supplierIds: filter?.supplierIdsId,
    };

    return this.http.post(API_GET_ALL, body);
  };

  public returnContractTermination = (
    id: string,
    data: string
  ): Observable<string> => {
    return this.http
      .put(`${API_GET_CONTRACT_TERMINATION_DETAIL}/${id}/return?reason=${data}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public rejectContractTermination = (
    id: string,
    data: string
  ): Observable<string> => {
    return this.http
      .put(`${API_GET_CONTRACT_TERMINATION_DETAIL}/${id}/reject?reason=${data}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public cancelContractTermination = (
    id: string,
    data: string
  ): Observable<string> => {
    return this.http
      .put(`${API_GET_CONTRACT_TERMINATION_DETAIL}/${id}/cancel?reason=${data}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public deleteContractTermination = (
    id: string,
    data: string
  ): Observable<string> => {
    return this.http
      .delete(`${API_GET_CONTRACT_TERMINATION_DETAIL}/${id}/?reason=${data}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  public approveContractTermination = (id: string): Observable<string> => {
    return this.http
      .put(`${API_GET_CONTRACT_TERMINATION_DETAIL}/${id}/approve`)
      .pipe(Repository.responseDataMapper<string>());
  };
  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(
        API_GET_CONTRACT_TERMINATION_DETAIL + "/actions",
        data
      )
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
  ): Observable<ContractDetailFormModel> => {
    return this.http
      .post<ContractDetailFormModel>(
        kebabCase(nameof(this.digitalSign)),
        signatureInfo
      )
      .pipe(
        map((response: AxiosResponse<ContractDetailFormModel>) => response.data)
      );
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(
        `${API_GET_CONTRACT_TERMINATION_DETAIL}/template/listSignature`,
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
        `${API_GET_CONTRACT_TERMINATION_DETAIL}/template/form/${requestId}`,
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
        `${API_GET_CONTRACT_TERMINATION_DETAIL}/template/form/${requestId}`
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
      `${API_GET_CONTRACT_TERMINATION_DETAIL}/template/previewFormConfiguration`,
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
    item: ContractDetailFormModel
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(
      `${API_GET_CONTRACT_TERMINATION_DETAIL}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_GET_CONTRACT_TERMINATION_DETAIL}/template/listTemplate`,
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
      `${API_GET_CONTRACT_TERMINATION_DETAIL}/template/previewDynamicTemplate/${param?.queryParams}`,
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

export const contractTerminationRepository =
  new ContractTerminationRepository();
