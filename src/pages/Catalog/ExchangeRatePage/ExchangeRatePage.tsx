import { EXCHANGE_RATE_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { ExchangeRateMaster } from "./ExchangeRateMaster/ExchangeRateMaster";
import { MENU_CODE } from "config/const";

export function ExchangeRatePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | ExchangeRatePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={EXCHANGE_RATE_MASTER_ROUTE}
          key={EXCHANGE_RATE_MASTER_ROUTE}
          component={ExchangeRateMaster}
          code={MENU_CODE.CATALOG_RATEOFEXCHANGE}
        />
        <Route exact path={path}>
          <Redirect to={EXCHANGE_RATE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
