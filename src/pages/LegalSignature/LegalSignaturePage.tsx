import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { LEGAL_SIGNATURE_MASTER_ROUTE } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import LegalSignatureMaster from "./LegalSignatureMaster/LegalSignatureMaster";

function LegalSignaturePage() {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("CT.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={LEGAL_SIGNATURE_MASTER_ROUTE}
          key={LEGAL_SIGNATURE_MASTER_ROUTE}
          component={LegalSignatureMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={LEGAL_SIGNATURE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default LegalSignaturePage;
