import { REPORT_PURCHASE_PLAN_DETAIL_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PurchasePlanDetail from "./PurchasePlanDetail";
import { MENU_CODE } from "config/const";

export default function PurchasePlanDetailPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PurchasePlanDetailPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_PURCHASE_PLAN_DETAIL_ROUTER}
          key={REPORT_PURCHASE_PLAN_DETAIL_ROUTER}
          component={PurchasePlanDetail}
          code={MENU_CODE.REPORT_PURCHASE_PLAN_DETAIL}
          exact
        />
        <Route exact path={path}>
          <Redirect to={REPORT_PURCHASE_PLAN_DETAIL_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
