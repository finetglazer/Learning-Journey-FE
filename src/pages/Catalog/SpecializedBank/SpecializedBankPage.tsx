import { SPECIALIZED_BANK_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { SpecializedBankMaster } from "./SpecializedBankMaster";
import { MENU_CODE } from "config/const";

export const SpecializedBankPage = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | SpecializedBankPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SPECIALIZED_BANK_ROUTE_MASTER}
          key={SPECIALIZED_BANK_ROUTE_MASTER}
          component={SpecializedBankMaster}
          code={MENU_CODE.CATALOG_BUSINESS_UNIT}
        />
        <Route exact path={path}>
          <Redirect to={SPECIALIZED_BANK_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
