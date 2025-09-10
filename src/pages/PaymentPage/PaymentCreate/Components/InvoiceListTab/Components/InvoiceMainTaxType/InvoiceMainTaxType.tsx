import React, { useContext, useEffect } from "react";
import "../../../../PaymentCreateTypes/PaymentRequest/PaymentCostAllocationTab/Components/MainTaxType/MainTaxType.scss";
import { useTranslation } from "react-i18next";
import { Radio } from "react-components-design-system";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { LIST_TAX, PaymentCreateModel, TAX_TYPE_ENUM } from "models/Payment";
import { isNil } from "lodash";
type props = {
  disableTaxMain: boolean;
};
function InvoiceMainTaxType({ disableTaxMain }: props) {
  const [translate] = useTranslation();
  const { handleChangeSingleField, model } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );
  const [selectTax, setSelectTax] = React.useState<number>();

  const handleChange = (value: number) => {
    setSelectTax(value);
    handleChangeSingleField({
      fieldName: "taxTypeInvoiceSubmit",
    })(value);
  };

  useEffect(() => {
    if (!isNil(model.taxTypeInvoiceSubmit)) {
      handleChange(model.taxTypeInvoiceSubmit);
      handleChangeSingleField({
        fieldName: "taxTypeEnum",
      })(model.taxTypeInvoiceSubmit);
    } else {
      handleChange(TAX_TYPE_ENUM.VAT);
      handleChangeSingleField({
        fieldName: "taxTypeEnum",
      })(TAX_TYPE_ENUM.VAT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.taxTypeInvoiceSubmit, model.taxTypeEnum]);

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
              disabled={disableTaxMain}
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

export default InvoiceMainTaxType;
