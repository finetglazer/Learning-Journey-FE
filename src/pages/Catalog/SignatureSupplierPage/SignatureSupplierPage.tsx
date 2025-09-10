import { SIGNATURE_SUPPLIER_MASTER } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { SignatureSupplierMaster } from "./SignatureSupplierMaster/SignatureSupplierMaster";
import { MENU_CODE } from "config/const";

export function SignatureSupplierPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | SignatureSupplierPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SIGNATURE_SUPPLIER_MASTER}
          key={SIGNATURE_SUPPLIER_MASTER}
          component={SignatureSupplierMaster}
          code={MENU_CODE.CATALOG_SIGNATURE_SUPPLIER}
        />
        <Route exact path={path}>
          <Redirect to={SIGNATURE_SUPPLIER_MASTER} />
        </Route>
      </Switch>
    </>
  );
}
