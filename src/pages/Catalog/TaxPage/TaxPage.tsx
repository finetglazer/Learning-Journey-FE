import { TAX_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { TaxMaster } from "./TaxMaster/TaxMaster";
import { MENU_CODE } from "config/const";

export function TaxPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | TaxPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={TAX_MASTER_ROUTE}
          key={TAX_MASTER_ROUTE}
          component={TaxMaster}
          code={MENU_CODE.CATALOG_TAX}
        />
        <Route exact path={path}>
          <Redirect to={TAX_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
