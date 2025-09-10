import { SUPPLIER_TYPE_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { SupplierTypeMaster } from "./SupplierTypeMaster/SupplierTypeMaster";
import { MENU_CODE } from "config/const";

export function SupplierTypePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | SupplierTypePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SUPPLIER_TYPE_MASTER_ROUTE}
          key={SUPPLIER_TYPE_MASTER_ROUTE}
          component={SupplierTypeMaster}
          code={MENU_CODE.CATALOG_SUPPLIER_TYPE}
        />
        <Route exact path={path}>
          <Redirect to={SUPPLIER_TYPE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
