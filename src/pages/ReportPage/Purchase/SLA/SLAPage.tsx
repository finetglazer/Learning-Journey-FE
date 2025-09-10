import { REPORT_SLA_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import SLA from "pages/ReportPage/Purchase/SLA/SLA";
import { MENU_CODE } from "config/const";

const SLAPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | SLAPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_SLA_ROUTER}
          key={REPORT_SLA_ROUTER}
          component={SLA}
          code={MENU_CODE.SLA}
          auth
        />

        <Route exact path={path}>
          <Redirect to={REPORT_SLA_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};

export default SLAPage;
