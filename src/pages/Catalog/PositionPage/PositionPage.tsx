import { POSITION_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { PositionMaster } from "./PositionMaster/PositionMaster";

export function PositionPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PositionPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={POSITION_MASTER_ROUTE}
          key={POSITION_MASTER_ROUTE}
          component={PositionMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={POSITION_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
