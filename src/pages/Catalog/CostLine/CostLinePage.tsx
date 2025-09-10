import { COST_LINE_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { CostLineMaster } from "./CostLineMaster/CostLineMaster";

export function CostLinePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | ConstLinePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COST_LINE_MASTER_ROUTE}
          key={COST_LINE_MASTER_ROUTE}
          component={CostLineMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={COST_LINE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
