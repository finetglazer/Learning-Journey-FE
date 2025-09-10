import i18next from "i18next";

export enum TabAssetInformationKey {
  ASSET_VALUE = "asset-value",
  ORDER_FORM = "order-form",
  INFORMATION_ASSET = "information-asset",
  INFORMATION_SETTLEMENT = "information-settlement",
}

export enum ProjectSettlementModal {
  SelectionSettlementPolicy,
  Cancel,
  Delete,
  None,
  Return,
  Reject,
  Approve,
}

export enum TabKey {
  INFORMATION = "0",
  GOODS_SERVICES = "1",
  INFORMATION_ASSET = "2",
  APPROVAL_HISTORY = "3",
  INTERGRATION = "4",
}

export const projectSettlementTypeList = [
  { id: 0, code: 1, name: i18next.t("PS.txt_buy_new") },
  { id: 1, code: 2, name: i18next.t("PS.txt_upgrade") },
];

export enum RequestStatus {
  Draft = 0,
  WaitingForApproval = 1,
}

export enum TAB_MASTER {
  ALL = "0",
  MINE = "1",
  IN_PROGRESS = "2",
  APPROVAL = "3",
}
