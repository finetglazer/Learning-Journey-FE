import { ColumnKey, PurchasingPlanModel } from "models/PurchasingPlan";
import TechnicalProfileTable from "./TechnicalProfileTable/TechnicalProfileTable";

export interface TechnicalProfileTableProps {
  isDetail?: boolean;
  contextValue?: PurchasingPlanModel;
  key?: string;
  columnKey: ColumnKey | string;
  columnKeyParent?: ColumnKey | string;
}

const TechnicalProfile = ({
  isDetail,
  contextValue,
  columnKey,
  columnKeyParent,
}: TechnicalProfileTableProps) => {
  return (
    <div className="">
      <TechnicalProfileTable
        columnKey={columnKey}
        columnKeyParent={columnKeyParent}
        isDetail={isDetail}
        contextValue={contextValue}
      />
    </div>
  );
};

export default TechnicalProfile;
