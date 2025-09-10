import type { ColumnProps } from "antd/es/table";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty } from "lodash";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { ColumnKey, GoodsItem } from "models/PurchasingPlan";
import {
  IExchangeRateTable,
  SelectSupplierTabDefaultProps,
} from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useCallback, useMemo } from "react";
import {
  FormItem,
  InputNumber,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface Props extends SelectSupplierTabDefaultProps {
  data: IExchangeRateTable[];
}

interface changeItemProps {
  value: number;
  id: string;
  indexBeforeValidate?: number;
}

const ExchangeRateTableSection = ({ data, contextValue }: Props) => {
  const [translate] = useTranslation();

  const { model, handleChangeAllField } = contextValue;

  const handleChangeClosingRate = useCallback(
    (props: changeItemProps) => {
      const { value, id } = props;
      const validValue = value || 0;
      const checkModelIsExist =
        model?.selectSupplier?.supplierGoodsItems?.length > 0;
      if (!checkModelIsExist) return;

      const exchangeRates = data?.map((item: IExchangeRateTable) => {
        if (id === item.supplierId) {
          return {
            ...item,
            closingRate: value,
          };
        }
        return item;
      });

      const editSelectedGoods = [
        ...model.selectSupplier.supplierGoodsItems,
      ].map((item: GoodServiceByCategory) => {
        if (!item) return null;

        const indexSupplier = item.goodsItems?.findIndex(
          (el: GoodsItem) => el?.supplier?.id === id
        );

        if (indexSupplier >= 0) {
          return {
            ...item,
            goodsItems: item.goodsItems.map(
              (el: GoodServiceByCategory, index: number) => {
                if (indexSupplier === index) {
                  const convertedAmountBeforeTax =
                    el.amountBeforeTax * validValue;
                  const taxConvertedAmount = el.taxAmount * validValue;
                  const totalConvertedAmount = el.totalAmount * validValue;

                  return {
                    ...el,
                    taxConvertedAmount,
                    totalConvertedAmount,
                    convertedAmountBeforeTax,
                  };
                }
                return el;
              }
            ),
          };
        }
        return item;
      });

      handleChangeAllField({
        ...model,
        selectSupplier: {
          ...model.selectSupplier,
          supplierGoodsItems: editSelectedGoods,
          exchangeRates,
        },
      });
    },
    [data, handleChangeAllField, model]
  );

  const columns: ColumnProps<IExchangeRateTable>[] = useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_tab"),
        ellipsis: true,
        key: ColumnKey.SUPPLIER,
        dataIndex: ColumnKey.SUPPLIER,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.supplierName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "PL.select_supplier.exchange_rate.abbreviation_supplier"
        ),
        ellipsis: true,
        width: 200,
        key: ColumnKey.SHORT_NAME,
        dataIndex: ColumnKey.SHORT_NAME,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.supplierShortName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_quote_code"),
        width: 200,
        key: ColumnKey.QUOTATION_CODE,
        dataIndex: ColumnKey.QUOTATION_CODE,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.type_currency_table"),
        width: 120,
        key: ColumnKey.CURRENCY,
        dataIndex: ColumnKey.CURRENCY,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: (
          <LayoutCell position="right">
            {translate("PL.select_supplier.exchange_rate.quoted_rate")}
          </LayoutCell>
        ),
        width: 190,
        key: ColumnKey.EXCHANGE_RATE,
        dataIndex: ColumnKey.EXCHANGE_RATE,
        render: (value) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        ),
      },
      {
        title: (
          <LayoutCell position="right">
            {translate("PL.select_supplier.exchange_rate.closing_rate")}
            <span className="required">&nbsp;*</span>
          </LayoutCell>
        ),
        width: 200,
        key: ColumnKey.CLOSING_RATE,
        dataIndex: ColumnKey.CLOSING_RATE,
        render: (value, record, index) => (
          <LayoutCell position="right">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `supplierClosingRates[${index}].closingRate`
              )}
              isTableCell
            >
              <InputNumber
                value={value}
                numberType="DECIMAL"
                onChange={(value) =>
                  handleChangeClosingRate({
                    value,
                    id: record.supplierId,
                  })
                }
              />
            </FormItem>
          </LayoutCell>
        ),
      },
    ],
    [handleChangeClosingRate, model, translate]
  );

  return isEmpty(data) ? (
    <EmptyDocuments isNewVersion />
  ) : (
    <StandardTable
      rowKey="id"
      id="exchange-rate-table"
      isDragable
      columns={columns}
      dataSource={data.filter((el) => el.currency !== VND_CURRENCY_UNIT)}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default ExchangeRateTableSection;
