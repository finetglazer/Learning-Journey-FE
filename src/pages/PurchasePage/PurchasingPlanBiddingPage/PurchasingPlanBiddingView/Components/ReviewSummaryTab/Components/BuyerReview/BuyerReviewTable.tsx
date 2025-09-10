import { ColumnProps } from "antd/lib/table";
import { Organization } from "models/Organization";
import {
  BuyerEvaluationResult,
  EvaluationResult,
  TabKeyBidder,
} from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import React, { useCallback, useContext, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./BuyerReviewTable.scss";
import { formatNumber, roundTo } from "core/helpers/number";
import DetailReviewSupplierDrawer from "../DetailReviewSupplierDrawer/DetailReviewSupplierDrawer";
import { ModelType, RoundType } from "../TechnicalReview/TechnicalReviewTable";
import { listEvaluationResultsStatus } from "config/const";
import DetailDocumentEvaluationDrawer from "../DetailDocumentEvaluationDrawer/DetailDocumentEvaluationDrawer";

interface Props {
  data: EvaluationResult[];
  roundData?: RoundType;
}
const BuyerReviewTable = ({ data, roundData }: Props) => {
  const [translate] = useTranslation();

  const {
    tabKeyParams: tabKey,
    setIsOpenModalSelectSupplier,
    setTempSelectSupplier,
  } = useContext(PurchasingPlanBiddingDetailHookContext);
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
          isShow:
            evaluationResult?.canEvaluate &&
            tabKey === TabKeyBidder.DocumentEvaluation,
        },
      ];
      if (list.every((item) => !item.isShow)) return null;
      return <OverflowMenu list={list} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, tabKey]
  );

  const columns: ColumnProps<EvaluationResult>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_name"),
        key: "supplier",
        dataIndex: "supplier",
        ellipsis: true,
        render(item) {
          return (
            <LayoutCell>
              <div>
                <OneLineText value={item?.name} />
              </div>
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.purchasing_plan_quote_code"),
        key: "quotationCode",
        dataIndex: "quotationCode",
        ellipsis: true,
        align: "end",
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="text-table-content-primary"
                value={value}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_technique"),
        key: "technique",
        dataIndex: "technique",
        ellipsis: true,
        align: "center",
        children: [
          {
            title: translate("PL.txt_review_summary_assessment_score"),
            key: "buyerEvaluationResult",
            dataIndex: "buyerEvaluationResult",
            ellipsis: true,
            align: "end",
            render(value: BuyerEvaluationResult) {
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumber(roundTo(value?.technicalPoint, 2))}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_conversion_point"),
            key: "buyerEvaluationResult",
            dataIndex: "buyerEvaluationResult",
            ellipsis: true,
            align: "end",
            render(value: BuyerEvaluationResult) {
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumber(value?.technicalConvertPoint)}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_status"),
            key: "buyerEvaluationResult",
            dataIndex: "buyerEvaluationResult",
            ellipsis: true,
            align: "end",
            render(value: BuyerEvaluationResult) {
              const status = listEvaluationResultsStatus.find(
                (item) => item.id === value?.technicalStatus
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
        key: "finance",
        dataIndex: "finance",
        ellipsis: true,
        align: "center",
        children: [
          {
            title: translate("PL.txt_review_summary_total_cost"),
            key: "buyerEvaluationResult",
            dataIndex: "buyerEvaluationResult",
            ellipsis: true,
            align: "end",
            render(value: BuyerEvaluationResult) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value?.totalAmount)} />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_conversion_point"),
            key: "buyerEvaluationResult",
            dataIndex: "buyerEvaluationResult",
            ellipsis: true,
            align: "end",
            render(value: BuyerEvaluationResult) {
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumber(value?.financialConvertPoint)}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: translate("PL.txt_review_summary_status"),
            key: "buyerEvaluationResult",
            dataIndex: "buyerEvaluationResult",
            ellipsis: true,
            align: "end",
            render(value: BuyerEvaluationResult) {
              const status = listEvaluationResultsStatus.find(
                (item) => item.id === value?.financialStatus
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
        title: translate("PL.txt_review_summary_total_conversion_point"),
        key: "totalConvertPoint",
        dataIndex: "buyerEvaluationResult",
        ellipsis: true,
        align: "end",
        render(value: BuyerEvaluationResult) {
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={value?.totalConvertPoint?.toString()}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_ratings"),
        key: "rank",
        dataIndex: "rank",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value} />
            </LayoutCell>
          );
        },
      },

      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: "40px",
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
    [translate, menu]
  );

  return (
    <>
      <div>
        <StandardTable
          className="table-view-buyer"
          rowKey={"id"}
          columns={columns}
          dataSource={data || []}
          isDragable={true}
          scroll={{ y: "calc(100vh - 360px)" }}
          idContainer="table-id"
        />
        {typeModel == ModelType.View &&
          tabKey == TabKeyBidder.ReviewSummary && (
            <DetailReviewSupplierDrawer
              onPressClose={handleDismiss}
              data={currentReview}
            />
          )}
        {typeModel == ModelType.View &&
          tabKey == TabKeyBidder.DocumentEvaluation && (
            <DetailDocumentEvaluationDrawer
              onPressClose={handleDismiss}
              data={currentReview}
              isEdit={isEditDocumentEvaluation}
              roundData={roundData}
            />
          )}
      </div>
    </>
  );
};

export default BuyerReviewTable;
