import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { addNumberRoundFour, formatNumber } from "core/helpers/number";
import {
  ContractRequestType,
  GoodsItemsType,
  PricingType,
  SettlementHookModel,
} from "models/Settlement";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import "./SettlementGoodsServicesInfo.scss";
import { VND_CURRENCY_UNIT } from "core/config/consts";

interface Props {
  recordGoodServices: GoodsItemsType;
}

export const SettlementGoodsServicesInfo = ({ recordGoodServices }: Props) => {
  const { translate, model } = useContext<SettlementHookModel>(
    SettlementHookContext
  );

  const dataGoodsServices: GoodsItemsType[] = [
    {
      id: "1",
      title: PricingType.SETTLEMENT,
      quantity: recordGoodServices?.quantity,
      unitPrice: recordGoodServices?.unitPrice,
      totalPrice: recordGoodServices?.totalPrice,
      reducedPrice: recordGoodServices?.reducedPrice,
      taxId: recordGoodServices?.taxId,
      tax: {
        ...recordGoodServices?.tax,
      },
      taxAmount: recordGoodServices?.taxAmount,
      totalAmount: recordGoodServices?.totalAmount,
      totalExchangeAmount: recordGoodServices?.totalExchangeAmount,
    },
    {
      id: "2",
      title:
        model?.contactOrderInfo?.contractRequestType ===
        ContractRequestType.Contract
          ? PricingType.CONTRACT
          : model?.contactOrderInfo?.contractRequestType ===
            ContractRequestType.PurchaseOrder
          ? translate("settlement.settlement_purchase_order")
          : translate("settlement.settlement_contract_in_principle"),
      contractQuantity: recordGoodServices?.contractQuantity,
      contractUnitPrice: recordGoodServices?.contractUnitPrice,
      contractTotalPrice: recordGoodServices?.contractTotalPrice,
      contractReducedPrice: recordGoodServices?.contractReducedPrice,
      contractTaxId: recordGoodServices?.contractTaxId,
      contractTax: {
        ...recordGoodServices?.contractTax,
      },
      contractTaxAmount: recordGoodServices?.contractTaxAmount,
      contractTotalAmount: recordGoodServices?.contractTotalAmount,
      contractTotalExchangeAmount:
        recordGoodServices?.contractTotalExchangeAmount,
    },
    {
      id: "3",
      title: PricingType.DIFFERENCE,
      diffQuantity: recordGoodServices?.diffQuantity,
      diffUnitPrice: recordGoodServices?.diffUnitPrice,
      diffTotalPrice: recordGoodServices?.diffTotalPrice,
      diffReducedPrice: recordGoodServices?.diffReducedPrice,
      diffTaxId: recordGoodServices?.diffTaxId,
      diffTax: {
        ...recordGoodServices?.diffTax,
      },
      diffTaxAmount: recordGoodServices?.diffTaxAmount,
      diffTotalAmount: recordGoodServices?.diffTotalAmount,
      diffTotalExchangeAmount: recordGoodServices?.diffTotalExchangeAmount,
    },
  ];

  const columns: ColumnProps<GoodsItemsType>[] = useMemo(
    () => [
      {
        title: "",
        key: "title",
        dataIndex: "title",
        align: "left",
        sorter: false,
        width: 94,
        render: (_text_) => {
          return (
            <LayoutCell position="left">
              <OneLineText className="data-column" useTooltip value={_text_} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title p-b--xs")}>
              {translate("settlement.settlement_quantity")}
            </label>
          </div>
        ),
        key: "quantity",
        dataIndex: "quantity",
        align: "right",
        sorter: false,
        width: 90,
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.quantity)}
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.contractQuantity)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffQuantity < 0,
                  "text-green": record?.diffQuantity > 0,
                })}
                useTooltip
                value={
                  `${record?.diffQuantity > 0 ? "+" : ""}` +
                  formatNumber(record?.diffQuantity)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_unit_price")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "unitPrice",
        dataIndex: "unitPrice",
        align: "right",
        sorter: false,
        width: 160,
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.unitPrice)}
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(
                    addNumberRoundFour(record?.contractUnitPrice) || 0
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffUnitPrice < 0,
                  "text-green": record?.diffUnitPrice > 0,
                })}
                useTooltip
                value={
                  `${record?.diffUnitPrice > 0 ? "+" : ""}` +
                  formatNumber(record?.diffUnitPrice)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_become_price")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "totalPrice",
        dataIndex: "totalPrice",
        sorter: false,
        width: 145,
        align: "right",
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={
                    record?.totalPrice ? formatNumber(record?.totalPrice) : "0"
                  }
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(
                    addNumberRoundFour(record?.contractTotalPrice || 0)
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffTotalPrice < 0,
                  "text-green": record?.diffTotalPrice > 0,
                })}
                useTooltip
                value={
                  `${record?.diffTotalPrice > 0 ? "+" : ""}` +
                  formatNumber(record?.diffTotalPrice)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_discount_value")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "reducedPrice",
        dataIndex: "reducedPrice",
        width: 160,
        align: "right",
        sorter: false,
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.reducedPrice)}
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(
                    addNumberRoundFour(record?.contractReducedPrice || 0)
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffReducedPrice < 0,
                  "text-green": record?.diffReducedPrice > 0,
                })}
                useTooltip
                value={
                  `${record?.diffReducedPrice > 0 ? "+" : ""}` +
                  formatNumber(record?.diffReducedPrice || 0)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_tax_rate")}
            unit={" "}
          />
        ),
        key: "taxRate",
        dataIndex: "taxRate",
        align: "left",
        sorter: false,
        width: 110,
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="left">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.tax?.name)}
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="left">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={record?.contractTax?.name}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={record?.diffTax?.name}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_tax_amount")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "taxAmount",
        dataIndex: "taxAmount",
        align: "right",
        sorter: false,
        width: 160,
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.taxAmount)}
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.contractTaxAmount)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffTaxAmount < 0,
                  "text-green": record?.diffTaxAmount > 0,
                })}
                useTooltip
                value={
                  `${record?.diffTaxAmount > 0 ? "+" : ""}` +
                  formatNumber(record?.diffTaxAmount)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_amount")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "totalAmount",
        dataIndex: "totalAmount",
        align: "right",
        sorter: false,
        width: 145,
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={
                    record?.totalAmount
                      ? formatNumber(record?.totalAmount)
                      : "0"
                  }
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.contractTotalAmount)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffTotalAmount < 0,
                  "text-green": record?.diffTotalAmount > 0,
                })}
                useTooltip
                value={
                  `${record?.diffTotalAmount > 0 ? "+" : ""}` +
                  formatNumber(record?.diffTotalAmount)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_exchange_rate")}
            unit={VND_CURRENCY_UNIT}
          />
        ),
        key: "contractTotalExchangeAmount",
        dataIndex: "contractTotalExchangeAmount",
        align: "right",
        sorter: false,
        width: 160,
        render: (_text_, record) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.totalExchangeAmount)}
                />
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle")
          ) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column"
                  useTooltip
                  value={formatNumber(record?.contractTotalExchangeAmount)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffTotalExchangeAmount < 0,
                  "text-green": record?.diffTotalExchangeAmount > 0,
                })}
                useTooltip
                value={
                  `${record?.diffTotalExchangeAmount > 0 ? "+" : ""}` +
                  formatNumber(record?.diffTotalExchangeAmount)
                }
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, model]
  );

  return (
    <div className="settlement-goods-and-services-information">
      <div className="settlement-goods-and-services-information-note">
        <div className="label">{translate("settlement.settlement_note")}</div>
        <div className="value">{recordGoodServices?.note}</div>
      </div>
      <div className="p-t--xs p-b--sm">
        <StandardTable
          rowKey="id"
          isDragable
          columns={columns}
          dataSource={dataGoodsServices}
          scroll={{ y: "calc(100vh - 320px)" }}
          idContainer="table-id-container"
        />
      </div>
    </div>
  );
};

export default SettlementGoodsServicesInfo;
