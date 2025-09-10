import { CheckedDisable, IcCheckedSuccess } from "assets/icons";
import { useContext } from "react";
import { PaymentDetailHookContext } from "../../../../../PaymentDetailHook";

const ProposedValue = () => {
  const { model, translate, formatNumberToCurrency } = useContext(
    PaymentDetailHookContext
  );

  // const totalFDAInvoice = model?.paymentDetailInfomation?.invoices?.reduce(
  //   (total: number, item: { paymentAmount: number }) =>
  //     total + item?.paymentAmount,
  //   0
  // );

  // const totalOtherInvoice =
  //   model?.paymentDetailInfomation?.otherDocuments?.reduce(
  //     (total: number, item: { paymentAmount: number }) =>
  //       total + item?.paymentAmount,
  //     0
  //   );

  // const refundedToCompany =
  //   totalFDAInvoice +
  //   totalOtherInvoice -
  //   (model?.paymentDetailInfomation?.applyAdvancesTotal +
  //     model?.paymentDetailInfomation?.applyDepositsTotal) +
  //   model?.paymentDetailInfomation?.retention;

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
          {/*Refund / Deposit*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--2xs">
            <div className="payment-label">
              {translate("PM.payment_deposit_amount_label")}
            </div>
            <div className="d-flex gap-1">
              <div>
                {formatNumberToCurrency(
                  model?.paymentDetailInfomation?.applyAdvancesTotal +
                    model?.paymentDetailInfomation?.applyDepositsTotal
                ) || 0}
              </div>
              <div className="payment-label payment-label_font_10">
                {model?.paymentDetailInfomation?.currencyDTO?.code ||
                  translate("PM.payment_currency_unit")}
              </div>
            </div>
          </div>
          {/*Disinvestment*/}
          <div className="d-flex flex-wrap justify-content-between border-bottom p-x--sm p-y--2xs">
            <div className="payment-label">
              {translate("PM.payment_disinvestment_amount_label")}
            </div>
            <div className="d-flex gap-1">
              <div>
                {formatNumberToCurrency(
                  model?.paymentDetailInfomation?.refundPlanToSpentsTotal
                ) || 0}
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
        <div className="p-x--sm p-y--xs border-bottom">
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
        {/*start Amount to be refunded to the company*/}
        <div className="p-x--sm p-y--xs">
          <div className="d-flex align-items-center gap-1 m-t--2xs">
            <img
              src={
                model?.paymentDetailInfomation?.isRefundedToCompany
                  ? IcCheckedSuccess
                  : CheckedDisable
              }
              width={13}
              height={13}
              alt="icon_checked_success"
            />
            <div className="d-flex align-items-center payment-label">
              {translate("PM.payment_return_money")}
            </div>
          </div>
          <div className="d-flex m-t--3xs">
            <div className="d-flex justify-content-end w-100">
              <div className="d-flex gap-2 align-items-baseline justify-content-end">
                <div className="fw-bold">
                  {formatNumberToCurrency(
                    Math.max(
                      -model?.paymentDetailInfomation?.paymentInformation
                        ?.transferAmount,
                      0
                    )
                  ) || 0}
                </div>
                <div className="payment-label payment-label_font_10">
                  {model?.paymentDetailInfomation?.currencyDTO?.code ||
                    translate("PM.payment_currency_unit")}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*end Amount to be refunded to the company*/}
      </div>
    </div>
  );
};

export default ProposedValue;
