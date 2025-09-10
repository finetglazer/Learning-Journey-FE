import { type ColumnProps } from "antd/es/table";
import type { ExpandableConfig } from "antd/es/table/interface";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { formatNumber } from "core/helpers/number";
import { isEmpty, round } from "lodash";
import {
  GoodPriceByCategory,
  GoodsItem,
  GoodsServicesCategory,
} from "models/PurchasingPlan";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Quotation } from "models/PurchasingPlan/PurchasingPlanBidder";

import "./TableGoodsServices.scss";
import {
  JPY_CURRENCY_UNIT,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { TYPE_PURCHASING_PLAN } from "models/PurchasingPlan/PurchasingPlanConstant";

export const formatDecimal = (value: number, decimals?: number): string =>
  Number.isInteger(value)
    ? value.toString()
    : value.toFixed(decimals || TWO_NUMBER_FIX);

export const TWO_NUMBER_FIX = 2;
export const FOUR_NUMBER_FIX = 4;
const CURRENCY_VIETNAMDONG = "VND";

export type SummaryDataInfo = {
  id: string;
  renderId: string;
  category: GoodsServicesCategory;
  children: GoodsItem[];
  amount: number;
  amountBeforeTax: number;
  totalAmount: number;
  totalConvertedAmount: number;
  totalTax: number;
  totalOtherCost: number;
};

export const convertSummaryDataInfo = (
  data: GoodsItem[],
  currencyCode: string,
  biddingExchangeRate: number
): SummaryDataInfo[] => {
  return Object.values(
    data.reduce((acc: { [key: string]: SummaryDataInfo }, item: GoodsItem) => {
      const categoryId = item?.category?.id;
      if (categoryId) {
        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: categoryId,
            renderId: categoryId,
            category: item.category,
            children: [],
            amount: numberConstants.ZERO,
            amountBeforeTax: numberConstants.ZERO,
            totalAmount: numberConstants.ZERO,
            totalConvertedAmount: numberConstants.ZERO,
            totalTax: numberConstants.ZERO,
            totalOtherCost: numberConstants.ZERO,
          };
        }

        const rawAmount =
          (item?.supplyQuantity || numberConstants.ZERO) *
          (item.unitPrice || numberConstants.ZERO);
        const amount =
          currencyCode === CURRENCY_VIETNAMDONG
            ? Math.round(rawAmount)
            : parseFloat(formatDecimal(rawAmount, TWO_NUMBER_FIX));

        const totalAmountRaw =
          (amount || numberConstants.ZERO) +
          (item.taxAmount || numberConstants.ZERO);
        const totalAmount = parseFloat(
          formatDecimal(totalAmountRaw, FOUR_NUMBER_FIX)
        );

        const totalConvertedAmountRaw =
          (totalAmount || numberConstants.ZERO) * biddingExchangeRate;
        const totalConvertedAmount = round(totalConvertedAmountRaw);

        const itemWithCalculations: GoodsItem & {
          amount: number;
          totalAmount: number;
          totalConvertedAmount: number;
        } = {
          ...item,
          amount,
          totalAmount,
          totalConvertedAmount,
        };
        acc[categoryId].children.push(itemWithCalculations);
        acc[categoryId].amount += amount;
        acc[categoryId].amountBeforeTax += item?.amountBeforeTax;
        acc[categoryId].totalAmount += totalAmount;
        acc[categoryId].totalConvertedAmount += totalConvertedAmount;
        acc[categoryId].totalTax += item?.taxAmount;
      }
      return acc;
    }, {})
  );
};

export const calculateTotal = (
  records: GoodPriceByCategory[] = [],
  key: keyof GoodPriceByCategory
): number => {
  return records.reduce(
    (sum, record) => sum + (Number(record[key]) || numberConstants.ZERO),
    numberConstants.ZERO
  );
};

export interface TableGoodsServiceProps {
  quotation: Quotation;
}

const TableGoodsService = ({ quotation }: TableGoodsServiceProps) => {
  const [translate] = useTranslation();
  const { model } = useContext(PurchasingPlanBiddingDetailHookContext);

  const currencyCode = quotation?.currency?.code;

  const isIntegerCurrency = useMemo(
    () =>
      currencyCode &&
      [JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT].includes(currencyCode),
    [currencyCode]
  );

  const convertDataByCategory = convertSummaryDataInfo(
    quotation?.quotationInfo || [],
    currencyCode,
    quotation?.quotationInfo?.[numberConstants.ZERO]?.exchangeRate
  );

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        title: (
          <div className={classNames("p-l--xl")}>
            {translate("PL.drawer_goods_services")}
          </div>
        ),
        ellipsis: true,
        width: 240,
        key: "name",
        dataIndex: "name",
        render: (_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell className="m-l--lg">
                <OneLineText
                  useTooltip
                  className="fw-semibold fw-red"
                  value={translate("PR.size_type_goods_services", {
                    size: quotation?.quotationInfo?.length,
                  })}
                />
              </LayoutCell>
            );
          }
          if (!isEmpty(record?.children)) {
            return (
              <LayoutCell className="data-with-collapse">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={record?.category?.name}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="data-with-collapse">
              <TwoLineText
                className="p-l--3xs"
                classNameSecondLine="text-second__style"
                valueLine1={record?.name}
                valueLine2={record?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.description_goods_service_header_table"),
        ellipsis: true,
        width: 220,
        key: "description",
        dataIndex: "description",
        render: (_, record) => {
          if (record?.totalPrice || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.description} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_unit"),
        ellipsis: true,
        width: 90,
        key: "unit",
        dataIndex: "unit",
        render: (_, record) => {
          if (record?.totalPrice || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_quality_buy"),
        ellipsis: true,
        width: 112,
        key: "supplyQuantity",
        dataIndex: "supplyQuantity",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(record?.quantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.supply_quantity_label"),
        ellipsis: true,
        width: 142,
        key: "supplyQuantity",
        dataIndex: "supplyQuantity",
        hidden: model?.purchasePlanType?.id === TYPE_PURCHASING_PLAN.BIDDING,
        render: (supplyQuantity, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={supplyQuantity || 0} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_unit_price")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 140,
        key: "price",
        dataIndex: "price",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(record?.unitPrice)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_total_amount")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 155,
        key: "amountBeforeTax",
        dataIndex: "amountBeforeTax",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalAmount = round(
              calculateTotal(convertDataByCategory, "amountBeforeTax"),
              isIntegerCurrency ? numberConstants.ZERO : TWO_NUMBER_FIX
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold fw-red"
                  value={formatNumber(totalAmount)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotal = round(
              calculateTotal(record.children, "amountBeforeTax"),
              isIntegerCurrency ? numberConstants.ZERO : TWO_NUMBER_FIX
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotal)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(record.amountBeforeTax)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_tax_type"),
        ellipsis: true,
        width: 100,
        key: "taxType",
        dataIndex: "taxType",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText
                useTooltip
                value={
                  record?.tax?.name &&
                  record?.tax?.name +
                    " " +
                    (record?.taxPercent ? record?.taxPercent + "%" : "")
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_tax_money")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 155,
        key: "totalTax",
        dataIndex: "totalTax",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalTax = round(
              calculateTotal(convertDataByCategory, "totalTax"),
              isIntegerCurrency ? numberConstants.ZERO : FOUR_NUMBER_FIX
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold fw-red"
                  value={formatNumber(totalTax)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotalTax = round(
              calculateTotal(record?.children, "taxAmount"),
              isIntegerCurrency ? numberConstants.ZERO : FOUR_NUMBER_FIX
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotalTax)}
                />
              </LayoutCell>
            );
          }
          const decimalTaxAmount = round(
            record?.taxAmount,
            isIntegerCurrency ? numberConstants.ZERO : FOUR_NUMBER_FIX
          );
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(decimalTaxAmount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_total_money")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 155,
        key: "totalAmount",
        dataIndex: "totalAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalAmount = round(
              calculateTotal(convertDataByCategory, "totalAmount"),
              isIntegerCurrency ? numberConstants.ZERO : FOUR_NUMBER_FIX
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold fw-red"
                  value={formatNumber(totalAmount)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotalAmount = round(
              calculateTotal(record.children, "totalAmount"),
              isIntegerCurrency ? numberConstants.ZERO : FOUR_NUMBER_FIX
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotalAmount)}
                />
              </LayoutCell>
            );
          }
          const decimalTotalAmount = round(
            record?.totalAmount,
            isIntegerCurrency ? numberConstants.ZERO : FOUR_NUMBER_FIX
          );
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(decimalTotalAmount)} />
            </LayoutCell>
          );
        },
      },
      currencyCode !== VND_CURRENCY_UNIT
        ? {
            title: () => (
              <UnitTitle
                title={translate("PL.drawer_exchange_total")}
                className="align-items-end"
                unit={CURRENCY_VIETNAMDONG}
              />
            ),
            ellipsis: true,
            width: 155,
            key: "totalConvertedAmount",
            dataIndex: "totalConvertedAmount",
            render: (_, record) => {
              if (record?.isTotal) {
                const totalConvertedAmount = calculateTotal(
                  convertDataByCategory,
                  "totalConvertedAmount"
                );
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      useTooltip
                      className="fw-semibold fw-red"
                      value={formatNumber(totalConvertedAmount)}
                    />
                  </LayoutCell>
                );
              } else if (!isEmpty(record?.children)) {
                const childTotalConvertedAmount = calculateTotal(
                  record.children,
                  "totalConvertedAmount"
                );
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      useTooltip
                      className="fw-semibold"
                      value={formatNumber(childTotalConvertedAmount)}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumber(record.totalConvertedAmount)}
                  />
                </LayoutCell>
              );
            },
          }
        : {
            width: 0,
          },
      {
        title: translate("PL.select_supplier.table.branch_type_required"),
        ellipsis: true,
        width: 200,
        key: "branch",
        dataIndex: "branch",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.branch?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.select_supplier.table.note_request"),
        ellipsis: true,
        width: 200,
        key: "note",
        dataIndex: "note",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.note} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.select_supplier.table.branch_type_quote"),
        ellipsis: true,
        width: 200,
        key: "quoteBranch",
        dataIndex: "quoteBranch",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.quoteBranch?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.select_supplier.table.note_quote"),
        ellipsis: true,
        width: 220,
        key: "quoteNote",
        dataIndex: "quoteNote",
        hidden: model?.purchasePlanType?.id === TYPE_PURCHASING_PLAN.BIDDING,
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.quoteNote} />
            </LayoutCell>
          );
        },
      },
    ],
    [
      convertDataByCategory,
      currencyCode,
      isIntegerCurrency,
      quotation?.quotationInfo?.length,
      translate,
    ]
  );

  const expandable: ExpandableConfig<GoodPriceByCategory> = {
    expandIcon: ({ expanded, onExpand, record }) => {
      if (isEmpty(record?.children)) {
        return null;
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
            alt="expand-icon"
            width={10}
            height={10}
          />
        </div>
      );
    },
  };

  return (
    <div className="table_goods_services-view mt-4">
      <StandardTable
        rowKey="id"
        id="table_goods_services-id"
        columns={columns}
        dataSource={[{ isTotal: true }, ...convertDataByCategory]}
        scroll={{ y: "calc(100vh - 320px)" }}
        expandable={expandable}
        rowClassName={(record) => {
          return record?.isTotal && record?.totalPrice ? "total-row" : "";
        }}
      />
    </div>
  );
};

export default TableGoodsService;
