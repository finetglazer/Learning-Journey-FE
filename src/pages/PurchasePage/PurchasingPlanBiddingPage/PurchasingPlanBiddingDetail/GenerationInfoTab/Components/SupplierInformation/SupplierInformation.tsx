import { PurchasingPlanModel } from "models/PurchasingPlan";
import SupplierInformationTableBidding from "./Components/SupplierInformationTable/SupplierInformationTable";

export interface SupplierInformationProps {
  isDetail?: boolean;
  contextValue?: PurchasingPlanModel;
}

const SupplierInformation = ({
  isDetail,
  contextValue,
}: SupplierInformationProps) => {
  return (
    <div>
      <SupplierInformationTableBidding
        isDetail={isDetail}
        contextValue={contextValue}
      />
    </div>
  );
};

export default SupplierInformation;
