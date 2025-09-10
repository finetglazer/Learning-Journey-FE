import { PurchasingPlanModel } from "models/PurchasingPlan";
import BidderInformationTable from "./Components/BidderInformationTable/BidderInformationTable";

export interface BidderInformationProps {
  isDetail?: boolean;
  contextValue?: PurchasingPlanModel;
  isBidderInformation?: boolean;
}

const BidderInformation = ({
  isDetail,
  contextValue,
  isBidderInformation,
}: BidderInformationProps) => {
  return (
    <div className="">
      <BidderInformationTable
        isDetail={isDetail}
        contextValue={contextValue}
        isBidderInformation={isBidderInformation}
      />
    </div>
  );
};

export default BidderInformation;
