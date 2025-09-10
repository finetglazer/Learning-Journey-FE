import { Budget } from "assets/icons";
import add from "assets/icons/add.svg";
import { LIST_TYPE_COST, ProposalCreateModel } from "models/Proposal";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ProposalCreateHookContext } from "../../ProposalCreateHook";

const EmptyData = () => {
  const [translate] = useTranslation();
  const { model, handleClickAddCostAllocationLine } =
    useContext<ProposalCreateModel>(ProposalCreateHookContext);

  return (
    <div>
      <div className="empty-data-table__body">
        <Budget width={140} height={140} />
        <div className="empty-data-table__body__content">
          <span className="content">{translate("PP.add_cost_allocation")}</span>
          <div className="empty-data-table__body__content__button">
            {model?.costDriver?.code ===
              LIST_TYPE_COST.COST__ABSOLUTE_AMOUNT && (
              <Button
                icon={<img src={add} alt="img" width={12} height={12} />}
                iconPlace="left"
                type="secondary"
                onClick={handleClickAddCostAllocationLine}
              >
                {translate("PM.add_cost_allocation_line")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
