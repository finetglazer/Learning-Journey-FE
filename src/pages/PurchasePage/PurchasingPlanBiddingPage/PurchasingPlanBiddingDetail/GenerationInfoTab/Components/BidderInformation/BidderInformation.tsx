import { PurchasingPlanModel } from "models/PurchasingPlan";
import BidderInformationTable from "./Components/BidderInformationTable/BidderInformationTable";

export interface BidderInformationProps {
  isDetail?: boolean;
  contextValue: PurchasingPlanModel;
  titleModal?: string;
  titleNameProperty?: string;
}

const BidderInformation = (props: BidderInformationProps) => {
  const { isDetail, contextValue, titleModal } = props;

  return (
    <div className="">
      <BidderInformationTable
        isDetail={isDetail}
        contextValue={contextValue}
        titleModal={titleModal}
        {...props}
      />
    </div>
  );
};

export default BidderInformation;
