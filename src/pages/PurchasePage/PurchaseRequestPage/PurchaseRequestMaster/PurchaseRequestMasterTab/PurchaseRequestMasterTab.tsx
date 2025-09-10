import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_PURCHASE_REQUEST_LIST } from "config/const";
import { isEmpty } from "lodash";
import { useContext, useEffect } from "react";
import {
  PurchaseRequestMaster,
  PurchaseRequestMasterContext,
} from "../PurchaseRequestMasterHook";
import PurchaseMasterTabTable from "./PurchaseRequestMasterTabTable";
import PurchaseMasterTabAction from "./PurchaseRequestTabAction";
import EmptyDataCM from "./component/EmptyDataCM";

const ProposalMasterTab = () => {
  const { list, countFilter, modelFilter } = useContext<PurchaseRequestMaster>(
    PurchaseRequestMasterContext
  );
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PURCHASE_REQUEST_LIST,
      JSON.stringify(list)
    );
  }, [list]);

  function getEmptyData(): boolean {
    if (isEmpty(modelFilter?.search)) {
      return isEmpty(list) && countFilter === 0;
    } else {
      return false;
    }
  }
  return (
    <LayoutMaster>
      <LayoutMasterActions>
        <PurchaseMasterTabAction />
      </LayoutMasterActions>
      <LayoutMasterContent>
        {getEmptyData() ? <EmptyDataCM /> : <PurchaseMasterTabTable />}
      </LayoutMasterContent>
    </LayoutMaster>
  );
};

export default ProposalMasterTab;
