import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import {
  LEGAL_ENTITY_ROUTE_DETAIL,
  LEGAL_ENTITY_ROUTE_MASTER,
  LEGAL_ENTITY_ROUTE_VIEW,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import LegalEntityDetail from "./LegalEntityDetail/LegalEntityDetail";
import { LegalEntityMaster } from "./LegalEntityMaster/LegalEntityMaster";
import LegalEntityView from "./LegalEntityView/LegalEntityView";
import { MENU_CODE } from "config/const";

export const UseLegalEntityPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("LE.title_legal_entity")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={LEGAL_ENTITY_ROUTE_MASTER}
          key={LEGAL_ENTITY_ROUTE_MASTER}
          component={LegalEntityMaster}
          auth={true}
        />
        <ProtectedRoute
          path={LEGAL_ENTITY_ROUTE_DETAIL}
          key={LEGAL_ENTITY_ROUTE_DETAIL}
          component={LegalEntityDetail}
          auth={true}
        />
        <ProtectedRoute
          path={LEGAL_ENTITY_ROUTE_VIEW}
          key={LEGAL_ENTITY_ROUTE_VIEW}
          component={LegalEntityView}
          code={MENU_CODE.CATALOG_LEGAL_ENTITY}
        />
        <Route exact path={path}>
          <Redirect to={LEGAL_ENTITY_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
