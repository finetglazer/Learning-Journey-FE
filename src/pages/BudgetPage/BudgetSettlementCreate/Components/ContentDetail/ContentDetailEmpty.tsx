import { Budget } from "assets/icons";
import { isNil } from "lodash";
import { useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  BudgetSettlementContext,
  BudgetSettlementCreate,
} from "../../BudgetSettlementCreateHook";
import { AddProjectButton } from "../AddProjectButton";
import "./ContentDetailEmpty.scss";

const ICON_SIZE = 140;

export const ContentDetailEmpty = () => {
  const [translate] = useTranslation();
  const { model, setModalType } = useContext<BudgetSettlementCreate>(
    BudgetSettlementContext
  );

  return (
    <div className="budget-settlement__container">
      <Budget width={ICON_SIZE} height={ICON_SIZE} />
      <div className="body">
        <span>
          <Trans>{translate("BG.txt_description_to_add_new")}</Trans>
        </span>
        <AddProjectButton
          disabled={isNil(model.budgetSettlementTypeValue?.id)}
          onClick={() => setModalType({ type: "ADD_PROJECT" })}
        />
      </div>
    </div>
  );
};
