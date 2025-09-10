import { t } from "i18next";
import { of } from "rxjs";

export const listGoodsServicesType = [
  { id: 1, name: t("workflowTypes.goodsServices.user") },
  { id: 2, name: t("workflowTypes.goodsServices.position") },
  { id: 3, name: t("workflowTypes.goodsServices.role") },
];

export const getListGoodsServicesType = () => {
  return of([
    { id: 1, name: t("workflowTypes.goodsServices.user") },
    { id: 2, name: t("workflowTypes.goodsServices.position") },
    { id: 3, name: t("workflowTypes.goodsServices.role") },
  ]);
};
