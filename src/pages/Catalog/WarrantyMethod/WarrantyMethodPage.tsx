import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { WARRANTY_METHOD_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { WarrantyMethodMaster } from "./WarrantyMethodMaster";
import { MENU_CODE } from "config/const";

export const UseWarrantyMethodPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("WM.title_warranty_method")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={WARRANTY_METHOD_ROUTE_MASTER}
          key={WARRANTY_METHOD_ROUTE_MASTER}
          component={WarrantyMethodMaster}
          code={MENU_CODE.CATALOG_WARRANTY_METHOD}
        />
        <Route exact path={path}>
          <Redirect to={WARRANTY_METHOD_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
