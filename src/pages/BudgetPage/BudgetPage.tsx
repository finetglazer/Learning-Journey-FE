import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

// import AppUserDetailPage from "./AppUserDetaill/AppUserDetailPage";
import {
  BUDGET_ADJUST_CREATE_ROUTE,
  BUDGET_ADJUST_DETAIL_ROUTE,
  BUDGET_ADJUST_EDIT_ROUTE,
  BUDGET_CREATE_ROUTE,
  BUDGET_CREATE_SETTLEMENT_ROUTE,
  BUDGET_DETAIL_ROUTE,
  BUDGET_EDIT_ROUTE,
  BUDGET_EDIT_SETTLEMENT_ROUTE,
  BUDGET_MASTER_ROUTE,
} from "config/route-const";
import { Helmet } from "react-helmet";

import BudgetAdjustCreate from "./BudgetAdjustPage/BudgetAdjustCreate/BudgetAdjustCreate";
import BudgetAdjustDetail from "./BudgetAdjustPage/BudgetAdjustDetail/BudgetAdjustDetail";
import BudgetCreate from "./BudgetCreate/BudgetCreate";
import BudgetDetail from "./BudgetDetail/BudgetDetail";
import BudgetMaster from "./BudgetMaster/BudgetMaster";
import BudgetSettlementCreate from "./BudgetSettlementCreate/BudgetSettlementCreate";

function BudgetPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | BudgetPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={BUDGET_MASTER_ROUTE}
          key={BUDGET_MASTER_ROUTE}
          component={BudgetMaster}
          auth={true}
        />
        <ProtectedRoute
          path={`${BUDGET_DETAIL_ROUTE}/:id`}
          key={BUDGET_DETAIL_ROUTE}
          component={BudgetDetail}
          auth={true}
        />
        <ProtectedRoute
          path={BUDGET_CREATE_ROUTE}
          key={BUDGET_CREATE_ROUTE}
          component={BudgetCreate}
          auth={true}
        />
        <ProtectedRoute
          path={BUDGET_ADJUST_CREATE_ROUTE}
          key={BUDGET_ADJUST_CREATE_ROUTE}
          component={BudgetAdjustCreate}
          auth={true}
        />
        <ProtectedRoute
          path={`${BUDGET_ADJUST_DETAIL_ROUTE}/:id`}
          key={BUDGET_ADJUST_DETAIL_ROUTE}
          component={BudgetAdjustDetail}
          auth={true}
        />
        {/* Settlement */}
        <ProtectedRoute
          path={BUDGET_CREATE_SETTLEMENT_ROUTE}
          key={BUDGET_CREATE_SETTLEMENT_ROUTE}
          component={BudgetSettlementCreate}
          auth={true}
        />
        {/* Edit Budget */}
        <ProtectedRoute
          path={BUDGET_EDIT_ROUTE}
          key={BUDGET_EDIT_ROUTE}
          component={BudgetCreate}
          auth={true}
        />
        {/* Edit Budget Settlement */}
        <ProtectedRoute
          path={`${BUDGET_EDIT_SETTLEMENT_ROUTE}/:id`}
          key={BUDGET_EDIT_SETTLEMENT_ROUTE}
          component={BudgetSettlementCreate}
          auth={true}
        />
        {/* Edit Adjust */}
        <ProtectedRoute
          path={`${BUDGET_ADJUST_EDIT_ROUTE}/:id`}
          key={BUDGET_ADJUST_EDIT_ROUTE}
          component={BudgetAdjustCreate}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={BUDGET_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default BudgetPage;
