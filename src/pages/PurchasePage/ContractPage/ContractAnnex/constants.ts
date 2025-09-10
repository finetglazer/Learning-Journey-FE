import {
  CONTRACT_ORDER,
  CONTRACT_ORDER_PRINCIPAL_CREATE,
  CONTRACT_PRINCIPLE_DETAIL_ROUTE,
  CONTRACT_ROUTE_CREATE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { ConfirmModalType } from "core/helpers/enum";
import { t } from "i18next";
import { isNil, isUndefined } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { of } from "rxjs";

export enum ContractAnnexModal {
  SelectionSettlementContract,
  SelectionSettlementContractAnnex,
  Cancel,
  Delete,
  None,
  Return,
  Reject,
  Approve,
}

export enum TabKey {
  INFORMATION = "0",
  TERMS = "1",
  PAYMENT_SCHEDULE = "2",
  WARRANTY = "3",
  ATTACHMENT_FILES = "4",
  APPROVAL_HISTORY = "5",
}

export enum TagFilterEnum {
  ALL = "0",
  MINE = "1",
  IN_PROGRESS = "2",
  APPROVAL = "3",
}

export interface ModelSelect {
  type: ConfirmModalType;
  model: ContractAnnex;
  errorMessage?: string;
}

export interface TagFilterList {
  title: string;
  value: string;
}

export enum ContractAnnexStatus {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  DECLINED = 3,
  CANCELED = 4,
}

export const listContractAnnexStatus = () => [
  {
    id: ContractAnnexStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_draft"),
  },
  {
    id: ContractAnnexStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  {
    id: ContractAnnexStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: ContractAnnexStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: ContractAnnexStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_status_cancelled"),
  },
];

export enum ActionRowType {
  VIEW,
  EDIT,
  VIEW_FROM_MASTER,
}

export interface ContractAnnexCreate {
  isDraft: boolean;
  isEdit: boolean;
}

/**
 * Combines two strings with a dash separator.
 * If both strings are undefined or null, an empty string is returned.
 * If only one of the strings is undefined or null, the other string is returned.
 * If both strings have values, they are concatenated with a dash separator.
 *
 * @param text1 - The first string to be combined.
 * @param text2 - The second string to be combined.
 * @returns The combined string.
 * @summary David's - david.jonathan@mail.com
 */
export const combineText = (text1?: string, text2?: string): string => {
  let dash = "";
  if (isNil(text1) && isNil(text2)) {
    return dash;
  }

  if (!isUndefined(text1) && !isUndefined(text2)) {
    dash = " - ";
  }

  return `${text1 || ""}${dash}${text2 || ""}`;
};

export const receivedType = () => {
  const list = [
    {
      id: numberConstants.ZERO,
      name: t("CA.txt_received_type_0"),
    },
    {
      id: numberConstants.ONE,
      name: t("CA.txt_received_type_1"),
    },
  ];

  return of(list);
};

enum ERelatedSlip {
  PurchaseProposal = 1, // Purchase Proposal
  PurchaseRequest = 2, // Purchase Request
  PurchasePlan = 3, // Purchase Plan
  Contract = 4, // Contract
  PurchaseOrder = 5, // Purchase Order
  OrderByPrinciple = 6, // Order By Principle
  PrincipleContract = 7, // Principle Contract
}

interface RelatedSlipType {
  id: ERelatedSlip;
  url: string;
}

export const relatedSlipListType: RelatedSlipType[] = [
  {
    id: ERelatedSlip.PurchaseProposal,
    url: PROPOSAL_DETAIL_ROUTE,
  },
  {
    id: ERelatedSlip.PurchaseRequest,
    url: PURCHASE_REQUEST_VIEW_ROUTE,
  },
  {
    id: ERelatedSlip.PurchasePlan,
    url: PURCHASING_PLAN_VIEW_ROUTE,
  },
  {
    id: ERelatedSlip.Contract,
    url: CONTRACT_ROUTE_CREATE,
  },
  {
    id: ERelatedSlip.PurchaseOrder,
    url: CONTRACT_ORDER,
  },
  {
    id: ERelatedSlip.OrderByPrinciple,
    url: CONTRACT_ORDER_PRINCIPAL_CREATE,
  },
  {
    id: ERelatedSlip.PrincipleContract,
    url: CONTRACT_PRINCIPLE_DETAIL_ROUTE,
  },
];
