import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT } from "core/config/consts";
import {
  addNumberRoundFour,
  addNumberRoundTwo,
  formatNumber,
} from "core/helpers/number";
import { taxRepository } from "core/repositories/TaxRepository";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty } from "lodash";
import {
  ContractRequestType,
  GoodsItemsType,
  PricingType,
  SettlementHookModel,
} from "models/Settlement";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { useCallback, useContext, useEffect, useMemo } from "react";
import {
  FormItem,
  InputNumber,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
  TextArea,
} from "react-components-design-system";
import "./SettlementContractInfo.scss";
import { NUMBER_MAX_13 } from "config/const";

interface Props {
  recordGoodServices: GoodsItemsType;
}

export const SettlementContractInfo = ({ recordGoodServices }: Props) => {
  const { translate, model, handleChangeSingleField, handleChangeAllField } =
    useContext<SettlementHookModel>(SettlementHookContext);

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
      taxAmount:
        recordGoodServices?.totalPrice == 0 ||
        recordGoodServices?.tax?.rate == 0
          ? 0
          : recordGoodServices?.taxAmount,
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

  useEffect(() => {
    handleChangeAllField({
      ...model,
      goodServicesDetails: dataGoodsServices,
      noteSettlement: recordGoodServices?.note || "",
    });
  }, []);

  const handleChangeMultipleItemTable = (
    data: object,
    id: string | number,
    indexBeforeValidate?: number,
    nameError?: string[]
  ) => {
    const goodServicesDetails = model?.goodServicesDetails?.map(
      (item: GoodsItemsType) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }
    );
    if (nameError && nameError?.length > 0) {
      const errors = nameError?.reduce((acc: { [key: string]: null }, name) => {
        acc[`goodServicesDetails[${indexBeforeValidate}].${name}`] = null;
        return acc;
      }, {});

      handleChangeAllField({
        ...model,
        goodServicesDetails: goodServicesDetails,
        errors: {
          ...model.errors,
          ...errors,
        },
      });
    } else {
      handleChangeAllField({
        ...model,
        goodServicesDetails: goodServicesDetails,
      });
    }
  };

  const numberType = useMemo(() => {
    return model?.contactOrderInfo?.currency &&
      model.contactOrderInfo.currency != VND_CURRENCY_UNIT &&
      model.contactOrderInfo.currency != JPY_CURRENCY_UNIT
      ? "DECIMAL"
      : null;
  }, [model?.contactOrderInfo?.currency]);

  const convertTotalExchangeAmount = useCallback(
    (totalAmount: number) => {
      return model?.contactOrderInfo?.currency != VND_CURRENCY_UNIT &&
        model?.contactOrderInfo?.currency != JPY_CURRENCY_UNIT
        ? totalAmount * model?.rate || 0
        : totalAmount || 0;
    },
    [model?.contactOrderInfo?.currency, model?.rate]
  );

  const columns: ColumnProps<GoodsItemsType>[] = useMemo(
    () => [
      {
        title: "",
        key: "title",
        dataIndex: "title",
        align: "left",
        sorter: false,
        width: 94,
        render: (_text_, record) => {
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
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "quantity",
        dataIndex: "quantity",
        align: "right",
        sorter: false,
        width: 90,
        render: (_text_, record, index) => {
          const quantity =
            (model?.goodServicesDetails[0]?.quantity ?? 0) -
              (model?.goodServicesDetails[1]?.contractQuantity ?? 0) || 0;

          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `goodServicesDetails[${index}].quantity`
                  )}
                >
                  <InputNumber
                    translate={translate}
                    isTableCell
                    isInputRight
                    isRequired
                    value={record?.quantity}
                    numberType={"DECIMAL"}
                    onChange={(value) => {
                      const baseAmount =
                        value * record?.unitPrice - record?.reducedPrice || 0;
                      const taxFactor = (record?.tax?.rate || 0) * 0.01;

                      const totalTaxAmount =
                        model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                          ? Math.round(baseAmount * taxFactor)
                          : addNumberRoundTwo(baseAmount * taxFactor);
                      const total =
                        model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                          ? value * record?.unitPrice
                          : addNumberRoundTwo(value * record?.unitPrice);
                      const totalAmount =
                        (total ?? 0) -
                        (record?.reducedPrice ?? 0) +
                        totalTaxAmount;
                      const totalExchangeAmount =
                        convertTotalExchangeAmount(totalAmount);

                      handleChangeMultipleItemTable(
                        {
                          quantity: value,
                          taxAmount: addNumberRoundTwo(totalTaxAmount),
                          totalPrice: total,
                          totalAmount: addNumberRoundFour(totalAmount),
                          totalExchangeAmount:
                            addNumberRoundFour(totalExchangeAmount),
                        },
                        record?.id,
                        index,
                        ["quantity"]
                      );
                    }}
                  />
                </FormItem>
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
                  "text-red": quantity < 0,
                  "text-green": quantity > 0,
                })}
                useTooltip
                value={
                  `${quantity > 0 ? "+" : ""}` +
                  formatNumber(addNumberRoundFour(quantity))
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            isRequire
            title={translate("settlement.settlement_unit_price")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "unitPrice",
        dataIndex: "unitPrice",
        align: "right",
        sorter: false,
        width: 160,
        render: (_text_, record, index) => {
          const unitPrice =
            model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
              ? (model?.goodServicesDetails[0]?.unitPrice ?? 0) -
                (model?.goodServicesDetails[1]?.contractUnitPrice ?? 0)
              : addNumberRoundFour(
                  (model?.goodServicesDetails[0]?.unitPrice ?? 0) -
                    (model?.goodServicesDetails[1]?.contractUnitPrice ?? 0)
                );
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `goodServicesDetails[${index}].unitPrice`
                  )}
                >
                  <InputNumber
                    translate={translate}
                    isTableCell
                    isInputRight
                    isRequired
                    value={record?.unitPrice}
                    onChange={(value) => {
                      const baseAmount =
                        record?.quantity * value - record?.reducedPrice || 0;
                      const taxFactor = (record?.tax?.rate || 0) * 0.01;

                      const totalTaxAmount =
                        model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                          ? Math.round(baseAmount * taxFactor)
                          : addNumberRoundTwo(baseAmount * taxFactor);
                      const total =
                        model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                          ? record?.quantity * value
                          : addNumberRoundTwo(record?.quantity * value);
                      const totalAmount =
                        (total ?? 0) -
                        (record?.reducedPrice ?? 0) +
                        totalTaxAmount;
                      const totalExchangeAmount =
                        convertTotalExchangeAmount(totalAmount);

                      handleChangeMultipleItemTable(
                        {
                          unitPrice: value,
                          taxAmount: addNumberRoundTwo(totalTaxAmount),
                          totalPrice: total,
                          totalAmount: addNumberRoundFour(totalAmount),
                          totalExchangeAmount:
                            addNumberRoundFour(totalExchangeAmount),
                        },
                        record?.id,
                        index,
                        ["unitPrice"]
                      );
                    }}
                    max={NUMBER_MAX_13}
                    numberType={numberType}
                  />
                </FormItem>
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
                  "text-red": unitPrice < 0,
                  "text-green": unitPrice > 0,
                })}
                useTooltip
                value={`${unitPrice > 0 ? "+" : ""}` + formatNumber(unitPrice)}
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
          const totalPrice =
            model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
              ? (model?.goodServicesDetails[0]?.totalPrice ?? 0) -
                (model?.goodServicesDetails[1]?.contractTotalPrice ?? 0)
              : addNumberRoundTwo(
                  (model?.goodServicesDetails[0]?.totalPrice ?? 0) -
                    (model?.goodServicesDetails[1]?.contractTotalPrice ?? 0)
                );

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
                  "text-red": totalPrice < 0,
                  "text-green": totalPrice > 0,
                })}
                useTooltip
                value={
                  `${totalPrice > 0 ? "+" : ""}` + formatNumber(totalPrice)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            isRequire
            title={translate("settlement.settlement_discount_value")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "reducedPrice",
        dataIndex: "reducedPrice",
        width: 160,
        align: "right",
        sorter: false,
        render: (_text_, record, index) => {
          const discount =
            model?.contactOrderInfo?.currency == VND_CURRENCY_UNIT
              ? (model?.goodServicesDetails[0]?.reducedPrice ?? 0) -
                (model?.goodServicesDetails[1]?.contractReducedPrice ?? 0)
              : addNumberRoundFour(
                  (model?.goodServicesDetails[0]?.reducedPrice ?? 0) -
                    (model?.goodServicesDetails[1]?.contractReducedPrice ?? 0)
                );
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `goodServicesDetails[${index}].reducedPrice`
                  )}
                >
                  <InputNumber
                    isRequired
                    translate={translate}
                    isTableCell
                    isInputRight
                    value={record?.reducedPrice}
                    max={NUMBER_MAX_13}
                    onChange={(value) => {
                      const baseAmount =
                        record?.quantity * record?.unitPrice - value || 0;
                      const taxFactor = (record?.tax?.rate || 0) * 0.01;

                      const totalTaxAmount =
                        model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                          ? Math.round(baseAmount * taxFactor)
                          : addNumberRoundTwo(baseAmount * taxFactor);
                      const totalAmount =
                        (record?.quantity ?? 0) * (record?.unitPrice ?? 0) -
                        (value ?? 0) +
                        totalTaxAmount;
                      const totalExchangeAmount =
                        convertTotalExchangeAmount(totalAmount);

                      handleChangeMultipleItemTable(
                        {
                          reducedPrice: value,
                          taxAmount: addNumberRoundTwo(totalTaxAmount),
                          totalAmount: addNumberRoundFour(totalAmount),
                          totalExchangeAmount:
                            addNumberRoundFour(totalExchangeAmount),
                        },
                        record?.id,
                        index,
                        ["reducedPrice"]
                      );
                    }}
                    numberType={numberType}
                  />
                </FormItem>
              </LayoutCell>
            );
          }
          if (
            record.title === PricingType.CONTRACT ||
            record.title ===
              translate("settlement.settlement_purchase_order") ||
            record.title ===
              translate("settlement.settlement_contract_in_principle") ||
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
                  "text-red": discount < 0,
                  "text-green": discount > 0,
                })}
                useTooltip
                value={`${discount > 0 ? "+" : ""}` + formatNumber(discount)}
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
        render: (_text_, record, index) => {
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <Select
                  placeHolder={translate(
                    "settlement.settlement_tax_placeholder"
                  )}
                  classFilter={undefined}
                  searchProperty="search"
                  searchType=""
                  isSearch={true}
                  valueFilter={{
                    search: "",
                  }}
                  value={record?.tax}
                  onChange={(value, objectValue) => {
                    const baseAmount =
                      record?.quantity * record?.unitPrice -
                        record?.reducedPrice || 0;
                    const taxFactor = (objectValue?.rate || 0) * 0.01;

                    const totalTaxAmount =
                      model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                        ? Math.round(baseAmount * taxFactor)
                        : addNumberRoundTwo(baseAmount * taxFactor);
                    const totalAmount =
                      (record?.quantity ?? 0) * (record?.unitPrice ?? 0) -
                      (record?.reducedPrice ?? 0) +
                      totalTaxAmount;
                    const totalExchangeAmount =
                      convertTotalExchangeAmount(totalAmount);

                    handleChangeMultipleItemTable(
                      {
                        tax: objectValue,
                        taxAmount: addNumberRoundTwo(totalTaxAmount),
                        totalAmount: addNumberRoundFour(totalAmount),
                        totalExchangeAmount:
                          addNumberRoundFour(totalExchangeAmount),
                      },
                      record?.id,
                      index,
                      ["tax"]
                    );
                  }}
                  getList={taxRepository.getDropdown}
                  render={(tax) =>
                    tax?.id ? `${tax?.code} - ${tax?.name}` : null
                  }
                  isEnumerable={false}
                  isSmall={true}
                  appendToBody
                  allowClear={false}
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
            isRequire
            title={translate("settlement.settlement_tax_amount")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        key: "taxAmount",
        dataIndex: "taxAmount",
        align: "right",
        sorter: false,
        width: 160,
        render: (_text_, record, index) => {
          const taxAmountDifference =
            (model?.goodServicesDetails[0]?.taxAmount ?? 0) -
            (model?.goodServicesDetails[1]?.contractTaxAmount ?? 0);

          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `goodServicesDetails[${index}].taxAmount`
                  )}
                >
                  <InputNumber
                    isTableCell
                    isRequired
                    allowNegative
                    translate={translate}
                    disabled={isEmpty(model?.goodServicesDetails?.[0]?.tax)}
                    isInputRight
                    value={record?.taxAmount}
                    onChange={(value) => {
                      const totalAmount =
                        addNumberRoundTwo(
                          (record?.quantity ?? 0) * (record?.unitPrice ?? 0)
                        ) -
                        (record?.reducedPrice ?? 0) +
                        (value ?? 0);
                      const totalExchangeAmount =
                        convertTotalExchangeAmount(totalAmount);

                      handleChangeMultipleItemTable(
                        {
                          taxAmount: value,
                          totalAmount: addNumberRoundFour(totalAmount),
                          totalExchangeAmount:
                            addNumberRoundFour(totalExchangeAmount),
                        },
                        record?.id,
                        index,
                        ["taxAmount"]
                      );
                    }}
                    numberType={numberType}
                    max={NUMBER_MAX_13}
                  />
                </FormItem>
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
                    addNumberRoundTwo(record?.contractTaxAmount)
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": taxAmountDifference < 0,
                  "text-green": taxAmountDifference > 0,
                })}
                useTooltip
                value={
                  `${taxAmountDifference > 0 ? "+" : ""}` +
                  formatNumber(addNumberRoundTwo(taxAmountDifference))
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
          const totalAmount =
            model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
              ? (model?.goodServicesDetails[0]?.totalAmount ?? 0) -
                (model?.goodServicesDetails[1]?.contractTotalAmount ?? 0)
              : addNumberRoundFour(
                  (model?.goodServicesDetails[0]?.totalAmount ?? 0) -
                    (model?.goodServicesDetails[1]?.contractTotalAmount ?? 0)
                );

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
                  "text-red": totalAmount < 0,
                  "text-green": totalAmount > 0,
                })}
                useTooltip
                value={
                  `${totalAmount > 0 ? "+" : ""}` + formatNumber(totalAmount)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            isRequire
            title={translate("settlement.settlement_total_exchange_rate")}
            unit={"VND"}
          />
        ),
        key: "contractTotalExchangeAmount",
        dataIndex: "contractTotalExchangeAmount",
        align: "right",
        sorter: false,
        width: 160,
        render: (_text_, record, index) => {
          const convertedAmount =
            model?.contactOrderInfo?.currency == VND_CURRENCY_UNIT
              ? (model?.goodServicesDetails[0]?.totalExchangeAmount ?? 0) -
                (model?.goodServicesDetails[1]?.contractTotalExchangeAmount ??
                  0)
              : addNumberRoundFour(
                  (model?.goodServicesDetails[0]?.totalExchangeAmount ?? 0) -
                    (model?.goodServicesDetails[1]
                      ?.contractTotalExchangeAmount ?? 0)
                );
          if (record.title === PricingType.SETTLEMENT) {
            return (
              <LayoutCell position="right">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `goodServicesDetails[${index}].totalExchangeAmount`
                  )}
                >
                  <InputNumber
                    isRequired
                    allowNegative
                    translate={translate}
                    isTableCell
                    isInputRight
                    value={record?.totalExchangeAmount}
                    numberType={numberType}
                    max={NUMBER_MAX_13}
                    onChange={(value) => {
                      handleChangeMultipleItemTable(
                        {
                          totalExchangeAmount: value,
                        },
                        record?.id,
                        index,
                        ["totalExchangeAmount"]
                      );
                    }}
                  />
                </FormItem>
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
                    addNumberRoundFour(record?.contractTotalExchangeAmount)
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": convertedAmount < 0,
                  "text-green": convertedAmount > 0,
                })}
                useTooltip
                value={
                  `${convertedAmount > 0 ? "+" : ""}` +
                  formatNumber(convertedAmount)
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
    <div className="settlement-contract-info">
      <div>
        <FormItem
          validateObject={utilService.getValidateObj(model, "noteSettlement")}
        >
          <TextArea
            label={translate("settlement.settlement_note")}
            placeHolder={translate("settlement.settlement_note_placeholder")}
            value={model?.noteSettlement}
            showCount
            resize="none"
            maxLength={500}
            onChange={handleChangeSingleField({
              fieldName: "noteSettlement",
            })}
            translate={translate}
          />
        </FormItem>
      </div>
      <div className="p-y--sm">
        <StandardTable
          rowKey="id"
          isDragable
          columns={columns}
          dataSource={model.goodServicesDetails}
          scroll={{ y: "calc(100vh - 320px)" }}
          idContainer="table-id-container"
        />
      </div>
    </div>
  );
};

export default SettlementContractInfo;
