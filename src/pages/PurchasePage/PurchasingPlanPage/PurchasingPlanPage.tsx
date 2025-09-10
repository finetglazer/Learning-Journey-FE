import {
  PURCHASING_PLAN_DETAIL_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PurchasingPlanDetail from "./PurchasingPlanDetail/PurchasingPlanDetail";
import PurchasingPlanMaster from "./PurchasingPlanMaster/PurchasingPlanMaster";
import PurchasingPlanView from "./PurchasingPlanView/PurchasingPlanView";

function PurchasingPlanPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PurchasingPlanPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PURCHASING_PLAN_MASTER_ROUTE}
          key={PURCHASING_PLAN_MASTER_ROUTE}
          component={PurchasingPlanMaster}
          auth
          exact
        />
        <ProtectedRoute
          key={PURCHASING_PLAN_DETAIL_ROUTE}
          path={`${PURCHASING_PLAN_DETAIL_ROUTE}/:id?`}
          component={PurchasingPlanDetail}
          auth
          exact
        />
        <ProtectedRoute
          key={PURCHASING_PLAN_VIEW_ROUTE}
          path={`${PURCHASING_PLAN_VIEW_ROUTE}/:id`}
          component={PurchasingPlanView}
          auth
          exact
        />
        <Route exact path={path}>
          <Redirect to={PURCHASING_PLAN_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PurchasingPlanPage;
