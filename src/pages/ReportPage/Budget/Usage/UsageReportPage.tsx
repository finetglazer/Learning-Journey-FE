import { REPORT_BUDGET_USAGE_MASTER_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Usage } from "./Usage";
import { MENU_CODE } from "config/const";

export const UsageReportPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | UsageReportPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_BUDGET_USAGE_MASTER_ROUTER}
          key={REPORT_BUDGET_USAGE_MASTER_ROUTER}
          component={Usage}
          code={MENU_CODE.REPORT_BUDGET_USAGE_MASTER}
        />
        <Route exact path={path}>
          <Redirect to={REPORT_BUDGET_USAGE_MASTER_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};
