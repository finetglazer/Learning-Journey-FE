import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_PURCHASING_PLAN_LIST } from "config/const";
import { useContext, useEffect } from "react";
import CreatePurchasingPlanModal from "../Components/CreatePurchasingPlanModal";
import EmptyDataCM from "../Components/EmptyDataCM";
import "../PurchasingPlan.scss";
import { PurchasingPlanMasterContext } from "../PurchasingPlanMasterHook";
import AdjustPurchasingPlanMasterAction from "./AdjustPurchasingPlanMasterAction";
import PurchasingPlanMasterTabTable from "./AdjustPurchasingPlanMasterTabTable";

const PurchasingPlanMasterTab = () => {
  const { list, getEmptyData, isOpenCreateModal, handleModal } = useContext(
    PurchasingPlanMasterContext
  );

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PURCHASING_PLAN_LIST,
      JSON.stringify(list)
    );
  }, [list]);

  return (
    <LayoutMaster>
      <LayoutMasterActions>
        <AdjustPurchasingPlanMasterAction />
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
