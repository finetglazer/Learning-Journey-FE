import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { USE_ELECTRONIC_INVOICE_ROUTE_MASTER } from "config/route-const";
import { UseElectronicInvoiceMaster } from "./UseElectronicInvoiceMaster/UseElectronicInvoiceMaster";
import { MENU_CODE } from "config/const";

export const UseElectronicInvoicePage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("PC.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={USE_ELECTRONIC_INVOICE_ROUTE_MASTER}
          key={USE_ELECTRONIC_INVOICE_ROUTE_MASTER}
          component={UseElectronicInvoiceMaster}
          code={MENU_CODE.CATALOG_INVOICE}
        />
        <Route exact path={path}>
          <Redirect to={USE_ELECTRONIC_INVOICE_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
