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
import { isNil } from "lodash";
import { getStatusByPassFlag } from "../../../Components/ReviewSummaryTab/helper";

enum ColumnKey {
  SUPPLIER = "supplier",
  SUMMARY_QUOTATION_POINT = "summaryQuotationPoint",
  SUMMARY_QUOTATION_NOTE = "summaryQuotationNote",
  SUMMARY_FINANCIAL_PASS_FLAG = "summaryFinancialPassFlag",
  SUMMARY_FINANCIAL_NOTE = "summaryFinancialNote",
  STATUS = "status",
}

const columnsWidth = {
  supplier: 190,
  summaryQuotationPoint: 160,
  summaryFinancialPassFlag: 160,
  status: 120,
  overflowMenu: 40,
};

export const FinancialReviewerPassTable = ({
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
        title: translate("PL.totalQuote"),
        key: ColumnKey.SUMMARY_QUOTATION_POINT,
        dataIndex: ColumnKey.SUMMARY_QUOTATION_POINT,
        ellipsis: true,
        width: columnsWidth.summaryQuotationPoint,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatNumber(record?.summaryQuotationPoint)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_quotation_notes_table"),
        key: ColumnKey.SUMMARY_QUOTATION_NOTE,
        dataIndex: ColumnKey.SUMMARY_QUOTATION_NOTE,
        ellipsis: true,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.summaryQuotationNote} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.totalCriteria"),
        key: ColumnKey.SUMMARY_FINANCIAL_PASS_FLAG,
        dataIndex: ColumnKey.SUMMARY_FINANCIAL_PASS_FLAG,
        ellipsis: true,
        width: columnsWidth.summaryFinancialPassFlag,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  isNil(record?.summaryFinancialPassFlag)
                    ? ""
                    : getStatusByPassFlag(record?.summaryFinancialPassFlag)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.criteriaNote"),
        key: ColumnKey.SUMMARY_FINANCIAL_NOTE,
        dataIndex: ColumnKey.SUMMARY_FINANCIAL_NOTE,
        ellipsis: true,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.summaryFinancialNote} />
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
