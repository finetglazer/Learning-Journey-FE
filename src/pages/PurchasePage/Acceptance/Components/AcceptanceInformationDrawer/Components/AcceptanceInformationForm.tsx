import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { numberConstants } from "core/config/consts";
import {
  dividedWithFixed,
  exchangeCurrencyWithFixed,
  multiplyWithFixed,
  sumWithFixed,
  toFixedByCurrency,
} from "core/helpers/calculator";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { taxRepository } from "core/repositories/TaxRepository";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { useAcceptanceInformationContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { ReactNode } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../AcceptanceInformationDrawer.module.scss";

interface ReceivingGoodsDetailDrawerFormProps {
  isEdit: boolean;
  exchangeRate: number | undefined;
  children: ReactNode;
}

export const AcceptanceInformationForm = ({
  isEdit,
  children,
}: ReceivingGoodsDetailDrawerFormProps) => {
  const [translate] = useTranslation();

  const { goodsReceiptSelect, setGoodsReceiptSelect, model } =
    useAcceptanceInformationContext();

  const handleCalculator = (taxAmount: number) => {
    const exchangeRate = model?.exchangeRate;

    const totalAmount =
      sumWithFixed([taxAmount, goodsReceiptSelect?.amountBeforeTax]) ||
      numberConstants.ZERO;

    const taxConvertedAmount =
      exchangeCurrencyWithFixed(taxAmount, exchangeRate) ||
      numberConstants.ZERO;
    const totalConvertedAmount =
      exchangeCurrencyWithFixed(totalAmount, exchangeRate) ||
      numberConstants.ZERO;

    return {
      totalAmount,
      taxConvertedAmount,
      totalConvertedAmount,
    };
  };

  const handleUpdateField = (
    value: number | string | OptionBaseModel | null,
    filedName: string
  ) => {
    const errors: Model.Errors<Model> = {
      ...goodsReceiptSelect.errors,
      [filedName]: undefined,
    };
    const isUpdateTax = ["tax"].includes(filedName);
    if (isUpdateTax) {
      const taxAmount = toFixedByCurrency(
        dividedWithFixed(
          multiplyWithFixed(
            goodsReceiptSelect?.amountBeforeTax,
            (value as OptionBaseModel)?.rate
          ) || numberConstants.ZERO,
          100
        ),
        model?.currency
      );
      setGoodsReceiptSelect({
        ...goodsReceiptSelect,
        [filedName]: value,
        taxAmount,
        ...handleCalculator(taxAmount),
        errors,
      });

      return;
    }

    if (isEqual("taxAmount", filedName)) {
      setGoodsReceiptSelect({
        ...goodsReceiptSelect,
        [filedName]: value,
        ...handleCalculator(Number(value)),
        errors,
      });
      return;
    }

    setGoodsReceiptSelect({
      ...goodsReceiptSelect,
      [filedName]: value,
      errors,
    });
  };

  const isView = isEqual(isEdit, false);

  return (
    <div className={styles["form-container"]}>
      <FormItem
        validateObject={utilService.getValidateObj(
          goodsReceiptSelect,
          "acceptanceNote"
        )}
      >
        <InputText
          label={translate("AC.txt_acceptance_notes")}
          placeHolder={translate("AC.txt_enter_acceptance_notes")}
          value={goodsReceiptSelect?.acceptanceNote}
          onChange={(value) =>
            handleUpdateField(value?.trim(), "acceptanceNote")
          }
          isSmall={false}
          readOnly={isView}
          disabled={isView}
        />
      </FormItem>
      <FormItem
        validateObject={utilService.getValidateObj(goodsReceiptSelect, "note")}
      >
        <InputText
          label={translate("AC.txt_notes")}
          placeHolder={translate("AC.txt_enter_notes")}
          value={goodsReceiptSelect?.note}
          onChange={(value) => handleUpdateField(value?.trim(), "note")}
          isSmall={false}
          readOnly={isView}
          disabled={isView}
        />
      </FormItem>
      {children}
      <div
        className={classNames(styles["form-item"], styles["form-item--half"])}
      >
        <FormItem
          validateObject={utilService.getValidateObj(goodsReceiptSelect, "tax")}
        >
          <Select
            label={translate("AC.txt_tax_rate")}
            classFilter={undefined}
            searchProperty="name"
            searchType=""
            isSearch={true}
            valueFilter={{
              name: "",
            }}
            value={goodsReceiptSelect?.tax}
            onChange={(_, option) => handleUpdateField(option, "tax")}
            getList={taxRepository.getDropdown}
            isEnumerable={false}
            isSmall={false}
            appendToBody
            readOnly={isView}
            allowClear={false}
            disabled={isView}
            render={(tax) => (tax?.id ? `${tax?.code} - ${tax?.name}` : null)}
          />
        </FormItem>
      </div>
      <div
        className={classNames(styles["form-item"], styles["form-item--half"])}
      >
        <FormItem
          validateObject={utilService.getValidateObj(
            goodsReceiptSelect,
            "taxAmount"
          )}
        >
          <InputNumber
            label={translate("AC.txt_tax_value")}
            placeHolder={translate("AC.txt_enter_tax_value")}
            numberType={getNumberTypeByCurrency(model?.currency)}
            suffix={model?.currency}
            value={goodsReceiptSelect?.taxAmount}
            onChange={(value) => handleUpdateField(value, "taxAmount")}
            isSmall={false}
            readOnly={isView}
            max={NUMBER_MAX_13}
            disabled={isView}
          />
        </FormItem>
      </div>
    </div>
  );
};
