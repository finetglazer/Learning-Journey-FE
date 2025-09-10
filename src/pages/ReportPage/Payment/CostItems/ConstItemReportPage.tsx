import { REPORT_PAYMENT_BY_COST_ITEM_MASTER_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import CostItems from "./CostItems";
import { MENU_CODE } from "config/const";

export default function ConstItemReportPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | ConstItemReportPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_PAYMENT_BY_COST_ITEM_MASTER_ROUTER}
          key={REPORT_PAYMENT_BY_COST_ITEM_MASTER_ROUTER}
          component={CostItems}
          code={MENU_CODE.REPORT_PAYMENT_BY_COSTGROUP}
          exact
        />

        <Route exact path={path}>
          <Redirect to={REPORT_PAYMENT_BY_COST_ITEM_MASTER_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
