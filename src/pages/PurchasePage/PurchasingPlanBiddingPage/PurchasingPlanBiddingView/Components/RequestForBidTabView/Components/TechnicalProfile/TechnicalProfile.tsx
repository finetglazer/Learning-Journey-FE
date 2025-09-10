import { ColumnKey } from "models/PurchasingPlan";
import TechnicalProfileTable from "./TechnicalProfileTable/TechnicalProfileTable";

export interface TechnicalProfileTableProps {
  isDetail?: boolean;
  contextValue?: any;
  key?: string;
  columnKey: ColumnKey | string;
  columnKeyParent?: ColumnKey | string;
  dataTable: any;
}

const TechnicalProfile = ({
  isDetail,
  contextValue,
  columnKey,
  columnKeyParent,
  dataTable,
}: TechnicalProfileTableProps) => {
  return (
    <div className="">
      <TechnicalProfileTable
        columnKey={columnKey}
        columnKeyParent={columnKeyParent}
        isDetail={isDetail}
        contextValue={contextValue}
        dataTable={dataTable}
      />
    </div>
  );
};

export default TechnicalProfile;
