import { IcGitForkCost } from "assets/icons";
import { LIST_TYPE_COST, ProposalCreateModel } from "models/Proposal";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ProposalCreateHookContext } from "../../ProposalCreateHook";
import ModalCostAllocationProposal from "../ModalCostAllocationProposal/ModalCostAllocationProposal";

const AnotherCostAllocation = () => {
  const [translate] = useTranslation();
  const { model, handleOpenModalAutoCostAllocation } =
    useContext<ProposalCreateModel>(ProposalCreateHookContext);
  return (
    <div>
      {model?.costDriver?.code !== LIST_TYPE_COST.COST__ABSOLUTE_AMOUNT && (
        <Button
          icon={<img src={IcGitForkCost} alt="img" width={16} height={16} />}
          iconPlace="left"
          type="text"
          onClick={handleOpenModalAutoCostAllocation}
        >
          {translate("PP.proposal_auto_cost_allocation_btn")}
        </Button>
      )}
      <ModalCostAllocationProposal />
    </div>
  );
};

export default AnotherCostAllocation;
