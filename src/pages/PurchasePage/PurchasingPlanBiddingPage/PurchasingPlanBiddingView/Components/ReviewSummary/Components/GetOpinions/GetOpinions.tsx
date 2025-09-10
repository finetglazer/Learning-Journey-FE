import classNames from "classnames";

import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { PURCHASING_PLAN_BIDDING_DETAIL_ROUTE } from "config/route-const";
import isEmpty from "lodash/isEmpty";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext } from "react";
import { useHistory } from "react-router";
import GetOpinionsTable from "../../../ReviewSummaryTab/Components/GetOpinions/GetOpinionsTable";

const GetOpinions = () => {
  const { translate, model } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );
  const history = useHistory();
  const collapseItems = [
    {
      key: "1",
      label: translate("PL.txt_modal_title_get_opinions"),
      children: <GetOpinionsTable />,
    },
  ];

  const isCreate =
    history.location.pathname.includes(PURCHASING_PLAN_BIDDING_DETAIL_ROUTE) &&
    isEmpty(model?.id);

  return (
    <div className={classNames(isCreate && "principle")}>
      <AdvancedCollapseView items={collapseItems} />
    </div>
  );
};

export default GetOpinions;
