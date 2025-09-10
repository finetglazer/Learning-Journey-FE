import { ColumnProps } from "antd/lib/table";
import { EvaluationResult, TabKeyBidder } from "models/PurchasingPlan";
import React, { useCallback, useContext, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { EditReview } from "../EditReview";
import "./FinancialReviewTable.scss";

import DetailReviewSupplierDrawer from "../DetailReviewSupplierDrawer/DetailReviewSupplierDrawer";
import { listEvaluationResultsStatus } from "config/const";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import DetailDocumentEvaluationDrawer from "../DetailDocumentEvaluationDrawer/DetailDocumentEvaluationDrawer";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { RoundType } from "../TechnicalReview/TechnicalReviewTable";

enum ModelType {
  Edit,
  View,
}

interface Props {
  data: EvaluationResult[];
  roundData?: RoundType;
}

const FinancialReviewTable = ({ data, roundData }: Props) => {
  const [translate] = useTranslation();
  const [typeModel, setTypeModel] = useState<ModelType | null>();
  const { tabKeyParams: tabKey } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const [currentReview, setCurrentReview] = useState<
    EvaluationResult | undefined
  >();
  const [isEditDocumentEvaluation, setIsEditDocumentEvaluation] =
    useState(false);

  const handleEditClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.Edit);
  };

  const handleViewClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.View);
  };

  const handleReviewClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.View);
    setIsEditDocumentEvaluation(true);
  };

  const handleDismiss = () => {
    setTypeModel(null);
    setIsEditDocumentEvaluation(false);
  };

  const menu = useCallback(
    (data: EvaluationResult) => {
      const list = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleViewClick(data),
          isShow: data?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => handleEditClick(data),
          isShow: data.canEdit && tabKey == TabKeyBidder.ReviewSummary,
        },
        // Review
        {
          title: translate("PL.txt_evaluation"),
          action: () => handleReviewClick(data),
          isShow:
            data?.canEvaluate && tabKey == TabKeyBidder.DocumentEvaluation,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [tabKey, translate]
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
        dataIndex: "supplier",
        ellipsis: true,
        align: "end",
        width: 150,
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="text-table-content-primary"
                value={item?.taxCode}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_total_cost"),
        key: "totalAmount",
        dataIndex: "totalAmount",
        ellipsis: true,
        align: "end",
        width: 150,
        render(value) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumberToCurrency(value, 2)} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_conversion_point"),
        key: "convertPoint",
        dataIndex: "convertPoint",
        ellipsis: true,
        align: "end",
        width: 150,
        render(value) {
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(value, 2)}
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
        align: "end",
        width: 150,
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: 120,
        render(value) {
          const status = listEvaluationResultsStatus.find(
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

      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: "40px",
        align: "center",
        render(id: number, record) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [menu, translate]
  );

  return (
    <>
      <div>
        <StandardTable
          className="table-view-financial"
          rowKey={"id"}
          columns={columns}
          dataSource={data || []}
          isDragable={true}
          scroll={{ y: "calc(100vh - 360px)" }}
          idContainer="table-id"
        />
      </div>

      {typeModel == ModelType.Edit && (
        <EditReview editReview={currentReview} dismiss={handleDismiss} />
      )}
      {typeModel == ModelType.View && tabKey == TabKeyBidder.ReviewSummary && (
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
    </>
  );
};

export default FinancialReviewTable;
