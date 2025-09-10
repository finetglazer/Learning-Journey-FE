import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import {
  PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { lazy } from "react";

const PurchasePlanAdjustBidDetail = lazy(
  () => import("./PurchasePlanAdjustBidDetail/PurchasePlanAdjustBidDetail")
);
const PurchasePlanAdjustBidView = lazy(
  () => import("./PurchasePlanAdjustBidView/PurchasePlanAdjustBidView")
);

function PurchasePlanAdjustBidPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | Purchase Plan Adjust Bid Page</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          key={PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE}
          path={`${PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE}`}
          component={PurchasePlanAdjustBidDetail}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE}
          path={`${PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE}/:id`}
          component={PurchasePlanAdjustBidDetail}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE}
          path={`${PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE}/:id`}
          component={PurchasePlanAdjustBidView}
          auth={true}
          exact={true}
        />
        <Route exact path={path}>
          <Redirect to={PURCHASING_PLAN_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PurchasePlanAdjustBidPage;
