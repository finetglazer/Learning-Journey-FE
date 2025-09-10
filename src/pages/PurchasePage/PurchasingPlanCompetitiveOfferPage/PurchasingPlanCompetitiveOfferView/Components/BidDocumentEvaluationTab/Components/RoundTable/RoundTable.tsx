import React, { useCallback, useContext, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
import { useTranslation } from "react-i18next";
import { isEmpty, isNil } from "lodash";

import { TABLE_ROW_KEY, VND_CURRENCY_UNIT } from "core/config/consts";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import { listDocumentEvaluationStatus } from "config/const";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import {
  EvaluationMethod,
  EvaluationResult,
  EvaluationSummary,
} from "models/PurchasingPlan";
import DetailDocumentEvaluationDrawer from "../DetailDocumentEvaluationDrawer/DetailDocumentEvaluationDrawer";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { getStatusByPassFlag } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/helper";

export interface RoundTableProps {
  roundData: EvaluationSummary;
}

enum ModelType {
  Edit,
  View,
}

enum ColumnKey {
  SUPPLIER = "supplier",
  QUOTATION_CODE = "quotationCode",
  TOTAL_AMOUNT = "totalAmount",
  CURRENCY = "currency",
  TOTAL_CONVERT_AMOUNT = "totalConvertAmount",
  CONVERT_POINT = "convertPoint",
  RANK = "rank",
  STATUS = "status",
}

const columnsWidth = {
  quotationCode: 150,
  totalAmount: 166,
  currency: 100,
  totalConvertAmount: 160,
  convertPoint: 120,
  rank: 150,
  status: 120,
  overflowMenu: 40,
};

const RoundTable = ({ roundData }: RoundTableProps) => {
  const [translate] = useTranslation();

  const {
    setSelectedEvaluationResult,
    setIsDrawerQuote,
    setHasMultiLayerDrawer,
  } = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);

  const [typeModel, setTypeModel] = useState<ModelType | null>();
  const [currentReview, setCurrentReview] = useState<EvaluationResult>();
  const [isEditDocumentEvaluation, setIsEditDocumentEvaluation] =
    useState(false);

  const showCurrencyTypeColumn = useCallback(() => {
    return roundData?.evaluationResults?.some(
      (item) =>
        item?.quotation?.currency?.code &&
        item?.quotation?.currency?.code !== VND_CURRENCY_UNIT
    );
  }, [roundData]);

  const handleOpenDetailDocumentEvaluationDrawer = (
    data: EvaluationResult,
    canEdit = false
  ) => {
    setCurrentReview(data);
    setTypeModel(ModelType.View);
    setIsEditDocumentEvaluation(canEdit);

    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  const handleDismiss = () => {
    setTypeModel(null);
    setIsEditDocumentEvaluation(false);
    setHasMultiLayerDrawer(false);
    document.body.style.overflow = "unset";
  };

  const renderOverflowMenu = useCallback(
    (data: EvaluationResult) => {
      const list = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOpenDetailDocumentEvaluationDrawer(data),
          isShow: data?.canView,
        },
        // Evaluation
        {
          title: translate("PL.txt_evaluation"),
          action: () => handleOpenDetailDocumentEvaluationDrawer(data, true),
          isShow: data?.canEvaluate,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate]
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
              <OneLineText value={item?.name} />
            </LayoutCell>
          );
        },
      },
      showCurrencyTypeColumn()
        ? {
            title: translate("PL.type_currency_table"),
            key: ColumnKey.CURRENCY,
            dataIndex: ColumnKey.CURRENCY,
            ellipsis: true,
            width: columnsWidth.currency,
            render(_item, record) {
              return (
                <LayoutCell>
                  <OneLineText
                    value={
                      record?.quotation?.currency?.code
                        ? `${record?.quotation?.currency?.code}`
                        : ""
                    }
                    className="bold-text"
                  />
                </LayoutCell>
              );
            },
          }
        : {
            width: 0,
          },
      {
        title: translate("PL.total_original_currency_value"),
        key: ColumnKey.TOTAL_AMOUNT,
        dataIndex: ColumnKey.TOTAL_AMOUNT,
        ellipsis: true,
        align: "end",
        width: columnsWidth.totalAmount,
        render(_, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={
                  record?.totalAmount
                    ? formatNumberToCurrency(
                        record?.totalAmount,
                        record?.quotation?.currency?.code === VND_CURRENCY_UNIT
                          ? 0
                          : 2
                      )
                    : ""
                }
              />
            </LayoutCell>
          );
        },
      },
      showCurrencyTypeColumn()
        ? {
            title: () => (
              <UnitTitle
                title={translate("PL.total_converted_value")}
                unit={translate("PM.payment_currency_unit")}
              />
            ),
            key: ColumnKey.TOTAL_CONVERT_AMOUNT,
            dataIndex: ColumnKey.TOTAL_CONVERT_AMOUNT,
            ellipsis: true,
            align: "end",
            width: columnsWidth.totalConvertAmount,
            render(value) {
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={value ? formatNumberToCurrency(value) : ""}
                  />
                </LayoutCell>
              );
            },
          }
        : { width: 0 },
      {
        title: translate("CM.total_points"),
        key: ColumnKey.CONVERT_POINT,
        dataIndex: ColumnKey.CONVERT_POINT,
        ellipsis: true,
        width: columnsWidth.convertPoint,
        render(_, record) {
          return (
            <LayoutCell>
              {record?.evaluationMethod === EvaluationMethod.Scoring ? (
                <OneLineText
                  value={
                    record?.editedPoint
                      ? formatNumberToCurrency(record?.editedPoint, 2)
                      : ""
                  }
                />
              ) : (
                <OneLineText
                  value={
                    isNil(record?.editedPassFlag)
                      ? ""
                      : getStatusByPassFlag(record?.editedPassFlag)
                  }
                />
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_quote_code"),
        key: ColumnKey.QUOTATION_CODE,
        dataIndex: ColumnKey.QUOTATION_CODE,
        ellipsis: true,
        width: columnsWidth.quotationCode,
        render(_, record) {
          return (
            <LayoutCell>
              <div
                className="truncate"
                onClick={() => {
                  setSelectedEvaluationResult(record);
                  setIsDrawerQuote(true);
                  if (typeof window != "undefined" && window.document) {
                    document.body.style.overflow = "hidden";
                  }
                }}
              >
                <OneLineText
                  className="text-table-content-primary"
                  value={record?.quotationCode || ""}
                />
              </div>
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
          const status = listDocumentEvaluationStatus.find(
            (item) => item.id === value
          );
          return (
            <LayoutCell>
              <Tag
                size="sm"
                value={status.name}
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
    [
      renderOverflowMenu,
      setIsDrawerQuote,
      setSelectedEvaluationResult,
      showCurrencyTypeColumn,
      translate,
    ]
  );

  if (isEmpty(roundData?.evaluationResults)) {
    return (
      <CloudyEmpty
        content={translate("PM.payment_empty_list_expense_reversal_title")}
      />
    );
  }

  return (
    <>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        className="table-view-financial"
        columns={columns}
        dataSource={roundData?.evaluationResults || []}
        isDragable={true}
        scroll={{ y: "calc(100vh - 360px)" }}
        idContainer="table-id"
      />
      {typeModel === ModelType.View && (
        <DetailDocumentEvaluationDrawer
          onPressClose={handleDismiss}
          data={currentReview}
          isEdit={isEditDocumentEvaluation}
          roundData={roundData}
        />
      )}
    </>
  );
};

export default RoundTable;
