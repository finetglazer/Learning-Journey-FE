import { COST_DRIVER_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { CostDriverMaster } from "./CostDriverMaster";
import { MENU_CODE } from "config/const";

export const CostDriverPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("CM.menu_title_cost_driver")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COST_DRIVER_ROUTE_MASTER}
          key={COST_DRIVER_ROUTE_MASTER}
          component={CostDriverMaster}
          code={MENU_CODE.CATALOG_COST_DRIVER}
        />
        <Route exact path={path}>
          <Redirect to={COST_DRIVER_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
