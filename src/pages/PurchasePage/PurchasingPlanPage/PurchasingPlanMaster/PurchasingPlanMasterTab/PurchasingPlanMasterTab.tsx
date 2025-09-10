import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_PURCHASING_PLAN_LIST } from "config/const";
import { useContext, useEffect } from "react";
import "../PurchasingPlan.scss";
import {
  PurchasingPlanMaster,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";
import PurchasingPlanMasterAction from "./PurchasingPlanMasterAction";
import PurchasingPlanMasterTabTable from "./PurchasingPlanMasterTabTable";
import EmptyDataCM from "../Components/EmptyDataCM";
import CreatePurchasingPlanModal from "../Components/CreatePurchasingPlanModal";

const PurchasingPlanMasterTab = () => {
  const { list, getEmptyData, isOpenCreateModal, handleModal } =
    useContext<PurchasingPlanMaster>(PurchasingPlanMasterContext);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PURCHASING_PLAN_LIST,
      JSON.stringify(list)
    );
  }, [list]);

  return (
    <LayoutMaster>
      <LayoutMasterActions>
        <PurchasingPlanMasterAction />
      </LayoutMasterActions>
      <LayoutMasterContent>
        {getEmptyData() ? <EmptyDataCM /> : <PurchasingPlanMasterTabTable />}
      </LayoutMasterContent>
      {isOpenCreateModal && (
        <CreatePurchasingPlanModal handleCloseModal={handleModal} />
      )}
    </LayoutMaster>
  );
};

export default PurchasingPlanMasterTab;
