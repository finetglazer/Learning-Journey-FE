import { ColumnProps } from "antd/lib/table";
import {
  ColumnKey,
  CriteriaType,
  EvaluationGroupResult,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import React, { useCallback, useMemo } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import { listEvaluation } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { isNil } from "lodash";
import { getStatusByPassFlag } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/helper";
import { roundTo } from "core/helpers/number";

import styles from "./TechnicalCapabilityEvaluationGroup.module.scss";
import classNames from "classnames";
import { TABLE_ROW_KEY } from "core/config/consts";

type Props = {
  model?: EvaluationResult;
  data: EvaluationGroupResult[];
  type?: TechnicalCompetenceType;
  isEdit?: boolean;
  handleUpdate?: (
    evaluationGroupResultId: string,
    data: EvaluationItemResult[]
  ) => void;
};

const MAX_POINT_SCALE = 100;

const TechnicalCapabilityEvaluationGroup = ({
  model,
  data,
  isEdit,
  handleUpdate,
}: Props) => {
  const [translate] = useTranslation();

  const evaluationGroupResultItemPass = data?.find(
    (item) =>
      item.evaluationMethod === TechnicalCompetenceType.TechnicalCriteriaMet &&
      item.criteriaType === CriteriaType.TechnicalCompetence
  );

  const evaluationGroupResultItemScore = data?.find(
    (item) =>
      item.evaluationMethod === TechnicalCompetenceType.TechnicalScore &&
      item.criteriaType === CriteriaType.TechnicalCompetence
  );

  const handleChangeItemTable = useCallback(
    (
      evaluationGroupResultId: string,
      id: string,
      value: number | string,
      key: string
    ) => {
      const currentUpdatedData = data?.find(
        (item) => item.id === evaluationGroupResultId
      );

      const newData = currentUpdatedData?.evaluationItemResult?.map((item) => {
        if (item.evaluationCriteriaId === id) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      });
      handleUpdate(evaluationGroupResultId, newData);
    },
    [data, handleUpdate]
  );

  const columns: ColumnProps<EvaluationItemResult>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: ColumnKey.INDEX,
        dataIndex: ColumnKey.INDEX,
        sorter: false,
        width: 50,
        render(item, record, index) {
          return (
            <LayoutCell>
              <OneLineText value={record?.isTotalRow ? "" : `${index + 1}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_criteria_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: false,
        render(item, record) {
          return (
            <LayoutCell
              className={classNames({
                [styles["total-point-text"]]: record?.isTotalRow,
              })}
            >
              <OneLineText
                value={item || (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("EV.txt_evaluation_criteria_describe"),
        key: ColumnKey.CRITERIA_NOTE,
        dataIndex: ColumnKey.CRITERIA_NOTE,
        sorter: false,
        width: 300,
        render(item, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={item || (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>
            <label className={"component__title"}>
              {translate("PL.txt_review_summary_assessment_score")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: ColumnKey.PASS_FLAG,
        dataIndex: ColumnKey.PASS_FLAG,
        sorter: false,
        width: 150,
        render(_, item) {
          if (isEdit && !item?.isDefaultCriteria) {
            return (
              <FormItem
                validateObject={
                  isNil(item?.passFlag)
                    ? utilService.getValidateObj(
                        model,
                        `passFlag.${item?.evaluationCriteriaId}`
                      )
                    : null
                }
                isTableCell
              >
                <LayoutCell>
                  <Select
                    valueFilter={{
                      name: "",
                    }}
                    isRequired
                    classFilter={undefined}
                    getList={() => of(listEvaluation)}
                    onChange={(id, value) => {
                      handleChangeItemTable(
                        evaluationGroupResultItemPass?.id,
                        item?.evaluationCriteriaId,
                        value?.id,
                        ColumnKey.PASS_FLAG
                      );
                    }}
                    searchType=""
                    isEnumerable={false}
                    placeHolder={translate("PL.txt_choice_evaluation")}
                    value={listEvaluation.find((i) => i.id === item.passFlag)}
                    appendToBody
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                value={getStatusByPassFlag(item.passFlag)}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluation_note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        sorter: false,
        width: 220,
        render(item, record) {
          if (isEdit && !record?.isDefaultCriteria) {
            return (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `note.${record?.evaluationCriteriaId}`
                )}
                isTableCell
              >
                <LayoutCell>
                  <InputText
                    isTableCell
                    allowClear={false}
                    placeHolder={translate("CT.enter_note")}
                    maxLength={255}
                    translate={translate}
                    value={item}
                    onChange={(value: string) =>
                      handleChangeItemTable(
                        evaluationGroupResultItemPass?.id,
                        record?.evaluationCriteriaId,
                        value,
                        ColumnKey.NOTE
                      )
                    }
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [
      evaluationGroupResultItemPass?.id,
      handleChangeItemTable,
      isEdit,
      model,
      translate,
    ]
  );

  const columnsTechnicalScore: ColumnProps<EvaluationItemResult>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: "index",
        dataIndex: "index",
        sorter: false,
        width: 46,
        render(item, record, index) {
          return (
            <LayoutCell>
              <OneLineText value={record?.isTotalRow ? "" : `${index + 1}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_criteria_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: false,
        render(item, record) {
          return (
            <LayoutCell
              className={classNames({
                [styles["total-point-text"]]: record?.isTotalRow,
              })}
            >
              <OneLineText
                value={item || (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("EV.txt_evaluation_criteria_describe"),
        key: ColumnKey.CRITERIA_NOTE,
        dataIndex: ColumnKey.CRITERIA_NOTE,
        sorter: false,
        width: 190,
        render(item, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={item || (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_max_score"),
        key: "maximumPointScale",
        dataIndex: "maximumPointScale",
        sorter: false,
        width: 130,
        render(item, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={item ?? (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_min_score"),
        key: "minimumPointScale",
        dataIndex: "minimumPointScale",
        sorter: false,
        width: 128,
        render(item, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={item ?? (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>
            <label className={"component__title"}>
              {translate("PL.txt_review_summary_assessment_score")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "point",
        dataIndex: "point",
        sorter: false,
        width: 150,
        render(_, item) {
          if (isEdit && !item?.isDefaultCriteria) {
            return (
              <FormItem
                validateObject={
                  isNil(item?.point) || item?.point < item?.minimumPointScale
                    ? utilService.getValidateObj(
                        model,
                        `point.${item?.evaluationCriteriaId}`
                      )
                    : null
                }
                isTableCell
              >
                <LayoutCell>
                  <InputNumber
                    isRequired
                    value={item?.point}
                    onChange={(value) => {
                      handleChangeItemTable(
                        evaluationGroupResultItemScore?.id,
                        item?.evaluationCriteriaId,
                        value,
                        "point"
                      );
                    }}
                    numberType={"DECIMAL"}
                    decimalDigit={2}
                    max={
                      item?.isTotalRow
                        ? MAX_POINT_SCALE
                        : item?.maximumPointScale
                    }
                    placeHolder={translate("PL.plh_score")}
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                value={item.point ? String(roundTo(item.point, 2)) : "---"}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluation_note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        sorter: false,
        width: 190,
        render(item, record) {
          if (isEdit && !record?.isDefaultCriteria) {
            return (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `note.${record?.evaluationCriteriaId}`
                )}
                isTableCell
              >
                <LayoutCell>
                  <InputText
                    isTableCell
                    allowClear={false}
                    placeHolder={translate("CT.enter_note")}
                    maxLength={255}
                    translate={translate}
                    value={item}
                    onChange={(value: string) =>
                      handleChangeItemTable(
                        evaluationGroupResultItemScore?.id,
                        record?.evaluationCriteriaId,
                        value,
                        ColumnKey.NOTE
                      )
                    }
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [
      translate,
      isEdit,
      model,
      handleChangeItemTable,
      evaluationGroupResultItemScore?.id,
    ]
  );

  return (
    <div>
      {evaluationGroupResultItemPass?.evaluationItemResult?.length > 0 && (
        <>
          <div className={styles["evaluation-method"]}>
            <span className={styles["evaluation-method__title"]}>{`${translate(
              "PL.txt_evaluation_method"
            )}: `}</span>
            <span className={styles["evaluation-method__value"]}>
              {translate("PL.txt_pass_or_fail")}
            </span>
          </div>
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            isDragable
            columns={columns}
            dataSource={evaluationGroupResultItemPass?.evaluationItemResult}
            scroll={{ y: "calc(100vh - 546px)" }}
          />
        </>
      )}

      {evaluationGroupResultItemScore?.evaluationItemResult?.length > 0 && (
        <>
          <div className={styles["evaluation-method"]}>
            <span className={styles["evaluation-method__title"]}>{`${translate(
              "PL.txt_evaluation_method"
            )}: `}</span>
            <span className={styles["evaluation-method__value"]}>
              {translate("PL.txt_scoring")}
            </span>
            <span
              className={styles["evaluation-method__separator"]}
            >{` | `}</span>
            <span className={styles["evaluation-method__title"]}>
              {`${translate("PL.technical_weight")}: `}
            </span>
            <span className={styles["evaluation-method__value"]}>
              {evaluationGroupResultItemScore?.technicalWeight
                ? `${evaluationGroupResultItemScore?.technicalWeight}%`
                : "---"}
            </span>
          </div>
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            isDragable
            columns={columnsTechnicalScore}
            dataSource={evaluationGroupResultItemScore?.evaluationItemResult}
            scroll={{ y: "calc(100vh - 546px)" }}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(TechnicalCapabilityEvaluationGroup);
