import { NATION_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { NationMaster } from "./NationMaster/NationMaster";
import { MENU_CODE } from "config/const";

export function NationPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | NationPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={NATION_MASTER_ROUTE}
          key={NATION_MASTER_ROUTE}
          component={NationMaster}
          code={MENU_CODE.CATALOG_NATION}
        />
        <Route exact path={path}>
          <Redirect to={NATION_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
