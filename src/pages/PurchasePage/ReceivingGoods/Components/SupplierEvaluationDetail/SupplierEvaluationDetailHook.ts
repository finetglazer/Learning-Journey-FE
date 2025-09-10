import { sumWithFixed } from "core/helpers/calculator";
import {
  SupplierEvaluation,
  SupplierEvaluationDetail,
} from "models/ReceivingGood/GoodsReceipt";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useReceivingGoodsDetailContext } from "../../ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { isNumber } from "lodash";

export const useSupplierEvaluationDetailHooks = () => {
  const { model, handleChangeSingleField, isEditable } =
    useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const supplierEvaluation: SupplierEvaluation = model?.supplierEvaluation;

  const evaluations = useMemo(() => {
    const list: SupplierEvaluationDetail[] =
      supplierEvaluation?.evaluationDetails || [];
    const hasShowTotal = list?.find((item) => isNumber(item?.score));
    const total = {
      ...new SupplierEvaluationDetail(),
      name: translate("CT.total"),
      weight: 0,
      score: 0,
    };

    const result: SupplierEvaluationDetail = {
      ...new SupplierEvaluationDetail(),
      name: translate("AC.txt_output"),
      score: 0,
    };

    const conclusion: SupplierEvaluationDetail = {
      ...new SupplierEvaluationDetail(),
      name: translate("AC.txt_summary_evaluation_supplier"),
    };

    list?.forEach((item) => {
      const weight = total.weight + (item?.weight ?? 0);
      total.weight = weight;
      const scoreSum = sumWithFixed([total.score, item?.score ?? 0]);
      total.score = hasShowTotal ? scoreSum : undefined;

      result.score = sumWithFixed([
        result.score,
        ((item?.score ?? 0) * (item?.weight ?? 0)) / 100,
      ]);
    });

    const findResult = supplierEvaluation?.evaluationResults?.find((item) => {
      return result?.score >= item?.fromScore && result?.score <= item?.toScore;
    });

    conclusion.standard = findResult?.conclude;

    return [total, ...list, result, conclusion];
  }, [
    supplierEvaluation?.evaluationDetails,
    supplierEvaluation?.evaluationResults,
    translate,
  ]);

  const hasEvaluation = (record: SupplierEvaluationDetail) =>
    Boolean(record?.id);

  return {
    supplierEvaluation,
    evaluations,
    model,
    isEditable,
    translate,
    hasEvaluation,
    handleChangeSingleField,
  };
};
