import {
  BiddingIcon,
  CaretRight,
  CompetitiveBidIcon,
  ContractIcon,
  DirectBidIcon,
} from "assets/icons";
import {
  PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASING_PLAN_DETAIL_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE,
} from "config/route-const";
import { Fragment, useCallback, useMemo } from "react";
import { Modal } from "react-components-design-system";
import { useHistory } from "react-router";
import { usePurchasingPlanMasterHook } from "../PurchasingPlanMasterHook";
import { IPurchaseRequest } from "models/PurchasingPlan";
import { authorizationService } from "core/services/common-services/authorization-service";

const MODAL_WIDTH = 600;

enum PurchasingPlanType {
  DIRECT_BID,
  CONTRACT,
  COMPETITIVE_BID,
  BIDDING,
}

type PurchasingPlanListType = {
  id: PurchasingPlanType;
  name: string;
  icon: string;
  path?: string;
}[];

interface CreatePurchasingPlanModalProperties {
  purchaseRequest?: IPurchaseRequest;
  handleCloseModal: () => void;
}

const CreatePurchasingPlanModal = ({
  purchaseRequest,
  handleCloseModal,
}: CreatePurchasingPlanModalProperties) => {
  const { translate } = usePurchasingPlanMasterHook();
  const history = useHistory();

  const { validAction: validActionCDT } =
    authorizationService.useAuthorizedAction("PURCHASE_PLAN", "CDT");

  const { validAction: validActionCHCT } =
    authorizationService.useAuthorizedAction("PURCHASE_PLAN", "CHCT");

  const { validAction: validActionHĐNT } =
    authorizationService.useAuthorizedAction("PURCHASE_PLAN", "HĐNT");

  const { validAction: validActionDT } =
    authorizationService.useAuthorizedAction("PURCHASE_PLAN", "DT");

  const PurchasingPlanList: PurchasingPlanListType = useMemo(
    () => [
      {
        id: PurchasingPlanType.DIRECT_BID,
        name: translate("PL.md_direct_bid"),
        icon: DirectBidIcon,
        path: PURCHASING_PLAN_DETAIL_ROUTE,
      },
      {
        id: PurchasingPlanType.CONTRACT,
        name: translate("PL.md_contract"),
        icon: ContractIcon,
        path: PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE,
      },
      {
        id: PurchasingPlanType.COMPETITIVE_BID,
        name: translate("PL.md_competitive_bid"),
        icon: CompetitiveBidIcon,
        path: PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
      },
      {
        id: PurchasingPlanType.BIDDING,
        name: translate("PL.md_bidding"),
        icon: BiddingIcon,
        path: PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
      },
    ],
    [translate]
  );

  const handlePressAdd = useCallback(
    (path: string) => {
      history.push(path, { purchaseRequest });
    },
    [history, purchaseRequest]
  );

  return (
    <Modal
      open
      title={translate("CM.title_create_purchasing_plan")}
      size={MODAL_WIDTH}
      isShowIconBack={false}
      isShowButtonCancel={false}
      isShowButtonApply={false}
      handleCancel={handleCloseModal}
    >
      <div className="purchasing-plan-border">
        {PurchasingPlanList.map((item) => (
          <Fragment key={item.id}>
            {item.path.includes("purchasing-plan-detail") &&
              validActionCDT("CREATE") && (
                <div
                  onClick={() => handlePressAdd(item.path)}
                  className="purchasing-plan-border_btn-plan"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={item.icon}
                      className="icon-represent"
                      alt={item.name}
                      width={32}
                    />
                    <span className="title-plan">{item.name}</span>
                  </div>
                  <img src={CaretRight} alt="right-icon" width={16} />
                </div>
              )}
            {item.path.includes("purchase-plan-principle-detail") &&
              validActionHĐNT("CREATE") && (
                <div
                  onClick={() => handlePressAdd(item.path)}
                  className="purchasing-plan-border_btn-plan"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={item.icon}
                      className="icon-represent"
                      alt={item.name}
                      width={32}
                    />
                    <span className="title-plan">{item.name}</span>
                  </div>
                  <img src={CaretRight} alt="right-icon" width={16} />
                </div>
              )}
            {item.path.includes("purchase-plan-competitive-offer-detail") &&
              validActionCHCT("CREATE") && (
                <div
                  onClick={() => handlePressAdd(item.path)}
                  className="purchasing-plan-border_btn-plan"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={item.icon}
                      className="icon-represent"
                      alt={item.name}
                      width={32}
                    />
                    <span className="title-plan">{item.name}</span>
                  </div>
                  <img src={CaretRight} alt="right-icon" width={16} />
                </div>
              )}
            {item.path.includes("purchase-plan-bidding-detail") &&
              validActionDT("CREATE") && (
                <div
                  onClick={() => handlePressAdd(item.path)}
                  className="purchasing-plan-border_btn-plan"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={item.icon}
                      className="icon-represent"
                      alt={item.name}
                      width={32}
                    />
                    <span className="title-plan">{item.name}</span>
                  </div>
                  <img src={CaretRight} alt="right-icon" width={16} />
                </div>
              )}
          </Fragment>
        ))}
      </div>
    </Modal>
  );
};

export default CreatePurchasingPlanModal;
