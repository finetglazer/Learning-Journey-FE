import { formatNumber } from "core/helpers/number";
import { ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./ProposalCostAllocationDetail.scss";
const ProposalCostAllocationDetail = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  return (
    <>
      <div className="proposal-cost-allocation-detail">
        <div className="basic-information-detail">
          <div className="basic-information-item">
            <div className="table-row">
              <div className="table-cell flex-1">
                <span className="title">
                  {translate("PP.cost_allocation_method")}
                </span>
                <span className="value">
                  {formatNumber(model?.costDriver?.name)}
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.total_estimate")}</span>
                <span className="value">
                  {formatNumber(model?.totalEstimateAmount)}{" "}
                  <span className="title">{model?.currency?.code}</span>
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.reserve_amount")}</span>
                <span className="value">
                  {formatNumber(model?.totalContingencyAmount)}{" "}
                  <span className="title">{model?.currency?.code}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-detail"></div>
    </>
  );
};

export default ProposalCostAllocationDetail;
