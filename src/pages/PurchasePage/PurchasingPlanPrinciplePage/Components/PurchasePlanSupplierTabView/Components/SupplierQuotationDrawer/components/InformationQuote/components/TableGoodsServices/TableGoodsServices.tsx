import { type ColumnProps } from "antd/es/table";
import type { ExpandableConfig } from "antd/es/table/interface";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import {
  GoodPriceByCategory,
  GoodsItem,
  GoodsServicesCategory,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import "./TableGoodsServices.scss";

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
            amount: 0,
            totalAmount: 0,
            totalConvertedAmount: 0,
            totalTax: 0,
            totalOtherCost: 0,
          };
        }

        const rawAmount = (item.quantity || 0) * (item.unitPrice || 0);
        const amount =
          currencyCode === CURRENCY_VIETNAMDONG
            ? Math.round(rawAmount)
            : parseFloat(formatDecimal(rawAmount, TWO_NUMBER_FIX));

        const totalAmountRaw =
          (amount || 0) + (item.taxAmount || 0) + (item.otherAmount || 0);
        const totalAmount = parseFloat(
          formatDecimal(totalAmountRaw, FOUR_NUMBER_FIX)
        );

        const totalConvertedAmountRaw =
          (totalAmount || 0) * biddingExchangeRate;
        const totalConvertedAmount = parseFloat(
          formatDecimal(totalConvertedAmountRaw, TWO_NUMBER_FIX)
        );

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
        acc[categoryId].totalAmount += totalAmount;
        acc[categoryId].totalConvertedAmount += totalConvertedAmount;
        acc[categoryId].totalTax += item?.taxAmount;
        acc[categoryId].totalOtherCost += item?.otherAmount;
      }
      return acc;
    }, {})
  );
};

export const calculateTotal = (
  records: GoodPriceByCategory[] = [],
  key: keyof GoodPriceByCategory
): number => {
  return records.reduce((sum, record) => sum + (Number(record[key]) || 0), 0);
};

const TableGoodsService = () => {
  const { translate, model } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
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
                  value={translate("PR.size_type_goods_services", {
                    size: model?.drawerQuotationDetail?.goodsItems?.length,
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
        title: translate("PL.drawer_generic"),
        ellipsis: true,
        width: 130,
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
            <LayoutCell>
              <OneLineText useTooltip value={formatNumber(record?.quantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_unit_price")}
            className="align-items-end"
            unit={
              model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
                ?.quotationRoundDetail?.quotations?.[0]?.currency
            }
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
            unit={
              model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
                ?.quotationRoundDetail?.quotations?.[0]?.currency
            }
          />
        ),
        ellipsis: true,
        width: 155,
        key: "amount",
        dataIndex: "amount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalAmount = calculateTotal(convertDataByCategory, "amount");
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalAmount)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotal = calculateTotal(record.children, "amount");
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
              <OneLineText useTooltip value={formatNumber(record.amount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_tax_type"),
        ellipsis: true,
        width: 140,
        key: "taxType",
        dataIndex: "taxType",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.tax?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_tax_money")}
            className="align-items-end"
            unit={
              model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
                ?.quotationRoundDetail?.quotations?.[0]?.currency
            }
          />
        ),
        ellipsis: true,
        width: 155,
        key: "taxAmount",
        dataIndex: "taxAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalTax = calculateTotal(convertDataByCategory, "taxAmount");
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalTax)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotalTax = calculateTotal(record.children, "taxAmount");
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
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(record.taxAmount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_other_money")}
            className="align-items-end"
            unit={
              model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
                ?.quotationRoundDetail?.quotations?.[0]?.currency
            }
          />
        ),
        ellipsis: true,
        width: 155,
        key: "otherAmount",
        dataIndex: "otherAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalOtherCost = calculateTotal(
              convertDataByCategory,
              "otherAmount"
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalOtherCost)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotalOtherCost = calculateTotal(
              record.children,
              "otherAmount"
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotalOtherCost)}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(record.otherAmount)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_total_money")}
            className="align-items-end"
            unit={
              model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
                ?.quotationRoundDetail?.quotations?.[0]?.currency
            }
          />
        ),
        ellipsis: true,
        width: 155,
        key: "totalAmount",
        dataIndex: "totalAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalAmount = calculateTotal(
              convertDataByCategory,
              "totalAmount"
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalAmount)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotalAmount = calculateTotal(
              record.children,
              "totalAmount"
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
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record.totalAmount)} />
            </LayoutCell>
          );
        },
      },
      {
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
                  className="fw-semibold"
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
              <OneLineText value={formatNumber(record.totalConvertedAmount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_description"),
        ellipsis: true,
        width: 220,
        key: "description",
        dataIndex: "description",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
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
        title: translate("PL.drawer_notes_table"),
        ellipsis: true,
        width: 220,
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
    ],
    [translate, model?.drawerQuotationDetail]
  );

  const convertDataByCategory = convertSummaryDataInfo(
    model?.drawerQuotationDetail?.goodsItems || [],
    model?.originalPurchaseRequest?.currency?.name,
    model?.drawerQuotationDetail?.goodsItems?.[0]?.exchangeRate
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
