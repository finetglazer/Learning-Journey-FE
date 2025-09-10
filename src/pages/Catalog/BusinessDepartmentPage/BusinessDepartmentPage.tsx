import { BUSINESS_DEPARTMENT_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { BusinessDepartmentMaster } from "./BusinessDepartmentMaster/BusinessDepartmentMaster";
import { MENU_CODE } from "config/const";

export function BusinessDepartmentPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | BusinessDepartmentPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={BUSINESS_DEPARTMENT_MASTER_ROUTE}
          key={BUSINESS_DEPARTMENT_MASTER_ROUTE}
          component={BusinessDepartmentMaster}
          code={MENU_CODE.CATALOG_BUSINESS_DEPARTMENT}
        />
        <Route exact path={path}>
          <Redirect to={BUSINESS_DEPARTMENT_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
