import {
  ACCEPTANCE_CREATE_ROUTE,
  ACCEPTANCE_DETAIL_ROUTE,
  ACCEPTANCE_EDIT_ROUTE,
  ACCEPTANCE_ROUTE_MASTER,
} from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { AcceptanceDetail } from "./AcceptanceDetail/AcceptanceDetail";
import { AcceptanceView } from "./AcceptanceView/AcceptanceView";
import AcceptanceMaster from "./AcceptanceMaster/AcceptanceMaster";

export const ACCEPTANCE_ROUTER = {
  EDIT: `${ACCEPTANCE_EDIT_ROUTE}/:acceptanceId`,
  CREATE: `${ACCEPTANCE_CREATE_ROUTE}/:contractId`,
  DETAIL: `${ACCEPTANCE_DETAIL_ROUTE}/:acceptanceId`,
};

export const AcceptancePage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("AC.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={ACCEPTANCE_ROUTE_MASTER}
          key={ACCEPTANCE_ROUTE_MASTER}
          component={AcceptanceMaster}
          exact
          auth
        />
        <ProtectedRoute
          path={ACCEPTANCE_ROUTER.DETAIL}
          key={ACCEPTANCE_ROUTER.DETAIL}
          component={AcceptanceView}
          exact
          auth
        />
        <ProtectedRoute
          path={ACCEPTANCE_ROUTER.EDIT}
          key={ACCEPTANCE_ROUTER.EDIT}
          component={AcceptanceDetail}
          exact
          auth
        />
        <ProtectedRoute
          path={ACCEPTANCE_ROUTER.CREATE}
          key={ACCEPTANCE_ROUTER.CREATE}
          component={AcceptanceDetail}
          exact
          auth
        />
        <Route exact path={path}>
          <Redirect to={ACCEPTANCE_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
