import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { detectIntegerCurrency } from "core/helpers/currency";
import { addNumbers, formatNumber } from "core/helpers/number";
import { size } from "lodash";
import { ProposalCreateModel } from "models/Proposal";
import {
  SummaryItem,
  SummaryItemByCategory,
} from "models/Proposal/GoodService";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import { useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./GeneralGoodsServicesTable.scss";
import { convertSummaryData } from "./helper";

const GeneralGoodsServicesTable = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const roundNum = detectIntegerCurrency(model?.currency?.code) ? 0 : 4;

  const columns: ColumnProps<SummaryItem | SummaryItemByCategory>[] = [
    {
      title: (
        <div className="p-l--md">{translate("PP.text_goods_services")}</div>
      ),
      ellipsis: true,
      width: 240,
      fixed: "left",
      key: "id",
      render: (record) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="m-l--sm">
              <OneLineText
                useTooltip
                value={translate("PP.txt_size_type_goods_services", {
                  size: size(model?.itemsSummary),
                })}
              />
            </LayoutCell>
          );
        }
        if ("children" in record) {
          return (
            <LayoutCell className="data-with-collapse">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={(record as SummaryItemByCategory)?.categoryName}
              />
            </LayoutCell>
          );
        }

        return (
          <LayoutCell className="data-with-collapse">
            <CellCustom
              line1={(record as SummaryItem)?.name}
              line2={(record as SummaryItem)?.code}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.general_txt_quantity_proposal")}
          unit={" "}
        />
      ),
      ellipsis: true,
      width: 100,
      align: "right",
      render: (record: SummaryItem | SummaryItemByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumber(
                  model?.itemsSummary?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return addNumbers(
                        prev,
                        curr?.purchaseProposalQuantity || 0
                      );
                    },
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }

        if ("children" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumber(
                  (record as SummaryItemByCategory)?.children?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return prev + (curr?.purchaseProposalQuantity || 0);
                    },
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              value={formatNumber(
                (record as SummaryItem)?.purchaseProposalQuantity
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.general_txt_total_proposal")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      align: "right",
      width: 100,
      render: (record: SummaryItem | SummaryItemByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  model?.itemsSummary?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return prev + (curr?.purchaseProposalTotalAmount || 0);
                    },
                    0
                  ),
                  roundNum
                )}
              />
            </LayoutCell>
          );
        }
        if ("children" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  (record as SummaryItemByCategory)?.children?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return prev + (curr?.purchaseProposalTotalAmount || 0);
                    },
                    0
                  ),
                  roundNum
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              value={formatNumberToCurrency(
                (record as SummaryItem)?.purchaseProposalTotalAmount,
                roundNum
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.general_txt_remaining_quantity")}
          unit={" "}
        />
      ),
      ellipsis: true,
      align: "right",
      width: 100,
      render: (record: SummaryItem | SummaryItemByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumber(
                  model?.itemsSummary?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return addNumbers(prev, curr?.remainingQuantity || 0);
                    },
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        if ("children" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumber(
                  (record as SummaryItemByCategory)?.children?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return prev + (curr?.remainingQuantity || 0);
                    },
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              value={formatNumber((record as SummaryItem)?.remainingQuantity)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.general_txt_remaining_value")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      align: "right",
      width: 100,
      render: (record: SummaryItem | SummaryItemByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  model?.itemsSummary?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return prev + (curr?.remainingTotalAmount || 0);
                    },
                    0
                  ),
                  roundNum
                )}
              />
            </LayoutCell>
          );
        }
        if ("children" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                className="fw-semibold"
                value={formatNumberToCurrency(
                  (record as SummaryItemByCategory)?.children?.reduce(
                    (prev: number, curr: SummaryItem) => {
                      return prev + (curr?.remainingTotalAmount || 0);
                    },
                    0
                  ),
                  roundNum
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              value={formatNumberToCurrency(
                (record as SummaryItem)?.remainingTotalAmount,
                roundNum
              )}
            />
          </LayoutCell>
        );
      },
    },
  ];

  const convertDataByCategory = convertSummaryData(model?.itemsSummary || []);

  return (
    <div className="general-goods-services-table-wrapper">
      <div className="header">
        <div className="title">
          {translate("PP.title_general_goods_services")}
        </div>
      </div>
      <div className="body m-t--xs">
        <StandardTable
          dataSource={[{ isTotal: true }, ...convertDataByCategory]}
          scroll={{ y: "calc(100vh -320px)" }}
          rowKey={(record) => {
            return record?.renderId || record?.categoryId;
          }}
          columns={columns}
          rowClassName={(record) => {
            return record.isTotal ? "total-row" : "";
          }}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) => {
              if (!record.children || record.children.length === 0) {
                return <div className="table__width-8" />;
              }
              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(record, e);
                  }}
                >
                  <img
                    className={classNames("cursor-pointer m-x--3xs", {
                      "rotate-180": expanded,
                      "rotate-0": !expanded,
                    })}
                    src={IcArrowDown}
                    alt="img"
                    width={10}
                    height={10}
                  />
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
};

const CellCustom = ({ line1, line2 }: { line1: string; line2: string }) => {
  return (
    <Tooltip
      placement="topLeft"
      className="w-100"
      title={
        <>
          <div>{line1}</div>
          <div>{line2}</div>
        </>
      }
    >
      <div>
        <div className="table__cell_text_top">{line1}</div>
        <div className="table__cell_text_below">{line2}</div>
      </div>
    </Tooltip>
  );
};

export default GeneralGoodsServicesTable;
