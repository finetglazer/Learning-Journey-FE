import { EvaluationSummary, PassFlag } from "models/PurchasingPlan";
import i18nTranslation from "core/config/i18n";
i18nTranslation.initialize();
import { t } from "i18next";
import { isEmpty, isNil } from "lodash";

export const getStatusByPassFlag = (passFlag: PassFlag) => {
  if (isNil(passFlag)) return "---";
  return passFlag ? t("PL.txt_not_pass") : t("PL.txt_pass");
};

export const convertDataEvaluationSummary = (data: EvaluationSummary[]) => {
  if (isEmpty(data)) return [];
  return data?.map((item) => ({
    ...item,
    evaluationResults: item?.evaluationResults?.map((evaluationResult) => ({
      ...evaluationResult,
      evaluationSummaryId: item?.id,
      evaluationGroupResult: evaluationResult?.evaluationGroupResult?.map(
        (evaluationGroupResult) => ({
          ...evaluationGroupResult,
          evaluationResultId: evaluationResult?.supplierId,
          evaluationSummaryId: item?.id,
        })
      ),
    })),
  }));
};
