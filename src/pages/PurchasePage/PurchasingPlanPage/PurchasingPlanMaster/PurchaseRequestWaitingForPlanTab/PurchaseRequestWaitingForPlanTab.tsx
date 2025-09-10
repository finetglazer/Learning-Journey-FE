import { LayoutMaster, EmptyData } from "components";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { isEmpty, isEqual } from "lodash";
import { Button } from "react-components-design-system";
import CreatePurchasingPlanModal from "../Components/CreatePurchasingPlanModal";
import ActionsBar from "./ActionsBar";
import {
  PurchaseRequestWaitingForPlanContext,
  usePurchaseRequestWaitingForPlanHook,
} from "./PurchaseRequestWaitingForPlanHook";
import "./PurchaseRequestWaitingForPlanTab.scss";
import PurchaseRequestWaitingForPlanTable from "./PurchaseRequestWaitingForPlanTable";
import { Fragment } from "react";
import { authorizationService } from "core/services/common-services/authorization-service";

const EMPTY_DATA_HEIGHT = 300;

const PurchaseRequestWaitingForPlanTab = () => {
  const contextValue = usePurchaseRequestWaitingForPlanHook();

  const {
    paymentRequestList,
    modelFilter,
    countFilter,
    loadingList,
    isOpenCreateModal,
    translate,
    handleOpenModal,
    handleCloseModal,
  } = contextValue;

  const { validAction } =
    authorizationService.useAuthorizedAction("PURCHASE_PLAN");

  if (
    isEmpty(paymentRequestList) &&
    isEmpty(modelFilter?.search) &&
    isEqual(countFilter, numberConstants.ZERO) &&
    !loadingList
  ) {
    return (
      <EmptyData message={undefined} height={EMPTY_DATA_HEIGHT}>
        <Fragment>
          <span className="empty_message">
            {translate("PL.txt_content_no_data")}
          </span>
          {validAction("CREATE") && (
            <Button onClick={() => handleOpenModal()} type="primary" size="lg">
              {translate("CM.btn_add")}
            </Button>
          )}

          {isOpenCreateModal && (
            <CreatePurchasingPlanModal handleCloseModal={handleCloseModal} />
          )}
        </Fragment>
      </EmptyData>
    );
  }

  return (
    <PurchaseRequestWaitingForPlanContext.Provider value={contextValue}>
      <LayoutMaster>
        <div className="action_bar">
          <ActionsBar />
        </div>
        <LayoutMasterContent>
          <PurchaseRequestWaitingForPlanTable />
        </LayoutMasterContent>
        {isOpenCreateModal && (
          <CreatePurchasingPlanModal
            handleCloseModal={handleCloseModal}
            purchaseRequest={contextValue?.purchaseRequest}
          />
        )}
      </LayoutMaster>
    </PurchaseRequestWaitingForPlanContext.Provider>
  );
};

export default PurchaseRequestWaitingForPlanTab;
