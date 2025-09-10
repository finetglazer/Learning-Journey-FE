import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import {
  API_DOWNLOAD_FILE,
  DEFAULT_PAGE_SIZE,
  numberConstants,
} from "core/config/consts";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import { ListResult } from "core/services/service-types";
import { isNumber, isUndefined, kebabCase } from "lodash";
import CommonFilter from "models/CommonFilter";
import { Contract } from "models/Contract";
import { ContractAnnex, ContractAnnexFilter } from "models/ContractAnnex";
import { FileTemplate } from "models/FileTemplate";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import { WorkflowAction } from "models/WorkflowAction";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { API_UPLOAD_SINGLE_FILE } from "pages/BudgetPage/BudgetRepository";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const API_CANCEL_CONTRACT_ANNEX = "cancel";
const API_CONTRACT_ANNEX = "/purchasing/contractAppendix";
const API_CONTRACT_PRINCIPLE_ANNEX = "/purchasing/principleContractAppendix";

const API_CONTRACT_APPENDIX_GET_MANAGER_PERSON = "/auth/user";
const API_CONTRACT_ANNEX_GET_ALL = "/purchasing/contractAppendix/getAll";
const GENERAL_CONTRACT_ANNEX_DETAIL_API = "/purchasing/contractAppendix";
const GENERAL_CONTRACT_PRINCIPLE_ANNEX_DETAIL_API =
  "/purchasing/principleContractAppendix";

const GENERAL_CONTRACT_INFORMATION_API =
  "/purchasing/contractAppendix/byContract";
const API_CONTRACT_APPENDIX_GET_MANAGER_DEPARTMENT_UNIT =
  "/master/organization/getDropdown";
const API_CONTRACT_APPENDIX_GET_SUPPLIER_PAYMENT =
  "/master/supplier/getSupplierPayment";
const API_CONTRACT_GET_INCLUDE_SEGMENT =
  "/master/organization/getIncludeSegment";
const AUTH_USER_API = "/auth/user";

export class ContractAnnexRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };

  public getAll = (
    filter?: ContractAnnexFilter
  ): Observable<ListResult<ContractAnnex>> => {
    const effectiveDateFrom =
      getISOStringDate(filter?.effectiveDate?.greaterEqual) || undefined;
    const effectiveDateTo =
      getISOStringDate(filter?.effectiveDate?.lessEqual) || undefined;
    const endDateFrom =
      getISOStringDate(filter?.endDate?.greaterEqual) || undefined;
    const endDateTo = getISOStringDate(filter?.endDate?.lessEqual) || undefined;
    const createdDateFrom =
      getISOStringDate(filter?.createdDate?.greaterEqual) || undefined;
    const createdDateTo =
      getISOStringDate(filter?.createdDate?.lessEqual) || undefined;
    const amountRangeFrom = Number(filter?.contractFrom?.equal);
    const amountRangeTo = Number(filter?.contractTo?.equal);

    const requestBody = {
      tab: filter?.tab ? Number(filter?.tab) : numberConstants.ZERO,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,

      statuses: this.getListIds(filter?.statusesId),
      code: filter?.code,
      name: filter?.name,
      appendixNo: filter?.appendixNo?.trim() || undefined,
      contractCode: filter?.contractCode,
      contractNo: filter?.contractNo,
      contractName: filter?.contractName,
      contractTypeIds: filter?.contractTypeValue?.map(
        (item: CommonFilter) => item?.id
      ),
      costItemIds: filter?.costItemValue?.map((item: CommonFilter) => item?.id),
      supplierIds: filter?.suppliersValue?.map((item: CommonFilter) => item.id),
      amountRange: {
        from: isNumber(amountRangeFrom) ? amountRangeFrom : undefined,
        to: isNumber(amountRangeTo) ? amountRangeTo : undefined,
      },
      goodsIds: filter?.goodsValue?.map((item: CommonFilter) => item?.id),
      createdUserIds: filter?.createdUsersValue?.map(
        (item: CommonFilter) => item?.id
      ),
      createdOrganizationIds: filter?.createdOrganizationsValue?.map(
        (item: CommonFilter) => item?.id
      ),
      managers: filter?.managersValue?.map((item: CommonFilter) => item?.email),
      organizationIds: filter?.organizationsValue?.map(
        (item: CommonFilter) => item?.id
      ),
      effectiveDate:
        isUndefined(effectiveDateFrom) && isUndefined(effectiveDateTo)
          ? undefined
          : {
              from: effectiveDateFrom,
              to: effectiveDateTo,
            },
      endDate:
        isUndefined(endDateFrom) && isUndefined(endDateTo)
          ? undefined
          : {
              from: endDateFrom,
              to: endDateTo,
            },
      createdDate:
        isUndefined(createdDateFrom) && isUndefined(createdDateTo)
          ? undefined
          : {
              from: createdDateFrom,
              to: createdDateTo,
            },
    };

    return this.http.post(API_CONTRACT_ANNEX_GET_ALL, requestBody);
  };

  // Delete
  public deleteContractAnnex = (
    id: string,
    reason?: string
  ): Observable<string> => {
    return this.http
      .delete(`${API_CONTRACT_ANNEX}/${id}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  // Cancel
  public cancelContractAnnex = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put(
        `${API_CONTRACT_ANNEX}/${id}/${API_CANCEL_CONTRACT_ANNEX}?reason=${reason}`
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  public reject = (id: string, reason: string): Observable<string> => {
    return this.http
      .put(
        `${API_CONTRACT_ANNEX}/${id}/${nameof(this.reject)}?reason=${reason}`
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  public return = (id: string, reason: string): Observable<string> => {
    return this.http
      .put(
        `${API_CONTRACT_ANNEX}/${id}/${nameof(this.return)}?reason=${reason}`
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  // get contractAppendix by contractId

  public getGeneralByContractInformation = (
    contractId: string
  ): Observable<ContractAnnex> => {
    return this.http
      .get(`${GENERAL_CONTRACT_INFORMATION_API}/${contractId}`)
      .pipe(Repository.responseDataMapper<ContractAnnex>());
  };

  // gte detail by id
  public getContractAnnexDetail = (
    id: string,
    isView?: boolean,
    isPrinciple = false
  ): Observable<ContractAnnex> => {
    const endpoint = isPrinciple
      ? GENERAL_CONTRACT_PRINCIPLE_ANNEX_DETAIL_API
      : GENERAL_CONTRACT_ANNEX_DETAIL_API;
    return this.http
      .get(`${endpoint}/${id}`, { params: { isView } })
      .pipe(Repository.responseDataMapper<ContractAnnex>());
  };

  // get manager organization list
  public getManagerOrganizationList = (
    filter?: ModelFilter
  ): Observable<Model[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim() || filter?.search?.trim(),
      isIncludeRelation: false,
    };

    return this.http
      .post(API_CONTRACT_APPENDIX_GET_MANAGER_DEPARTMENT_UNIT, requestBody)
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  // get manager person list
  public getManagerPersonList = ({
    name,
    organizationId,
  }: ModelFilter): Observable<Model[]> => {
    const search = name?.trim();
    const params = { isActive: true, search, organizationId };

    return this.http
      .get(API_CONTRACT_APPENDIX_GET_MANAGER_PERSON, { params })
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  // get supplier payment
  public getSupplierPayment = (filter?: ModelFilter): Observable<Model[]> => {
    const requestBody = {
      supplierIds: [filter?.id],
    };
    return this.http
      .post(API_CONTRACT_APPENDIX_GET_SUPPLIER_PAYMENT, requestBody)
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  // Create
  public create = (model: Model): Observable<string> => {
    const endPoint = model?.isPrinciple
      ? API_CONTRACT_PRINCIPLE_ANNEX
      : API_CONTRACT_ANNEX;
    return this.http
      .post(endPoint, model)
      .pipe(Repository.responseDataMapper<string>());
  };

  // edit
  public edit = (model: Model): Observable<string> => {
    const endPoint = model?.isPrinciple
      ? API_CONTRACT_PRINCIPLE_ANNEX
      : API_CONTRACT_ANNEX;
    return this.http
      .put(`${endPoint}/${model?.id}`, model)
      .pipe(Repository.responseDataMapper<string>());
  };

  public approve = (id: string): Observable<boolean> => {
    return this.http
      .put(`${API_CONTRACT_ANNEX}/${id}/approval`)
      .pipe(Repository.responseDataMapper<boolean>());
  };

  public getIncludeSegment = (filter: ModelFilter): Observable<Model[]> => {
    return this.http
      .post(API_CONTRACT_GET_INCLUDE_SEGMENT, {
        isActive: filter?.isActive,
        search: filter?.name?.trim(),
        pageSize: 30,
        pageIndex: 1,
      })
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getListUser = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim() || filter?.search?.trim(),
      organizationId: filter?.organizationId,
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
            phoneNumber: item?.phoneNumber,
          }));
        })
      );
  };
  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_CONTRACT_ANNEX + "/actions", data)
      .pipe(Repository.responseMapToModel<WorkflowAction>(WorkflowAction));
  };

  // Api for Signing Form
  public getSigningInfo = (id: number | string): Observable<SigningInfo> => {
    return this.http
      .post<SigningInfo>(kebabCase(nameof(this.getSigningInfo)), { id })
      .pipe(map((response: AxiosResponse<SigningInfo>) => response.data));
  };

  public digitalSign = (signatureInfo: SignatureInfo): Observable<Contract> => {
    return this.http
      .post<Contract>(kebabCase(nameof(this.digitalSign)), signatureInfo)
      .pipe(map((response: AxiosResponse<Contract>) => response.data));
  };

  public listSignature = (
    filter: WorkflowStateFilter
  ): Observable<WorkflowState[]> => {
    return this.http
      .post<WorkflowState[]>(`${API_CONTRACT_ANNEX}/template/listSignature`, {
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
        `${API_CONTRACT_ANNEX}/template/form/${requestId}`,
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
        `${API_CONTRACT_ANNEX}/template/form/${requestId}`
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
      `${API_CONTRACT_ANNEX}/template/previewFormConfiguration`,
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
    item: Contract
  ): Observable<AxiosResponse<any>> => {
    return this.http.post(
      `${API_CONTRACT_ANNEX}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_CONTRACT_ANNEX}/template/listTemplate`,
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
      `${API_CONTRACT_ANNEX}/template/previewDynamicTemplate/${param?.queryParams}`,
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

export const contractAnnexRepository = new ContractAnnexRepository();
