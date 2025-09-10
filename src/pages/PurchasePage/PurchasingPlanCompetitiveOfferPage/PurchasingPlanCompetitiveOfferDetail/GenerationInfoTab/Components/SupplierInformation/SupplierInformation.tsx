import {
  PurchasingPlanModel,
  SupplierPurchasePlan,
  SupplierQuotationAction,
} from "models/PurchasingPlan";
import SupplierInformationTableBidding from "./Components/SupplierInformationTable/SupplierInformationTable";

export interface SupplierInformationProps {
  isDetail?: boolean;
  contextValue?: PurchasingPlanModel;
  isView?: boolean;
  idContainer?: string;
  isNotConfirmDelete?: boolean;
  isNegotiationRound?: boolean;
  actionQuote?: SupplierQuotationAction;
  handleChangeSelectSupplier?: (list: string[]) => void;
  suppliers?: SupplierPurchasePlan[];
}

const SupplierInformation = ({
  isDetail,
  contextValue,
  isView,
}: SupplierInformationProps) => {
  return (
    <div className="">
      <SupplierInformationTableBidding
        isDetail={isDetail}
        contextValue={contextValue}
        isView={isView}
      />
    </div>
  );
};

export default SupplierInformation;
