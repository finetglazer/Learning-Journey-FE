import { ConfirmModalType } from "core/helpers/enum";
import { ContractAnnex } from "models/ContractAnnex";

export interface TagFilterList {
  title: string;
  value: string;
}

export enum ActionRowType {
  VIEW,
  EDIT,
  VIEW_FROM_MASTER,
}

export enum ContractPrincipleAppendixStatus {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  DECLINED = 3,
  CANCELED = 4,
}

export interface ListOverflowMenu {
  title: string;
  action: () => void;
  isShow: boolean;
}

export const CONTRACT_PRINCIPLE_APPENDIX_TAB_KEY = "1";

export interface ModelSelect {
  type: ConfirmModalType;
  model: ContractAnnex;
  errorMessage?: string;
}
