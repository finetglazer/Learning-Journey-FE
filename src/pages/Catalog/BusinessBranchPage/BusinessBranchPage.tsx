import { BUSINESS_BRANCH_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { BusinessBranchMaster } from "./BusinessBranchMaster/BusinessBranchMaster";
import { MENU_CODE } from "config/const";

export function BusinessBranchPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | BusinessBranchPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={BUSINESS_BRANCH_MASTER_ROUTE}
          key={BUSINESS_BRANCH_MASTER_ROUTE}
          component={BusinessBranchMaster}
          code={MENU_CODE.CATALOG_BUSINESS_BRANCH}
        />
        <Route exact path={path}>
          <Redirect to={BUSINESS_BRANCH_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
