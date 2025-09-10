import { SUPPLIER_CATEGORY_CONFIG_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { SupplierCategoryConfigMaster } from "./SupplierCategoryConfigMaster/SupplierCategoryConfigMaster";
import { MENU_CODE } from "config/const";

export function SupplierCategoryConfigPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | SupplierCategoryConfigPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SUPPLIER_CATEGORY_CONFIG_MASTER_ROUTE}
          key={SUPPLIER_CATEGORY_CONFIG_MASTER_ROUTE}
          component={SupplierCategoryConfigMaster}
          code={MENU_CODE.CATALOG_SUPPLIER_CATEGORY_CONFIG}
        />
        <Route exact path={path}>
          <Redirect to={SUPPLIER_CATEGORY_CONFIG_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
