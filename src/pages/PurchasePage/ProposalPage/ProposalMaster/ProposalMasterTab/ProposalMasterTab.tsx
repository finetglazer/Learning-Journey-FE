import { LoadingCM } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_PROPOSAL_LIST } from "config/const";
import { useContext, useEffect } from "react";
import { ProposalMaster, ProposalMasterContext } from "../ProposalMasterHook";
import ProposalMasterTabTable from "./ProposalMasterTabTable";
import ProposalMasterTabAction from "./ProposalTabAction";
import EmptyDataCM from "./component/EmptyDataCM";

const ProposalMasterTab = () => {
  const { list, getEmptyData, loadingList } = useContext<ProposalMaster>(
    ProposalMasterContext
  );
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PROPOSAL_LIST, JSON.stringify(list));
  }, [list]);

  return (
    <LayoutMaster>
      <LayoutMasterActions>
        <ProposalMasterTabAction />
      </LayoutMasterActions>
      <LayoutMasterContent>
        {getEmptyData() ? <EmptyDataCM /> : <ProposalMasterTabTable />}
        {getEmptyData() && loadingList && <LoadingCM />}
      </LayoutMasterContent>
    </LayoutMaster>
  );
};

export default ProposalMasterTab;
