import { isEmpty } from "lodash";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  BudgetSettlementContext,
  BudgetSettlementCreate,
} from "../../BudgetSettlementCreateHook";
import { AddProjectButton } from "../AddProjectButton";
import { ProjectTable } from "./ProjectTable";

export const ContentDetail = () => {
  const {
    model,
    setModalType,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useContext<BudgetSettlementCreate>(BudgetSettlementContext);
  const [translate] = useTranslation();

  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        <span className="form-title">{translate("BG.txt_content_detail")}</span>
        <span className="unit-text">{translate("BG.txt_unit")}</span>
      </div>
      <div className="budget-plan__body__settlement">
        {!isEmpty(model.budgetIds) ? (
          <div className="add-button__container">
            <div>
              <AddProjectButton
                disabled={false}
                onClick={() => setModalType({ type: "ADD_PROJECT" })}
              />
            </div>
            <div />
          </div>
        ) : null}
        <ProjectTable
          dataSource={model.budgetIds}
          rowSelection={rowSelection}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setModalType={setModalType}
        />
      </div>
    </>
  );
};
