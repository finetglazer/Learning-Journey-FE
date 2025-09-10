import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import { ItemTableViewCurrency } from "components/ItemTableView/ItemTableView";
import { MAX_DIGITAL_NUMBER_4_DIGITS, NUMBER_MAX_13 } from "config/const";
import {
  JPY_CURRENCY_UNIT,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { toFixedNumber } from "core/helpers/calculator";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { addNumbers, roundTo } from "core/helpers/number";
import { taxRepository } from "core/repositories/TaxRepository";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import { cloneDeep, isEqual } from "lodash";
import {
  ContractAnnex,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { VND_CURRENCY } from "models/Payment";
import { Tax } from "models/Tax";
import { CostLineModelFilter } from "pages/Catalog/CostLine/CostLineMaster/CostLineMasterAdvanceFilter";
import { goodsServicesRepository } from "pages/Catalog/GoodsServicesPage/GoodsServicesRepository";
import { convertPriceToVND } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import React, { useCallback, useMemo } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import {
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { unitOfMeasureRepository } from "../../../../../../../Catalog/UnitOfMeasurePage/UnitOfMeasureRepository";
import "./GoodsServiceInfo.scss";

interface GoodsServiceInfoProps {
  currentItem: SelectAdjustableGoodsServicesModel;
  model?: ContractAnnex;
  handleChangeSelectFieldGoodsService: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleFieldGoodsService: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeAllFieldGoodsService: (
    data: SelectAdjustableGoodsServicesModel
  ) => void;
  isEdit?: boolean;
}

const SPACING = {
  gutter: [12, 16] as [Gutter, Gutter],
  span_8: 8,
  span_16: 16,
};

export interface TaxBoxProps {
  price: string;
  covertPrice?: string;
  currency: string;
}

export const GoodsServiceInfo: React.FC<GoodsServiceInfoProps> = ({
  currentItem,
  handleChangeSelectFieldGoodsService,
  handleChangeSingleFieldGoodsService,
  handleChangeAllFieldGoodsService,
  isEdit,
}) => {
  const [translate] = useTranslation();

  const currencyCode = currentItem?.currency || VND_CURRENCY;
  const isNotVNDorJPY =
    !isEqual(currencyCode, VND_CURRENCY) &&
    !isEqual(currencyCode, JPY_CURRENCY_UNIT);
  const roundNumber = isNotVNDorJPY ? 2 : 0;

  const currentRate = useMemo(
    () =>
      isEqual(currencyCode, VND_CURRENCY)
        ? numberConstants.ONE
        : currentItem?.currencyRate,
    [currencyCode, currentItem?.currencyRate]
  );

  const calculateTaxAmount = useCallback(
    (unitPrice: number, quantity: number, taxRate: number) => {
      const taxAmount = unitPrice * quantity * (taxRate / 100);
      return isNotVNDorJPY ? roundTo(taxAmount, 2) : Math.round(taxAmount);
    },
    [isNotVNDorJPY]
  );

  const formatAmount = useCallback(
    (amount: number) =>
      isNotVNDorJPY ? roundTo(amount, 2) : Math.round(amount),
    [isNotVNDorJPY]
  );

  const getAmountBeforeTax = useMemo(
    () =>
      formatAmount(
        (currentItem?.unitPrice || 0) * (currentItem?.quantity || 0)
      ),
    [currentItem?.quantity, currentItem?.unitPrice, formatAmount]
  );

  const getTotalAmount = useMemo(() => {
    const totalAmount = addNumbers(
      getAmountBeforeTax,
      currentItem?.taxAmount || 0,
      currentItem?.otherAmount || 0
    );
    return formatAmount(totalAmount);
  }, [
    getAmountBeforeTax,
    currentItem?.taxAmount,
    currentItem?.otherAmount,
    formatAmount,
  ]);

  const handleChangeSelectTaxModel = useCallback(
    (id: string | number, value: Tax) => {
      const { unitPrice, quantity } = currentItem || {};
      const taxAmount = calculateTaxAmount(
        currentItem?.unitPrice || 0,
        currentItem?.quantity || 0,
        value.rate
      );
      const baseAmount = formatAmount(unitPrice * quantity);
      const totalAmount = addNumbers(baseAmount, taxAmount);
      const totalAmountConvert = convertPriceToVND(
        totalAmount,
        currentRate
      ).value;

      handleChangeAllFieldGoodsService({
        ...currentItem,
        taxModel: value,
        taxAmount,
        totalAmount,
        totalAmountConvert,
        errors: {
          ...currentItem.errors,
          taxModel: null,
        },
      });
    },
    [
      calculateTaxAmount,
      currentItem,
      currentRate,
      formatAmount,
      handleChangeAllFieldGoodsService,
    ]
  );

  const handleChangeQuantity = useCallback(
    (value: number) => {
      const { unitPrice, taxModel } = currentItem || {};
      const taxAmount = calculateTaxAmount(
        unitPrice,
        value,
        taxModel?.rate || 0
      );

      const baseAmount = formatAmount(unitPrice * value);
      const totalAmount = addNumbers(baseAmount, taxAmount);
      const totalAmountConvert = convertPriceToVND(
        totalAmount,
        currentRate
      ).value;

      handleChangeAllFieldGoodsService({
        ...currentItem,
        quantity: value,
        taxAmount,
        totalAmount,
        amount: baseAmount,
        totalAmountConvert,
        errors: {
          ...currentItem.errors,
          quantity: null,
          taxAmount: value && unitPrice && null,
        },
      });
    },
    [
      calculateTaxAmount,
      currentItem,
      currentRate,
      formatAmount,
      handleChangeAllFieldGoodsService,
    ]
  );

  const columnsCenter = [
    {
      title: translate("RG.txt_amount_before_tax"),
      price: toFixedNumber(getAmountBeforeTax, roundNumber),
      priceExchange: getAmountBeforeTax,
    },
    {
      title: translate("RG.txt_tax"),
      price: toFixedNumber(currentItem?.taxAmount, roundNumber),
      priceExchange: currentItem?.taxAmount,
    },
    {
      title: translate("RG.txt_total_amount"),
      price: toFixedNumber(getTotalAmount, roundNumber),
      priceExchange: getTotalAmount,
    },
  ];

  const handleChangeUnitPrice = useCallback(
    (value: number) => {
      const { taxModel, quantity } = currentItem || {};
      const taxAmount = calculateTaxAmount(
        value,
        quantity,
        taxModel?.rate || 0
      );

      const baseAmount = formatAmount(value * quantity);
      const totalAmount = addNumbers(baseAmount, taxAmount);
      const totalAmountConvert = convertPriceToVND(
        totalAmount,
        currentRate
      ).value;

      handleChangeAllFieldGoodsService({
        ...currentItem,
        unitPrice: value,
        taxAmount,
        totalAmount,
        amount: baseAmount,
        totalAmountConvert,
        errors: {
          ...currentItem.errors,
          unitPrice: null,
          taxAmount: quantity && value && null,
        },
      });
    },
    [
      calculateTaxAmount,
      currentItem,
      currentRate,
      formatAmount,
      handleChangeAllFieldGoodsService,
    ]
  );

  const handleChangeTaxAmount = useCallback(
    (value: number) => {
      const { unitPrice, quantity } = currentItem || {};
      const taxAmount = value;
      const baseAmount = formatAmount(unitPrice * quantity);
      const totalAmount = addNumbers(baseAmount, taxAmount);
      const totalAmountConvert = convertPriceToVND(
        totalAmount,
        currentRate
      ).value;
      const newError = cloneDeep(currentItem?.errors) || {};
      newError["taxAmount"] = null;
      handleChangeAllFieldGoodsService({
        ...currentItem,
        errors: newError,
        taxAmount,
        totalAmount,
        amount: baseAmount,
        totalAmountConvert,
      });
    },
    [
      calculateTaxAmount,
      currentItem,
      currentRate,
      formatAmount,
      handleChangeAllFieldGoodsService,
    ]
  );

  const isRequired = !!currentItem.purchaseItemId;

  return (
    <>
      <Row gutter={SPACING.gutter}>
        <Col span={SPACING.span_8}>
          <InputText
            isSmall={false}
            label={translate("RG.txt_product_code")}
            disabled={true}
            value={currentItem?.code}
            className={"input-text-disabled"}
          />
        </Col>
        <Col span={SPACING.span_16}>
          <InputText
            isSmall={false}
            label={translate("RG.txt_product_name")}
            disabled={true}
            value={currentItem?.name}
            className={"input-text-disabled"}
          />
        </Col>

        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              currentItem,
              "goodBranch"
            )}
          >
            <Select
              label={translate("RG.txt_manufacturer_brand_type")}
              placeHolder={translate(
                "RG.placeholder.txt_manufacturer_brand_type"
              )}
              getList={goodsServicesRepository.getDropdownManufacturer}
              classFilter={CostLineModelFilter}
              value={currentItem?.goodBranch}
              onChange={handleChangeSelectFieldGoodsService({
                fieldName: "goodBranch",
              })}
              className="input-text-disabled"
              disabled={!isEdit || !currentItem.purchaseItemId}
              isSmall={false}
              allowClear={false}
              isRequired={isRequired}
              appendToBody
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_16}>
          <FormItem
            validateObject={utilService.getValidateObj(
              currentItem,
              "description"
            )}
          >
            <InputText
              isSmall={false}
              label={translate("RG.txt_goods_service_description")}
              value={currentItem?.description}
              onChange={handleChangeSingleFieldGoodsService({
                fieldName: "description",
              })}
              disabled={!isEdit || !currentItem.purchaseItemId}
              className={"input-text-disabled"}
              allowClear={false}
            />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            validateObject={utilService.getValidateObj(currentItem, "note")}
          >
            <InputText
              isSmall={false}
              label={translate("RG.txt_notes")}
              onChange={handleChangeSingleFieldGoodsService({
                fieldName: "note",
              })}
              value={currentItem?.note}
              allowClear={false}
              readOnly={!isEdit}
              className={"input-text-read-only"}
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(currentItem, "quantity")}
          >
            <InputNumber
              isSmall={false}
              label={translate("RG.txt_goods_quantity")}
              onChange={handleChangeQuantity}
              max={NUMBER_MAX_13}
              allowNegative={!currentItem.purchaseItemId}
              numberType={"DECIMAL"}
              value={currentItem?.quantity}
              decimalDigit={MAX_DIGITAL_NUMBER_4_DIGITS}
              className={"input-text-read-only"}
              allowClear={false}
              isRequired
              readOnly={!isEdit}
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(currentItem, "goodUnit")}
          >
            <Select
              isSmall={false}
              label={translate("RG.txt_unit_of_measure")}
              value={currentItem?.goodUnit}
              className={"input-text-disabled"}
              getList={unitOfMeasureRepository.getDropdown}
              classFilter={ModelFilter}
              onChange={handleChangeSelectFieldGoodsService({
                fieldName: "goodUnit",
              })}
              searchProperty="search"
              searchType={null}
              disabled={true}
              isRequired={isRequired}
              isEnumerable={false}
              appendToBody
              isSearch
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              currentItem,
              "unitPrice"
            )}
          >
            <InputNumber
              isSmall={false}
              allowClear={false}
              label={translate("RG.txt_unit_price")}
              value={currentItem?.unitPrice}
              onChange={handleChangeUnitPrice}
              suffix={currentItem?.currency}
              className={"input-text-disabled"}
              disabled={!isEdit || !currentItem.purchaseItemId}
              max={NUMBER_MAX_13}
              numberType={getNumberTypeByCurrency(currentItem?.currency)}
              isRequired={isRequired}
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(currentItem, "taxModel")}
          >
            <Select
              isSmall={false}
              label={translate("RG.txt_tax_rate")}
              placeHolder={translate("RG.placeholder.txt_tax_rate")}
              getList={taxRepository.getDropdown}
              classFilter={ModelFilter}
              value={currentItem?.taxModel}
              onChange={(id, value: Model) => {
                return handleChangeSelectTaxModel(id, value);
              }}
              searchProperty="search"
              isEnumerable={false}
              searchType={null}
              isSearch={true}
              render={(tax) => (tax?.id ? `${tax?.code} - ${tax?.name}` : null)}
              appendToBody
              className={"input-text-read-only"}
              readOnly={!isEdit}
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              currentItem,
              "taxAmount"
            )}
          >
            <InputNumber
              isSmall={false}
              label={translate("RG.txt_tax_amount")}
              value={currentItem?.taxAmount}
              onChange={(value) => handleChangeTaxAmount(value)}
              allowNegative={!currentItem.purchaseItemId}
              disabled={!currentItem?.taxModel?.id}
              max={NUMBER_MAX_13}
              numberType={
                isEqual(currencyCode, VND_CURRENCY_UNIT) ||
                isEqual(currencyCode, JPY_CURRENCY_UNIT)
                  ? "LONG"
                  : "DECIMAL"
              }
              allowClear={false}
              className={
                isEdit ? "input-text-disabled" : "input-text-read-only"
              }
              readOnly={!isEdit}
            />
          </FormItem>
        </Col>
      </Row>
      <div className="my-4 table-goods-service">
        <table className="table__blue">
          <tbody>
            <tr className={"bg-blue"}>
              {columnsCenter.map((props, index) => (
                <ItemTableViewCurrency
                  key={index}
                  {...props}
                  price={props.price || 0}
                  priceExchange={props.priceExchange || 0}
                  currency={currencyCode}
                  exchangeRate={currentRate || 1}
                  hasUseTooltip
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
