import i18next from "i18next";
import { of } from "rxjs";

export const settlementListType = () => {
  const list = [
    {
      id: 0,
      name: i18next.t("BG.txt_open_budget"),
      code: "OPEN",
    },
    {
      id: 1,
      name: i18next.t("BG.txt_close_budget"),
      code: "CLOSE",
    },
  ];

  return of(list);
};

export const DEFAULT_PLACEHOLDER = "---";
