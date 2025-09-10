import { ColumnProps } from "antd/lib/table";
import { listEvaluationResultsStatus } from "config/const";
import { formatNumber, roundTo } from "core/helpers/number";
import {
  EvaluationResult,
  PassFlag,
  TabKeyBidder,
  ViewRole,
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
import { getStatusByPassFlag } from "../../helper";
import DetailReviewSupplierDrawer from "../DetailReviewSupplierDrawer/DetailReviewSupplierDrawer";
import "./TechnicalReviewTable.scss";
import { EditReview } from "../EditReview";
import DetailDocumentEvaluationDrawer from "../DetailDocumentEvaluationDrawer/DetailDocumentEvaluationDrawer";
import { SupplierModel } from "models/Payment";
import { isNil } from "lodash";

export enum ModelType {
  Edit,
  View,
}

export interface RoundType {
  id?: string;
  roundNumber?: number;
  isResultConfirmed?: boolean;
  isResultSummarized?: boolean;
  isFinancialEvaluationCompleted?: boolean;
  isTechnicalEvaluationCompleted?: boolean;
}

interface Props {
  data: EvaluationResult[];
  roundData: RoundType;
}

const TechnicalReviewTable = ({ data, roundData }: Props) => {
  const [translate] = useTranslation();
  const { model, tabKeyParams: tabKey } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );
  const [typeModel, setTypeModel] = useState<ModelType | null>();
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
          isShow: data?.canEdit && tabKey == TabKeyBidder.ReviewSummary,
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
    [translate, tabKey]
  );

  const columns: ColumnProps<EvaluationResult>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_name"),
        key: "supplier",
        dataIndex: "supplier",
        ellipsis: true,
        width: 180,
        render(item: SupplierModel) {
          return (
            <LayoutCell>
              <div>
                <OneLineText value={item.name} />
              </div>
            </LayoutCell>
          );
        },
      },
      ...([
        ViewRole.TechnicalLeader,
        ViewRole.FinancialLeader,
        ViewRole.ProjectDirector,
      ].includes(model?.viewRole)
        ? [
            {
              title: translate("PL.txt_review_summary_pass_criteria"),
              key: "editedPassFlag",
              dataIndex: "editedPassFlag",
              ellipsis: true,
              width: 150,
              align: "end" as any,
              render(item: PassFlag) {
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      value={!isNil(item) ? getStatusByPassFlag(item) : "---"}
                    />
                  </LayoutCell>
                );
              },
            },
          ]
        : []),
      {
        title: translate("PL.txt_review_summary_maximum_score"),
        key: "maximumPoint",
        dataIndex: "maximumPoint",
        ellipsis: true,
        width: 150,
        align: "end",
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_minimum_passing_score"),
        key: "minimumPoint",
        dataIndex: "minimumPoint",
        align: "end",
        ellipsis: true,
        width: 150,
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_assessment_score"),
        key: "evaluationPoint",
        dataIndex: "evaluationPoint",
        ellipsis: true,
        width: 150,
        align: "end",
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_conversion_point"),
        key: "convertPoint",
        dataIndex: "convertPoint",
        ellipsis: true,
        width: 150,
        align: "end",
        render(value) {
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(roundTo(value, 2))} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_ratings"),
        key: "rank",
        dataIndex: "rank",
        ellipsis: true,
        width: 150,
        align: "end",
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
        width: 150,
        render(value: number) {
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
        width: 40,
        render(id: number, record) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [translate, model?.viewRole, menu]
  );

  return (
    <>
      <div>
        <StandardTable
          className="table-view-technical"
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

export default TechnicalReviewTable;
