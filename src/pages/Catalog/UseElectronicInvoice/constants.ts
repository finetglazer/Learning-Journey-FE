import { t } from "i18next";
import {
  UseElectronicInvoiceEProStatus,
  UseElectronicInvoiceStatus,
} from "models/UseElectronicInvoice";

export const listStatusEPro = [
  {
    id: UseElectronicInvoiceEProStatus.NOT_USED,
    code: "DEFAULT",
    name: t("UEI.txt_status_not_used"),
  },
  {
    id: UseElectronicInvoiceEProStatus.PARTIALLY_USED,
    code: "IN_PROGRESS",
    name: t("UEI.txt_status_partially_used"),
  },
  {
    id: UseElectronicInvoiceEProStatus.USED,
    code: "SUCCESS",
    name: t("UEI.txt_status_used"),
  },
];

export const listStatus = [
  {
    id: UseElectronicInvoiceStatus.NEW_INVOICE,
    code: "DEFAULT",
    name: t("UEI.txt_status_new_invoice"),
  },
  {
    id: UseElectronicInvoiceStatus.REPLACEMENT_INVOICE,
    code: "SUCCESS",
    name: t("UEI.txt_status_replacement_invoice"),
  },
  {
    id: UseElectronicInvoiceStatus.REPLACED_INVOICE,
    code: "INFO",
    name: t("UEI.txt_status_replaced_invoice"),
  },
  {
    id: UseElectronicInvoiceStatus.ADJUST_INVOICE,
    code: "SUCCESS",
    name: t("UEI.txt_status_adjust_invoice"),
  },
  {
    id: UseElectronicInvoiceStatus.ADJUSTED_INVOICE,
    code: "ERROR",
    name: t("UEI.txt_status_adjusted_invoice"),
  },
];
