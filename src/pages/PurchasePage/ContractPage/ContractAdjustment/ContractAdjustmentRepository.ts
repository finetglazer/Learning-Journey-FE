import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { ListResult } from "core/services/service-types";
import { isNil, isUndefined, kebabCase } from "lodash";
import { UserModel } from "models/Budget/Budget";
import {
  ContractAdjustment,
  ContractAdjustmentDetailModel,
  ContractAdjustmentFilter,
  ContractAdjustmentSubmitModel,
  GoodItem,
  SelectAdjustableGoodsServicesFilterByContract,
} from "models/ContractAdjustment";
import { Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { FileTemplate } from "../../../../models/FileTemplate";
import type { AxiosResponse } from "axios";
import {
  WorkflowState,
  WorkflowStateFilter,
} from "../../../../models/WorkflowState";
import { RequestFormConfiguration } from "../../../../models/RequestFormConfiguration";
import { Contract } from "../../../../models/Contract";
import { FileTemplateParams } from "../../../SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import nameof from "ts-nameof.macro";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { WorkflowAction } from "../../../../models/WorkflowAction";
const API_CONTRACT_ADJUSTMENT_GET_ALL = "/purchasing/contractAdjust/getAll";
const API_CONTRACT_NEED_ADJUSTMENT =
  "/purchasing/contractAdjust/getAllContractNeedAdjust";
const API_CONTRACT = "/purchasing/contractAdjust/getContractToAdjust";
const API_CONTRACT_ADJUSTMENT = "/purchasing/contractAdjust";
const API_SUBMIT_CONTRACT_ADJUSTMENT = "/purchasing/contractAdjust";
const API_GET_GOODS_SERVICES_FROM_CONTRACT =
  "/purchasing/contractAdjust/getGoodItemsFromContract";
const API_GET_GOODS_SERVICES_FROM_PROPOSAL =
  "/purchasing/contractAdjust/getGoodItemsAdjustFromProposal";
const API_GET_DETAIL = "/purchasing/contractAdjust";
const API_CANCEL_CONTRACT_ADJUSTMENT = "/purchasing/contract";
const API_DELETE_CONTRACT_ADJUSTMENT = "/purchasing/contract";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";

export class ContractAdjustmentRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };

  public getAll = (
    filter?: ContractAdjustmentFilter
  ): Observable<ListResult<ContractAdjustment>> => {
    let params = {};
    const createDateFrom =
      getISOStringDate(filter?.createdDate?.greaterEqual) || undefined;
    const createDateTo =
      getISOStringDate(filter?.createdDate?.lessEqual) || undefined;
    if (!isNil(createDateFrom) || !isNil(createDateTo)) {
      params = {
        ...params,
        createdDateRange: {
          from: createDateFrom,
          to: createDateTo,
        },
      };
    }

    if (!isNil(filter?.totalAmountFrom) || !isNil(filter?.totalAmountTo)) {
      params = {
        ...params,
        amountRange: {
          from: filter?.totalAmountFrom?.equal,
          to: filter?.totalAmountTo?.equal,
        },
      };
    }

    const tab = filter?.tab;

    const requestBody = {
      ...params,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      tab: tab ? Number(tab) : 0,
      status: this.getListIds(filter?.statusesId),
      codeAdjust: filter?.codeAdjust,
      desciption: filter?.desciption,
      code: filter?.code,
      name: filter?.name,
      contractNo: filter?.contractNo,
      contractTypeIds: filter?.contractTypesId,
      supplierIds: filter?.suppliersId,
      organizationCreateIds: filter?.organizationCreateId,
      createdUsers: filter?.createdUsersValue?.map(
        (user: UserModel) => user.email
      ),
      costGroupIds: filter?.costGroupsId,
    };

    return this.http.post(API_CONTRACT_ADJUSTMENT_GET_ALL, requestBody);
  };

  public getAllContractNeedAdjust = (
    filter?: ContractAdjustmentFilter
  ): Observable<ListResult<ContractAdjustment>> => {
    const requestBody = {
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      amountRange: filter?.amountRange,
      createdDateRange: filter?.createdDateRange,
    };

    return this.http.post(API_CONTRACT_NEED_ADJUSTMENT, requestBody);
  };

  public create = (
    contractAdjustment: ContractAdjustmentSubmitModel
  ): Observable<ContractAdjustment> => {
    return this.http.post(API_SUBMIT_CONTRACT_ADJUSTMENT, contractAdjustment);
  };

  public update = (
    contractAdjustment: ContractAdjustment,
    id: string
  ): Observable<ContractAdjustment> => {
    return this.http.put(
      `${API_SUBMIT_CONTRACT_ADJUSTMENT}/${id}`,
      contractAdjustment
    );
  };

  public getContractDetail = (
    id: string
  ): Observable<{
    data: ContractAdjustmentDetailModel;
  }> => {
    return this.http.get(`${API_CONTRACT}/${id}`);
  };

  public getDetail = ({
    id,
    isViewWaitingApprove,
  }: {
    id: string;
    isViewWaitingApprove: boolean;
  }) => {
    return this.http.get(
      `${API_GET_DETAIL}/${id}?isViewWaitingApprove=${isViewWaitingApprove}`
    );
  };

  public getGoodsServicesFromContract = (
    body: SelectAdjustableGoodsServicesFilterByContract
  ): Observable<ListResult<GoodItem>> => {
    return this.http.post(API_GET_GOODS_SERVICES_FROM_CONTRACT, body);
  };

  public getGoodsServicesFromProposal = (
    body: SelectAdjustableGoodsServicesFilterByContract
  ): Observable<ListResult<GoodItem>> => {
    return this.http.post(API_GET_GOODS_SERVICES_FROM_PROPOSAL, body).pipe();
  };

  public cancelContractAdjustment = (
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
      .put(
        `${API_CANCEL_CONTRACT_ADJUSTMENT}/${id}/cancel`,
        {},
        {
          params,
          headers,
        }
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  public deleteContractAdjustment = (
    id: string,
    data: string
  ): Observable<string> => {
    const params = { reason: data };

    const headers = {
      "Content-Type": "text/plain; charset=utf-8",
    };
    return this.http
      .delete(`${API_DELETE_CONTRACT_ADJUSTMENT}/${id}`, { headers, params })
      .pipe(Repository.responseDataMapper<string>());
  };

  //workflow
  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_CONTRACT_ADJUSTMENT}/template/listTemplate`,
        {},
        {
          params: {
            requestId: id,
          },
        }
      )
      .pipe(map((response: AxiosResponse<FileTemplate[]>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(
        `${API_CONTRACT_ADJUSTMENT}/template/listSignature`,
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
        `${API_CONTRACT_ADJUSTMENT}/template/form/${requestId}`,
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

  public previewFormConfiguration = (
    model: RequestFormConfiguration
  ): Observable<any> => {
    return this.http.post<RequestFormConfiguration>(
      `${API_CONTRACT_ADJUSTMENT}/template/previewFormConfiguration`,
      model,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplatePreview = (
    param: FileTemplateParams
  ): Observable<AxiosResponse<any>> => {
    return this.http.post<AxiosResponse<any>>(
      `${API_CONTRACT_ADJUSTMENT}/template/previewDynamicTemplate/${param?.queryParams}`,
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

  public getFormConfiguration = (
    requestId: string
  ): Observable<RequestFormConfiguration> => {
    return this.http
      .get<RequestFormConfiguration>(
        `${API_CONTRACT_ADJUSTMENT}/template/form/${requestId}`
      )
      .pipe(
        map(
          (response: AxiosResponse<RequestFormConfiguration>) => response.data
        )
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

  public getFile = (Id: string): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer",
      params: {
        Id,
      },
    });
  };

  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_CONTRACT_ADJUSTMENT + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };

  public previewSignedForm = (
    item: Contract
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(
      `${API_CONTRACT_ADJUSTMENT}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };
}

export const contractAdjustmentRepository = new ContractAdjustmentRepository();
