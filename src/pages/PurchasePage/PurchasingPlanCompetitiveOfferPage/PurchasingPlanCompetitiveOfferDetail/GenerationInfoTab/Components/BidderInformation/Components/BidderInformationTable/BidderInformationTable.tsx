import { BidderInformationProps } from "../../BidderInformation";
import BidderInformationTableChild from "../BidderInformationTableChild/BidderInformationTableChild";
const BidderInformationTable = ({
  isDetail,
  contextValue,
  isBidderInformation = false,
}: BidderInformationProps) => {
  const { model, handleChangeSingleField, handleChangeAllField } = contextValue;

  return (
    <div className={"supplier-information-table"}>
      <BidderInformationTableChild
        handleChangeSingleField={handleChangeSingleField}
        contextValue={contextValue}
        isDetail={isDetail}
        handleChangeAllField={handleChangeAllField}
        isBidderInformation={isBidderInformation}
      />
    </div>
  );
};

export default BidderInformationTable;
