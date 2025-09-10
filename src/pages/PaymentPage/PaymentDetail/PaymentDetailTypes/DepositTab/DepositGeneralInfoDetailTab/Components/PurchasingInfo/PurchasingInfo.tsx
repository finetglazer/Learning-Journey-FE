import dayjs from "dayjs";
import { PURPOSE_OF_PURCHASE_TYPES, SHOPPING_PURPOSES } from "models/Payment";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext } from "react";

const PurchasingInfo = () => {
  const { model, translate, formatNumberToCurrency, renderPaymentMethod } =
    useContext(PaymentDetailHookContext);

  const paymentPurposeType =
    model?.paymentDetailInfomation?.paymentPurpose?.type;

  const getTitleByPaymentPurposeType = () => {
    const type = PURPOSE_OF_PURCHASE_TYPES.find(
      (item) => item.id === paymentPurposeType
    );
    return type?.name;
  };

  const renderPurposeShopping = () => {
    return (
      <div className="payment-detail__info_not_double m-t--sm">
        <div className="payment-detail__info_not_double_left rounded-left_bottom">
          <p className="payment-detail__info_title">
            {translate("PM.shopping_purpose")}
          </p>
          <p className="payment-detail__info_value">
            {getTitleByPaymentPurposeType()}
          </p>
        </div>
        <div className="payment-detail__info_not_double_right rounded-right_bottom">
          <p className="payment-detail__info_title">{translate("PM.note")}</p>
          <p className="payment-detail__info_value">
            {model?.paymentDetailInfomation?.paymentPurpose?.note}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="m-b--2xl"></div>

      <div>
        <div className="payment-detail__info rounded-top_left_right">
          <p className="payment-detail__info_title">
            {translate("PM.suggest_interpretation")}
          </p>
          <p className="payment-detail__info_value">
            {model?.paymentDetailInfomation?.description}
          </p>
        </div>
        <div className="payment-detail__content">
          <div className="payment-detail__content_left">
            <p className="payment-detail__content_title">
              {translate("PM.payment_suggest_amount")}
            </p>
            <p className="payment-detail__content_value">
              {formatNumberToCurrency(model?.paymentDetailInfomation?.amount) ||
                0}
              <span className="payment-detail__currency m-l--3xs">
                {model?.paymentDetailInfomation?.currencyDTO?.code ||
                  translate("PM.payment_currency_unit")}
              </span>
            </p>
          </div>
          <div className="payment-detail__content_right">
            <p className="payment-detail__content_title">
              {translate("PM.payment_method")}
            </p>
            <p className="payment-detail__content_value">
              {renderPaymentMethod()}
            </p>
          </div>
        </div>

        <div className="payment-detail__info_double m-t--sm">
          <div className="payment-detail__info_double_left rounded-top_left">
            <p className="payment-detail__info_title">
              {translate("PM.type_of_cost")}
            </p>
            <p className="payment-detail__info_value">
              {model?.paymentDetailInfomation?.costTypeDTO?.name}
            </p>
          </div>
          <div className="payment-detail__info_double_right rounded-top_right">
            <p className="payment-detail__info_title">
              {translate("PM.expense_item")}
            </p>
            <p className="payment-detail__info_value">
              {model?.paymentDetailInfomation?.costGroupDTO?.name}
            </p>
          </div>
        </div>
        <div className="payment-detail_content_full">
          <div className="">
            <p className="payment-detail__content_title">
              {translate("PM.payment_deposit_refund_date")}
            </p>
            <p className="payment-detail__content_value">
              {model?.paymentDetailInfomation?.actionDate &&
                dayjs(model?.paymentDetailInfomation?.actionDate).format(
                  "DD/MM/YYYY"
                )}
            </p>
          </div>
        </div>

        {model?.paymentDetailInfomation?.paymentPurpose?.type ===
          SHOPPING_PURPOSES.PROMOTION_PROGRAM && (
          <>
            <div className="payment-detail__info rounded-top_left_right m-t--sm">
              <p className="payment-detail__info_title">
                {translate("PM.shopping_purpose")}
              </p>
              <p className="payment-detail__info_value">
                {translate("PM.txt_promotional_purchasing")}
              </p>
            </div>
            <div className="payment-detail__content">
              <div className="payment-detail__content_left">
                <p className="payment-detail__content_title">
                  {translate("PM.name_ctkm")}
                </p>
                <p className="payment-detail__content_value">
                  {
                    model?.paymentDetailInfomation?.paymentPurpose?.promotionDTO
                      ?.name
                  }
                </p>
              </div>
              <div className="payment-detail__content_right">
                <p className="payment-detail__content_title">
                  {translate("PM.code_ctkm")}
                </p>
                <p className="payment-detail__content_value">
                  {
                    model?.paymentDetailInfomation?.paymentPurpose?.promotionDTO
                      ?.code
                  }
                </p>
              </div>
              <div className="payment-detail__content_left rounded-bottom_left">
                <p className="payment-detail__content_title">
                  {translate("PM.total_budget_ctkm")}
                </p>
                <p className="payment-detail__content_value">
                  {formatNumberToCurrency(
                    model?.paymentDetailInfomation?.paymentPurpose?.promotionDTO
                      ?.budget
                  ) || 0}
                  <span className="payment-detail__currency m-l--3xs">
                    {translate("PM.payment_currency_unit")}
                  </span>
                </p>
              </div>
              <div className="payment-detail__content_right rounded-bottom_right">
                <p className="payment-detail__content_title">
                  {translate("PM.time_of_execution_ctkm")}
                </p>
                <p className="payment-detail__content_value">
                  {model?.paymentDetailInfomation?.paymentPurpose?.promotionDTO
                    ?.startDate &&
                    model?.paymentDetailInfomation?.paymentPurpose?.promotionDTO
                      ?.endDate &&
                    dayjs(
                      model?.paymentDetailInfomation?.paymentPurpose
                        ?.promotionDTO?.startDate
                    ).format("DD/MM/YYYY") +
                      " - " +
                      dayjs(
                        model?.paymentDetailInfomation?.paymentPurpose
                          ?.promotionDTO?.endDate
                      ).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </>
        )}

        {model?.paymentDetailInfomation?.paymentPurpose?.type ===
          SHOPPING_PURPOSES.REPAIR_MAINTENANCE && (
          <div className="payment-detail__info_double m-t--sm">
            <div className="payment-detail__info_double_left rounded-left_bottom">
              <p className="payment-detail__info_title">
                {translate("PM.shopping_purpose")}
              </p>
              <p className="payment-detail__info_value">
                {translate("PM.txt_repair_maintenance")}
              </p>
            </div>
            <div className="payment-detail__info_double_right rounded-right_bottom">
              <p className="payment-detail__info_title">
                {translate("PM.payment_asset_code_input_label")}
              </p>
              <p className="payment-detail__info_value">
                {model?.paymentDetailInfomation?.paymentPurpose?.assetCode}
              </p>
            </div>
          </div>
        )}

        {model?.paymentDetailInfomation?.paymentPurpose?.type ===
          SHOPPING_PURPOSES.ACCORDING_PROJECT && (
          <div className="payment-detail__info_not_double m-t--sm">
            <div className="payment-detail__info_not_double_left rounded-left_bottom">
              <p className="payment-detail__info_title">
                {translate("PM.shopping_purpose")}
              </p>
              <p className="payment-detail__info_value">
                {translate("PM.txt_project_based")}
              </p>
            </div>
            <div className="payment-detail__info_not_double_right rounded-right_bottom">
              <p className="payment-detail__info_title">
                {translate("PM.name_project")}
              </p>
              <p className="payment-detail__info_value">
                {
                  model?.paymentDetailInfomation?.paymentPurpose?.projectDTO
                    ?.name
                }
              </p>
            </div>
          </div>
        )}

        {[
          SHOPPING_PURPOSES.NORMAL_SHOPPING,
          SHOPPING_PURPOSES.OTHER,
          SHOPPING_PURPOSES.STORAGE_PURCHASING,
          SHOPPING_PURPOSES.FINANCIAL_LEASE,
          SHOPPING_PURPOSES.OPERATING_LEASE,
          SHOPPING_PURPOSES.SOFTWARE_LEASE,
          SHOPPING_PURPOSES.NOT_PROMOTIONAL_PURCHASING,
          SHOPPING_PURPOSES.UNIFORM_PURCHASING,
        ].includes(paymentPurposeType) && renderPurposeShopping()}
      </div>
    </div>
  );
};

export default PurchasingInfo;
