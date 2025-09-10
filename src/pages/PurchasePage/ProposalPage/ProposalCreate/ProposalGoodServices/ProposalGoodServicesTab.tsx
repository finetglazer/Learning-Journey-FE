import { LIST_TYPE_PROPOSAL, ProposalStatus } from "config/const";
import { isEqual } from "lodash";
import { ProposalCreateModel } from "models/Proposal";
import { useContext } from "react";
import GeneralGoodsServicesTable from "../../ProposalDetail/Components/GeneralGoodsServicesTable/GeneralGoodsServicesTable";
import { ProposalCreateHookContext } from "../ProposalCreateHook";
import TablePurchaseInfo from "./Components/TablePurchaseInfo/TablePurchaseInfo";
import "./ProposalGoodServicesTab.scss";
import { FundamentalWrap } from "../../ProposalDetail/Components/FundamentalInfoDetail/FundamentalInfoDetail";

const ProposalGoodServices = () => {
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const isRegularPayment = isEqual(model?.type?.id, LIST_TYPE_PROPOSAL[0].id);

  return (
    <div className="proposal_good_service_tab">
      <FundamentalWrap isShow={isRegularPayment} isShowHeader />
      <TablePurchaseInfo />
      {/* {model?.isDetail &&
        !model?.isAdjust &&
        !isEqual(model?.status, ProposalStatus.IN_PROGRESS) && (
          <GeneralGoodsServicesTable />
        )} */}
    </div>
  );
};

export default ProposalGoodServices;
