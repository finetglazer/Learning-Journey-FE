import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { CENTRAL_PURCHASE_UNIT_ROUTE_MASTER } from "config/route-const";
import { CentralPurchaseUnitMaster } from "./CentralPurchaseUnitMaster/CentralPurchaseUnitMaster";
import { MENU_CODE } from "config/const";

export const CentralPurchaseUnitPage = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | CentralPurchaseUnitPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CENTRAL_PURCHASE_UNIT_ROUTE_MASTER}
          key={CENTRAL_PURCHASE_UNIT_ROUTE_MASTER}
          component={CentralPurchaseUnitMaster}
          code={MENU_CODE.CATALOG_CENTRALIZED_PURCHASING_UNIT}
        />
        <Route exact path={path}>
          <Redirect to={CENTRAL_PURCHASE_UNIT_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
