import {
  PURCHASING_PLAN_BIDDING_DETAIL_ROUTE,
  PURCHASING_PLAN_ROUTE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { lazy } from "react";

const PurchasingPlanBiddingDetail = lazy(
  () => import("./PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetail")
);
const PurchasingPlanBiddingView = lazy(
  () => import("./PurchasingPlanBiddingView/PurchasingPlanBiddingView")
);

function PurchasingPlanBiddingPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PurchasingPlanBiddingPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          key={PURCHASING_PLAN_BIDDING_DETAIL_ROUTE}
          path={`${PURCHASING_PLAN_BIDDING_DETAIL_ROUTE}/:id?`}
          component={PurchasingPlanBiddingDetail}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={PURCHASING_PLAN_BIDDING_VIEW_ROUTE}
          path={`${PURCHASING_PLAN_BIDDING_VIEW_ROUTE}/:id`}
          component={PurchasingPlanBiddingView}
          auth={true}
          exact={true}
        />
        <Route exact path={path}>
          <Redirect to={PURCHASING_PLAN_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PurchasingPlanBiddingPage;
