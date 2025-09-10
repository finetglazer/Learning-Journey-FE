import React, { useContext, useEffect } from "react";
import "./MainTaxType.scss";
import { useTranslation } from "react-i18next";
import { Radio } from "react-components-design-system";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { PaymentCreateModel } from "models/Payment";

export enum TaxTypeEnum {
  VAT = 0,
  PERSONAL_INCOME = 1,
  CONTRACTOR = 2,
  NO_TAX = 3,
}

function MainTaxType() {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );

  const [selectTax, setSelectTax] = React.useState<number>();

  const LIST_TAX = [
    {
      id: TaxTypeEnum.VAT,
      name: translate("PM.vat_tax"),
    },
    {
      id: TaxTypeEnum.PERSONAL_INCOME,
      name: translate("PM.personal_income_tax"),
    },
    {
      id: TaxTypeEnum.CONTRACTOR,
      name: translate("PM.contractor_tax"),
    },
    {
      id: TaxTypeEnum.NO_TAX,
      name: translate("PM.no_tax"),
    },
  ];

  const handleChange = (value: number) => {
    setSelectTax(value);
    handleChangeSingleField({
      fieldName: "taxTypeEnum",
    })(value);
  };

  useEffect(() => {
    if (model.taxTypeEnum) {
      handleChange(model.taxTypeEnum);
      handleChangeSingleField({
        fieldName: "taxTypeInvoiceSubmit",
      })(model.taxTypeEnum);
    } else {
      handleChange(TaxTypeEnum.VAT);
      handleChangeSingleField({
        fieldName: "taxTypeInvoiceSubmit",
      })(TaxTypeEnum.VAT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.taxTypeEnum, model.taxTypeInvoiceSubmit]);

  return (
    <div className="main-tax-type">
      <span className="main-tax-type__title">
        {translate("PM.main_tax_type")}
      </span>
      <div className="main-tax-type__content">
        {LIST_TAX.map((tax) => {
          return (
            <Radio
              value={tax.name}
              key={tax.id}
              checked={tax.id === selectTax}
              disabled={
                model?.costAllocation.length > 0 ||
                model?.invoices.length > 0 ||
                model?.invoicesOtherDocument?.length > 0 ||
                model?.expenseApplicationList?.length > 0
              }
              onChange={() => handleChange(tax.id)}
            >
              {tax.name}
            </Radio>
          );
        })}
      </div>
    </div>
  );
}

export default MainTaxType;
