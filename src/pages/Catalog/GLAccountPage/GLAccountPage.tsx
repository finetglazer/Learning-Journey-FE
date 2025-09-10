import { GL_ACCOUNT_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { GLAccountMaster } from "./GLAccountMaster/GLAccountMaster";
import { MENU_CODE } from "config/const";

export function GLAccountPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | GLAccountPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={GL_ACCOUNT_MASTER_ROUTE}
          key={GL_ACCOUNT_MASTER_ROUTE}
          component={GLAccountMaster}
          code={MENU_CODE.CATALOG_GL_ACCOUNT}
        />
        <Route exact path={path}>
          <Redirect to={GL_ACCOUNT_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
