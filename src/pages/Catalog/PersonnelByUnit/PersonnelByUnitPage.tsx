import { PERSONNEL_BY_UNIT_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { PersonnelByUnitMaster } from "./PersonnelByUnitMaster";
import { MENU_CODE } from "config/const";

export const PersonnelByUnitPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("CM.menu_title_personnel_by_unit")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PERSONNEL_BY_UNIT_ROUTE_MASTER}
          key={PERSONNEL_BY_UNIT_ROUTE_MASTER}
          component={PersonnelByUnitMaster}
          code={MENU_CODE.CATALOG_PERSONNEL_BY_UNIT}
        />
        <Route exact path={path}>
          <Redirect to={PERSONNEL_BY_UNIT_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
