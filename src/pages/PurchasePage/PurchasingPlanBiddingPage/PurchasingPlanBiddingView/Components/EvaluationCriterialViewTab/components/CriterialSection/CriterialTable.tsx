import { ColumnProps } from "antd/lib/table";
import {
  ColumnKey,
  CriteriaType,
  EvaluationCriteria,
  EvaluationCriteriaGroup,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { insertArray } from "./helper";

type Props = {
  data: EvaluationCriteriaGroup;
  criteriaType?: CriteriaType;
  technicalCompetenceType?: TechnicalCompetenceType;
};

const CriterialTable = ({
  data,
  technicalCompetenceType = TechnicalCompetenceType.TechnicalScore,
}: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<EvaluationCriteria>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_criteria_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_technical_requirements"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluator"),
        key: ColumnKey.USER,
        dataIndex: ColumnKey.USER,
        width: 250,
        render(value) {
          return (
            <LayoutCell position="left">
              <OneLineText value={value?.name ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_email"),
        key: ColumnKey.USER,
        dataIndex: ColumnKey.USER,
        width: 240,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value?.email ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        width: 240,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const columnsTechnicalScore: ColumnProps<EvaluationCriteria>[] = insertArray<
    ColumnProps<EvaluationCriteria>
  >(
    columns,
    [
      {
        title: translate("PL.txt_max_score"),
        key: ColumnKey.MAX_POINT_SCALE,
        dataIndex: ColumnKey.MAX_POINT_SCALE,
        width: 129,
        render(value) {
          return (
            <LayoutCell position="left">
              <OneLineText value={value} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_min_score"),
        key: ColumnKey.MIN_POINT_SCALE,
        dataIndex: ColumnKey.MIN_POINT_SCALE,
        width: 129,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    2
  );

  return (
    <StandardTable
      rowKey="id"
      isDragable
      columns={
        technicalCompetenceType === TechnicalCompetenceType.TechnicalScore
          ? columnsTechnicalScore
          : columns
      }
      dataSource={data?.evaluationCriterias ?? []}
      scroll={{ y: "calc(100vh - 326px)" }}
    />
  );
};

export default CriterialTable;
