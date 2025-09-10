import React, { useCallback } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
import { useTranslation } from "react-i18next";

import { TABLE_ROW_KEY } from "core/config/consts";
import {
  listDocumentEvaluationStatus,
  listEvaluationResultsStatus,
} from "config/const";
import { EvaluationResult } from "models/PurchasingPlan";
import { formatNumber } from "core/helpers/number";
import { DocumentEvaluationRoundTableProps } from "../../types";
import { getStatusByPassFlag } from "../../../Components/ReviewSummaryTab/helper";
import { isNil } from "lodash";

enum ColumnKey {
  SUPPLIER = "supplier",
  SUMMARY_TECHNICAL_PASS_FLAG = "summaryTechnicalPassFlag", // Tổng chấm đạt
  SUMMARY_TECHNICAL_PASS_FLAG_NOTE = "summaryTechnicalPassFlagNote", // Ghi chú chấm đạt
  SUMMARY_TECHNICAL_POINT = "summaryTechnicalPoint", // Tổng chấm điểm
  SUMMARY_TECHNICAL_POINT_NOTE = "summaryTechnicalPointNote", // Ghi chú chấm điểm
  STATUS = "status",
}

const columnsWidth = {
  summaryTechnicalPassFlag: 160,
  summaryTechnicalPassFlagNote: 250,
  summaryTechnicalPoint: 160,
  summaryTechnicalPointNote: 250,
  status: 120,
  overflowMenu: 40,
};

export const TechnicalReviewerTable = ({
  roundData,
  onOpenDetailDocumentEvaluationDrawer,
}: DocumentEvaluationRoundTableProps) => {
  const [translate] = useTranslation();

  const renderOverflowMenu = useCallback(
    (data: EvaluationResult) => {
      const list = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => onOpenDetailDocumentEvaluationDrawer(data),
          isShow: data?.canView,
        },
        // Evaluation
        {
          title: translate("PL.txt_evaluation"),
          action: () => onOpenDetailDocumentEvaluationDrawer(data, true),
          isShow: data?.canEvaluate,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [onOpenDetailDocumentEvaluationDrawer, translate]
  );

  const columns: ColumnProps<EvaluationResult>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_name"),
        key: ColumnKey.SUPPLIER,
        dataIndex: ColumnKey.SUPPLIER,
        ellipsis: true,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText className="text-bold" value={item?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.totalPass"),
        key: ColumnKey.SUMMARY_TECHNICAL_PASS_FLAG,
        dataIndex: ColumnKey.SUMMARY_TECHNICAL_PASS_FLAG,
        ellipsis: true,
        width: columnsWidth.summaryTechnicalPassFlag,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  isNil(record?.summaryTechnicalPassFlag)
                    ? ""
                    : getStatusByPassFlag(record?.summaryTechnicalPassFlag)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.passNote"),
        key: ColumnKey.SUMMARY_TECHNICAL_PASS_FLAG_NOTE,
        dataIndex: ColumnKey.SUMMARY_TECHNICAL_PASS_FLAG_NOTE,
        ellipsis: true,
        width: columnsWidth.summaryTechnicalPassFlagNote,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.summaryTechnicalPassFlagNote} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.totalScore"),
        key: ColumnKey.SUMMARY_TECHNICAL_POINT,
        dataIndex: ColumnKey.SUMMARY_TECHNICAL_POINT,
        ellipsis: true,
        width: columnsWidth.summaryTechnicalPoint,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatNumber(record?.summaryTechnicalPoint)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.scoreNote"),
        key: ColumnKey.SUMMARY_TECHNICAL_POINT_NOTE,
        dataIndex: ColumnKey.SUMMARY_TECHNICAL_POINT_NOTE,
        ellipsis: true,
        width: columnsWidth.summaryTechnicalPointNote,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.summaryTechnicalPointNote} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        ellipsis: true,
        width: columnsWidth.status,
        render(value) {
          const status = listEvaluationResultsStatus.find(
            (item) => item.id === value
          );
          return (
            <LayoutCell>
              <Tag
                size="sm"
                value={status?.name}
                status={status?.code}
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },

      // Menu Actions
      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(_, record) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {renderOverflowMenu(record)}
            </div>
          );
        },
      },
    ],
    [renderOverflowMenu, translate]
  );

  return (
    <StandardTable
      rowKey={TABLE_ROW_KEY}
      columns={columns}
      dataSource={roundData?.evaluationResults || []}
      scroll={{ y: "calc(100vh - 360px)" }}
      idContainer="table-id"
    />
  );
};
