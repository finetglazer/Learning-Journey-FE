import { COST_ITEM_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { CostItemMaster } from "./CostItemMaster/CostItemMaster";
import { MENU_CODE } from "config/const";

export function CostItemPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | CostItemPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COST_ITEM_MASTER_ROUTE}
          key={COST_ITEM_MASTER_ROUTE}
          component={CostItemMaster}
          code={MENU_CODE.CATALOG_COSTITEM}
        />
        <Route exact path={path}>
          <Redirect to={COST_ITEM_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
