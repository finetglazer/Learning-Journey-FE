import {
  SETTLEMENT_DETAIL_ROUTE,
  SETTLEMENT_MASTER_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import SettlementDetail from "./SettlementDetail/SettlementDetail";
import SettlementMaster from "./SettlementMaster/SettlementMaster";
import SettlementView from "./SettlementView/SettlementView";

function SettlementPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | Settlement</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SETTLEMENT_MASTER_ROUTE}
          key={SETTLEMENT_MASTER_ROUTE}
          component={SettlementMaster}
          auth={true}
        />
        <ProtectedRoute
          exact
          path={`${SETTLEMENT_DETAIL_ROUTE}`}
          key={SETTLEMENT_DETAIL_ROUTE}
          component={SettlementDetail}
          auth={true}
        />
        <ProtectedRoute
          exact
          path={`${SETTLEMENT_DETAIL_ROUTE}/:id`}
          key={`${SETTLEMENT_DETAIL_ROUTE}/:id`}
          component={SettlementDetail}
          auth={true}
        />
        <ProtectedRoute
          exact
          path={`${SETTLEMENT_VIEW_ROUTE}/:id`}
          key={SETTLEMENT_VIEW_ROUTE}
          component={SettlementView}
          auth={true}
        />

        <Route exact path={path}>
          <Redirect to={SETTLEMENT_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default SettlementPage;
