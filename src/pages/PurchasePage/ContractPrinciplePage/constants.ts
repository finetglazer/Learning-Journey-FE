import { numberConstants } from "core/config/consts";
import { t } from "i18next";
import { of } from "rxjs";

export enum TabKey {
  INFORMATION = "0",
  TERMS = "1",
  ANNEX_FILES = "4", // sửa từ 2 sang 4 vì chung api với bên hợp đồng, BE trả ra lỗi ở file phụ lục tại tab 4
  HISTORY_APPROVAL = "3",
}

export enum CPAModalType {
  SelectionContractPrincipleAppendix,
  Cancel,
  Delete,
  None,
  Return,
  Reject,
  Approve,
}

export enum CPAStatus {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  DECLINED = 3,
  CANCELED = 4,
}

export const annexTypeList = [
  {
    id: numberConstants.ZERO,
    name: t("CPA.txt_annex_type_0"),
  },
  {
    id: numberConstants.ONE,
    name: t("CPA.txt_annex_type_1"),
  },
];

export const annexType = () => of(annexTypeList);
