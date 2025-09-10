import { GOOD_SERVICE_TYPE_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { GoodServiceTypeMaster } from "./GoodServiceTypeMaster/GoodServiceTypeMaster";
import { MENU_CODE } from "config/const";

export function GoodServiceTypePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | GoodServiceTypePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={GOOD_SERVICE_TYPE_MASTER_ROUTE}
          key={GOOD_SERVICE_TYPE_MASTER_ROUTE}
          component={GoodServiceTypeMaster}
          code={MENU_CODE.CATALOG_GOODSERVICETYPE}
        />
        <Route exact path={path}>
          <Redirect to={GOOD_SERVICE_TYPE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
