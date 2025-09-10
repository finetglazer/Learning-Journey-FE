import {
  COST_LINE_COST_ITEM_DETAIL_ROUTE,
  COST_LINE_COST_ITEM_MASTER_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { CostLineCostItemMaster } from "./CostLineCostItemMaster/CostLineCostItemMaster";
import CostLineCostItemDetail from "./CostLineCostItemDetail/CostLineCostItemDetail";
import { MENU_CODE } from "config/const";

export function CostLineCostItemPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | CostLineCostItemPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COST_LINE_COST_ITEM_MASTER_ROUTE}
          key={COST_LINE_COST_ITEM_MASTER_ROUTE}
          component={CostLineCostItemMaster}
          code={MENU_CODE.CATALOG_COSTLINE_COSTGROUP_CONFIG}
        />
        <ProtectedRoute
          path={COST_LINE_COST_ITEM_DETAIL_ROUTE}
          key={COST_LINE_COST_ITEM_DETAIL_ROUTE}
          component={CostLineCostItemDetail}
          code={MENU_CODE.CATALOG_COSTLINE_COSTGROUP_CONFIG}
        />
        <ProtectedRoute
          path={`${COST_LINE_COST_ITEM_DETAIL_ROUTE}/:id`}
          key={COST_LINE_COST_ITEM_DETAIL_ROUTE}
          component={CostLineCostItemDetail}
          code={MENU_CODE.CATALOG_COSTLINE_COSTGROUP_CONFIG}
        />
        <Route exact path={path}>
          <Redirect to={COST_LINE_COST_ITEM_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
