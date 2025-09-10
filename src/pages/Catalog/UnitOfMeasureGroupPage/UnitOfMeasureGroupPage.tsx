import { UNIT_OF_MEASURE_GROUP_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { UnitOfMeasureGroupMaster } from "./UnitOfMeasureGroupMaster/UnitOfMeasureGroupMaster";
import { MENU_CODE } from "config/const";

export function UnitOfMeasureGroupPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | UnitOfMeasureGroupPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={UNIT_OF_MEASURE_GROUP_MASTER_ROUTE}
          key={UNIT_OF_MEASURE_GROUP_MASTER_ROUTE}
          component={UnitOfMeasureGroupMaster}
          code={MENU_CODE.CATALOG_UNIT_OF_MEASURE_GROUP}
        />
        <Route exact path={path}>
          <Redirect to={UNIT_OF_MEASURE_GROUP_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
