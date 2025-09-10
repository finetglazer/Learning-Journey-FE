import { Budget } from "assets/icons";
import add from "assets/icons/add.svg";
import { COST_DRIVER_TYPE, PaymentCreateModel } from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./EmptyDataTable.scss";

const EmptyDataTable = () => {
  const [translate] = useTranslation();

  const { model, handleClickAddCostAllocationLine } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);

  return (
    <div className="empty-data-table__body">
      <Budget width={140} height={140} />
      <div className="empty-data-table__body__content">
        <span className="content">
          {translate("PM.no_data_recorded")}
          <br />
          {translate("PM.add_new_data")}
        </span>
        {model.costDriver?.code ===
          COST_DRIVER_TYPE.COST_DRIVER_ABSOLUTE_AMOUNT && (
          <div className="empty-data-table__body__content__button">
            <Button
              icon={<img src={add} alt="img" width={12} height={12} />}
              iconPlace="left"
              type="secondary"
              onClick={handleClickAddCostAllocationLine}
            >
              {translate("PM.add_cost_allocation_line")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyDataTable;
