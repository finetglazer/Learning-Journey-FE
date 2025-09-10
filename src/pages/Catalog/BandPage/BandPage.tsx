import { BAND_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { BandMaster } from "./BandMaster/BandMaster";

export function BandPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | BandPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={BAND_MASTER_ROUTE}
          key={BAND_MASTER_ROUTE}
          component={BandMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={BAND_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
