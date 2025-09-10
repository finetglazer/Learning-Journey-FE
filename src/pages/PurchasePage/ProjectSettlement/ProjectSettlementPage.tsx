import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  PROJECT_SETTLEMENT_CREATE_ROUTE,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROJECT_SETTLEMENT_EDIT_ROUTE,
  PROJECT_SETTLEMENT_MASTER_ROUTE,
} from "config/route-const";
import ProjectSettlementMaster from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/ProjectSettlementMaster";
import ProjectSettlementDetail from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/ProjectSettlementDetail";
import ProjectSettlementView from "./ProjectSettlementView/ProjectSettlementView";

export const PROJECT_SETTLEMENT_ROUTER = {
  EDIT: `${PROJECT_SETTLEMENT_EDIT_ROUTE}/:id`,
  CREATE: `${PROJECT_SETTLEMENT_CREATE_ROUTE}/:originalPurchaseProposalId`,
  DETAIL: `${PROJECT_SETTLEMENT_DETAIL_ROUTE}/:id`,
};

export const ProjectSettlementPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("PS.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PROJECT_SETTLEMENT_MASTER_ROUTE}
          key={PROJECT_SETTLEMENT_MASTER_ROUTE}
          component={ProjectSettlementMaster}
          exact
          auth
        />
        <ProtectedRoute
          path={PROJECT_SETTLEMENT_ROUTER.CREATE}
          key={PROJECT_SETTLEMENT_ROUTER.CREATE}
          component={ProjectSettlementDetail}
          exact
          auth
        />
        <ProtectedRoute
          path={PROJECT_SETTLEMENT_ROUTER.EDIT}
          key={PROJECT_SETTLEMENT_ROUTER.EDIT}
          component={ProjectSettlementDetail}
          exact
          auth
        />
        <ProtectedRoute
          path={PROJECT_SETTLEMENT_ROUTER.DETAIL}
          key={PROJECT_SETTLEMENT_ROUTER.DETAIL}
          component={ProjectSettlementView}
          exact
          auth
        />
        <Route exact path={path}>
          <Redirect to={PROJECT_SETTLEMENT_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
};
