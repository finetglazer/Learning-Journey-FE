import i18nTranslation from "core/config/i18n";
i18nTranslation.initialize();

import { t } from "i18next";
import { SelectModel } from "models/Contract";

export const generateDays = (length: number): SelectModel[] => {
  return Array.from({ length: length }, (v, k) => ({
    id: (k + 1).toString(),
    name: (k + 1).toString(),
  }));
};

export const generateMonths = (): SelectModel[] => {
  return Array.from({ length: 12 }, (v, k) => ({
    id: (k + 1).toString(),
    code: (k + 1).toString(),
    name: `${t("CT.month")} ${k + 1}`,
  }));
};
