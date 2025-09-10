import type { ColumnProps } from "antd/es/table";
import { isEmpty, isNil, round } from "lodash";
import { SelectSupplierTabDefaultProps } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import PriceQuoteTicket from "../GoodServices/PriceQuoteTicket/PriceQuoteTicket";
import styles from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/SelectSupplierTab/Components/GoodServices/GoodServices.module.scss";
import { ColumnKey } from "models/PurchasingPlan";
import { Supplier } from "models/Supplier/Supplier";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import CONSTANT_NUMBER from "config/number";

const SelectInformationSection = ({
  contextValue,
  data,
}: SelectSupplierTabDefaultProps) => {
  const [translate] = useTranslation();
  const { model } = contextValue;

  const isSameVNDCurrency = useMemo(() => {
    return data.every((el: Supplier) => el.currency === VND_CURRENCY_UNIT);
  }, [data]);

  const isHaveVNDCurrency = useMemo(() => {
    return data.some((el: Supplier) => el.currency === VND_CURRENCY_UNIT);
  }, [data]);

  const columns: ColumnProps<Supplier>[] = useMemo(
    () =>
      [
        {
          title: (
            <div className="vertical_baseline">
              {translate("PL.purchasing_plan_supplier_name")}
            </div>
          ),
          ellipsis: true,
          width: 300,
          key: ColumnKey.SUPPLIER_NAME,
          dataIndex: ColumnKey.SUPPLIER_NAME,
          render: (value: string) => {
            return (
              <LayoutCell>
                <OneLineText value={value} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <div className="vertical_baseline">
              {translate("PL.purchasing_plan_supplier_tax_code")}
            </div>
          ),
          ellipsis: true,
          width: 120,
          key: ColumnKey.TAX_CODE,
          dataIndex: ColumnKey.TAX_CODE,
          render: (value: string) => {
            return (
              <LayoutCell>
                <OneLineText value={value} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <div className="vertical_baseline">
              {translate("PL.purchasing_plan_currency")}
            </div>
          ),
          ellipsis: true,
          width: 100,
          key: ColumnKey.CURRENCY,
          dataIndex: ColumnKey.CURRENCY,
          render: (value: string) => {
            return (
              <LayoutCell>
                <OneLineText value={value} useTooltip />
              </LayoutCell>
            );
          },
        },
        !isSameVNDCurrency && {
          title: (
            <div className="vertical_baseline text-right">
              {translate("PL.exchange_rate_label")}
            </div>
          ),
          ellipsis: true,
          width: 120,
          key: ColumnKey.CLOSING_RATE,
          dataIndex: ColumnKey.CLOSING_RATE,
          render: (value: number, record: Supplier) => {
            if (record?.currency === VND_CURRENCY_UNIT) {
              return "";
            }

            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <LayoutCell position="right">
              {translate("PL.drawer_tax_before_money")}
            </LayoutCell>
          ),
          ellipsis: true,
          width: 160,
          key: ColumnKey.AMOUNT_BEFORE_TAX,
          dataIndex: ColumnKey.AMOUNT_BEFORE_TAX,
          render: (value: number, record: Supplier) => {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(value)
                      ? formatCurrency({
                          value,
                          shouldRoundTwoNumber: true,
                          code: record?.currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <LayoutCell position="right">
              {translate("PL.drawer_tax_money")}
            </LayoutCell>
          ),
          ellipsis: true,
          width: 120,
          key: ColumnKey.TAX,
          dataIndex: ColumnKey.TAX,
          render: (value: number, record: Supplier) => {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(value)
                      ? formatCurrency({
                          value,
                          shouldRoundTwoNumber: true,
                          code: record?.currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <LayoutCell position="right">
              {translate("PL.drawer_total_money")}
            </LayoutCell>
          ),
          ellipsis: true,
          width: 120,
          key: ColumnKey.TOTAL_AMOUNT,
          dataIndex: ColumnKey.TOTAL_AMOUNT,
          render: (value: number, record: Supplier) => {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(value)
                      ? formatCurrency({
                          value,
                          shouldRoundTwoNumber: true,
                          code: record?.currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <UnitTitle
              className="text-right"
              title={translate("PL.drawer_exchange_total")}
              unit={"VND"}
            />
          ),
          ellipsis: true,
          width: 120,
          key: ColumnKey.TOTAL_CONVERT_AMOUNT,
          dataIndex: ColumnKey.TOTAL_CONVERT_AMOUNT,
          render: (value: number) => {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(value)
                      ? formatNumber(
                          round(value, CONSTANT_NUMBER.ZERO_FIX_NUMBER)
                        )
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          },
        },
      ].filter((el) => Boolean(el)),
    [isSameVNDCurrency, translate]
  );

  return isEmpty(data) ? (
    <EmptyDocuments isNewVersion />
  ) : (
    <div>
      <StandardTable
        rowKey="id"
        id="table-select-information"
        isDragable
        columns={columns}
        dataSource={data}
        scroll={{ y: "calc(100vh - 320px)" }}
        className={styles["table-price"]}
      />
      <PriceQuoteTicket
        contextValue={contextValue}
        dataExchangeRate={data}
        dataGoodsItems={data}
        isHaveFourColumn={!isSameVNDCurrency && isHaveVNDCurrency}
      />
    </div>
  );
};

export default SelectInformationSection;
