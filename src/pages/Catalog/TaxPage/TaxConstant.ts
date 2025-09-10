import { t } from "i18next";
import { of } from "rxjs";

export const listTaxType = [
  { id: 0, name: t("taxs.type.gtgt") },
  { id: 1, name: t("taxs.type.personal") },
  { id: 2, name: t("taxs.type.bidding") },
  { id: 3, name: t("taxs.type.none") },
  { id: 4, name: t("taxs.type.output") },
];

export const getListTaxType = () => {
  return of([
    { id: 0, name: t("taxs.type.gtgt") },
    { id: 1, name: t("taxs.type.personal") },
    { id: 2, name: t("taxs.type.bidding") },
    { id: 3, name: t("taxs.type.none") },
    { id: 4, name: t("taxs.type.output") },
  ]);
};
