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
import { listEvaluationResultsStatus } from "config/const";
import { EvaluationResult } from "models/PurchasingPlan";
import { formatNumber } from "core/helpers/number";
import { DocumentEvaluationRoundTableProps } from "../../types";

enum ColumnKey {
  SUPPLIER = "supplier",
  SUMMARY_POINT = "summaryPoint", // Tổng điểm
  SUMMARY_NOTE = "summaryNote", // Ghi chú tổng điểm
  STATUS = "status",
}

const columnsWidth = {
  supplier: 450,
  summaryPoint: 160,
  status: 120,

  overflowMenu: 40,
};

export const FinancialReviewerScoreTable = ({
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
        width: columnsWidth.supplier,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText className="text-bold" value={item?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.total_points"),
        key: ColumnKey.SUMMARY_POINT,
        dataIndex: ColumnKey.SUMMARY_POINT,
        ellipsis: true,
        width: columnsWidth.summaryPoint,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(record?.summaryPoint)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.totalPointsNote"),
        key: ColumnKey.SUMMARY_NOTE,
        dataIndex: ColumnKey.SUMMARY_NOTE,
        ellipsis: true,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.summaryNote} />
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
