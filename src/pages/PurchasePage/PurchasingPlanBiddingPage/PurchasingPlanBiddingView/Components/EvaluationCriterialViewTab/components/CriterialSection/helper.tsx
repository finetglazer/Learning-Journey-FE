import { isNil } from "lodash";
import {
  CriteriaType,
  EvaluationCriteriaGroup,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";

export const getDataTableByCriteriaType = (
  data: EvaluationCriteriaGroup[],
  type: CriteriaType,
  technicalCompetenceType?: TechnicalCompetenceType
) => {
  return data?.find((item) => {
    let evaluationMethod = item?.evaluationMethod;
    if (isNil(evaluationMethod)) {
      evaluationMethod = TechnicalCompetenceType.TechnicalCriteriaMet;
    }

    if (!isNil(technicalCompetenceType)) {
      return (
        item?.criteriaType == type &&
        evaluationMethod == technicalCompetenceType
      );
    }
    return item?.criteriaType == type;
  });
};

export function insertArray<T>(
  originalArray: T[],
  newItems: T[],
  index: number
): T[] {
  return [
    ...originalArray.slice(0, index),
    ...newItems,
    ...originalArray.slice(index),
  ];
}
