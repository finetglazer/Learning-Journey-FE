import { UNIT_OF_MEASURE_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { UnitOfMeasureMaster } from "./UnitOfMeasureMaster/UnitOfMeasureMaster";
import { MENU_CODE } from "config/const";

export function UnitOfMeasurePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | UnitOfMeasurePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={UNIT_OF_MEASURE_MASTER_ROUTE}
          key={UNIT_OF_MEASURE_MASTER_ROUTE}
          component={UnitOfMeasureMaster}
          code={MENU_CODE.CATALOG_UNIT_OF_MEASURE}
        />
        <Route exact path={path}>
          <Redirect to={UNIT_OF_MEASURE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
