import { PROMOTION_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { PromotionMaster } from "./PromotionMaster/PromotionMaster";
import { MENU_CODE } from "config/const";

export function PromotionPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PromotionPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PROMOTION_MASTER_ROUTE}
          key={PROMOTION_MASTER_ROUTE}
          component={PromotionMaster}
          code={MENU_CODE.CATALOG_PROMOTION}
        />
        <Route exact path={path}>
          <Redirect to={PROMOTION_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
