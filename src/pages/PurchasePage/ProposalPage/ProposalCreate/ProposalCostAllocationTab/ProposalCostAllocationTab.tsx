import { LIST_TYPE_COST, ProposalCreateModel } from "models/Proposal";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ProposalCreateHookContext } from "../ProposalCreateHook";
import AnotherCostAllocation from "./AnotherCostAllocation/AnotherCostAllocation";
import BasicInformation from "./BasicInfomation/BasicInfomation";
import CostAllocationTable from "./CostAllocationTable/CostAllocationTable";
import EmptyData from "./EmptyData/EmptyData";
import "./ProposalCostAllocationTab.scss";

const ProposalCostAllocationTab = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const hasCostAllocation =
    model.costAllocation && model?.costAllocation?.length > 0;
  const shouldShowCostAllocation =
    (model.totalEstimateAmount || model.totalEstimateAmount === 0) &&
    (model.totalContingencyAmount || model.totalContingencyAmount === 0) &&
    model.costDriver?.code !== LIST_TYPE_COST.COST__ABSOLUTE_AMOUNT;

  return (
    <div className="proposal_cost_allocation_wrapper">
      <BasicInformation />
      <div className="proposal_cost_allocation">
        <div className="title">{translate("PP.tab_cost_allocation")}</div>
        <div className="body">
          {hasCostAllocation ? (
            <CostAllocationTable />
          ) : (
            shouldShowCostAllocation && <AnotherCostAllocation />
          )}
          {!hasCostAllocation ? <EmptyData /> : null}
        </div>
      </div>
    </div>
  );
};

export default ProposalCostAllocationTab;
