import CostAllocationMethod from "./Components/CostAllocationMethod/CostAllocationMethod";
import MainTaxType from "./Components/MainTaxType/MainTaxType";
import "./ExpenseCostAllocationTab.scss";

const ExpenseCostAllocationTab = () => {
  return (
    <div className="cost-allocation__wrapper">
      <MainTaxType />
      <CostAllocationMethod />
    </div>
  );
};

export default ExpenseCostAllocationTab;
