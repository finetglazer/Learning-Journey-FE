import dayjs from "dayjs";
import { useContext } from "react";
import { PaymentDetailHookContext } from "../../../PaymentDetailHook";

const ProposerPeople = () => {
  const { model, translate } = useContext(PaymentDetailHookContext);
  const businessBranchDTO = model?.paymentDetailInfomation?.businessBranchDTO;
  const businessUnitDTO = model?.paymentDetailInfomation?.businessUnitDTO;
  const businessDepartmentDTO =
    model?.paymentDetailInfomation?.businessDepartmentDTO;
  const positionDTO = model?.paymentDetailInfomation?.positionDTO;

  return (
    <div>
      <div className="fs-8 fw-semibold position-relative payment-top">
        {translate("PM.payment_proposer_people_label")}
      </div>
      <div className="border rounded-1">
        <div className="border-bottom">
          <div className="p-x--sm p-y--xs">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="payment-label">{positionDTO?.name}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {positionDTO?.code}
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
                <div className="fs-8 fw-normal">{businessBranchDTO?.name}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {businessBranchDTO?.code}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="">{businessUnitDTO?.name}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {businessUnitDTO?.code}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="">{businessDepartmentDTO?.name}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {businessDepartmentDTO?.code}
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
