import { ColumnProps } from "antd/lib/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { listDocumentEvaluationStatus, listEvaluation } from "config/const";
import { JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT } from "core/config/consts";
import { formatNumber, roundTo } from "core/helpers/number";
import { isEqual, isNil } from "lodash";
import { SupplierModel } from "models/Payment";
import {
  EvaluationResult,
  PurchasingPlanModel,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import DetailReviewSupplierDrawer from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/Drawer/DetailReviewSupplierDrawer/DetailReviewSupplierDrawer";
import { useCallback, useContext, useMemo, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./SummaryReviewTable.scss";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";

export enum ModelType {
  Edit,
  View,
}

export interface RoundType {
  id?: string;
  roundNumber?: number;
}

interface Props {
  data: EvaluationResult[];
}

const TechnicalReviewTable = ({ data }: Props) => {
  const [translate] = useTranslation();
  const [typeModel, setTypeModel] = useState<ModelType | null>();
  const [currentReview, setCurrentReview] = useState<
    EvaluationResult | undefined
  >();

  const { setSelectedEvaluationResult, setIsDrawerQuote } =
    useContext<PurchasingPlanModel>(
      PurchasingPlanCompetitiveOfferDetailHookContext
    );

  const [isEditDocumentEvaluation, setIsEditDocumentEvaluation] =
    useState<boolean>(false);

  const handleEditClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.Edit);
    setIsEditDocumentEvaluation(true);
  };

  const handleViewClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.View);
  };

  const handleReviewClick = (data: EvaluationResult) => {
    setCurrentReview(data);
    setTypeModel(ModelType.View);
  };

  const handleDismiss = () => {
    setCurrentReview(undefined);
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
          isShow: data?.canEdit,
        },
        // Review
        {
          title: translate("PL.txt_evaluation"),
          action: () => handleReviewClick(data),
          isShow: data?.canEvaluate,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate]
  );

  const isShowCurrency = data?.some(
    (item) => item.currency != null && item.currency !== VND_CURRENCY_UNIT
  );

  const columns = useMemo(() => {
    const items: ColumnProps<EvaluationResult>[] = [
      {
        title: () => (
          <div className="p-b--xs">
            {translate("PL.purchasing_plan_supplier_name")}
          </div>
        ),
        key: "supplier",
        dataIndex: "supplier",
        ellipsis: true,
        width: 250,
        render(item: SupplierModel) {
          return (
            <LayoutCell>
              <OneLineText value={item.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">
            {translate("PL.txt_review_summary_ratings")}
          </div>
        ),
        key: "rank",
        dataIndex: "rank",
        ellipsis: true,
        width: 80,
        render(item: SupplierModel) {
          return (
            <LayoutCell>
              <OneLineText value={item?.toString()} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("PL.type_currency_table")}</div>
        ),
        key: "currency",
        dataIndex: "currency",
        ellipsis: true,
        width: 100,
        hidden: !isShowCurrency,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">
            {translate("PL.txt_total_original_currency")}
          </div>
        ),
        key: "totalAmount",
        dataIndex: "totalAmount",
        ellipsis: true,
        width: 180,
        align: "end",
        render(value: number, record) {
          const decimalCurrency = () => {
            const currency = record?.currency;
            if (isEqual(currency, VND_CURRENCY_UNIT || JPY_CURRENCY_UNIT)) {
              return 0;
            }
            return 2;
          };

          return (
            <LayoutCell position="right">
              <OneLineText
                value={value && formatNumber(roundTo(value, decimalCurrency()))}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.txt_total_converted_currency")}
            unit={VND_CURRENCY_UNIT}
            className="text-end"
          />
        ),
        key: "totalConvertAmount",
        dataIndex: "totalConvertAmount",
        ellipsis: true,
        width: 160,
        align: "end",
        hidden: !isShowCurrency,
        render(value: number) {
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={value && formatNumber(roundTo(value, 0))}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("PL.txt_technical_score")}</div>
        ),
        key: "summaryTechnicalPoint",
        dataIndex: "summaryTechnicalPoint",
        ellipsis: true,
        width: 120,
        align: "left",
        render(item, record) {
          if (record?.evaluationMethod === 1) {
            return (
              <LayoutCell position="left">
                <OneLineText
                  useTooltip
                  value={
                    listEvaluation.find(
                      (i) => i.id === record?.summaryTechnicalPassFlag
                    )?.name
                  }
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="left">
              <OneLineText
                useTooltip
                value={!isNil(item) && formatNumber(roundTo(item, 2))}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("PL.txt_financial_score")}</div>
        ),
        key: "summaryQuotationPoint",
        dataIndex: "summaryQuotationPoint",
        ellipsis: true,
        width: 120,
        align: "left",
        render(item) {
          return (
            <LayoutCell position="left">
              <OneLineText
                value={!isNil(item) && formatNumber(roundTo(item, 2))}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("PL.txt_total_point")}</div>
        ),
        key: "summaryPoint",
        dataIndex: "summaryPoint",
        ellipsis: true,
        width: 120,
        align: "left",
        hidden:
          data?.[0]?.evaluationGroupResult?.[0]?.evaluationMethod ===
          TechnicalCompetenceType.TechnicalCriteriaMet,
        render(item) {
          return (
            <LayoutCell position="left">
              <OneLineText
                value={!isNil(item) && formatNumber(roundTo(item, 2))}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">
            {translate("PL.purchasing_plan_quote_code")}
          </div>
        ),
        key: "quotationCode",
        dataIndex: "quotationCode",
        ellipsis: true,
        width: 120,
        render(value: string, record) {
          return (
            <LayoutCell>
              <div
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
                  value={value}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">
            {translate("PL.table_purchase_plan_status")}
          </div>
        ),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: 120,
        render(value: number) {
          const status = listDocumentEvaluationStatus.find((item) =>
            isEqual(item.id, value)
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
    ];

    return items;
  }, [translate, data, menu]);

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

      {(isEqual(typeModel, ModelType.View) ||
        isEqual(typeModel, ModelType.Edit)) &&
        currentReview && (
          <DetailReviewSupplierDrawer
            onPressClose={handleDismiss}
            data={currentReview}
            isEdit={isEditDocumentEvaluation}
            handleViewQuote={() => {
              setSelectedEvaluationResult(currentReview);
              setIsDrawerQuote(true);
              if (typeof window != "undefined" && window.document) {
                document.body.style.overflow = "hidden";
              }
            }}
          />
        )}
    </>
  );
};

export default TechnicalReviewTable;
