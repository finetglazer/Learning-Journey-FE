import { COST_TYPE_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { CostTypeMaster } from "./CostTypeMaster/CostTypeMaster";

export function CostTypePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | CostTypePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COST_TYPE_MASTER_ROUTE}
          key={COST_TYPE_MASTER_ROUTE}
          component={CostTypeMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={COST_TYPE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
