import { PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE } from "./../../config/route-const";
import {
  PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_DETAIL_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";
import { t } from "i18next";
import { PurchasePlanTypeRouter } from "./PurchasingPlan";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import {
  BiddingMethod,
  BiddingProcedure,
  TenderProfileType,
} from "./PurchasingPlanBidder";

export enum TYPE_OF_TABS {
  GENERAL_INFORMATION = 0, //Thông tin chung
  SUPPLIER = 1, // Nhà cung cấp
}

export enum TYPE_PURCHASING_PLAN {
  DIRECT_CONTACTING = 1, // Chỉ định thầu
  FROM_CONTRACT_PRINCIPLE, // Từ Hợp đồng Nguyên Tắc
  COMPETITIVE_BIDDING, // Chào thầu cạnh tranh
  BIDDING, // Đấu thầu
}

export const TYPE_PURCHASING_PLAN_OPTIONS: PurchasePlanTypeRouter[] = [
  {
    id: TYPE_PURCHASING_PLAN.DIRECT_CONTACTING,
    name: t("PL.purchasing_plan_direct_contacting"),
    pathEdit: PURCHASING_PLAN_DETAIL_ROUTE,
    pathView: PURCHASING_PLAN_VIEW_ROUTE,
  },
  {
    id: TYPE_PURCHASING_PLAN.FROM_CONTRACT_PRINCIPLE,
    name: t("PL.principle.title.from_contract"),
    pathEdit: PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE,
    pathView: PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE,
  },
  {
    id: TYPE_PURCHASING_PLAN.COMPETITIVE_BIDDING,
    name: t("PL.competitive_offer.title.page"),
    pathEdit: PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
    pathView: PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
    pathAdjustEdit: PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE,
    pathAdjustView: PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE,
  },
  {
    id: TYPE_PURCHASING_PLAN.BIDDING,
    name: t("PL.bidding.title.page"),
    pathEdit: PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
    pathView: PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
    pathAdjustEdit: PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE,
    pathAdjustView: PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE,
  },
];

export enum TYPE_OF_ATTACHMENTS {
  SUPPLIER_ATTACHMENT = 1, // TÀI LIỆU NHÀ CUNG CẤP
  ATTACHMENT,
}

export enum PURCHASING_PLAN_STATUS {
  DRAFT, // Bản nháp
  WAITING_FOR_APPROVAL, // Chờ duyệt
  APPROVED, // Đã duyệt
  DECLINED, // Từ chối
  WAITING_CANCEL, // Chờ hủy
  WAITING_QUOTATION, // Chờ báo giá
  QUOTED, // Đã báo giá
  SELECT_SUPPLIER, //chọn nhà cung cấp
  SELECTED_SUPPLIER, //đã chọn nhà cung cấp
  BID, //Chào thầu
  BIDDING, //CHấm thầu
  CANCELLED, //Đã hủy
  OPEN_PROFILE, // Mở hồ sơ
}

export enum PURCHASING_PLAN_STATUS_PROCESS {
  DRAFT = 1, // Bản nháp
  QUOTING, // Đang báo giá
  SELECT_SUPPLIER, // chọn nhà cung cấp
  AWAITING_APPROVAL, // Chờ duyệt
  APPROVED, // Đã duyệt
}

export enum PURCHASING_PLAN_PRINCIPLE_STATUS_PROCESS {
  DRAFT = 1, // Bản nháp
  SELECT_SUPPLIER, // Chọn nhà cung cấp
  SELECTED_SUPPLIER, // Đã chọn nhà cung cấp
}

export const PURCHASING_PLAN_STATUS_OPTIONS = [
  {
    id: PURCHASING_PLAN_STATUS?.DRAFT,
    name: t("PL.purchasing_plan_status_draft"),
  },
  {
    id: PURCHASING_PLAN_STATUS?.WAITING_FOR_APPROVAL,
    name: t("PL.purchasing_plan_status_waiting_for_approval"),
  },
  {
    id: PURCHASING_PLAN_STATUS.APPROVED,
    name: t("PL.purchasing_plan_status_approved"),
  },
  {
    id: PURCHASING_PLAN_STATUS.DECLINED,
    name: t("PL.purchasing_plan_status_declined"),
  },
  {
    id: PURCHASING_PLAN_STATUS.WAITING_CANCEL,
    name: t("PL.purchasing_plan_status_waiting_cancel"),
  },
  {
    id: PURCHASING_PLAN_STATUS.WAITING_QUOTATION,
    name: t("PL.purchasing_plan_status_waiting_quotation"),
  },
  {
    id: PURCHASING_PLAN_STATUS.QUOTED,
    name: t("PL.purchasing_plan_status_quoted"),
  },
  {
    id: PURCHASING_PLAN_STATUS.SELECT_SUPPLIER,
    name: t("PL.purchasing_plan_status_select_supplier"),
  },
  {
    id: PURCHASING_PLAN_STATUS.SELECTED_SUPPLIER,
    name: t("PL.purchasing_plan_status_selected_supplier"),
  },
  { id: PURCHASING_PLAN_STATUS.BID, name: t("PL.purchasing_plan_status_bid") },
  {
    id: PURCHASING_PLAN_STATUS.BIDDING,
    name: t("PL.purchasing_plan_status_bidding"),
  },
  {
    id: PURCHASING_PLAN_STATUS.CANCELLED,
    name: t("PL.purchasing_plan_status_cancelled"),
  },
];

export enum ConfirmModalType {
  DELETE,
  CANCEL,
  RETURN,
  REJECT,
  SEND_APPROVE,
  SEND_RESULT,
  RENEGOTIATION,
}

export const listPurchasePlanTypeLinkRouter = [
  {
    id: TYPE_PURCHASING_PLAN.DIRECT_CONTACTING,
    name: t("PL.purchasing_plan_status_draft"),
  },
];

export const childText = "_child";

export const DEFAULT_ERROR_MODAL_TYPE: ModalTypeError = {
  type: "NONE",
  errors: [],
};

export const PURCHASING_PLAN_BIDDING_METHOD = [
  {
    id: BiddingMethod.OpenTender,
    name: t("PL.bidding.title.bidding_method_open_tender"),
  },
  {
    id: BiddingMethod.RestrictedTender,
    name: t("PL.bidding.title.bidding_method_restricted_tender"),
  },
];

export const PURCHASING_PLAN_BIDDING_PROCEDURE = [
  {
    id: BiddingProcedure.OneTenderDocument,
    name: t("PL.bidding.title.bidding_procedure_one_tender"),
  },
  {
    id: BiddingProcedure.TwoTenderDocument,
    name: t("PL.bidding.title.bidding_procedure_two_tender"),
  },
];

export const PURCHASING_PLAN_BIDDING_PROFILE = [
  {
    id: TenderProfileType.TechnicalProfile,
    name: t("PL.bidding.title.technical_profile"),
  },
  {
    id: TenderProfileType.FinancialProfile,
    name: t("PL.bidding.title.financial_profile"),
  },
];
