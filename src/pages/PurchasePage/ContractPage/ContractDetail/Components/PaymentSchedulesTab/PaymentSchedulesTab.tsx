import { AddIcon } from "assets/icons";
import { listValueCalculationPaymentSchedule } from "config/const";
import { isEmpty } from "lodash";
import { ContractDetailModel, ContractStatus } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext } from "react";
import { Button, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import EmptyDataSchedule from "./Components/EmptyDataSchedule/EmptyDataSchedule";
import PaymentScheduleModal from "./Components/PaymentScheduleModal/PaymentScheduleModal";
import PaymentScheduleTable from "./Components/PaymentScheduleTable/PaymentScheduleTable";
import "./PaymentSchedulesTab.scss";
import PaymentTrackingsTablet from "./Components/PaymentTrackingsTable/PaymentTrackingsTablet";

const PaymentSchedulesTab = () => {
  const [translate] = useTranslation();
  const {
    model,
    handleChangeSelectField,
    setIsOpenModalPaymentSchedule,
    isOpenModalPaymentSchedule,
    setRecordEditPaymentSchedule,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const isDetail = model?.isDetail;

  return (
    <div className="payment_schedule_tab">
      <div className="header">{translate("CT.tab_payment_schedule")}</div>
      <div className="value_calculation d-flex flex-row align-items-center">
        <div className="title">{translate("CT.value_calculation")}</div>
        <Select
          isSmall
          classFilter={undefined}
          isSearch={false}
          valueFilter={{
            name: "",
          }}
          getList={() => of(listValueCalculationPaymentSchedule)}
          onChange={handleChangeSelectField({
            fieldName: "calculationValue",
          })}
          value={model?.calculationValue}
          className="select"
          allowClear={false}
          disabled={!isEmpty(model?.paymentSchedules)}
          readOnly={isDetail}
        />
        {!isEmpty(model?.paymentSchedules) && !isDetail && (
          <Button
            iconPlace="left"
            type="secondary"
            size="lg"
            onClick={() => setIsOpenModalPaymentSchedule(true)}
            icon={<img src={AddIcon} alt="img" />}
            disabled={!model?.originalPurchasePlanId}
          >
            {translate("CT.add_payment_schedule")}
          </Button>
        )}
      </div>
      {!isEmpty(model?.paymentSchedules) ? (
        <PaymentScheduleTable />
      ) : (
        <EmptyDataSchedule />
      )}
      {isDetail && model?.status !== ContractStatus.WAITING_FOR_APPROVAL && (
        <PaymentTrackingsTablet />
      )}
      {isOpenModalPaymentSchedule && (
        <PaymentScheduleModal
          open={isOpenModalPaymentSchedule}
          handleCancel={() => {
            setIsOpenModalPaymentSchedule(false);
            setRecordEditPaymentSchedule(null);
          }}
        />
      )}
    </div>
  );
};

export default PaymentSchedulesTab;
