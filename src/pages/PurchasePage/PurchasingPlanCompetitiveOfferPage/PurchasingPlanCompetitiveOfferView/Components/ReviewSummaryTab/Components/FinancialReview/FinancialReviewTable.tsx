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
import "./FinancialReviewTable.scss";

import { listEvaluationResultsStatus } from "config/const";
import { isEqual } from "lodash";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import DetailReviewSupplierDrawer from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/Drawer/DetailReviewSupplierDrawer/DetailReviewSupplierDrawer";
import { EditReviewPurchasingPlan } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/EditReviewPurchasingPlan";
import { RoundType } from "../TechnicalReview/SummaryReviewTable";

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
  const {
    tabKeyParams: tabKey,
    setIsOpenModalSelectSupplier,
    setTempSelectSupplier,
  } = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);

  const [currentReview, setCurrentReview] = useState<
    EvaluationResult | undefined
  >();
  const [isEditDocumentEvaluation, setIsEditDocumentEvaluation] =
    useState(false);

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
        // Select Supplier
        {
          title: translate("PL.txt_review_summary_select_supplier"),
          action: () => {
            setIsOpenModalSelectSupplier(true);
            setTempSelectSupplier(data?.supplier);
          },
          isShow: data?.canEdit,
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
        width: 150,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_evaluate_criterial"),
        key: "editedPoint",
        dataIndex: "editedPoint",
        ellipsis: true,
        width: 150,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
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
          const status = listEvaluationResultsStatus.find((item) =>
            isEqual(item.id, value)
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

      {isEqual(typeModel, ModelType.Edit) && (
        <EditReviewPurchasingPlan
          editReview={currentReview}
          dismiss={handleDismiss}
        />
      )}

      {isEqual(typeModel, ModelType.View) && (
        <DetailReviewSupplierDrawer
          onPressClose={handleDismiss}
          data={currentReview}
        />
      )}
    </>
  );
};

export default FinancialReviewTable;
