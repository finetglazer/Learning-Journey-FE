import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { MANUFACTURER_CATEGORIES_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { ManufacturerCategoriesMaster } from "./ManufacturerCategoriesMaster/ManufacturerCategoriesMaster";
import { MENU_CODE } from "config/const";

export const ManufacturerCategoriesPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("MC.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={MANUFACTURER_CATEGORIES_ROUTE_MASTER}
          key={MANUFACTURER_CATEGORIES_ROUTE_MASTER}
          component={ManufacturerCategoriesMaster}
          code={MENU_CODE.CATALOG_MANUFACTURERS}
        />
        <Route exact path={path}>
          <Redirect to={MANUFACTURER_CATEGORIES_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
