import { ColumnProps } from "antd/lib/table";
import {
  ColumnKey,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import React, { useEffect, useMemo, useState } from "react";
import {
  FormItem,
  InputNumber,
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

type Props = {
  model?: EvaluationResult;
  data: EvaluationItemResult[];
  type?: TechnicalCompetenceType;
  isEdit?: boolean;
  handleUpdate?: (data: EvaluationItemResult[]) => void;
};

const TechnicalCriteriaTable = ({
  data,
  type,
  isEdit,
  handleUpdate,
  model,
}: Props) => {
  const [translate] = useTranslation();
  const [dataRender, setDataRender] = useState(data);

  useEffect(() => {
    setDataRender(data);
  }, [data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeItemTable = (
    id: string,
    value: number | string,
    key: string
  ) => {
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
  };

  const columns: ColumnProps<EvaluationItemResult>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: ColumnKey.INDEX,
        dataIndex: ColumnKey.INDEX,
        sorter: false,
        width: 46,
        render(item, record, index) {
          return (
            <LayoutCell>
              <OneLineText value={`${index + 1}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_criteria_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: false,
        width: 200,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_technical_requirements"),
        key: ColumnKey.TECHNICAL_REQUIREMENT,
        dataIndex: ColumnKey.TECHNICAL_REQUIREMENT,
        sorter: false,
        width: 280,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        sorter: false,
        width: 280,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluation"),
        key: ColumnKey.PASS_FLAG,
        dataIndex: ColumnKey.PASS_FLAG,
        sorter: false,
        width: 150,
        render(_, item) {
          if (isEdit) {
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
            <LayoutCell>
              <OneLineText
                value={getStatusByPassFlag(item.passFlag)}
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
              <OneLineText value={`${index + 1}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_criteria_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: false,
        width: 200,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_technical_requirements"),
        key: ColumnKey.TECHNICAL_REQUIREMENT,
        dataIndex: ColumnKey.TECHNICAL_REQUIREMENT,
        sorter: false,
        width: 167,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item} useTooltip />
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
        width: 129,
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={item ?? "---"} useTooltip />
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
        width: 129,
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={item ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        sorter: false,
        width: 176,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluation"),
        key: "point",
        dataIndex: "point",
        sorter: false,
        width: 150,
        render(_, item) {
          if (isEdit) {
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
                    max={item?.maximumPointScale}
                    placeHolder={translate("PL.plh_score")}
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                value={item?.point?.toString() || "---"}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, isEdit, model, handleChangeItemTable]
  );

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

export default React.memo(TechnicalCriteriaTable);
