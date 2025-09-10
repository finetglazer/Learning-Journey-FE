import { BANK_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { BankMaster } from "./BankMaster/BankMaster";
import { MENU_CODE } from "config/const";

export function BankPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | BankPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={BANK_MASTER_ROUTE}
          key={BANK_MASTER_ROUTE}
          component={BankMaster}
          code={MENU_CODE.CATALOG_BANK}
        />
        <Route exact path={path}>
          <Redirect to={BANK_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
