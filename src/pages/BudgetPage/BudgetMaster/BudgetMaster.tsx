import PageHeader from "components/PageHeader/PageHeader";
import { APP_OVERVIEW, BUDGET_MASTER_ROUTE } from "config/route-const";
import "./BudgetMaster.scss";
import { BudgetMasterContext, useBudgetMasterHook } from "./BudgetMasterHook";
import BudgetMasterTab from "./BudgetMasterTab/BudgetMasterTab";

const BudgetMaster = () => {
  // Budget master page
  const { translate, ...contextValue } = useBudgetMasterHook();

  return (
    <>
      <BudgetMasterContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={translate("BG.title_list")}
            breadcrumbs={[
              {
                name: translate("CM.menu_title_home"),
                path: APP_OVERVIEW,
              },
              {
                name: translate("CM.menu_title_budget"),
                path: BUDGET_MASTER_ROUTE,
              },
            ]}
            hasTabs={false}
          />
          <div className="tab__master">
            <BudgetMasterTab />
          </div>
        </div>
      </BudgetMasterContext.Provider>
    </>
  );
};

export default BudgetMaster;
