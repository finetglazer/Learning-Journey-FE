import { PaymentCreateModel } from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext } from "react";

const ProposedValue = () => {
  const { translate, model, formatNumberToCurrency } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);

  return (
    <div>
      <div className="fw-semibold position-relative payment-top">
        {translate("PM.payment_proposed_value_title")}
      </div>
      <div className="border rounded-1">
        {/*start of amount*/}
        <div className="payment-bg_color">
          {/*Requested amount (tax included)*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--xs">
            <div className="payment-label">
              {translate("PM.payment_requested_amount_label")}
            </div>
            <div className="d-flex gap-1">
              <div>{formatNumberToCurrency(model.amount)}</div>
              <div className="payment-label payment-label_font_10">
                {model.currency?.code || translate("PM.payment_currency_unit")}
              </div>
            </div>
          </div>
          {/*Do not pay / withhold*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--2xs">
            <div className="payment-label">
              {translate("PM.payment_with_hold_not_pay_label")}
            </div>
            <div className="d-flex gap-1">
              <div>{formatNumberToCurrency(model.retentionAmount)}</div>
              <div className="payment-label payment-label_font_10">
                {model.currency?.code || translate("PM.payment_currency_unit")}
              </div>
            </div>
          </div>
        </div>
        {/*end of amount*/}
        {/*start Total amount due*/}
        <div className="p-x--sm p-y--xs">
          <div className="payment-label">
            {translate("PM.payment_total_amount_label")}
          </div>
          <div>
            <div className="d-flex gap-2 align-items-baseline justify-content-end">
              <div className="fw-bold text-wrap text-break fs-4">
                {formatNumberToCurrency(Math.max(0, model.totalAmountPayable))}
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

export default ProposedValue;
