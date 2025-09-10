import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { GUARANTEE_TYPE_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { GuaranteeTypeMaster } from "./GuaranteeTypeMaster";
import { MENU_CODE } from "config/const";

export const UseGuaranteeTypePage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("GT.title_guarantee_type")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={GUARANTEE_TYPE_ROUTE_MASTER}
          key={GUARANTEE_TYPE_ROUTE_MASTER}
          component={GuaranteeTypeMaster}
          code={MENU_CODE.CATALOG_GUARANTEE_TYPE}
        />
        <Route exact path={path}>
          <Redirect to={GUARANTEE_TYPE_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
