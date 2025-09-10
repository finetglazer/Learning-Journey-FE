import {
  JPY_CURRENCY_UNIT,
  MAX_LENGTH_1000,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import {
  exchangeCurrencyWithFixed,
  multiplyWithFixed,
  sumWithFixed,
  toFixedNumber,
} from "core/helpers/calculator";
import { formatNumber, roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import { useEffect, useMemo } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ItemTable } from "../../../ItemTable/ItemTable";
import { useReceivingGoodsDetailDrawerContext } from "../ReceivingGoodsDetailContext";
import styles from "../ReceivingGoodsDetailDrawer.module.scss";

interface ReceivingGoodsDetailDrawerFormProps {
  isEdit: boolean;
  exchangeRate: number | undefined;
}

export const ReceivingGoodsDetailDrawerForm = ({
  isEdit,
  exchangeRate,
}: ReceivingGoodsDetailDrawerFormProps) => {
  const [translate] = useTranslation();

  const {
    goodsReceiptRequestItem: data,
    currency,
    setGoodsReceiptRequestItem,
  } = useReceivingGoodsDetailDrawerContext();

  const isVNDOrJPY = useMemo(
    () =>
      isEqual(currency, VND_CURRENCY_UNIT) ||
      isEqual(currency, JPY_CURRENCY_UNIT),
    [currency]
  );

  const handleUpdateField = (
    value: number | string | null,
    filedName: string
  ) => {
    const isFieldQuantity = isEqual(filedName, "quantity");
    if (!isFieldQuantity) {
      setGoodsReceiptRequestItem({
        ...data,
        contractGoodsItem: {
          ...data?.contractGoodsItem,
        },
        [filedName]: value,
        errors: {
          ...data?.errors,
          [filedName]: null,
        },
      });

      return;
    }
    const quantity = Number(value) || numberConstants.ZERO;
    const remainingQuantity = toFixedNumber(
      data?.qualityByContract - quantity - data?.alreadyReceivedQuantity,
      numberConstants.FOUR
    );

    const amountBeforeTax = roundTo(
      multiplyWithFixed(quantity, data?.unitPrice),
      isVNDOrJPY ? numberConstants.ZERO : numberConstants.TWO
    );
    const convertedAmountBeforeTax = exchangeCurrencyWithFixed(
      amountBeforeTax,
      exchangeRate
    );

    const taxAmount = roundTo(
      multiplyWithFixed(quantity, data?.taxAmountPerOne),
      isVNDOrJPY ? numberConstants.ZERO : numberConstants.TWO
    );
    const convertedTaxAmount = exchangeCurrencyWithFixed(
      taxAmount,
      exchangeRate
    );

    const totalAmount = sumWithFixed([amountBeforeTax, taxAmount]);
    const convertedTotalAmount = toFixedNumber(
      convertedAmountBeforeTax + convertedTaxAmount,
      numberConstants.ZERO
    );

    setGoodsReceiptRequestItem({
      ...data,
      contractGoodsItem: {
        ...data?.contractGoodsItem,
      },
      remainingQuantity,
      amountBeforeTax,
      convertedAmountBeforeTax,
      taxAmount,
      convertedTotalAmount,
      convertedTaxAmount,
      totalAmount,
      [filedName]: value,
      errors: {
        ...data?.errors,
        [filedName]: null,
      },
    });
  };

  useEffect(() => {
    handleUpdateField(data?.quantity, "quantity");
  }, [data?.quantity]);

  return (
    <div className={styles["form-container"]}>
      {isEqual(isEdit, true) ? (
        <>
          <div className={styles["form-top"]}>
            <FormItem
              validateObject={utilService.getValidateObj(data, "quantity")}
            >
              <InputNumber
                label={translate("RG.txt_actual_quantity_received")}
                placeHolder={translate("RG.txt_enter_actual_quantity_received")}
                isSmall={false}
                value={data?.quantity}
                numberType="DECIMAL"
                onChange={(value) => handleUpdateField(value, "quantity")}
                allowNegative
                isRequired
              />
            </FormItem>
            <FormItem
              validateObject={utilService.getValidateObj(data, "serialNumber")}
            >
              <InputText
                label={translate("RG.txt_serial_number")}
                placeHolder={translate("RG.txt_enter_serial_number")}
                isSmall={false}
                value={data?.serialNumber}
                onChange={(value) => handleUpdateField(value, "serialNumber")}
              />
            </FormItem>
          </div>
          <FormItem validateObject={utilService.getValidateObj(data, "note")}>
            <TextArea
              showCount
              label={translate("RG.txt_receipt_notes")}
              placeHolder={translate("RG.txt_enter_notes")}
              value={data?.note}
              maxLength={MAX_LENGTH_1000}
              onChange={(value) => handleUpdateField(value, "note")}
              resize="none"
              translate={translate}
            />
          </FormItem>
        </>
      ) : (
        <table className={styles["table"]}>
          <tbody>
            <tr>
              <ItemTable
                title={translate("RG.txt_actual_quantity_received")}
                content={formatNumber(data?.quantity)}
              />
              <ItemTable
                title={translate("RG.txt_serial_number")}
                content={data?.serialNumber}
                colSpan={numberConstants.TWO}
              />
            </tr>
            <tr>
              <ItemTable
                title={translate("RG.txt_receipt_notes")}
                content={data?.note}
                colSpan={numberConstants.THREE}
              />
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
