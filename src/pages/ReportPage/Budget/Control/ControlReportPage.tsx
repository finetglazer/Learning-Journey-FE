import { REPORT_BUDGET_CONTROL_MASTER_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Control from "./Control";
import { MENU_CODE } from "config/const";

export const ControlReportPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | ControlReportPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_BUDGET_CONTROL_MASTER_ROUTER}
          key={REPORT_BUDGET_CONTROL_MASTER_ROUTER}
          component={Control}
          code={MENU_CODE.REPORT_BUDGET_CONTROL_MASTER}
        />
        <Route exact path={path}>
          <Redirect to={REPORT_BUDGET_CONTROL_MASTER_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};
