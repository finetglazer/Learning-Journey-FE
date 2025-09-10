import EmptyTab from "components/EmtyTab/EmptyTab";
import CostAllocationTable from "./Components/CostAllocationTable/CostAllocationTable";
import { useContext } from "react";
import { PaymentDetailModel } from "models/Payment";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";

const ExpenseCostAllocationTab = () => {
  const { model } = useContext<PaymentDetailModel>(PaymentDetailHookContext);

  return (
    <div className="">
      {model?.paymentDetailInfomation?.costAllocation?.costAllocationLines
        ?.length == 0 ? (
        <EmptyTab />
      ) : (
        <CostAllocationTable />
      )}
      <div className="m-t--2xl"></div>
    </div>
  );
};

export default ExpenseCostAllocationTab;
