import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext } from "react";

const FinancicalInvoiceInfo = () => {
  const { model, translate, formatNumberToCurrency } = useContext(
    PaymentDetailHookContext
  );

  return (
    <div>
      <p className="payment-detail__title m-b--xs">
        {translate("PM.payment_title_financial_invoice_information")}
      </p>

      <div className="payment-detail__info rounded-top_left_right m-t--sm">
        <p className="payment-detail__info_title">
          {translate("PM.payment_amount_to_invoice_label")}
        </p>
        <p className="payment-detail__info_value">
          {formatNumberToCurrency(
            model?.paymentDetailInfomation?.outputInvoice?.amount
          ) || 0}
          <span className="payment-detail__currency m-l--3xs">
            {translate("PM.payment_currency_unit")}
          </span>
        </p>
      </div>
      <div className="payment-detail__content">
        <div className="payment-detail__content_left">
          <p className="payment-detail__content_title">
            {translate("PM.payment_tax_code_buyer_label")}
          </p>
          <p className="payment-detail__content_value">
            {model?.paymentDetailInfomation?.outputInvoice?.taxCode}
          </p>
        </div>
        <div className="payment-detail__content_right">
          <p className="payment-detail__content_title">
            {translate("PM.payment_name_buyer_label")}
          </p>
          <p className="payment-detail__content_value">
            {model?.paymentDetailInfomation?.outputInvoice?.name}
          </p>
        </div>
        <div className="payment-detail__content_left rounded-bottom_left">
          <p className="payment-detail__content_title">
            {translate("PM.payment_address_buyer_label")}
          </p>
          <p className="payment-detail__content_value">
            {model?.paymentDetailInfomation?.outputInvoice?.address}
          </p>
        </div>
        <div className="payment-detail__content_right rounded-bottom_right">
          <p className="payment-detail__content_title">
            {translate("PM.payment_content_goods_service_label")}
          </p>
          <p className="payment-detail__content_value">
            {model?.paymentDetailInfomation?.outputInvoice?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancicalInvoiceInfo;
