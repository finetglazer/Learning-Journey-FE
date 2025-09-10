import { PaymentCreateModel } from "models/Payment";
import { useContext, useEffect } from "react";
import { Checkbox } from "react-components-design-system";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";

const ProposedValue = () => {
  const {
    translate,
    model,
    formatNumberToCurrency,
    handleChangeSingleField,
    idDetail,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);
  useEffect(() => {
    const unTotalAmountPayable = -model?.totalAmountPayable;
    if (unTotalAmountPayable <= 0) {
      handleChangeSingleField({
        fieldName: "isRefundedToCompany",
      })(false);
    }
  }, [model?.totalAmountPayable]);
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
              <div>{formatNumberToCurrency(model?.retentionAmount)}</div>
              <div className="payment-label payment-label_font_10">
                {model.currency?.code || translate("PM.payment_currency_unit")}
              </div>
            </div>
          </div>
          {/*Refund / Deposit*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--2xs">
            <div className="payment-label">
              {translate("PM.payment_deposit_amount_label")}
            </div>
            <div className="d-flex gap-1">
              <div>{formatNumberToCurrency(model?.depositReversalAmount)}</div>
              <div className="payment-label payment-label_font_10">
                {model.currency?.code || translate("PM.payment_currency_unit")}
              </div>
            </div>
          </div>
          {/*Disinvestment*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--2xs">
            <div className="payment-label">
              {translate("PM.payment_disinvestment_amount_label")}
            </div>
            <div className="d-flex gap-1">
              <div>{formatNumberToCurrency(model?.expenseReversalAmount)}</div>
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
              <div className="fw-bold fs text-wrap text-break payment-size-24">
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
        {/*start Amount to be refunded to the company*/}
        <div className="p-x--sm p-y--xs">
          <div className="d-flex">
            <div className="d-flex justify-content-between w-100">
              <div className="payment-label">
                {translate("PM.payment_amount_refunded_label")}
              </div>
              <div>
                <div className="d-flex gap-2 align-items-baseline justify-content-end">
                  <div className="fw-bold">
                    {formatNumberToCurrency(
                      Math.max(0, -model.totalAmountPayable)
                    )}
                  </div>
                  <div className="payment-label payment-label_font_10">
                    {model.currency?.code ||
                      translate("PM.payment_currency_unit")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="m-t--2xs">
            <Checkbox
              disabled={-model?.totalAmountPayable <= 0}
              label={translate("PM.payment_excess_amount_refunded_label")}
              checked={model.isRefundedToCompany}
              onChange={
                handleChangeSingleField({
                  fieldName: "isRefundedToCompany",
                }) as () => (value: boolean) => void
              }
            />
          </div>
        </div>
        {/*end Amount to be refunded to the company*/}
      </div>
    </div>
  );
};

export default ProposedValue;
