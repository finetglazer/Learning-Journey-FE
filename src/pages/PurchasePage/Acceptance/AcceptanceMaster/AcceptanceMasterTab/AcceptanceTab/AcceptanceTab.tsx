import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import AcceptanceTabAction from "./AcceptanceTabAction";
import AcceptanceMasterTabTable from "./AcceptanceTabTable";

const AcceptanceMasterTab = () => {
  return (
    <LayoutMaster>
      <LayoutMasterActions>
        <AcceptanceTabAction />
      </LayoutMasterActions>
      <LayoutMasterContent>
        <AcceptanceMasterTabTable />
      </LayoutMasterContent>
    </LayoutMaster>
  );
};

export default AcceptanceMasterTab;
