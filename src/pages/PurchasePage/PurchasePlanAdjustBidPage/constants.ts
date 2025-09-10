import { Observable, of } from "rxjs";
import { t } from "i18next";
import { isEmpty } from "lodash";
import { Model, ModelFilter } from "react-3layer-common";

import { trimText } from "core/helpers/text";
import { PurchasePlanAdjustBidRoleList } from "models/PurchasingPlan";

export const purchasePlanAdjustBidRoleList = [
  {
    id: PurchasePlanAdjustBidRoleList.TechnicalTeamLeader,
    code: PurchasePlanAdjustBidRoleList.TechnicalTeamLeader,
    name: t("PPA.technical_team_leader"),
  },
  {
    id: PurchasePlanAdjustBidRoleList.FinancialTeamLeader,
    code: PurchasePlanAdjustBidRoleList.FinancialTeamLeader,
    name: t("PPA.financial_team_leader"),
  },
  {
    id: PurchasePlanAdjustBidRoleList.ProjectDirector,
    code: PurchasePlanAdjustBidRoleList.ProjectDirector,
    name: t("PPA.project_director"),
  },
];

export const purchasePlanAdjustBidRoleMap = {
  [PurchasePlanAdjustBidRoleList.TechnicalTeamLeader]: t(
    "PPA.technical_team_leader"
  ),
  [PurchasePlanAdjustBidRoleList.FinancialTeamLeader]: t(
    "PPA.financial_team_leader"
  ),
  [PurchasePlanAdjustBidRoleList.ProjectDirector]: t("PPA.project_director"),
};

export const getPurchasePlanAdjustBidRoleList = (
  filter?: ModelFilter
): Observable<Model[]> => {
  const searchText = filter?.name;
  const trimmedText = trimText(searchText);

  if (!isEmpty(trimmedText)) {
    return of(
      purchasePlanAdjustBidRoleList.filter((item) =>
        item.name.toLowerCase().includes(trimmedText.toLowerCase())
      )
    );
  }

  return of(purchasePlanAdjustBidRoleList);
};
