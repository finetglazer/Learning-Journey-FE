import { ColumnProps } from "antd/lib/table";
import {
  ColumnKey,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { listEvaluation, NUMBER_MAX_13 } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { isNil } from "lodash";
import { getStatusByPassFlag } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/helper";
import { roundTo } from "core/helpers/number";

import styles from "./EvaluationResultsTable.module.scss";
import classNames from "classnames";

type Props = {
  model?: EvaluationResult;
  data: EvaluationItemResult[];
  type?: TechnicalCompetenceType;
  isEdit?: boolean;
  handleUpdate?: (data: EvaluationItemResult[]) => void;
};

const EvaluationResultsTable = ({
  data,
  type,
  isEdit,
  handleUpdate,
  model,
}: Props) => {
  const [translate] = useTranslation();
  const [dataRender, setDataRender] = useState(data);

  const handleChangeItemTable = useCallback(
    (id: string, value: number | string, key: string) => {
      const newData = dataRender.map((item) => {
        if (item.evaluationCriteriaId === id) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      });
      setDataRender(newData);
      handleUpdate(newData);
    },
    [dataRender, handleUpdate]
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
        title: translate("PL.txt_technical_requirements"),
        key: ColumnKey.TECHNICAL_REQUIREMENT,
        dataIndex: ColumnKey.TECHNICAL_REQUIREMENT,
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
        align: "end",
        width: 150,
        render(_, item) {
          if (isEdit && !item?.isQuotation) {
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
            <LayoutCell position="right">
              <OneLineText
                value={
                  item?.isQuotation
                    ? String(roundTo(item.point, 2))
                    : getStatusByPassFlag(item.passFlag)
                }
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
          if (isEdit && !item?.isQuotation && !record?.isTotalRow) {
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
              <OneLineText
                value={item || (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
    ],
    [handleChangeItemTable, isEdit, model, translate]
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
        title: translate("PL.txt_technical_requirements"),
        key: ColumnKey.TECHNICAL_REQUIREMENT,
        dataIndex: ColumnKey.TECHNICAL_REQUIREMENT,
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
        align: "end",
        width: 130,
        render(item, record) {
          return (
            <LayoutCell position="right">
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
        align: "end",
        width: 128,
        render(item, record) {
          return (
            <LayoutCell position="right">
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
        align: "end",
        width: 150,
        render(_, item) {
          if (isEdit && !item?.isQuotation) {
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
                        item?.evaluationCriteriaId,
                        value,
                        "point"
                      );
                    }}
                    numberType={"DECIMAL"}
                    decimalDigit={2}
                    max={
                      item?.isTotalRow ? NUMBER_MAX_13 : item?.maximumPointScale
                    }
                    placeHolder={translate("PL.plh_score")}
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={String(roundTo(item.point, 2)) || "---"}
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
          if (isEdit && !item?.isQuotation && !record?.isTotalRow) {
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
              <OneLineText
                value={item || (record?.isTotalRow ? "" : "---")}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, isEdit, model, handleChangeItemTable]
  );

  useEffect(() => {
    setDataRender(data);
  }, [data]);

  return (
    <div>
      <StandardTable
        rowKey={ColumnKey.TECHNICAL_REQUIREMENT}
        isDragable
        columns={
          type === TechnicalCompetenceType.TechnicalCriteriaMet
            ? columns
            : columnsTechnicalScore
        }
        dataSource={dataRender || []}
        scroll={{ y: "calc(100vh - 546px)" }}
      />
    </div>
  );
};

export default React.memo(EvaluationResultsTable);
