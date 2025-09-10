import { LoadingCM } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_PROPOSAL_LIST } from "config/const";
import { useContext, useEffect } from "react";
import { ProposalMaster, ProposalMasterContext } from "../ProposalMasterHook";
import EmptyDataCM from "../ProposalMasterTab/component/EmptyDataCM";
import AdjustProposalMasterTabTable from "./AdjustProposalMasterTabTable/AdjustProposalMasterTabTable";
import AdjustProposalTabAction from "./AdjustProposalTabAction";
import { useTranslation } from "react-i18next";
import { EntitySelection } from "models/PurchaseRequest";
import { ProposalModal } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestGenerationInfoTab/Components/ProposalModal/ProposalModal";

const AdjustProposalMasterTab = () => {
  const [translate] = useTranslation();
  const appUserMaster = useContext<ProposalMaster>(ProposalMasterContext);
  const { isShowModalProposal, setIsShowModalProposal } = appUserMaster;
  const { list, getEmptyData, loadingList } = useContext<ProposalMaster>(
    ProposalMasterContext
  );
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PROPOSAL_LIST, JSON.stringify(list));
  }, [list]);

  return (
    <LayoutMaster>
      <LayoutMasterActions>
        {!getEmptyData() && <AdjustProposalTabAction />}
      </LayoutMasterActions>
      <LayoutMasterContent>
        {getEmptyData() ? (
          <EmptyDataCM message={translate("PP.txt_content_no_data_adjust")} />
        ) : (
          <AdjustProposalMasterTabTable />
        )}
        {getEmptyData() && loadingList && <LoadingCM />}
      </LayoutMasterContent>
      {isShowModalProposal && (
        <ProposalModal
          setModal={setIsShowModalProposal}
          addedProposal={null}
          isShowModel={isShowModalProposal}
          callback={(value) => {
            appUserMaster?.handlePressAdd(value);
          }}
          entitySelection={EntitySelection.TTCT}
        />
      )}
    </LayoutMaster>
  );
};

export default AdjustProposalMasterTab;
