import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext } from "react";

const SupplierInfo = () => {
  const { model, translate } = useContext(PaymentDetailHookContext);

  return (
    <div>
      <p className="payment-detail__title m-b--xs">
        {translate("PM.supplier_info")}
      </p>

      <div className="payment-detail__info_double m-t--sm">
        <div className="payment-detail__info_double_left rounded-top_left">
          <p className="payment-detail__info_title">
            {translate("PM.label_supplier")}
          </p>
          <p className="payment-detail__info_value">
            {model?.paymentDetailInfomation?.supplierDTO?.name}
          </p>
        </div>
        <div className="payment-detail__info_double_right rounded-top_right">
          <p className="payment-detail__info_title">
            {translate("PM.payment_supplier_code_input_label")}
          </p>
          <p className="payment-detail__info_value">
            {model?.paymentDetailInfomation?.supplierDTO?.code}
          </p>
        </div>
      </div>
      <div className="payment-detail__content">
        <div className="payment-detail__content_left rounded-bottom_left">
          <p className="payment-detail__content_title">
            {translate("PM.mst_cccd_cmnd")}
          </p>
          <p className="payment-detail__content_value">
            {model?.paymentDetailInfomation?.supplierDTO?.taxCode}
          </p>
        </div>
        <div className="payment-detail__content_right rounded-bottom_right">
          <p className="payment-detail__content_title">
            {translate("PM.payment_supplier_type_input_label")}
          </p>
          <p className="payment-detail__content_value">
            {model?.paymentDetailInfomation?.supplierDTO?.type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplierInfo;
