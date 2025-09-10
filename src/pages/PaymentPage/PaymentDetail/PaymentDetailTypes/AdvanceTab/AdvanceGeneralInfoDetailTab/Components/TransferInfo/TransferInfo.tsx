import listDashes from "assets/icons/listDashes.svg";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { PaymentDetailHookContext } from "../../../../../PaymentDetailHook";

const TransferInfo = () => {
  const { model, translate, formatNumberToCurrency, setModalType } = useContext(
    PaymentDetailHookContext
  );

  const handleOpenModal = () => {
    setModalType("OPEN");
  };

  return (
    <div>
      <p className="payment-detail__title m-b--xs">
        {translate("PM.transfer_info")}
      </p>
      {model?.paymentDetailInfomation?.paymentInformation?.transferInfos
        .length !== 0 ? (
        <div className="payment-detail__content_bank_transfer m-t--sm">
          <div className="payment-detail__content_bank_transfer_left">
            <p className="payment-detail__content_title">
              {translate("PM.payment_bank_amount_input_label")}
            </p>
            <p className="payment-detail__content_value">
              {formatNumberToCurrency(
                Math.max(
                  model?.paymentDetailInfomation?.paymentInformation
                    ?.transferAmount,
                  0
                )
              ) || 0}
              <span className="payment-detail__currency m-l--3xs">
                {model?.paymentDetailInfomation?.currencyDTO?.code ||
                  translate("PM.payment_currency_unit")}
              </span>
            </p>
          </div>
          <div className="payment-detail__content_bank_transfer_right">
            <Button
              icon={<img src={listDashes} alt="img" />}
              iconPlace="left"
              type="secondary"
              size="lg"
              onClick={handleOpenModal}
            >
              {translate(
                "PM.payment_view_the_transfer_detail_list_label_button"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="payment-detail__info_double m-t--sm">
            <div className="payment-detail__info_double_left rounded-top_left">
              <p className="payment-detail__info_title">
                {translate("PM.payment_bank_amount_input_label")}
              </p>
              <p className="payment-detail__info_value">
                {formatNumberToCurrency(
                  Math.max(
                    model?.paymentDetailInfomation?.paymentInformation
                      ?.transferAmount,
                    0
                  )
                ) || 0}
                <span className="payment-detail__currency m-l--3xs">
                  {model?.paymentDetailInfomation?.currencyDTO?.code ||
                    translate("PM.payment_currency_unit")}
                </span>
              </p>
            </div>
            <div className="payment-detail__info_double_right rounded-top_right">
              <p className="payment-detail__info_title">
                {translate("PM.receiving_account_name")}
              </p>
              <p className="payment-detail__info_value">
                {
                  model?.paymentDetailInfomation?.paymentInformation
                    ?.accountName
                }
              </p>
            </div>
          </div>
          <div className="payment-detail__content">
            <div className="payment-detail__content_left rounded-bottom_left">
              <p className="payment-detail__content_title">
                {translate(
                  "PM.payment_bank_transfer_beneficiary_bank_input_label"
                )}
              </p>
              <p className="payment-detail__content_value">
                {model?.paymentDetailInfomation?.paymentInformation?.bankName}
              </p>
            </div>
            <div className="payment-detail__content_right rounded-bottom_right">
              <p className="payment-detail__content_title">
                {translate("PM.payment_number_of_account_affected")}
              </p>
              <p className="payment-detail__content_value">
                {
                  model?.paymentDetailInfomation?.paymentInformation
                    ?.accountNumber
                }
              </p>
            </div>
          </div>
          <div className="payment-detail_content_full">
            <div className="">
              <p className="payment-detail__content_title">
                {translate("PM.transfer_content")}
              </p>
              <p className="payment-detail__content_value">
                {
                  model?.paymentDetailInfomation?.paymentInformation
                    ?.description
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransferInfo;
