import { REPORT_PURCHASE_PLAN_SUMMARY_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PurchasePlanSummary from "./PurchasePlanSummary";
import { MENU_CODE } from "config/const";

export default function PurchasePlanSummaryPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PurchasePlanSummaryPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_PURCHASE_PLAN_SUMMARY_ROUTER}
          key={REPORT_PURCHASE_PLAN_SUMMARY_ROUTER}
          component={PurchasePlanSummary}
          code={MENU_CODE.REPORT_PURCHASE_PLAN_SUMMARY}
          exact
        />
        <Route exact path={path}>
          <Redirect to={REPORT_PURCHASE_PLAN_SUMMARY_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
