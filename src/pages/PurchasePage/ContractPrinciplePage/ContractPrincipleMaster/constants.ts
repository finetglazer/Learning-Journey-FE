import { t } from "i18next";
import { ContractStatus } from "models/Contract";
export const listContractPrincipleStatus = [
  {
    id: ContractStatus.APPROVED,
    code: "SUCCESS",
    name: t("CM.txt_status_approved"),
  },
  {
    id: ContractStatus.WAITING_FOR_APPROVAL,
    code: "IN_PROGRESS",
    name: t("CM.txt_status_queue"),
  },
  { id: ContractStatus.DRAFT, code: "DEFAULT", name: t("CM.txt_status_draft") },
  {
    id: ContractStatus.REJECTED,
    code: "ERROR",
    name: t("CM.txt_status_rejected"),
  },
  {
    id: ContractStatus.CANCELED,
    code: "ERROR",
    name: t("CM.txt_status_cancel"),
  },

  {
    id: ContractStatus.CLOSED,
    code: "INFO",
    name: t("CM.txt_status_closed"),
  },
];
