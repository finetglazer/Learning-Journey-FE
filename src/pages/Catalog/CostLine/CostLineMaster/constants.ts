import i18next from "i18next";
import { of } from "rxjs";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: i18next.t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: i18next.t("CL.deactivate_status_full_txt"),
  },
];

export const budgetCalculationMethodList = () => {
  const list = [
    { id: 1, code: "CUMULATIVE", name: i18next.t("CL.cumulative_txt") },
    { id: 2, code: "PERIODIC", name: i18next.t("CL.periodic_txt") },
  ];

  return of(list);
};

export const budgetPeriodList = () => {
  const list = [
    { id: 0, code: "MONTHLY", name: i18next.t("CL.monthly_txt") },
    { id: 1, code: "QUARTERLY", name: i18next.t("CL.quarterly_txt") },
    { id: 2, code: "SEMI_ANNUALLY", name: i18next.t("CL.semi_annually_txt") },
    { id: 3, code: "ANNUALLY", name: i18next.t("CL.annually_txt") },
  ];

  return of(list);
};

export const stateList = () => {
  const list = [
    { id: 2, code: "ALL", name: i18next.t("CL.all_txt"), value: undefined },
    { id: 0, code: "ACCEPT", name: i18next.t("CL.yes_txt"), value: true },
    { id: 1, code: "REJECT", name: i18next.t("CL.no_txt"), value: false },
  ];

  return of(list);
};
