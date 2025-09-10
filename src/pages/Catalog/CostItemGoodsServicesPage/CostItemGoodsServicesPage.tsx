import {
  COST_ITEM_GOODS_SERVICES_DETAIL_ROUTE,
  COST_ITEM_GOODS_SERVICES_MASTER_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { CostItemGoodsServicesMaster } from "./CostItemGoodsServicesMaster/CostItemGoodsServicesMaster";
import CostItemGoodsServicesDetail from "./CostItemGoodsServicesDetail/CostItemGoodsServicesDetail";
import { MENU_CODE } from "config/const";

export function CostItemGoodsServicesPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | CostItemGoodsServicesPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COST_ITEM_GOODS_SERVICES_MASTER_ROUTE}
          key={COST_ITEM_GOODS_SERVICES_MASTER_ROUTE}
          component={CostItemGoodsServicesMaster}
          code={MENU_CODE.CATALOG_GOODS_SERVICE_COSTGROUP_CONFIG}
        />
        <ProtectedRoute
          path={COST_ITEM_GOODS_SERVICES_DETAIL_ROUTE}
          key={COST_ITEM_GOODS_SERVICES_DETAIL_ROUTE}
          component={CostItemGoodsServicesDetail}
          code={MENU_CODE.CATALOG_GOODS_SERVICE_COSTGROUP_CONFIG}
        />
        <ProtectedRoute
          path={`${COST_ITEM_GOODS_SERVICES_DETAIL_ROUTE}/:id`}
          key={COST_ITEM_GOODS_SERVICES_DETAIL_ROUTE}
          component={CostItemGoodsServicesDetail}
          code={MENU_CODE.CATALOG_GOODS_SERVICE_COSTGROUP_CONFIG}
        />
        <Route exact path={path}>
          <Redirect to={COST_ITEM_GOODS_SERVICES_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
