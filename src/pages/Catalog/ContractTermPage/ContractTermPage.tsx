import { CONTRACT_TERM_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { ContractTermMaster } from "./ContractTermMaster/ContractTermMaster";
import { MENU_CODE } from "config/const";

export function ContractTermPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | ContractTermPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CONTRACT_TERM_MASTER_ROUTE}
          key={CONTRACT_TERM_MASTER_ROUTE}
          component={ContractTermMaster}
          code={MENU_CODE.CATALOG_CONTRACT_TERM}
        />
        <Route exact path={path}>
          <Redirect to={CONTRACT_TERM_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
