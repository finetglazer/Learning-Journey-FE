import { PaymentCreateModel, PeopleAmountModel } from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext, useEffect, useState } from "react";

const AccountingEntryProposedValue = () => {
  const { translate, model, formatNumberToCurrency } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const [amountPeople, setAmountPeople] = useState<PeopleAmountModel>({
    retentionAmount: 0,
    amount: 0,
    totalAmount: 0,
  });
  useEffect(() => {
    setAmountPeople({
      retentionAmount: model.retentionAmount,
      amount: model.amount,
      totalAmount: model.amount - (model.retentionAmount || 0),
    });
  }, [model?.amount, model?.retentionAmount]);
  return (
    <div>
      <div className="fw-semibold position-relative payment-top">
        {translate("PM.payment_proposed_value_title")}
      </div>
      <div className="border rounded-1">
        {/*start Total amount due*/}
        <div className="p--sm">
          <div className="payment-label">
            {translate("PM.payment_proposed_amount_input_label")}
          </div>
          <div>
            <div className="d-flex gap-2 align-items-baseline justify-content-end">
              <div className="fw-bold text-wrap text-break fs-4">
                {formatNumberToCurrency(amountPeople.totalAmount)}
              </div>
              <div className="">
                <span className="payment-label payment-label_font_10">
                  {model.currency?.code ||
                    translate("PM.payment_currency_unit")}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/*end Total amount due*/}
      </div>
    </div>
  );
};

export default AccountingEntryProposedValue;
