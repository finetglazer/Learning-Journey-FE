import { useContext } from "react";
import { PaymentDetailHookContext } from "../../../../../PaymentDetailHook";

const ProposedValue = () => {
  const { model, translate } = useContext(PaymentDetailHookContext);

  const formatNumberToCurrency = (value: number) => {
    if (!value) {
      return "0";
    }
    const parts = value.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1] ? parts[1].replace(".", ",") : "";
    return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
  };

  return (
    <div>
      <div className="border rounded-1">
        {/*start of amount*/}
        <div className="payment-bg_color">
          {/*Requested amount (tax included)*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--xs">
            <div className="payment-label">
              {translate("PM.payment_requested_amount_label")}
            </div>
            <div className="d-flex gap-1">
              <div>
                {formatNumberToCurrency(
                  model?.paymentDetailInfomation?.amount
                ) || 0}
              </div>
              <div className="payment-label payment-label_font_10">
                {model?.paymentDetailInfomation?.currencyDTO?.code ||
                  translate("PM.payment_currency_unit")}
              </div>
            </div>
          </div>
          {/*Do not pay / withhold*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--2xs">
            <div className="payment-label">
              {translate("PM.payment_with_hold_not_pay_label")}
            </div>
            <div className="d-flex gap-1">
              <div>
                {model?.paymentDetailInfomation?.retention &&
                  formatNumberToCurrency(
                    model?.paymentDetailInfomation?.retention
                  )}
              </div>
              <div className="payment-label payment-label_font_10">
                {model?.paymentDetailInfomation?.currencyDTO?.code ||
                  translate("PM.payment_currency_unit")}
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
              <div className="fw-bold fs-4">
                <div>
                  {formatNumberToCurrency(
                    Math.max(
                      model?.paymentDetailInfomation?.paymentInformation
                        ?.transferAmount,
                      0
                    )
                  ) || 0}
                </div>
              </div>
              <div className="">
                <span className="payment-label payment-label_font_10">
                  {model?.paymentDetailInfomation?.currencyDTO?.code ||
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
