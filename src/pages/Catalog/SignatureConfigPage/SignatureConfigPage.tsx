import { SIGNATURE_CONFIG_MASTER } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { SignatureConfigMaster } from "./SignatureConfigMaster/SignatureConfigMaster";
import { MENU_CODE } from "config/const";

export function SignatureConfigPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | SignatureConfigPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SIGNATURE_CONFIG_MASTER}
          key={SIGNATURE_CONFIG_MASTER}
          component={SignatureConfigMaster}
          code={MENU_CODE.CATALOG_SIGNATURE_CONFIG}
        />
        <Route exact path={path}>
          <Redirect to={SIGNATURE_CONFIG_MASTER} />
        </Route>
      </Switch>
    </>
  );
}
