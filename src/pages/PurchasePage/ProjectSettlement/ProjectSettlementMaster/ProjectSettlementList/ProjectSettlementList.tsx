import { LayoutMaster } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { isEmpty, isEqual } from "lodash";
import { TAB_MASTER } from "pages/PurchasePage/ProjectSettlement/Components/constant";
import EmptyDataCM from "pages/PurchasePage/ProjectSettlement/Components/EmptyDataCM";
import {
  ProjectSettlementMasterContext,
  ProjectSettlementMasterType,
} from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/context";
import ProjectSettlementTabAction from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/ProjectSettlementList/ProjectSettlementTabAction";
import ProjectSettlementTabTable from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/ProjectSettlementList/ProjectSettlementTabTable";
import { useContext } from "react";

const ProjectSettlementList = () => {
  const { list, countFilter, loadingList, modelFilter } =
    useContext<ProjectSettlementMasterType>(ProjectSettlementMasterContext);

  function getEmptyData(): boolean {
    if (isEmpty(modelFilter?.search)) {
      return (
        isEmpty(list) &&
        isEqual(countFilter, numberConstants.ZERO) &&
        isEmpty(modelFilter?.search) &&
        (isEmpty(modelFilter?.tab) || modelFilter?.tab === TAB_MASTER.ALL) &&
        !loadingList
      );
    } else {
      return false;
    }
  }
  return (
    <>
      <LayoutMaster>
        {getEmptyData() ? (
          <EmptyDataCM />
        ) : (
          <>
            <LayoutMasterActions>
              <ProjectSettlementTabAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <ProjectSettlementTabTable />
            </LayoutMasterContent>
          </>
        )}
      </LayoutMaster>
    </>
  );
};

export default ProjectSettlementList;
