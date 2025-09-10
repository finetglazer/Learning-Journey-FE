import CostAllocationMethod from "./Components/CostAllocationMethod/CostAllocationMethod";
import MainTaxType from "./Components/MainTaxType/MainTaxType";
import "./PaymentGenerationInfoTab.scss";
import { useContext } from "react";
import { PaymentCreateModel } from "models/Payment";
import { isEmpty, size } from "lodash";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import ContactOrder from "pages/PaymentPage/PaymentCreate/Components/ContactOrder/ContactOrder";

const PaymentCostAllocationTab = () => {
  const { model } = useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const inheritContractSettlement = model?.inheritContractSettlement;
  const contractSettlement = inheritContractSettlement?.contractSettlement;
  const assetFormations = inheritContractSettlement?.assetFormations;
  return (
    <div className="cost-allocation__wrapper">
      <MainTaxType />
      <CostAllocationMethod />
      {!isEmpty(contractSettlement) &&
      !isEmpty(assetFormations) &&
      size(assetFormations) > 0 ? (
        <ContactOrder
          contractSettlement={contractSettlement}
          assetFormations={assetFormations}
        />
      ) : null}
    </div>
  );
};

export default PaymentCostAllocationTab;
