import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { PromotionFilter } from "models/Promotion";
import { CostItems } from "models/Report/CostItems";
import { CostItemsFilter } from "models/Report/CostItemsFilter";
import { GoodsReceiptTrackingFilter } from "models/Report/GoodsReceiptTrackingFilter";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { getISOStringDate } from "core/helpers/date-time";
import {
  ListApprovedSupplier,
  ListApprovedSupplierModel,
} from "models/PurchasingPlan";
import { PurchasePlanFilter } from "models/Report/PurchasePlanFilter";

const API_GET_LIST_COST_ITEMS = "/report/payment/costGroup/getAll";
const API_GET_LIST_PROMOTION = "/report/payment/promotion/getAll";
const API_GET_LIST_PURCHASE_PLAN_SUMMARY =
  "/report/purchasing/purchasePlan/summary";
const API_GET_LIST_GOODS_RECEIPT_TRACKING =
  "/purchasing/report/goodsReceiptTracking";
const API_GET_PROPOSAL_SUMMARY = "/purchasing/report/proposalSummary";
const API_GET_PROPOSAL_EXCEL =
  "/report/purchasing/report/ProposalSummary/export";
const API_GET_LIST_DETAILED_SUPPLIER_PAYABLES =
  "/purchasing/report/detailedSupplierPayables";
const API_GET_COST_ITEMS_EXCEL = "/report/payment/costGroup/exportReport";
const API_GET_PROMOTION_EXCEL = "/report/payment/promotion/export";
const API_GET_PURCHASE_PLAN_SUMMARY_EXCEL =
  "/report/purchasing/purchasePlan/summary/export";
const API_GET_DETAILED_SUPPLIER_PAYABLES_EXCEL =
  "/report/purchasing/report/detailedSupplierPayables/export";
const API_GET_DETAIL_PURCHASE_PLAN = "/purchasing/report/purchasePlan/detail";
const API_GET_DETAIL_PURCHASE_PLAN_EXCEL =
  "/report/purchasing/purchasePlan/detail/export";
const API_GET_GOODS_RECEIPT_TRACKING_EXCEL =
  "/report/purchasing/report/goodsReceiptTracking/export";
const API_GET_PURCHASE_DROPDOWN = "/purchasing/plan/dropdown";
const API_GET_SUPPLIER_GOODS_ITEMS_DETAIL =
  "/purchasing/report/supplier/goodsItems";
const API_GET_PURCHASE_REQUIREMENT_SUMMARY =
  "purchasing/report/purchaseRequestSummary";
const API_GET_SUPPLIER_GOODS_ITEMS_DETAIL_EXPORT =
  "/report/purchasing/report/supplier/goodsItems/export";
const API_GET_PURCHASE_REQUIREMENT_SUMMARY_EXCEL =
  "/report/purchasing/report/purchaseRequestSummary/export";
const API_GET_SUPPLIER_DROPDOWN = "/master/supplier/getDropdown";
const API_GET_INVESTMENT_PROJECT_PORTFOLIO =
  "/purchasing/report/budget/investment-project-categories";
const API_GET_INVESTMENT_PROJECT_PORTFOLIO_EXCEL =
  "/report/budget/investment-project-categories/export";
const API_GET_REPORTS_BY_TYPE = "/report/topic/sla/getModelByTopicType";
const API_GET_ALL_SLA_REPORTS = "/report/topic/sla/getAll";

export class ReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public costItemsList = (
    filter: CostItemsFilter
  ): Observable<ListResult<CostItems>> => {
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
      businessUnitId: filter?.businessUnitIdId,
      businessDepartmentId: filter?.businessDepartmentIdId,
      businessBranchId: filter?.businessBranchIdId,
      costGroupIds: filter?.costGroupIdsId,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
    };
    return this.http.post(API_GET_LIST_COST_ITEMS, body);
  };

  public promotionList = (
    filter: PromotionFilter
  ): Observable<ListResult<CostItems>> => {
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
      businessUnitId: filter?.businessUnitIdId,
      businessDepartmentId: filter?.businessDepartmentIdId,
      businessBranchId: filter?.businessBranchIdId,
      promotionId: filter?.costGroupIdsId,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
    };
    return this.http.post(API_GET_LIST_PROMOTION, body);
  };

  public getCostItemsFile = (
    filter: CostItemsFilter
  ): Observable<ListResult<ArrayBuffer>> => {
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
      businessUnitId: filter?.businessUnitIdId,
      businessDepartmentId: filter?.businessDepartmentIdId,
      businessBranchId: filter?.businessBranchIdId,
      costGroupIds: filter?.costGroupIdsId,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      regionId: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return this.http.post(API_GET_COST_ITEMS_EXCEL, body, {
      headers: { Accept: "text/plain" },
      responseType: "arraybuffer" as "json",
    });
  };

  public getPromotionFile = (
    filter: PromotionFilter
  ): Observable<ListResult<Model>> => {
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
      businessUnitId: filter?.businessUnitIdId,
      businessDepartmentId: filter?.businessDepartmentIdId,
      businessBranchId: filter?.businessBranchIdId,
      promotionId: filter?.costGroupIdsId,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      regionId: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return this.http.post(API_GET_PROMOTION_EXCEL, body, {
      headers: { Accept: "text/plain" },
      responseType: "arraybuffer" as "json",
    });
  };

  public getPurchasePlanSummary = (
    filter: PurchasePlanFilter
  ): Observable<ListResult<Model>> => {
    const fromDate = filter?.createDateRange?.from
      ? dayjs(filter?.createDateRange?.from)?.toDate()?.toISOString()
      : undefined;

    const toDate = filter?.createDateRange?.to
      ? dayjs(filter?.createDateRange?.to)?.toDate()?.toISOString()
      : undefined;
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      classifications: filter?.purchasePlanTypesId?.map(Number),
      costGroupIds: filter?.costGroupIdsId,
      organizationIds: filter?.organizationIdId,
      businessBranchIds: filter?.businessBranchIdId,
      supplierIds: filter?.suppliersId,
      statuses: filter?.statusId?.map(Number),
    };

    return this.http.post(API_GET_LIST_PURCHASE_PLAN_SUMMARY, body);
  };

  public getPurchasePlanSummaryFile = (
    filter: PromotionFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const fromDate = filter?.createdDateRange?.from
      ? dayjs(filter?.createdDateRange?.from)?.toDate()?.toISOString()
      : undefined;

    const toDate = filter?.createdDateRange?.to
      ? dayjs(filter?.createdDateRange?.to)?.toDate()?.toISOString()
      : undefined;
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      classifications: filter?.purchasePlanTypesId?.map(Number),
      costGroupIds: filter?.costGroupIdsId,
      organizationIds: filter?.organizationIdId,
      businessBranchIds: filter?.businessBranchIdId,
      supplierIds: filter?.suppliersId,
      statuses: filter?.statusId?.map(Number),
      regionId: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return this.http.post(API_GET_PURCHASE_PLAN_SUMMARY_EXCEL, body, {
      headers: { Accept: "text/plain" },
      responseType: "arraybuffer" as "json",
    });
  };

  public getGoodsReceiptTracking = (
    filter: GoodsReceiptTrackingFilter
  ): Observable<ListResult<Model>> => {
    const fromDate = filter?.createdDateRange?.from
      ? dayjs(filter?.createdDateRange?.from)?.toDate()?.toISOString()
      : undefined;

    const toDate = filter?.createdDateRange?.to
      ? dayjs(filter?.createdDateRange?.to)?.toDate()?.toISOString()
      : undefined;

    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      supplierIds: [filter?.supplierValue.id],
      contractIds:
        (filter?.contractIdValue ?? []).map((contract) => contract.id) ?? [],
    };
    return this.http.post(API_GET_LIST_GOODS_RECEIPT_TRACKING, body);
  };

  public getGoodsReceiptTrackingFile = (
    filter: GoodsReceiptTrackingFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const fromDate = filter?.createdDateRange?.from
      ? dayjs(filter?.createdDateRange?.from)?.toDate()?.toISOString()
      : undefined;

    const toDate = filter?.createdDateRange?.to
      ? dayjs(filter?.createdDateRange?.to)?.toDate()?.toISOString()
      : undefined;

    const body = {
      supplierIds: [filter?.supplierValue.id],
      contractIds:
        (filter?.contractIdValue ?? []).map((contract) => contract.id) ?? [],
      createdDateRange: {
        from: fromDate,
        to: toDate,
      },
      regionId: "Asia/Saigon",
    };
    return this.http.post(API_GET_GOODS_RECEIPT_TRACKING_EXCEL, body, {
      responseType: "arraybuffer" as "json",
    });
  };
  public getDetailedSupplierPayables = (
    filter: ModelFilter
  ): Observable<ListResult<Model>> => {
    const effectiveDateFrom =
      getISOStringDate(filter?.effectiveDateRange?.from) || undefined;
    const effectiveDateTo =
      getISOStringDate(filter?.effectiveDateRange?.to) || undefined;

    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      effectiveDateFrom,
      effectiveDateTo,
      contractIds: filter?.contractIdsValue
        ? filter?.contractIdsValue?.map((contract: any) => contract.id)
        : undefined,
      supplierId: filter?.supplierIdValue?.id,
      businessBranchId: filter?.businessBranchIdValue?.id,
      projectId: filter?.projectIdValue?.id,
    };
    return this.http.post(API_GET_LIST_DETAILED_SUPPLIER_PAYABLES, body);
  };
  public getDetailedSupplierPayablesFile = (
    filter: ModelFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const effectiveDateFrom =
      getISOStringDate(filter?.effectiveDateRange?.from) || undefined;
    const effectiveDateTo =
      getISOStringDate(filter?.effectiveDateRange?.to) || undefined;

    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      effectiveDateFrom,
      effectiveDateTo,
      contractIds: filter?.contractIdsValue
        ? filter?.contractIdsValue?.map((contract: any) => contract.id)
        : undefined,
      supplierId: filter?.supplierIdValue?.id,
      businessBranchId: filter?.businessBranchIdValue?.id,
      projectId: filter?.projectIdValue?.id,
    };
    return this.http.post(API_GET_DETAILED_SUPPLIER_PAYABLES_EXCEL, body, {
      responseType: "arraybuffer" as "json",
    });
  };
  public getPurchaseDropdown = (
    filter: ModelFilter
  ): Observable<ListResult<ModelFilter[]>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.name?.contain?.trim(),
    };
    return this.http
      .post(API_GET_PURCHASE_DROPDOWN, body)
      .pipe(map((res) => res?.data?.items));
  };
  public getPurchasePlanDetail = (
    filter: PurchasePlanFilter
  ): Observable<Model> => {
    const body = {
      purchasePlanId: filter?.purchasePlanIdValue.id,
      supplierIds: filter?.supplierIdsId,
    };

    return this.http
      .post(API_GET_DETAIL_PURCHASE_PLAN, body)
      .pipe(map((res) => res?.data as Model));
  };

  public getPurchasePlanDetailFile = (
    filter: PromotionFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const body = {
      purchasePlanId: filter?.purchasePlanIdId,
      supplierIds: filter?.supplierIdsId,
    };
    return this.http.post(API_GET_DETAIL_PURCHASE_PLAN_EXCEL, body, {
      responseType: "arraybuffer" as "json",
    });
  };
  public getSupplierGoodsItemsDetail = (
    filter: ModelFilter
  ): Observable<Model> => {
    const effectiveDateFrom =
      getISOStringDate(filter?.effectiveDateRange?.from) || undefined;
    const effectiveDateTo =
      getISOStringDate(filter?.effectiveDateRange?.to) || undefined;
    const body = {
      supplierId: filter?.supplierId,
      effectiveDateFrom,
      effectiveDateTo,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
    };
    return this.http
      .post(API_GET_SUPPLIER_GOODS_ITEMS_DETAIL, body)
      .pipe(map((res) => res?.data as Model));
  };
  public getProposalSummaryList = (
    filter: ModelFilter
  ): Observable<ListResult<Model>> => {
    const createdDateFrom =
      getISOStringDate(filter?.createdDate?.from) || undefined;
    const createdDateTo =
      getISOStringDate(filter?.createdDate?.to) || undefined;
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      createdDateRange: {
        from: createdDateFrom,
        to: createdDateTo,
      },
      costTypeIds: filter?.costTypeIdsValue
        ? filter?.costTypeIdsValue.map((costType: any) => costType.id)
        : undefined,
      costGroupIds: filter?.costGroupIdsValue
        ? filter.costGroupIdsValue.map((costGroup: any) => costGroup.id)
        : undefined,
      businessBranchIds: filter?.businessBranchIdsValue
        ? filter.businessBranchIdsValue.map(
            (businessBranch: any) => businessBranch.id
          )
        : undefined,
      statuses: filter?.statusesValue,
    };
    return this.http.post(API_GET_PROPOSAL_SUMMARY, body);
  };
  public getProposalSummaryFile = (
    filter: ModelFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const createdDateFrom =
      getISOStringDate(filter?.createdDate?.from) || undefined;
    const createdDateTo =
      getISOStringDate(filter?.createdDate?.to) || undefined;
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      createdDateRange: {
        from: createdDateFrom,
        to: createdDateTo,
      },
      costTypeIds: filter?.costTypeIdsValue
        ? filter?.costTypeIdsValue.map((costType: any) => costType.id)
        : undefined,
      costGroupIds: filter?.costGroupIdsValue
        ? filter.costGroupIdsValue.map((costGroup: any) => costGroup.id)
        : undefined,
      businessBranchIds: filter?.businessBranchIdsValue
        ? filter.businessBranchIdsValue.map(
            (businessBranch: any) => businessBranch.id
          )
        : undefined,
      statuses: filter?.statusesValue,
    };
    return this.http.post(API_GET_PROPOSAL_EXCEL, body, {
      responseType: "arraybuffer" as "json",
    });
  };
  public getSupplierGoodsItemsDetailFile = (
    filter: ModelFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const effectiveDateFrom = filter?.effectiveDateRange?.from
      ? dayjs(filter?.effectiveDateRange?.from)?.toDate()?.toISOString()
      : undefined;

    const effectiveDateTo = filter?.effectiveDateRange?.to
      ? dayjs(filter?.effectiveDateRange?.to)?.toDate()?.toISOString()
      : undefined;
    const body = {
      supplierId: filter?.supplierId,
      effectiveDateFrom,
      effectiveDateTo,
    };
    return this.http.post(API_GET_SUPPLIER_GOODS_ITEMS_DETAIL_EXPORT, body, {
      headers: { Accept: "text/plain" },
      responseType: "arraybuffer" as "json",
    });
  };
  public getDropdownSupplier = (
    filter: ListApprovedSupplierModel
  ): Observable<ListApprovedSupplier[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.get(API_GET_SUPPLIER_DROPDOWN, { params }).pipe(
      map((response) => {
        return response?.data?.map((item: ListApprovedSupplier) => ({
          id: item?.id,
          name: item?.name,
        }));
      })
    );
  };
  public getPurchaseRequirementSummaryList = (
    filter: ModelFilter
  ): Observable<ListResult<Model>> => {
    const createdDateFrom = filter?.createdDate?.from
      ? dayjs(filter?.createdDate?.from)?.toDate()?.toISOString()
      : undefined;

    const createdDateTo = filter?.createdDate?.to
      ? dayjs(filter?.createdDate?.to)?.toDate()?.toISOString()
      : undefined;
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      createdDateRange: {
        from: createdDateFrom,
        to: createdDateTo,
      },
      costTypeIds: filter?.costTypeIdsValue?.map(
        (costType: any) => costType.id
      ),
      costGroupIds: filter?.costGroupIdsValue?.map(
        (costGroup: any) => costGroup.id
      ),
    };
    return this.http.post(API_GET_PURCHASE_REQUIREMENT_SUMMARY, body);
  };
  public getPurchaseRequirementSummaryFile = (
    filter: ModelFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const createdDateFrom = filter?.createdDate?.from
      ? dayjs(filter?.createdDate?.from)?.toDate()?.toISOString()
      : undefined;

    const createdDateTo = filter?.createdDate?.to
      ? dayjs(filter?.createdDate?.to)?.toDate()?.toISOString()
      : undefined;

    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      createdDateRange: {
        from: createdDateFrom,
        to: createdDateTo,
      },
      costTypeIds: filter?.costTypeIdsValue?.map(
        (costType: any) => costType.id
      ),
      costGroupIds: filter?.costGroupIdsValue?.map(
        (costGroup: any) => costGroup.id
      ),
      organizationIds: filter?.organizationIdsValue?.map(
        (organization: any) => organization.id
      ),
      businessBranchIds: filter?.businessBranchIdsValue?.map(
        (businessBranch: any) => businessBranch.id
      ),
      statuses: filter?.statusesValue?.map((status: any) => status.id),
    };
    return this.http.post(API_GET_PURCHASE_REQUIREMENT_SUMMARY_EXCEL, body, {
      headers: { Accept: "text/plain" },
      responseType: "arraybuffer" as "json",
    });
  };

  public getInvestmentProjectPortfolioList = (
    filter: ModelFilter
  ): Observable<ListResult<Model>> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      yearRange: {
        from: Number(filter?.projectYear?.fromYear),
        to: Number(filter?.projectYear?.toYear),
      },
      businessUnitId: filter?.businessUnitValue?.id,
      businessBranchId: filter?.businessBranchValue?.id,
      businessDepartmentId: filter?.businessDepartmentValue?.id,
      projectId: filter?.projectValue?.id,
    };

    return this.http.post(API_GET_INVESTMENT_PROJECT_PORTFOLIO, body);
  };

  public getInvestmentProjectPortfolioFile = (
    filter: ModelFilter
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    const body = {
      yearRange: {
        from: Number(filter?.projectYear?.fromYear),
        to: Number(filter?.projectYear?.toYear),
      },
      businessUnitId: filter?.businessUnitValue?.id,
      businessBranchId: filter?.businessBranchValue?.id,
      businessDepartmentId: filter?.businessDepartmentValue?.id,
    };

    return this.http.post(API_GET_INVESTMENT_PROJECT_PORTFOLIO_EXCEL, body, {
      headers: { Accept: "text/plain" },
      responseType: "arraybuffer" as "json",
    });
  };

  public getReportsByType = (filter: ModelFilter): Observable<Model[]> => {
    const body = {
      search: filter?.search?.trim() ?? "",
      topicTypeId: Number(filter?.reportTypeValue?.id),
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
    };

    return this.http
      .post(API_GET_REPORTS_BY_TYPE, body)
      .pipe(map((response) => response.data));
  };

  public getAllSLAReports = (
    filter: ModelFilter
  ): Observable<ListResult<Model>> => {
    const body = {
      createdDateRange: {
        from: filter?.createdDate?.from ?? "",
        to: filter?.createdDate?.to ?? "",
      },
      approvedDateRange: {
        from: filter?.approvedDate?.from ?? "",
        to: filter?.approvedDate?.to ?? "",
      },
      topicTypeId: Number(filter?.reportTypeValue?.id),

      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
    };

    return this.http.post(API_GET_ALL_SLA_REPORTS, body);
  };
}

export const reportRepository = new ReportRepository();
