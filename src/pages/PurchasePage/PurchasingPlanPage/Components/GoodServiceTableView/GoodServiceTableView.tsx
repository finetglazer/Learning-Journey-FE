import type { ExpandableConfig } from "antd/es/table/interface";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { formatNumber } from "core/helpers/number";
import { isEmpty, isEqual, round, size } from "lodash";
import { GoodPriceByCategory, GoodsPrice } from "models/PurchasingPlan";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  calculateTotal,
  convertToVNDCurrency,
  groupDataByCategory,
} from "../../PurchasingPlanDetail/SelectSupplierTab/Components/SelectSupplierSection/Components/GoodsServiceTable/helpers";

import { ColumnProps } from "antd/lib/table";
import { VIETNAMESE_CURRENCY } from "../../PurchasingPlanDetail/SelectSupplierTab/Components/SelectSupplierSection/SelectSupplierSection";
import "./GoodServiceTableView.scss";

export interface GoodsServiceTableViewProps {
  goodsPrices: GoodsPrice[];
  currencyCode: string;
  biddingExchangeRate: number;
}

const GoodsServiceTableView: React.FC<GoodsServiceTableViewProps> = ({
  goodsPrices,
  currencyCode,
  biddingExchangeRate,
}) => {
  const [translate] = useTranslation();

  const groupedDataByCategory: GoodPriceByCategory[] = useMemo(
    () => groupDataByCategory(goodsPrices, currencyCode, biddingExchangeRate),
    [goodsPrices, currencyCode, biddingExchangeRate]
  );

  const columns: ColumnProps<GoodPriceByCategory>[] = useMemo(
    () => [
      {
        title: (
          <div className={classNames("p-l--xl")}>
            {translate("PL.goods_services_label")}
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
                    size: size(goodsPrices),
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
                  className="collapse_text"
                  value={record?.category?.name}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="data-with-collapse">
              <TwoLineText
                className="p-l--3xs"
                classNameFirstLine="first_line_style"
                classNameSecondLine="text-second__style"
                valueLine1={record?.goodsItem?.name}
                valueLine2={record?.goodsItem?.code}
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
        title: translate("PL.unit_label"),
        ellipsis: true,
        width: 90,
        key: "unit",
        dataIndex: "unit",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.goodsItem?.unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchase_quantity_label"),
        ellipsis: true,
        width: 112,
        key: "supplyQuantityUser",
        dataIndex: "supplyQuantityUser",
        render: (supplyQuantityUser, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(supplyQuantityUser || 0)}
              />
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
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(record?.supplyQuantity)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.unit_price_label")}
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
              <OneLineText useTooltip value={formatNumber(record?.price)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.amount_label")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 155,
        key: "amount",
        dataIndex: "amount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalAmount = round(
              calculateTotal(groupedDataByCategory, "amount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 2
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
            const childTotal = round(
              calculateTotal(record.children, "amount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 2
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
              <OneLineText useTooltip value={formatNumber(record.amount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.tax_type_label"),
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
              <OneLineText useTooltip value={record?.tax?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.tax_label")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 160,
        key: "taxAmountQuotation",
        dataIndex: "taxAmountQuotation",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalTax = round(
              calculateTotal(groupedDataByCategory, "totalTax"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
            );
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
            const childTotalTax = round(
              calculateTotal(record.children, "taxAmountQuotation"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
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
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(record.taxAmountQuotation || 0)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.total_amount_label")}
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
              calculateTotal(groupedDataByCategory, "totalAmount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
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
            const childTotalAmount = round(
              calculateTotal(record.children, "totalAmount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
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
            title={translate("PL.total_converted_amount_label")}
            className="align-items-end"
            unit={VIETNAMESE_CURRENCY}
          />
        ),
        hidden: isEqual(currencyCode, VIETNAMESE_CURRENCY),
        ellipsis: true,
        width: 155,
        key: "totalConvertedAmount",
        dataIndex: "totalConvertedAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalConvertedAmount = convertToVNDCurrency(
              calculateTotal(groupedDataByCategory, "totalAmount") *
                biddingExchangeRate
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
        title: translate("PL.brand_category_label"),
        ellipsis: true,
        width: 130,
        key: "manufacturer",
        dataIndex: "manufacturer",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText
                useTooltip
                value={record?.goodsItem?.manufacturer?.name}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.note_label"),
        ellipsis: true,
        key: "note",
        width: 220,
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
    [
      translate,
      currencyCode,
      goodsPrices,
      groupedDataByCategory,
      biddingExchangeRate,
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

  const dataSource = useMemo(() => {
    const totalRow: GoodPriceByCategory = {
      isTotal: true,
      amount: calculateTotal(groupedDataByCategory, "amount"),
      totalAmount: calculateTotal(groupedDataByCategory, "totalAmount"),
      totalConvertedAmount: calculateTotal(
        groupedDataByCategory,
        "totalConvertedAmount"
      ),
      totalTax: calculateTotal(groupedDataByCategory, "totalTax"),
      category: null,
      children: [],
    };

    return [totalRow, ...groupedDataByCategory];
  }, [groupedDataByCategory]);

  return (
    <div className="goods_service_table_view">
      <StandardTable
        rowKey="id"
        id="goods-service-table"
        isDragable
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: "calc(100vh - 320px)" }}
        expandable={expandable}
        rowClassName={(record) => {
          return record?.isTotal ? "total-row" : "";
        }}
      />
    </div>
  );
};

export default GoodsServiceTableView;
