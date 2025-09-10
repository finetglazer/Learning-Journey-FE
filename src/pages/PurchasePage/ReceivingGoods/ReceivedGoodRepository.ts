/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_30,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { isEqual, isUndefined, kebabCase } from "lodash";
import CommonFilter from "models/CommonFilter";
import { GoodsReceiptFilter } from "models/GoodsReceipt/GoodsReceiptFilter";
import { Proposal } from "models/Proposal";
import {
  ListApprovedSupplier,
  ListApprovedSupplierModel,
  ListPurchaseRequest,
  ListPurchaseRequestModel,
} from "models/PurchasingPlan";
import {
  OrganizationModel,
  ReceivedWaitingModel,
  ReceivingGoodFilter,
  ReceivingGoodModel,
  ReceivingWaitingFilter,
} from "models/ReceivingGood";
import {
  GoodsReceipt,
  GoodsReceiptRequestItem,
} from "models/ReceivingGood/GoodsReceipt";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { WorkflowAction } from "models/WorkflowAction";
import { SignatureInfo, SigningInfo } from "models/SignatureInfo";
import nameof from "ts-nameof.macro";
import type { AxiosResponse } from "axios";
import { Contract } from "models/Contract";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { FileTemplate } from "models/FileTemplate";
import { FileTemplateParams } from "pages/SignProcess/SignReportUpload/FileTemplate/FileTemplate";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import ConfigStore from "core/config/ConfigStore";

export const API_RECEIVED_GOODS_PREFIX = "/purchasing/receipt";
export const API_RECEIVED_GOODS_GET_ALL_PREFIX = "/purchasing/receipt/getAll";
export const API_RECEIVED_WAITING_PREFIX =
  "/purchasing/contract/awaitingReceipt";
export const API_ORGANIZATION_PREFIX = "/master/organization/getAll";
export const API_AUTH_USER_PREFIX = "/auth/user";
export const API_BUSINESS_DEPARTMENT_PREFIX = "/master/businessDepartment";
export const API_PROPOSAL_PREFIX = "/purchasing/proposal/getAll";
export const API_PROPOSAL_APPROVED_PREFIX = "/purchasing/request/getAll";
export const API_GET_REQUEST_PURCHASING = "/purchasing/request/originPurchase";
export const API_GET_CONTACT_DETAIL = API_RECEIVED_GOODS_PREFIX + "/byContract";
const API_CANCEL_RECEIVED_GOOD = "cancel";
const API_APPROVAL_RECEIVED_GOOD = "approval";
const API_REJECT_RECEIVED_GOOD = "reject";
const API_RETURN_RECEIVED_GOOD = "return";
const API_GET_SUPPLIER_DROPDOWN = "/master/supplier/getDropdown";
const API_UPLOAD_SINGLE_FILE = "share/file/upload";
const API_DOWNLOAD_FILE = "share/file/download";
const API_INTERGRATION_ASSET = "/purchasing/intergrationAsset/goodsReceipt";
const API_LIST_DROPDOWN_PROPOSAL = "/purchasing/proposal/originPurchase";
const API_LIST_DROPDOWN_PROPOSAL_APPROVED =
  "/purchasing/request/originPurchase";

export class ReceivedGoodsRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };
  // Get all
  public getAll = (
    filter?: ReceivingGoodFilter
  ): Observable<ListResult<ReceivingGoodModel>> => {
    const requestBody = {
      contactTab: filter?.tabKey
        ? Number(filter?.tabKey)
        : numberConstants.ZERO,
      tab: filter?.tab ? Number(filter?.tab) : numberConstants.ZERO,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,

      receiptCode: filter?.receiptCode,
      contractCode: filter?.contractCode,
      contractNo: filter?.contractNo,
      contractName: filter?.contractName,
      supplierIds: filter?.suppliersId,
      goodsIds: filter?.goodsServicesId,
      statuses: this.getListIds(filter?.statusesId),
      receiptDateRange: {
        from: getISOStringDate(filter?.receiptDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.receiptDate?.lessEqual) || undefined,
      },
      contractValue: {
        from: filter?.totalAmountFrom?.equal || undefined,
        to: filter?.totalAmountTo?.equal || undefined,
      },
      recipientUnitIds: filter?.recipientUnitId,
      receiptPersonIds: filter?.receiptPersonId,
      createDateRange: {
        from: getISOStringDate(filter?.createDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.createDate?.lessEqual) || undefined,
      },
    };
    return this.http.post(API_RECEIVED_GOODS_GET_ALL_PREFIX, requestBody);
  };

  // Get all received waiting
  public getAllReceivedWaiting = (
    filter?: ReceivingWaitingFilter
  ): Observable<ListResult<ReceivedWaitingModel>> => {
    const requestBody = {
      contactTab: filter?.tabKey
        ? Number(filter?.tabKey)
        : numberConstants.ZERO,
      tab: filter?.tab ? Number(filter?.tab) : numberConstants.ZERO,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,

      receiptCode: filter?.receiptCode,
      code: filter?.code,
      name: filter?.name,
      contractNo: filter?.contractNo,
      contractName: filter?.contractName,
      supplierIds: filter?.suppliersId,
      goodsIds: filter?.goodsServicesId,
      createdUserIds: filter?.createdUserId,
      organizationIds: filter?.organizationIdsId,
      purchaseProposalIds: filter?.purchaseProposalId,
      purchaseRequestIds: filter?.purchaseRequestId,
      managerIds: filter?.managerId,
      createDateRange: {
        from: getISOStringDate(filter?.createDate?.greaterEqual) || undefined,
        to: getISOStringDate(filter?.createDate?.lessEqual) || undefined,
      },
      contractValueFrom: Number(filter?.contractFrom?.equal) || undefined,
      contractValueTo: Number(filter?.contractTo?.equal) || undefined,
      effectiveDateFrom:
        getISOStringDate(filter?.effectiveDate?.greaterEqual) || undefined,
      effectiveDateTo:
        getISOStringDate(filter?.effectiveDate?.lessEqual) || undefined,
      createdDateFrom:
        getISOStringDate(filter?.createdDate?.greaterEqual) || undefined,
      createdDateTo:
        getISOStringDate(filter?.createdDate?.lessEqual) || undefined,
    };
    return this.http.post(API_RECEIVED_WAITING_PREFIX, requestBody);
  };

  // Get all organization
  public getListOrganization = (
    filter: ModelFilter
  ): Observable<OrganizationModel[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .post(API_ORGANIZATION_PREFIX, requestBody)
      .pipe(map((response) => response?.data?.items));
  };

  // Get all user
  public getListUser = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.trim(),
      pageSize: DEFAULT_PAGE_SIZE,
      isActive: true,
      organizationId: filter?.organizationId,
    };

    return this.http
      .get(API_AUTH_USER_PREFIX, {
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

  // Get all proposal
  public getListProposal = (filter: ModelFilter): Observable<Proposal[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
      status: [numberConstants.TWO],
      pageSize: DEFAULT_PAGE_SIZE_30,
    };

    return this.http
      .post(API_PROPOSAL_PREFIX, requestBody)
      .pipe(map((response) => response?.data?.items));
  };

  // Get all Proposal Approved
  public getListProposalApproved = (
    filter: ModelFilter
  ): Observable<Proposal[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
      status: [numberConstants.ONE],
    };

    return this.http
      .post(API_PROPOSAL_APPROVED_PREFIX, requestBody)
      .pipe(map((response) => response?.data?.items));
  };

  // Get all request purchasing
  public getRequestPurchasing = (
    filter: ListPurchaseRequestModel
  ): Observable<ListPurchaseRequest[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.get(API_GET_REQUEST_PURCHASING, { params }).pipe(
      map((response) => {
        return response?.data?.map((item: ListPurchaseRequest) => ({
          id: item?.id,
          name: item?.name,
          code: item?.code,
        }));
      })
    );
  };

  public getGoodServicesList = (
    filter: GoodsReceiptFilter
  ): Observable<ListResult<GoodsReceiptRequestItem>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim(),
      description: filter?.description?.trim(),
      contractId: filter?.contractId,
      isFullyReceived: filter?.isFullyReceived,
      categoryIds: filter?.categoryId,
      orderType: filter?.orderType,
      orderBy: filter?.orderBy,
    };

    return this.http
      .post(`${API_RECEIVED_GOODS_PREFIX}/goodServices`, requestBody)
      .pipe(
        map((response) => ({
          data: response?.data,
        }))
      );
  };

  // Delete received good
  public deleteReceivedGood = (
    id: string,
    reason?: string
  ): Observable<string> => {
    return this.http
      .delete(`${API_RECEIVED_GOODS_PREFIX}/${id}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  // Cancel received good
  public cancelReceivedGood = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put(
        `${API_RECEIVED_GOODS_PREFIX}/${id}/${API_CANCEL_RECEIVED_GOOD}?reason=${reason}`
      )
      .pipe(Repository.responseDataMapper<string>());
  };

  //  Approval received good
  public approval = (id: string): Observable<boolean> => {
    return this.http
      .put(`${API_RECEIVED_GOODS_PREFIX}/${id}/${API_APPROVAL_RECEIVED_GOOD}`)
      .pipe(Repository.responseDataMapper<boolean>());
  };

  //  Reject received good
  public reject = (id: string, reason?: string): Observable<boolean> => {
    return this.http
      .put(
        `${API_RECEIVED_GOODS_PREFIX}/${id}/${API_REJECT_RECEIVED_GOOD}?reason=${
          reason || ""
        }`
      )
      .pipe(Repository.responseDataMapper<boolean>());
  };

  //  Return received good
  public returnReceivedGood = (
    id: string,
    reason: string
  ): Observable<boolean> => {
    return this.http
      .put(
        `${API_RECEIVED_GOODS_PREFIX}/${id}/${API_RETURN_RECEIVED_GOOD}?reason=${
          reason || ""
        }`
      )
      .pipe(Repository.responseDataMapper<boolean>());
  };

  public getDetail = (id: string, isView = false): Observable<GoodsReceipt> => {
    const params = {
      isView,
    };
    return this.http.get(`${API_RECEIVED_GOODS_PREFIX}/${id}`, { params }).pipe(
      map((response) => {
        return response?.data;
      })
    );
  };

  public getContactDetailBy = (id: string): Observable<GoodsReceipt> => {
    return this.http.get(`${API_GET_CONTACT_DETAIL}/${id}`).pipe(
      map((response) => {
        return response?.data;
      })
    );
  };

  public sendApproval = (
    data: GoodsReceipt,
    isDraft: boolean
  ): Observable<any> => {
    const exchangeRateBody = isEqual(data?.currency, VND_CURRENCY_UNIT)
      ? numberConstants.ONE
      : data?.exchangeRate;

    const supplierEvaluation: any = data?.supplierEvaluation;

    const requestBody = {
      isDraft,
      contractId: data?.contractId || undefined,
      deliveryPersonName: data?.deliveryPersonName || undefined,
      deliveryPersonPhone:
        data?.deliveryPersonPhoneValue ||
        data?.deliveryPersonPhone ||
        undefined,
      deliveryPersonPosition: data?.deliveryPersonPosition || undefined,
      receiptPersonPhone: data?.receiptPersonPhone || undefined,
      receiptDate: data?.receiptDate
        ? dayjs(data?.receiptDate).toDate().toISOString()
        : undefined,
      receiptPersonPosition: data?.receiptPersonPosition || undefined,
      exchangeRate: exchangeRateBody || undefined,
      attachments: data?.attachments || undefined,
      goodsReceiptRequestItems: data?.goodsReceiptRequestItems?.map(
        (goodsReceiptRequestItem) => ({
          quantity: goodsReceiptRequestItem?.quantity,
          serialNumber: goodsReceiptRequestItem?.serialNumber,
          note: goodsReceiptRequestItem?.note,
          contractGoodsItemId: goodsReceiptRequestItem?.contractGoodsItemId,
        })
      ),
      supplierEvaluation: {
        supplierId: supplierEvaluation?.supplierId,
        supplierEvaluationConfigId:
          supplierEvaluation?.supplierEvaluationConfigId,

        evaluationDetails:
          supplierEvaluation?.evaluationDetails?.map(
            (evaluationDetail: any) => ({
              evaluationItemId: evaluationDetail?.evaluationItemId,
              score: evaluationDetail?.score ?? undefined,
              note: evaluationDetail?.note?.trim(),
            })
          ) || [],
      },
      documentGroups: data?.documentGroups?.map((documentGroup) => ({
        description: documentGroup?.description,
        attachments: documentGroup?.attachments?.map((attachment) => ({
          name: attachment?.name,
          contentType: attachment?.contentType,
          size: attachment?.size,
          path: attachment?.path,
          systemFileId: attachment?.systemFileId,
        })),
      })),
      isHardValidate: data?.isHardValidate,
    };

    return this.http
      .post(API_RECEIVED_GOODS_PREFIX, requestBody)
      .pipe(Repository.responseDataMapper<any>());
  };

  public sendApprovalEdited = (
    data: GoodsReceipt,
    isDraft: boolean
  ): Observable<boolean> => {
    const exchangeRateBody = isEqual(data?.currency, VND_CURRENCY_UNIT)
      ? numberConstants.ONE
      : data?.exchangeRate;
    const supplierEvaluation: any = data?.supplierEvaluation;

    const requestBody = {
      isDraft,
      contractId: data?.contractId || undefined,
      deliveryPersonName: data?.deliveryPersonName || undefined,
      deliveryPersonPhone:
        data?.deliveryPersonPhoneValue ||
        data?.deliveryPersonPhone ||
        undefined,
      deliveryPersonPosition: data?.deliveryPersonPosition || undefined,
      receiptPersonPhone: data?.receiptPersonPhone || undefined,
      receiptDate: dayjs(data?.receiptDate).toDate().toISOString() || undefined,
      receiptPersonPosition: data?.receiptPersonPosition || undefined,
      exchangeRate: exchangeRateBody || undefined,
      attachments: data?.attachments || undefined,
      goodsReceiptRequestItems: data?.goodsReceiptRequestItems?.map(
        (goodsReceiptRequestItem) => ({
          quantity: goodsReceiptRequestItem?.quantity,
          serialNumber: goodsReceiptRequestItem?.serialNumber,
          note: goodsReceiptRequestItem?.note,
          contractGoodsItemId: goodsReceiptRequestItem?.contractGoodsItemId,
        })
      ),

      supplierEvaluation: {
        supplierId: supplierEvaluation?.supplierId,
        supplierEvaluationConfigId:
          supplierEvaluation?.supplierEvaluationConfigId,

        evaluationDetails:
          supplierEvaluation?.evaluationDetails?.map(
            (evaluationDetail: any) => ({
              evaluationItemId: evaluationDetail?.evaluationItemId,
              score: evaluationDetail?.score ?? undefined,
              note: evaluationDetail?.note?.trim(),
            })
          ) || [],
      },
      documentGroups: data?.documentGroups?.map((documentGroup) => ({
        description: documentGroup?.description,
        attachments: documentGroup?.attachments?.map((attachment) => ({
          name: attachment?.name,
          contentType: attachment?.contentType,
          size: attachment?.size,
          path: attachment?.path,
          systemFileId: attachment?.systemFileId,
        })),
      })),
      isHardValidate: data?.isHardValidate,
    };

    return this.http
      .put(`${API_RECEIVED_GOODS_PREFIX}/${data?.id}`, requestBody)
      .pipe(Repository.responseDataMapper<boolean>());
  };

  public getDropdownSupplier = (
    filter: ListApprovedSupplierModel
  ): Observable<ListApprovedSupplier[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.get(API_GET_SUPPLIER_DROPDOWN, { params }).pipe(
      map((response) => {
        return response?.data;
      })
    );
  };
  public actions = (data: WorkflowAction): Observable<WorkflowAction> => {
    return this.http
      .post<WorkflowAction>(API_RECEIVED_GOODS_PREFIX + "/actions", data)
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
      .post<WorkflowState[]>(
        `${API_RECEIVED_GOODS_PREFIX}/template/listSignature`,
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
        `${API_RECEIVED_GOODS_PREFIX}/template/form/${requestId}`,
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
        `${API_RECEIVED_GOODS_PREFIX}/template/form/${requestId}`
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
      `${API_RECEIVED_GOODS_PREFIX}/template/previewFormConfiguration`,
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
      `${API_RECEIVED_GOODS_PREFIX}/template/previewSignedForm`,
      item,
      {
        responseType: "arraybuffer",
      }
    );
  };

  public dynamicTemplateList = (id: string): Observable<FileTemplate[]> => {
    return this.http
      .post<FileTemplate[]>(
        `${API_RECEIVED_GOODS_PREFIX}/template/listTemplate`,
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
      `${API_RECEIVED_GOODS_PREFIX}/template/previewDynamicTemplate/${param?.queryParams}`,
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

  public intergrationGoodsReceipt = (
    id: string
  ): Observable<AxiosResponse<any>> => {
    return this.http.post<AxiosResponse<any>>(
      `${API_INTERGRATION_ASSET}/${id}`
    );
  };

  public getListDropdownProposal = (
    filter: ModelFilter
  ): Observable<Proposal[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      status: numberConstants.TWO,
    };

    return this.http.get(API_LIST_DROPDOWN_PROPOSAL, { params }).pipe(
      map((response) => {
        return response?.data;
      })
    );
  };

  public getListDropdownProposalApproved = (
    filter: ModelFilter
  ): Observable<Proposal[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      statuses: [1, 2, 3],
    };

    return this.http.post(API_LIST_DROPDOWN_PROPOSAL_APPROVED, params).pipe(
      map((response) => {
        return response?.data;
      })
    );
  };
}

export const receivedGoodsRepository = new ReceivedGoodsRepository();
