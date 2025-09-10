import CostAllocationTable from "./Components/CostAllocationTable/CostAllocationTable";
import { useContext } from "react";
import { isEmpty, size } from "lodash";
import ContactOrder from "pages/PaymentPage/PaymentCreate/Components/ContactOrder/ContactOrder";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";

const PaymentCostAllocationTab = () => {
  const { model } = useContext(PaymentDetailHookContext);
  const inheritContractSettlement =
    model?.paymentDetailInfomation?.inheritContractSettlement;
  const contractSettlement = inheritContractSettlement?.contractSettlement;
  const assetFormations = inheritContractSettlement?.assetFormations;
  return (
    <div className="payment-scroll">
      <CostAllocationTable />
      {!isEmpty(contractSettlement) &&
      !isEmpty(assetFormations) &&
      size(assetFormations) > 0 ? (
        <ContactOrder
          contractSettlement={contractSettlement}
          assetFormations={assetFormations}
        />
      ) : null}
      <div className="m-t--2xl"></div>
    </div>
  );
};

export default PaymentCostAllocationTab;
