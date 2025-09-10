import { t } from "i18next";
import { of } from "rxjs";

export const listPromotionType = [
  { id: 0, name: t("promotions.CTKM") },
  { id: 1, name: t("promotions.lucky") },
];

export const getListPromotionType = () => {
  return of([
    { id: 0, name: t("promotions.CTKM") },
    { id: 1, name: t("promotions.lucky") },
  ]);
};
