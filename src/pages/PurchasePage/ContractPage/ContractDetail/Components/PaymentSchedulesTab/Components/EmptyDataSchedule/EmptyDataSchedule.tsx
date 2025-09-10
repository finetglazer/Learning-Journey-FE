import { EmptyContactPerson, PlusIcon } from "assets/icons";
import { ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";

const EmptyDataSchedule = () => {
  const [translate] = useTranslation();
  const { model, setIsOpenModalPaymentSchedule } =
    useContext<ContractDetailModel>(ContractDetailHookContext);

  if (model?.isDetail) return null;

  return (
    <div className="m-t--sm">
      <div className="empty-data-table__body">
        <img
          src={EmptyContactPerson}
          alt="empty icon"
          width={140}
          height={140}
        />
        <div className="empty-data-table__body__content">
          <span className="content">{translate("CT.no_payment_schedule")}</span>
          <div className="empty-data-table__body__content__button">
            <Button
              icon={<img src={PlusIcon} alt="img" width={12} height={12} />}
              iconPlace="left"
              type="secondary"
              onClick={() => setIsOpenModalPaymentSchedule(true)}
              disabled={!model?.originalPurchasePlanId}
            >
              {translate("CT.add_payment_schedule")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyDataSchedule;
