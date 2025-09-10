import { ColumnProps } from "antd/lib/table";
import {
  EvaluationMethod,
  EvaluationResult,
  TabKeyBidder,
} from "models/PurchasingPlan";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { RoundType, ModelType } from "../TechnicalReview/TechnicalReviewTable";
import { formatNumber } from "core/helpers/number";
import { listEvaluation, listEvaluationResultsStatus } from "config/const";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import DetailDocumentEvaluationDrawer from "../DetailDocumentEvaluationDrawer/DetailDocumentEvaluationDrawer";
import { formatDecimal } from "core/helpers/currency";
import CONSTANT_NUMBER from "config/number";
import "./TableRoundReview.scss";
import { isEqual } from "lodash";

interface Props {
  data: EvaluationResult[];
  roundData?: RoundType;
}

const TableRoundReview = ({ data, roundData }: Props) => {
  const {
    model,
    tabKeyParams: tabKey,
    setIsOpenModalSelectSupplier,
    setTempSelectSupplier,
    setSelectedEvaluationResult,
    setIsDrawerQuote,
  } = useContext(PurchasingPlanBiddingDetailHookContext);
  const [translate] = useTranslation();
  const [typeModel, setTypeModel] = useState<ModelType | null>();
  const [currentReview, setCurrentReview] = useState<
    EvaluationResult | undefined
  >();
  const [isEditDocumentEvaluation, setIsEditDocumentEvaluation] =
    useState(false);

  const handleViewClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.View);
    setIsEditDocumentEvaluation(false);
  };

  const handleDismiss = () => {
    setTypeModel(null);
    setCurrentReview(undefined);
  };

  const handleReviewClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.View);
    setIsEditDocumentEvaluation(true);
  };

  const menu = useCallback(
    (evaluationResult: EvaluationResult) => {
      const list = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleViewClick(evaluationResult),
          isShow: evaluationResult?.canView,
        },
        // Edit
        {
          title: translate("PL.txt_review_summary_select_supplier"),
          action: () => {
            setIsOpenModalSelectSupplier(true);
            setTempSelectSupplier(evaluationResult?.supplier);
          },
          isShow:
            evaluationResult?.canEdit && tabKey === TabKeyBidder.ReviewSummary,
        },
        // Review
        {
          title: translate("PL.txt_evaluation"),
          action: () => handleReviewClick(evaluationResult),
          isShow: evaluationResult?.canEvaluate,
          // && tabKey === TabKeyBidder.DocumentEvaluation,
        },
      ];
      if (list.every((item) => !item.isShow)) return null;
      return <OverflowMenu list={list} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  );

  const columns: ColumnProps<EvaluationResult>[] = useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_name"),
        key: "supplier",
        dataIndex: "supplier",
        ellipsis: true,
        width: 364,
        render(item) {
          return (
            <LayoutCell position="left">
              <div>
                <OneLineText value={item?.name} />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_technique"),
        key: "evaluationGroupResult",
        dataIndex: "evaluationGroupResult",
        ellipsis: true,
        align: "center",
        children: [
          {
            title: translate("PL.totalPass"),
            key: "summaryTechnicalPassFlag",
            dataIndex: "summaryTechnicalPassFlag",
            ellipsis: true,
            align: "left",
            width: 120,
            render(value: number) {
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={listEvaluation.find((i) => i.id === value)?.name}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.totalScore"),
            key: "summaryTechnicalPoint",
            dataIndex: "summaryTechnicalPoint",
            ellipsis: true,
            align: "left",
            width: 130,
            render(value: number) {
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={formatDecimal(value, CONSTANT_NUMBER.TWO_NUMBER_FIX)}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_status"),
            key: "technicalStatus",
            dataIndex: "technicalStatus",
            ellipsis: true,
            align: "left",
            width: 108,
            render(value: number) {
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
        ] as any,
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_finance"),
        key: "evaluationGroupResult",
        dataIndex: "evaluationGroupResult",
        ellipsis: true,
        align: "center",
        children: [
          {
            title: translate("PL.txt_review_summary_total_cost"),
            key: "totalAmount",
            dataIndex: "totalAmount",
            ellipsis: true,
            align: "end",
            width: 200,
            render(value: number) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_currency_type"),
            key: "currency",
            dataIndex: "currency",
            ellipsis: true,
            align: "left",
            width: 100,
            hidden: data?.some(
              (item) =>
                item?.id === roundData?.id &&
                isEqual(
                  item?.financialEvaluationMethod,
                  EvaluationMethod.PassFail
                )
            ),
            render(value: string) {
              return (
                <LayoutCell position="left">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_total_quotation"),
            key: "summaryQuotationPoint",
            dataIndex: "summaryQuotationPoint",
            ellipsis: true,
            align: "left",
            width: 100,
            hidden: data?.some(
              (item) =>
                item?.financialEvaluationMethod === EvaluationMethod.Scoring
            ),
            render(value: number) {
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={formatDecimal(value, CONSTANT_NUMBER.TWO_NUMBER_FIX)}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_total_criteria"),
            key: "summaryFinancialPoint",
            dataIndex: "summaryFinancialPoint",
            ellipsis: true,
            align: "left",
            width: 120,
            hidden: data?.some(
              (item) =>
                item?.financialEvaluationMethod === EvaluationMethod.Scoring
            ),
            render(value: number, record: EvaluationResult) {
              if (
                record?.financialEvaluationMethod === EvaluationMethod.PassFail
              ) {
                return (
                  <LayoutCell position="left">
                    <OneLineText
                      value={
                        listEvaluation.find(
                          (i) => i.id === record?.summaryFinancialPassFlag
                        )?.name
                      }
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={formatDecimal(value, CONSTANT_NUMBER.TWO_NUMBER_FIX)}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_point_summary"),
            key: "summaryPoint",
            dataIndex: "summaryPoint",
            ellipsis: true,
            align: "left",
            width: 100,
            hidden: data?.some(
              (item) =>
                item?.financialEvaluationMethod === EvaluationMethod.PassFail
            ),
            render(value: number) {
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={formatDecimal(value, CONSTANT_NUMBER.TWO_NUMBER_FIX)}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_status"),
            key: "financialStatus",
            dataIndex: "financialStatus",
            ellipsis: true,
            align: "left",
            width: 108,
            render(value: number) {
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
        ],
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 40,
        align: "center",
        render(id: number, record: EvaluationResult) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [translate, menu, data]
  );

  return (
    <div>
      <StandardTable
        className="table-view-buyer"
        rowKey={"id"}
        columns={columns}
        dataSource={data || []}
        isDragable={true}
        tableLayout="fixed"
        scroll={{ y: "calc(100vh - 360px)" }}
        idContainer="table-id"
      />

      {typeModel == ModelType.View && tabKey == TabKeyBidder.ReviewSummary && (
        <DetailDocumentEvaluationDrawer
          onPressClose={handleDismiss}
          data={currentReview}
          isEdit={isEditDocumentEvaluation}
          roundData={roundData}
          handleViewQuote={() => {
            setSelectedEvaluationResult(currentReview);
            setIsDrawerQuote(true);
            if (typeof window != "undefined" && window.document) {
              document.body.style.overflow = "hidden";
            }
          }}
        />
      )}
    </div>
  );
};

export default TableRoundReview;
