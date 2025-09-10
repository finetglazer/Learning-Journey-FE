import { t } from "i18next";
import { isEmpty } from "lodash";
import { Model, ModelFilter } from "react-3layer-common";
import { Observable, of } from "rxjs";

import { trimText } from "core/helpers/text";
import { CriteriaType, RespondStatus } from "models/PurchasingPlan";

export const classificationMap = {
  [CriteriaType.TechnicalCompetence]: {
    id: CriteriaType.TechnicalCompetence,
    code: "INFO",
    name: t("PL.review_summary.technique"),
  },
  [CriteriaType.Finance]: {
    id: CriteriaType.Finance,
    code: "DEFAULT",
    name: t("PL.review_summary.financial"),
  },
};

export const responseStatusList = [
  {
    id: RespondStatus.Responded,
    code: "SUCCESS",
    name: t("PL.responded"),
  },
  {
    id: RespondStatus.NoRespond,
    code: "IN_PROGRESS",
    name: t("PL.not_response_yet"),
  },
];

const clarificationRequestTypeList = [
  {
    id: CriteriaType.TechnicalCompetence,
    code: CriteriaType.TechnicalCompetence,
    name: t("PL.review_summary.technique"),
  },
  {
    id: CriteriaType.Finance,
    code: CriteriaType.Finance,
    name: t("PL.review_summary.financial"),
  },
];

export const getClarificationRequestTypeList = (
  filter?: ModelFilter
): Observable<Model[]> => {
  const searchText = filter?.name;
  const trimmedText = trimText(searchText);

  if (!isEmpty(trimmedText)) {
    return of(
      clarificationRequestTypeList.filter((item) =>
        item.name.toLowerCase().includes(trimmedText.toLowerCase())
      )
    );
  }

  return of(clarificationRequestTypeList);
};
