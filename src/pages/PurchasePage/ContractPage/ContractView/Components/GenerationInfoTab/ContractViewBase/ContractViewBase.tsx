import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";

import "./ContractViewBase.scss";
import ShoppingPlanTable from "pages/PurchasePage/ContractPage/ContractDetail/Components/GenerationInfoTab/Components/ContractDetailBase/ShoppingPlanTable/ShoppingPlanTable";

const ContractViewBase = () => {
  return (
    <div className="create_contract_base_wrapper">
      <CollapseCard>
        <ShoppingPlanTable />
      </CollapseCard>
    </div>
  );
};

export default ContractViewBase;
