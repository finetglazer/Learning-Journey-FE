import { StepProgressBarFooter } from "components";
import SupplierInformationTable from "./Components/SupplierInformationTable/SupplierInformationTable";

import { useContext } from "react";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanPrincipleDetailHookContext } from "../PurchasingPlanPrincipleDetailHook";

export interface SupplierTabProps {
  isDetailPage?: boolean;
}

const SupplierTab = ({ isDetailPage }: SupplierTabProps) => {
  const { model, translate, mappingStatusToProcess, step } =
    useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

  const status = mappingStatusToProcess(step);

  return (
    <div className="p--sm">
      <SupplierInformationTable isDetailPage={isDetailPage} />

      <StepProgressBarFooter
        steps={[
          { title: translate("PL.initial_step_text") },
          { title: translate("PL.select_supplier_step_text") },
        ]}
        currentStep={status}
      />
    </div>
  );
};

export default SupplierTab;
