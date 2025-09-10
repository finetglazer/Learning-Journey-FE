import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import classNames from "classnames";
import { ItemTableView } from "components/ItemTableView/ItemTableView";
import { NUMBER_MAX_13 } from "config/const";
import {
  JPY_CURRENCY_UNIT,
  MAX_LENGTH_255,
  NOT_TAB_ENTER_REGEX,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { addNumbers, roundTo } from "core/helpers/number";
import { taxRepository } from "core/repositories/TaxRepository";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import { cloneDeep, isEmpty, isEqual, uniqueId } from "lodash";
import {
  ContractAnnex,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { VND_CURRENCY } from "models/Payment";
import { Tax } from "models/Tax";
import { CostLineModelFilter } from "pages/Catalog/CostLine/CostLineMaster/CostLineMasterAdvanceFilter";
import { goodsServicesRepository } from "pages/Catalog/GoodsServicesPage/GoodsServicesRepository";
import { unitOfMeasureRepository } from "pages/Catalog/UnitOfMeasurePage/UnitOfMeasureRepository";
import styles from "pages/PurchasePage/Acceptance/Components/Acceptance.module.scss";
import {
  convertPriceToVND,
  formatNumberToCurrency,
} from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import React, { useCallback, useMemo } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import {
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
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
  handleChangeAllFieldGoodsService: (data: any) => void;
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
  model,
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

  const calculateTaxAmount = (
    unitPrice: number,
    quantity: number,
    taxRate: number
  ) => {
    const taxAmount = (unitPrice || 0) * (quantity || 0) * (taxRate / 100);
    return isNotVNDorJPY ? roundTo(taxAmount, 2) : Math.round(taxAmount);
  };

  const formatAmount = (amount: number) =>
    isNotVNDorJPY ? roundTo(amount, 2) : Math.round(amount);

  const getAmountBeforeTax = () =>
    formatAmount((currentItem?.unitPrice || 0) * (currentItem?.quantity || 0));

  const getTotalAmount = useCallback(() => {
    const baseAmount = getAmountBeforeTax();
    const totalAmount = addNumbers(
      baseAmount,
      currentItem?.taxAmount || 0,
      currentItem?.otherAmount || 0
    );
    return formatAmount(totalAmount);
  }, [currentItem?.taxAmount, currentItem?.otherAmount, getAmountBeforeTax]);

  const handleChangeSelectTaxModel = useCallback(
    (id: any, value: Tax) => {
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

      const newError = cloneDeep(currentItem?.errors) || {};
      newError["taxModel"] = null;
      newError["taxAmount"] = null;

      handleChangeAllFieldGoodsService({
        ...currentItem,
        errors: newError,
        taxModel: value,
        taxAmount,
        totalAmount,
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

      const newError = cloneDeep(currentItem?.errors) || {};
      newError["quantity"] = null;
      newError["taxAmount"] = null;

      handleChangeAllFieldGoodsService({
        ...currentItem,
        errors: newError,
        quantity: value,
        taxAmount,
        totalAmount,
        amount: baseAmount,
        totalAmountConvert,
      });
    },
    [currentItem, handleChangeAllFieldGoodsService]
  );

  const handleChangeSingleFieldGoodsServiceLocal = ({
    fieldName,
    value,
  }: {
    fieldName: string;
    value: string;
  }) => {
    const validationRules = {
      description: {
        maxLength: MAX_LENGTH_255,
        regex: NOT_TAB_ENTER_REGEX,
        isRequired: true,
      },
      note: {
        maxLength: MAX_LENGTH_255,
        regex: NOT_TAB_ENTER_REGEX,
        isRequired: false,
      },
    };

    const newError = cloneDeep(currentItem?.errors) || {};

    const fieldNameKey = fieldName as keyof typeof validationRules;
    const rules = validationRules[fieldNameKey];
    newError[fieldName] = null;
    if (rules.isRequired && isEmpty(value)) {
      newError[fieldName] = translate("CM.input_require_validation");
    } else if (!isEmpty(value)) {
      if (!new RegExp(rules.regex).test(value)) {
        newError[fieldName] = translate("RG.error_input.invalidCharacters");
      } else if (value.length > rules.maxLength) {
        newError[fieldName] = translate("CM.input_length_validation", {
          maxLength: rules.maxLength,
        });
      }
    }

    handleChangeAllFieldGoodsService({
      ...currentItem,
      errors: newError,
      [fieldName]: value,
    });
  };

  const TaxBox = ({ price, currency, covertPrice }: TaxBoxProps) => (
    <div className="tax">
      <div className="d-flex gap-1 align-items-baseline">
        <strong className="primary-number">{price}</strong>
        <span className="currency">{currency}</span>
      </div>
      {covertPrice &&
        !isEqual(currency?.toLowerCase(), VND_CURRENCY.toLowerCase()) && (
          <div className="d-flex gap-1 align-items-baseline">
            <span className="secondary-number">{covertPrice}</span>
            <span className="currency">{VND_CURRENCY}</span>
          </div>
        )}
    </div>
  );

  const columnsCenter = [
    {
      title: translate("RG.txt_amount_before_tax"),
      content: (
        <TaxBox
          price={formatNumberToCurrency(getAmountBeforeTax(), roundNumber)}
          currency={currencyCode}
          covertPrice={
            convertPriceToVND(getAmountBeforeTax(), currentRate).display
          }
        />
      ),
    },
    {
      title: translate("RG.txt_tax"),
      content: (
        <TaxBox
          price={formatNumberToCurrency(
            currentItem?.taxAmount || 0,
            roundNumber
          )}
          currency={currencyCode}
          covertPrice={
            convertPriceToVND(currentItem?.taxAmount || 0, currentRate).display
          }
        />
      ),
    },
    {
      title: translate("RG.txt_total_amount"),
      content: (
        <TaxBox
          price={formatNumberToCurrency(getTotalAmount(), roundNumber)}
          currency={currencyCode}
          covertPrice={convertPriceToVND(getTotalAmount(), currentRate).display}
        />
      ),
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

      const newError = cloneDeep(currentItem?.errors) || {};
      newError["unitPrice"] = null;
      newError["taxAmount"] = null;

      handleChangeAllFieldGoodsService({
        ...currentItem,
        unitPrice: value,
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

  const handleChangeGoodsUnit = useCallback(
    (value: Model) => {
      const newError = cloneDeep(currentItem?.errors) || {};
      newError["goodUnit"] = null;

      handleChangeAllFieldGoodsService({
        ...currentItem,
        errors: newError,
        goodUnit: value,
      });
    },
    [currentItem, handleChangeAllFieldGoodsService]
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

  return (
    <>
      <Row gutter={SPACING.gutter}>
        <Col span={SPACING.span_8}>
          <InputText
            isSmall={false}
            label={translate("RG.txt_product_code")}
            disabled={true}
            value={currentItem?.code}
            className={"input-text--read-only"}
          />
        </Col>
        <Col span={SPACING.span_16}>
          <InputText
            isSmall={false}
            label={translate("RG.txt_product_name")}
            disabled={true}
            value={currentItem?.name}
            className={"input-text--read-only"}
          />
        </Col>

        <Col span={SPACING.span_8}>
          {isEmpty(currentItem?.purchaseItemId) ? (
            <InputText
              isSmall={false}
              label={translate("RG.txt_product_name")}
              disabled={true}
              value={currentItem?.goodBranch?.name}
              className={"input-text--read-only"}
            />
          ) : (
            <FormItem
              validateObject={utilService.getValidateObj(
                currentItem,
                "goodBranch"
              )}
            >
              <Select
                isRequired={true}
                label={translate("RG.txt_manufacturer_brand_type")}
                placeHolder={translate(
                  "RG.placeholder.txt_manufacturer_brand_type"
                )}
                getList={goodsServicesRepository.getDropdownManufacturer}
                classFilter={CostLineModelFilter}
                value={currentItem?.goodBranch}
                isSmall={false}
                onChange={handleChangeSelectFieldGoodsService({
                  fieldName: "goodBranch",
                })}
                appendToBody
                disabled={!currentItem.purchaseItemId}
                className={"input-text--read-only"}
              />
            </FormItem>
          )}
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
              onChange={(value) =>
                handleChangeSingleFieldGoodsServiceLocal({
                  value: value,
                  fieldName: "description",
                })
              }
              disabled={!currentItem.purchaseItemId}
              className={"input-text--read-only"}
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
              onChange={(value) =>
                handleChangeSingleFieldGoodsServiceLocal({
                  fieldName: "note",
                  value: value,
                })
              }
              value={currentItem?.note}
              allowClear={false}
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
              value={currentItem?.quantity}
              max={NUMBER_MAX_13}
              allowNegative={!currentItem?.purchaseItemId}
              numberType={"DECIMAL"}
              allowClear={false}
              isRequired
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          {!isEmpty(currentItem?.purchaseItemId) ? (
            <FormItem
              validateObject={utilService.getValidateObj(
                currentItem,
                "goodUnit"
              )}
            >
              <Select
                isSmall={false}
                label={translate("RG.txt_unit_of_measure")}
                value={currentItem?.goodUnit}
                className={"input-text--read-only"}
                isRequired
                getList={unitOfMeasureRepository.getDropdown}
                classFilter={ModelFilter}
                onChange={(_, object) => {
                  handleChangeGoodsUnit(object);
                }}
                readOnly={!currentItem?.purchaseItemId}
                searchProperty="search"
                isEnumerable={false}
                searchType={null}
                isSearch={true}
                disabled={true}
                appendToBody
              />
            </FormItem>
          ) : (
            <InputText
              readOnly={true}
              isSmall={false}
              label={translate("RG.txt_unit_of_measure")}
              value={currentItem?.goodUnit?.name}
              className={"input-text--read-only"}
            />
          )}
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              currentItem,
              "unitPrice"
            )}
          >
            <InputNumber
              isRequired={!!currentItem?.purchaseItemId}
              isSmall={false}
              label={translate("RG.txt_unit_price")}
              value={currentItem?.unitPrice}
              onChange={handleChangeUnitPrice}
              suffix={currentItem?.currency}
              readOnly={!currentItem?.purchaseItemId}
              className={"input-text--read-only"}
              allowClear={false}
              max={NUMBER_MAX_13}
              min={-NUMBER_MAX_13}
              numberType={
                isEqual(currencyCode, VND_CURRENCY_UNIT) ||
                isEqual(currencyCode, JPY_CURRENCY_UNIT)
                  ? "LONG"
                  : "DECIMAL"
              }
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(currentItem, "taxModel")}
          >
            <Select
              isSmall={false}
              isRequired
              label={translate("RG.txt_tax_rate")}
              placeHolder={translate("RG.placeholder.txt_tax_rate")}
              getList={taxRepository.getDropdown}
              classFilter={ModelFilter}
              value={currentItem?.taxModel}
              onChange={(id, value: Model) => {
                return handleChangeSelectTaxModel(id, value);
              }}
              searchProperty="search"
              render={(tax) => (tax?.id ? `${tax?.code} - ${tax?.name}` : null)}
              isEnumerable={false}
              searchType={null}
              isSearch={true}
              appendToBody
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
              onChange={(value) => {
                handleChangeTaxAmount(value);
              }}
              isRequired={!!currentItem?.taxModel?.id}
              allowNegative={!currentItem.purchaseItemId}
              readOnly={!currentItem?.taxModel?.id}
              max={NUMBER_MAX_13}
              suffix={currentItem?.currency}
              numberType={
                isEqual(currencyCode, VND_CURRENCY_UNIT) ||
                isEqual(currencyCode, JPY_CURRENCY_UNIT)
                  ? "LONG"
                  : "DECIMAL"
              }
              allowClear={false}
            />
          </FormItem>
        </Col>
      </Row>
      <div className="my-4 table-goods-service">
        <table className={classNames(styles["table"], "background-table")}>
          <tbody>
            <tr className="table-border-color">
              {columnsCenter.map((props) => (
                <ItemTableView key={uniqueId()} {...props} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
