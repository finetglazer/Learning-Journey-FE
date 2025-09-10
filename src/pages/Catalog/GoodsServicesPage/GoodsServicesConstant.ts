import { t } from "i18next";
import { of } from "rxjs";

export const listTriggerType = [
  { id: 1, name: t("goodsServices.user") },
  { id: 2, name: t("goodsServices.position") },
  { id: 3, name: t("goodsServices.role") },
];

export const getListTriggerType = () => {
  return of([
    { id: 1, name: t("goodsServices.user") },
    { id: 2, name: t("goodsServices.position") },
    { id: 3, name: t("goodsServices.role") },
  ]);
};

export const listStatus = [
  { id: 1, name: t("goodsServices.active") },
  { id: 2, name: t("goodsServices.inactive") },
];

export const getListStatus = () => {
  return of([
    { id: 1, name: t("goodsServices.active") },
    { id: 2, name: t("goodsServices.inactive") },
  ]);
};
