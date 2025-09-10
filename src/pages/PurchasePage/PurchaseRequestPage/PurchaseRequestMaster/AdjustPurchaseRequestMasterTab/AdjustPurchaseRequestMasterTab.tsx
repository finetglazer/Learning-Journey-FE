import { LoadingCM } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_PROPOSAL_LIST } from "config/const";
import { ModalSelectPurchaseRequest } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasePlanGenerationInfoTab/Components/ModalSelectPurchaseRequest/ModalSelectPurchaseRequest";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  PurchaseRequestMaster,
  PurchaseRequestMasterContext,
} from "../PurchaseRequestMasterHook";
import EmptyDataCM from "../PurchaseRequestMasterTab/component/EmptyDataCM";
import AdjustPurchaseRequestMasterTabTable from "./AdjustPurchaseRequestMasterTabTable/AdjustPurchaseRequestMasterTabTable";
import AdjustPurchaseRequestTabAction from "./AdjustPurchaseRequestTabAction";

const AdjustPurchaseRequestMasterTab = () => {
  const [translate] = useTranslation();

  const appUserMaster = useContext<PurchaseRequestMaster>(
    PurchaseRequestMasterContext
  );
  const {
    setIsShowModalPurchaseRequest,
    isShowModalPurchaseRequest,
    handleClickCreateAdjustmentPurchase,
  } = appUserMaster;

  const { list, getEmptyData, loadingList } = useContext<PurchaseRequestMaster>(
    PurchaseRequestMasterContext
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PROPOSAL_LIST, JSON.stringify(list));
  }, [list]);

  return (
    <LayoutMaster>
      <LayoutMasterActions>
        {!getEmptyData() && <AdjustPurchaseRequestTabAction />}
      </LayoutMasterActions>
      <LayoutMasterContent>
        {getEmptyData() ? (
          <EmptyDataCM message={translate("PR.txt_content_no_data_adjust")} />
        ) : (
          <AdjustPurchaseRequestMasterTabTable />
        )}
        {getEmptyData() && loadingList && <LoadingCM />}
      </LayoutMasterContent>
      {isShowModalPurchaseRequest && (
        <ModalSelectPurchaseRequest
          setModal={setIsShowModalPurchaseRequest}
          isShowModel={isShowModalPurchaseRequest}
          callback={(value) => {
            handleClickCreateAdjustmentPurchase(value);
          }}
          isPurchaseRequestAdjustment
        />
      )}
    </LayoutMaster>
  );
};

export default AdjustPurchaseRequestMasterTab;
