import {
  PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE,
  PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PurchasingPlanPrincipleDetail from "./PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetail";
import PurchasingPlanPrincipleView from "./PurchasingPlanPrincipleView/PurchasingPlanPrincipalView";

function PurchasingPlanPrinciplePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PurchasingPlanPrinciplePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          key={PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE}
          path={PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE}
          component={PurchasingPlanPrincipleDetail}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE}
          path={`${PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE}/:id?`}
          component={PurchasingPlanPrincipleDetail}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE}
          path={PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE}
          component={PurchasingPlanPrincipleView}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE}
          path={`${PURCHASING_PLAN_PRINCIPLE_VIEW_ROUTE}/:id`}
          component={PurchasingPlanPrincipleView}
          auth={true}
          exact={true}
        />
        <Route exact path={path}>
          <Redirect to={PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PurchasingPlanPrinciplePage;
