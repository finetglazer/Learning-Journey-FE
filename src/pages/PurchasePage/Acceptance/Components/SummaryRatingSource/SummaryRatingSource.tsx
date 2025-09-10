import { ColumnProps } from "antd/lib/table";
import { numberConstants, TABLE_ROW_KEY } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { EvaluationSupplierModel } from "models/Acceptance/Acceptance";
import { useAcceptanceDetailContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailContext";
import { useGetEvaluationSupplier } from "pages/PurchasePage/Acceptance/Components/hooks/useGetEvaluationSupplier";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./SummaryRatingSource.module.scss";
import classNames from "classnames";
import { useAcceptanceViewContext } from "pages/PurchasePage/Acceptance/AcceptanceView/AcceptanceViewContext";
import { useAcceptanceActions } from "pages/PurchasePage/Acceptance/Components/hooks/useAcceptanceActions";
import { isEqual } from "lodash";
import { toFixedNumber } from "core/helpers/calculator";

const CODE_TOTAL = "_TC";
const CODE_OUPUT = "_KQ";

const POINT = numberConstants.TEN;
const TABLE_ID_CONTAINER = "evaluation-id";

enum ColumnKey {
  NAME = "name",
  STANDARD = "standard",
  WEIGHT_PERCENT = "weight",
  POINT_EVALUATION = "score",
}

const columnsWidth = {
  name: 240,
  weightPercent: 200,
  pointEvaluation: 200,
};

const SummaryRatingSource = () => {
  const [translate] = useTranslation();
  const { model } = useAcceptanceDetailContext();
  const { model: modelView } = useAcceptanceViewContext();
  const { state } = useAcceptanceActions();
  const receivedId = useMemo(
    () =>
      isEqual(state, "EDIT") || isEqual(state, "CREATE")
        ? model?.goodsReceiptRequests?.map((item) => item.id)
        : modelView?.goodsReceiptRequests?.map((item) => item.id),
    [model?.goodsReceiptRequests, modelView?.goodsReceiptRequests, state]
  );
  const { evaluationSupplier } = useGetEvaluationSupplier({
    receivedId,
  });

  const makeTitle = (key: string) => (
    <div className="p-b--xs">{translate(key)}</div>
  );

  const columns: ColumnProps<EvaluationSupplierModel>[] = useMemo(
    () => [
      {
        title: makeTitle("AC.txt_creiteria_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(name: string, record) {
          const textMap: Record<string, string> = {
            isTotal: "CT.total",
            isResult: "AC.txt_output",
            isConclude: "AC.txt_summary_evaluation_supplier",
          };
          const key = (
            Object.keys(textMap) as Array<keyof typeof textMap>
          ).find((key) => record[key]);
          const displayText = key ? translate(textMap[key]) : name;
          const isBold = Boolean(key);
          return (
            <LayoutCell>
              <OneLineText
                className={classNames({
                  [styles["font-bold"]]: isBold,
                })}
                value={displayText}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: makeTitle("AC.txt_standard"),
        key: ColumnKey.STANDARD,
        dataIndex: ColumnKey.STANDARD,
        ellipsis: true,
        render(standard: string, record) {
          const isTotalRow = record?.isTotal;
          const isResultRow = record?.isResult;
          const isConcludeRow = record?.isConclude;
          const isBold = isResultRow;
          const displayText = isTotalRow
            ? ""
            : isResultRow
            ? formatNumber(evaluationSupplier?.evaluationScoreResult)
            : isConcludeRow
            ? evaluationSupplier?.supplierEvaluationConclusion
            : standard;

          return (
            <LayoutCell>
              <OneLineText
                className={classNames({
                  [styles["font-bold"]]: isBold,
                })}
                value={displayText}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: makeTitle("AC.txt_weight_percent"),
        key: ColumnKey.WEIGHT_PERCENT,
        dataIndex: ColumnKey.WEIGHT_PERCENT,
        width: columnsWidth.weightPercent,
        ellipsis: true,
        align: "right",
        render(weight: number, record) {
          const isBold = record.isTotal;
          const displayWeight = record.isTotal
            ? evaluationSupplier?.evaluationWeightTotal
            : weight;
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  [styles["font-bold"]]: isBold,
                })}
                value={formatNumber(displayWeight)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: makeTitle("AC.txt_evaluation_point"),
        key: ColumnKey.POINT_EVALUATION,
        dataIndex: ColumnKey.POINT_EVALUATION,
        ellipsis: true,
        width: columnsWidth.pointEvaluation,
        align: "right",
        render(score: number, record) {
          const isBold = record.isTotal;
          const displayScore = record.isTotal
            ? evaluationSupplier?.evaluationScoreTotal
            : score;

          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  [styles["font-bold"]]: isBold,
                })}
                value={formatNumber(displayScore)}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [
      evaluationSupplier?.evaluationScoreResult,
      evaluationSupplier?.evaluationScoreTotal,
      evaluationSupplier?.evaluationWeightTotal,
      evaluationSupplier?.supplierEvaluationConclusion,
      makeTitle,
      translate,
    ]
  );

  const data = useMemo(() => {
    if (evaluationSupplier?.evaluationDetails?.length > 0) {
      return [
        { isTotal: true },
        ...(evaluationSupplier?.evaluationDetails ?? []),
        { isResult: true },
        { isConclude: true },
      ];
    } else {
      return [];
    }
  }, [evaluationSupplier]);

  return (
    <div className={styles["summary-rating__container"]}>
      <span className={styles["source-point"]}>
        {translate("AC.txt_point_supplier", {
          count: evaluationSupplier.evaluationScoreMax,
        })}
      </span>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={data}
        scroll={{ y: "calc(100vh - 360px)" }}
        idContainer={TABLE_ID_CONTAINER}
        isDragable
      />
    </div>
  );
};

export default SummaryRatingSource;
