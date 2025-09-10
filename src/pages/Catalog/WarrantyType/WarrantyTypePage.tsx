import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { WARRANTY_TYPE_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { WarrantyTypeMaster } from "./WarrantyTypeMaster";
import { MENU_CODE } from "config/const";

export const UseWarrantyTypePage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("WT.title_warranty_type")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={WARRANTY_TYPE_ROUTE_MASTER}
          key={WARRANTY_TYPE_ROUTE_MASTER}
          component={WarrantyTypeMaster}
          code={MENU_CODE.CATALOG_WARRANTY_TYPE}
        />
        <Route exact path={path}>
          <Redirect to={WARRANTY_TYPE_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
