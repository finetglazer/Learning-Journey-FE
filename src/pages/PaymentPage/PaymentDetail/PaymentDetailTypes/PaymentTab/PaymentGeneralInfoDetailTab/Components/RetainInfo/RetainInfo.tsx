import { useContext } from "react";
import { PaymentDetailHookContext } from "../../../../../PaymentDetailHook";

const RetainInfo = () => {
  const { model, translate, formatNumberToCurrency } = useContext(
    PaymentDetailHookContext
  );

  return (
    <div>
      <p className="payment-detail__title m-b--xs">
        {translate("PM.retain_info")}
      </p>

      <div className="payment-detail__info_not_double m-t--sm">
        <div className="payment-detail__info_not_double_left rounded-left_bottom">
          <p className="payment-detail__info_title">
            {translate("PM.retained_amount")}
          </p>
          <p className="payment-detail__info_value">
            {model?.paymentDetailInfomation?.retention &&
              formatNumberToCurrency(model?.paymentDetailInfomation?.retention)}
            <span className="payment-detail__currency m-l--3xs">
              {model?.paymentDetailInfomation?.currencyDTO?.code ||
                translate("PM.payment_currency_unit")}
            </span>
          </p>
        </div>
        <div className="payment-detail__info_not_double_right rounded-right_bottom">
          <p className="payment-detail__info_title">{translate("PM.note")}</p>
          <p className="payment-detail__info_value">
            {model?.paymentDetailInfomation?.retentionNote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RetainInfo;
