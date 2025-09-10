import styles from "../GoodServices.module.scss";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ColumnKey } from "models/PurchasingPlan";
import { SelectSupplierTabDefaultProps } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import { Supplier } from "models/Supplier/Supplier";
import { VND_CURRENCY } from "models/Payment";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { formatNumber } from "core/helpers/number";

interface Props extends SelectSupplierTabDefaultProps {
  isHaveSupplier?: boolean;
}

const SupplierTable = (props: Props) => {
  const { contextValue, isHaveSupplier = true, data } = props;
  const [translate] = useTranslation();

  const isSameCurrency = useMemo(() => {
    const firstCurrency = data[0]?.currency;
    const checkSameCurrency = data
      ?.map((item: Supplier) => item?.currency)
      ?.every((item: string) => item === firstCurrency);
    return checkSameCurrency !== VND_CURRENCY;
  }, [data]);

  const columnSupplier = useMemo(() => {
    return [
      {
        title: (
          <div className="vertical_baseline">
            {translate("PL.purchasing_plan_supplier_name")}
          </div>
        ),
        ellipsis: true,
        width: 400,
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
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
        width: 80,
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
      isSameCurrency && {
        title: (
          <div className="vertical_baseline text-right">
            {translate("PL.exchange_rate_label")}
          </div>
        ),
        ellipsis: true,
        width: 100,
        key: ColumnKey.CLOSING_RATE,
        dataIndex: ColumnKey.CLOSING_RATE,
        render: (value: number, record: { currency: string }) => {
          if (record?.currency === VND_CURRENCY_UNIT) {
            return null;
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
          <div className="vertical_baseline">
            {translate("PL.drawer_address_supplier")}
          </div>
        ),
        ellipsis: true,
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        render: (value: string) => {
          return (
            <LayoutCell>
              <OneLineText value={value} useTooltip />
            </LayoutCell>
          );
        },
      },
    ].filter((el) => Boolean(el));
  }, [isSameCurrency, translate]);

  return (
    <StandardTable
      rowKey="id"
      isDragable
      columns={columnSupplier}
      dataSource={data}
      scroll={{ y: "calc(100vh - 320px)" }}
      className={styles["table-price"]}
    />
  );
};

export default SupplierTable;
