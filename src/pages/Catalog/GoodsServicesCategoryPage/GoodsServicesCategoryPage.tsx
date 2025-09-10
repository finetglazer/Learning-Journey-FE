import { GOODS_SERVICE_CATEGORY_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { GoodsServicesCategoryMaster } from "./GoodsServicesCategoryMaster/GoodsServicesCategoryMaster";
import { MENU_CODE } from "config/const";

export function GoodsServicesCategoryPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | GoodsServicesCategoryPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={GOODS_SERVICE_CATEGORY_MASTER_ROUTE}
          key={GOODS_SERVICE_CATEGORY_MASTER_ROUTE}
          component={GoodsServicesCategoryMaster}
          code={MENU_CODE.CATALOG_GOODS_SERVICES_CATEGORY}
        />
        <Route exact path={path}>
          <Redirect to={GOODS_SERVICE_CATEGORY_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
