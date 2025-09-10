import { ColumnKey, PurchasingPlanModel } from "models/PurchasingPlan";
import TechnicalProfileTable from "./TechnicalProfileTable/TechnicalProfileTable";
import { TechnicalProfile as TechnicalProfileModel } from "models/PurchasingPlan/PurchasingPlanBidder";

export interface TechnicalProfileTableProps {
  isDetail?: boolean;
  contextValue?: PurchasingPlanModel;
  key?: string;
  columnKey: ColumnKey | string;
  columnKeyParent?: ColumnKey | string;
  data: TechnicalProfileModel[];
}

const TechnicalProfile = ({
  isDetail,
  contextValue,
  columnKey,
  columnKeyParent,
  data,
}: TechnicalProfileTableProps) => {
  return (
    <div className="">
      <TechnicalProfileTable
        columnKey={columnKey}
        columnKeyParent={columnKeyParent}
        isDetail={isDetail}
        contextValue={contextValue}
        data={data}
      />
    </div>
  );
};

export default TechnicalProfile;
