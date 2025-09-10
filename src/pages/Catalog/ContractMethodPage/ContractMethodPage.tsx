import { CONTRACT_METHOD_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { ContractMethodMaster } from "./ContractMethodMaster/ContractMethodMaster";
import { MENU_CODE } from "config/const";

export function ContractMethodPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | ContractMethodPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CONTRACT_METHOD_MASTER_ROUTE}
          key={CONTRACT_METHOD_MASTER_ROUTE}
          component={ContractMethodMaster}
          code={MENU_CODE.CATALOG_CONTRACT_METHOD}
        />
        <Route exact path={path}>
          <Redirect to={CONTRACT_METHOD_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
