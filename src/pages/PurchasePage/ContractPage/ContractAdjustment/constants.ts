import { t } from "i18next";
import { isNil } from "lodash";
import { ContractStatus } from "models/Contract";
import { ContractAnnex } from "models/ContractAnnex";

export enum ContractAdjustmentModal {
  SelectionSettlementContract,
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

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  REJECT = "REJECT",
  RETURN = "RETURN",
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

export enum ContractAdjustmentStatus {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  DECLINED = 3,
  CANCELED = 4,
}

export const listContractAdjustmentStatus = () => [
  {
    id: ContractAdjustmentStatus.DRAFT,
    code: "DEFAULT",
    name: t("CM.txt_status_draft"),
  },
  {
    id: ContractAdjustmentStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  {
    id: ContractAdjustmentStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: ContractAdjustmentStatus.DECLINED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: ContractAdjustmentStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_status_cancelled"),
  },
];

export enum ActionRowType {
  VIEW,
  EDIT,
  CANCEL,
  DELETE,
  VIEW_APPROVE,
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

  if (!isNil(text1) && !isNil(text2)) {
    dash = " - ";
  }

  return `${text1 || ""}${dash}${text2 || ""}`;
};
