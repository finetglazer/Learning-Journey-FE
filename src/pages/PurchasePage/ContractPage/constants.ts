import { numberConstants } from "core/config/consts";
import { t } from "i18next";
import {
  AppendixStatus,
  ContractRequestType,
  TicketsAcceptanceStatus,
  TicketsReceiveGoodsStatus,
} from "models/Contract";

export const listTicketsReceiveGoodsStatus = [
  {
    id: TicketsReceiveGoodsStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_create_new"),
  },
  {
    id: TicketsReceiveGoodsStatus.WAITING_FOR_APPROVE,
    code: "IN_PROGRESS",
    name: t("CM.send_approve"),
  },
  {
    id: TicketsReceiveGoodsStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_approve"),
  },
  {
    id: TicketsReceiveGoodsStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: TicketsReceiveGoodsStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_status_cancel"),
  },
];

export const listTicketsAcceptanceStatus = [
  {
    id: TicketsAcceptanceStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_create_new"),
  },
  {
    id: TicketsAcceptanceStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_status_cancel"),
  },
  {
    id: TicketsAcceptanceStatus.WAITING_FOR_APPROVE,
    code: "IN_PROGRESS",
    name: t("CM.send_approve"),
  },
  {
    id: TicketsAcceptanceStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_approve"),
  },
  {
    id: TicketsAcceptanceStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: TicketsAcceptanceStatus.RETURN,
    code: "ERROR",
    name: t("CM.txt_status_return"),
  },
];

export const listAppendixStatus = [
  {
    id: AppendixStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_create_new"),
  },
  {
    id: AppendixStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  {
    id: AppendixStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: AppendixStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: AppendixStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_status_cancel"),
  },
];

export const CONTRACT_TITLES = {
  CREATE: {
    [ContractRequestType.CONTRACT_ANNEX]: "CA.txt_create_new_contract_annex",
    [ContractRequestType.CONTRACTUAL_APPENDIX ||
    ContractRequestType.CONTRACT_APPENDIX_ACCORDING_TO_HDNT]:
      "CA.txt_create_new_contract_annex_order_form",
  },
  EDIT: {
    [ContractRequestType.CONTRACT_ANNEX]: "CA.txt_title_detail",
    [ContractRequestType.CONTRACTUAL_APPENDIX ||
    ContractRequestType.CONTRACT_APPENDIX_ACCORDING_TO_HDNT]:
      "CA.txt_title_detail_order_form",
  },
} as const;

export const CONTRACT_ADJUSTMENT_TAB_KEY = "3";
export const CONTRACT_ANNEX_TAB_KEY = "2";
