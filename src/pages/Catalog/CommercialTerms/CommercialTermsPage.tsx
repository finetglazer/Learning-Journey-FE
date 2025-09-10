import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { COMMERCIAL_TERMS_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { CommercialTermsMaster } from "./CommercialTermsMaster";

export const UseCommercialTermsPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("CCT.title_commercial_terms")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COMMERCIAL_TERMS_ROUTE_MASTER}
          key={COMMERCIAL_TERMS_ROUTE_MASTER}
          component={CommercialTermsMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={COMMERCIAL_TERMS_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
