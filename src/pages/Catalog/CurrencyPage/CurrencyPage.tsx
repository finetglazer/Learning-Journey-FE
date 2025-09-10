import { CURRENCY_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { CurrencyMaster } from "./CurrencyMaster/CurrencyMaster";

export function CurrencyPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | CurrencyPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CURRENCY_MASTER_ROUTE}
          key={CURRENCY_MASTER_ROUTE}
          component={CurrencyMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={CURRENCY_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
