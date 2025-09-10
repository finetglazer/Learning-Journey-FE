import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext } from "react";

const ProposedValue = () => {
  const { model, translate, formatNumberToCurrency } = useContext(
    PaymentDetailHookContext
  );

  return (
    <div>
      <div className="border rounded-1">
        {/*start Total amount due*/}
        <div className="p-x--sm p-y--xs">
          <div className="payment-label">
            {translate("PM.payment_suggest_amount")}
          </div>
          <div>
            <div className="d-flex gap-2 align-items-baseline justify-content-end">
              <div className="fw-bold fs-4">
                <div>
                  {formatNumberToCurrency(
                    model?.paymentDetailInfomation?.amount
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
