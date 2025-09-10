import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import WaitingAcceptanceTabAction from "./WaitingAcceptanceTabAction";
import WaitingAcceptanceTabTable from "./WaitingAcceptanceTabTable";

const WaitingAcceptanceTab = () => {
  return (
    <LayoutMaster>
      <LayoutMasterActions>
        <WaitingAcceptanceTabAction />
      </LayoutMasterActions>
      <LayoutMasterContent>
        <WaitingAcceptanceTabTable />
      </LayoutMasterContent>
    </LayoutMaster>
  );
};

export default WaitingAcceptanceTab;
