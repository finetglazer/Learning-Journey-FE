import {
  GOODS_SERVICES_DETAIL_ROUTE,
  GOODS_SERVICES_MASTER_ROUTE,
  GOODS_SERVICES_PREVIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { GoodsServicesMaster } from "./GoodsServicesMaster/GoodsServicesMaster";
import GoodsServicesDetail from "./GoodsServicesDetail/GoodsServicesDetail";
import GoodsServicesPreview from "./GoodsServicesPreview/GoodsServicesPreview";
import { MENU_CODE } from "config/const";

export function GoodsServicesPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | GoodsServicesPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={GOODS_SERVICES_MASTER_ROUTE}
          key={GOODS_SERVICES_MASTER_ROUTE}
          component={GoodsServicesMaster}
          code={MENU_CODE.CATALOG_GOODS_SERVICE}
        />
        <ProtectedRoute
          path={GOODS_SERVICES_DETAIL_ROUTE}
          key={GOODS_SERVICES_DETAIL_ROUTE}
          component={GoodsServicesDetail}
          code={MENU_CODE.CATALOG_GOODS_SERVICE}
        />
        <ProtectedRoute
          path={`${GOODS_SERVICES_DETAIL_ROUTE}/:id`}
          key={GOODS_SERVICES_DETAIL_ROUTE}
          component={GoodsServicesDetail}
          code={MENU_CODE.CATALOG_GOODS_SERVICE}
        />
        <ProtectedRoute
          path={`${GOODS_SERVICES_PREVIEW_ROUTE}/:id`}
          key={GOODS_SERVICES_PREVIEW_ROUTE}
          component={GoodsServicesPreview}
          code={MENU_CODE.CATALOG_GOODS_SERVICE}
        />
        <Route exact path={path}>
          <Redirect to={GOODS_SERVICES_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
