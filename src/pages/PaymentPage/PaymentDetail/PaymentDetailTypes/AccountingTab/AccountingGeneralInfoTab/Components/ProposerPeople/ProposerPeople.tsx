import dayjs from "dayjs";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext } from "react";

const ProposerPeople = () => {
  const { model, translate } = useContext(PaymentDetailHookContext);

  return (
    <div>
      <div className="fs-6 fw-semibold position-relative payment-top">
        {translate("PM.payment_proposer_people_label")}
      </div>
      <div className="border rounded-1">
        <div className="border-bottom">
          <div className="p-x--sm p-y--xs">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="payment-label">
                  {translate("PM.payment_second_level_employee_label")}
                </div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    012032
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="fw-bold fs-5">
                {model?.paymentDetailInfomation?.createUserName}
              </div>
              <div className="payment-label">
                {model?.paymentDetailInfomation?.createUser}
              </div>
              <div className="payment-label">
                {model?.paymentDetailInfomation?.phoneNumber}
              </div>
            </div>
          </div>
        </div>
        <div className="payment-bg_color">
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="fs-8 fw-normal">
                  {translate("PM.payment_headquarters_label")}
                </div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    1000
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="">
                  {translate("PM.payment_office_and_internal_service_label")}
                </div>
                <div>
                  <div className="payment-label border payment-tag_bg">28</div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="">
                  {translate("PM.payment_settlement_function_label")}
                </div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    0322
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-x--sm p-y--xs">
          <div className="d-flex">
            <div className="d-flex justify-content-between w-100">
              <div className="payment-label">
                {translate("PM.payment_date_of_proposal_label")}
              </div>
              <div>
                <div>
                  {dayjs(model?.paymentDetailInfomation?.createdDate).format(
                    "DD/MM/YYYY"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposerPeople;
