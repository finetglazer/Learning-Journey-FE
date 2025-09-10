import { ColumnProps } from "antd/lib/table";
import { getIconFile } from "core/helpers/common";
import { formatNumber, roundTo } from "core/helpers/number";
import { RequestAttachment } from "models/Contract";
import {
  BuyerEvaluationResult,
  EvaluationResult,
  ViewRole,
} from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import React, { useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./SelectedSupplier.scss";

const SelectedSupplier = () => {
  const { model, ...contextValue } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const [translate] = useTranslation();

  const columns: ColumnProps<EvaluationResult>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_name"),
        key: "supplier.name",
        dataIndex: "supplier.name",
        ellipsis: true,
        render(_text, record: EvaluationResult) {
          return (
            <LayoutCell>
              <OneLineText
                className="text-table-content-primary"
                value={record?.supplier?.name}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.purchasing_plan_quote_code"),
        key: "quotationCode",
        dataIndex: "quotationCode",
        ellipsis: true,
        align: "start",
        render(value: string) {
          return (
            <LayoutCell position="left">
              <div onClick={() => contextValue.setIsDrawerQuote(true)}>
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
        title: translate("PL.review_summary.technique"),
        key: "evaluationPoint",
        dataIndex: "evaluationPoint",
        ellipsis: true,
        align: "center",
        children: [
          {
            title: translate("PL.txt_review_summary_assessment_score"),
            key: "evaluationPoint",
            dataIndex: "evaluationPoint",
            ellipsis: true,
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
            align: "end",
            render(value: string) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={value} />
                </LayoutCell>
              );
            },
          },
        ],
      },
      {
        title: translate("PL.review_summary.financial"),
        key: "adjustmentDescription",
        dataIndex: "adjustmentDescription",
        ellipsis: true,
        align: "center",
        children: [
          {
            title: translate("PL.txt_review_summary_total_cost"),
            key: "totalAmount",
            dataIndex: "totalAmount",
            ellipsis: true,
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
            key: "nonkey",
            dataIndex: "nonkey",
            ellipsis: true,
            align: "end",
            render(value: string) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={value} />
                </LayoutCell>
              );
            },
          },
        ],
      },
      {
        title: translate("PL.txt_review_summary_total_conversion_point"),
        key: "totalConvertPoint",
        dataIndex: "totalConvertPoint",
        ellipsis: true,
        align: "end",
        render(value) {
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={""} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.review_summary.attach_files"),
        key: "attachments",
        dataIndex: "attachments",
        ellipsis: true,
        align: "end",
        render(value) {
          return (
            <LayoutCell position="right" className="row pt-2">
              {(value ?? []).map((item: RequestAttachment, index: number) => {
                return (
                  <UploadFile.FileLoadedContent
                    className={"col-12"}
                    key={index}
                    file={item}
                    onClickFile={() =>
                      contextValue.handleDownloadFileAttached(item)
                    }
                    isViewMode
                    icon={
                      <img
                        src={getIconFile(item)}
                        alt="img"
                        width={24}
                        height={24}
                      />
                    }
                  />
                );
              })}
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const buyerColumns: ColumnProps<EvaluationResult>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_name"),
        key: "supplier.name",
        dataIndex: "supplier.name",
        ellipsis: true,
        render(_text, record: EvaluationResult) {
          return (
            <LayoutCell>
              <OneLineText
                className="text-table-content-primary"
                value={record?.supplier?.name}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_quote_code"),
        key: "quotationCode",
        dataIndex: "quotationCode",
        ellipsis: true,
        align: "start",
        render(value: string) {
          return (
            <LayoutCell position="left">
              <div onClick={() => contextValue.setIsDrawerQuote(true)}>
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
        title: translate("PL.review_summary.technique"),
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
        ],
      },
      {
        title: translate("PL.review_summary.financial"),
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
        ],
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
        title: translate("PL.review_summary.attach_files"),
        key: "attachments",
        dataIndex: "attachments",
        ellipsis: true,
        align: "end",
        render(value) {
          return (
            <LayoutCell position="right" className="row pt-2">
              {(value ?? []).map((item: RequestAttachment, index: number) => {
                return (
                  <UploadFile.FileLoadedContent
                    className={"col-12"}
                    key={index}
                    file={item}
                    onClickFile={() =>
                      contextValue.handleDownloadFileAttached(item)
                    }
                    isViewMode
                    icon={
                      <img
                        src={getIconFile(item)}
                        alt="img"
                        width={24}
                        height={24}
                      />
                    }
                  />
                );
              })}
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const getColumnByRole = () => {
    switch (model?.viewRole) {
      case ViewRole.Buyer:
        return buyerColumns;
      default:
        return columns;
    }
  };

  return (
    <div className="selected-supplier-wrapper">
      <StandardTable
        className={"table-view"}
        columns={getColumnByRole()}
        rowKey={"id"}
        dataSource={[contextValue?.approvalSupplier]}
        isDragable={true}
        scroll={{ y: "calc(100vh - 360px)" }}
        idContainer="table-id"
      />
    </div>
  );
};

export default SelectedSupplier;
