import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import {
  CONTRACT_ADJUSTMENT_DETAIL_ROUTE,
  CONTRACT_ADJUSTMENT_VIEW_ROUTE,
  CONTRACT_ANNEX_CREATE_ROUTE,
  CONTRACT_ANNEX_DETAIL_ROUTE,
  CONTRACT_ANNEX_EDIT_ROUTE,
  CONTRACT_ORDER,
  CONTRACT_ORDER_CREATE,
  CONTRACT_ORDER_PRINCIPAL,
  CONTRACT_ORDER_PRINCIPAL_CREATE,
  CONTRACT_ROUTE_CREATE,
  CONTRACT_ROUTE_MASTER,
  CONTRACT_ROUTE_VIEW,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { ContractAnnexDetail } from "./ContractAnnex/ContractAnnexDetail/ContractAnnexDetail";
import { ContractAnnexView } from "./ContractAnnex/ContractAnnexView/ContractAnnexView";
import ContractDetail from "./ContractDetail/ContractDetail";
import ContractMaster from "./ContractMaster/ContractMaster";
import ContractView from "./ContractView/ContractView";
import ContractAdjustmentView from "./ContractAdjustment/ContractAdjustmentView/ContractAdjustmentView";
import ContractAdjustmentDetail from "./ContractAdjustment/ContractAdjustmentDetail/ContractAdjustmentDetail";

export const CONTRACT_ANNEX_ROUTER = {
  EDIT: `${CONTRACT_ANNEX_EDIT_ROUTE}/:id`,
  CREATE: `${CONTRACT_ANNEX_CREATE_ROUTE}/:contractId`,
  DETAIL: `${CONTRACT_ANNEX_DETAIL_ROUTE}/:id`,
};

export const CONTRACT_ADJUSTMENT_ROUTER = {
  CREATE: `${CONTRACT_ADJUSTMENT_DETAIL_ROUTE}`,
  DETAIL: `${CONTRACT_ADJUSTMENT_DETAIL_ROUTE}/:id`,
  VIEW: `${CONTRACT_ADJUSTMENT_VIEW_ROUTE}/:id`,
};

function ContractPage() {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("CT.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CONTRACT_ROUTE_MASTER}
          key={CONTRACT_ROUTE_MASTER}
          component={ContractMaster}
          auth={true}
        />
        <ProtectedRoute
          path={CONTRACT_ROUTE_CREATE}
          key={CONTRACT_ROUTE_CREATE}
          component={ContractDetail}
          auth={true}
        />
        <ProtectedRoute
          path={CONTRACT_ORDER_CREATE}
          key={CONTRACT_ORDER_CREATE}
          component={ContractDetail}
          auth={true}
        />
        <ProtectedRoute
          path={CONTRACT_ORDER_PRINCIPAL_CREATE}
          key={CONTRACT_ORDER_PRINCIPAL_CREATE}
          component={ContractDetail}
          auth={true}
        />
        <ProtectedRoute
          path={`${CONTRACT_ROUTE_CREATE}/:id`}
          key={CONTRACT_ROUTE_CREATE}
          component={ContractDetail}
          auth={true}
        />
        <ProtectedRoute
          path={`${CONTRACT_ORDER_CREATE}/:id`}
          key={CONTRACT_ORDER_CREATE}
          component={ContractDetail}
          auth={true}
        />
        <ProtectedRoute
          path={`${CONTRACT_ORDER_PRINCIPAL_CREATE}/:id`}
          key={CONTRACT_ORDER_PRINCIPAL_CREATE}
          component={ContractDetail}
          auth={true}
        />
        <ProtectedRoute
          path={`${CONTRACT_ROUTE_VIEW}/:id`}
          key={CONTRACT_ROUTE_VIEW}
          component={ContractView}
          auth={true}
        />
        <ProtectedRoute
          path={`${CONTRACT_ORDER}/:id`}
          key={CONTRACT_ORDER}
          component={ContractView}
          auth={true}
        />
        <ProtectedRoute
          path={`${CONTRACT_ORDER_PRINCIPAL}/:id`}
          key={CONTRACT_ORDER_PRINCIPAL}
          component={ContractView}
          auth={true}
        />
        {/* Annex */}
        <ProtectedRoute
          path={CONTRACT_ANNEX_ROUTER.EDIT}
          key={CONTRACT_ANNEX_ROUTER.EDIT}
          component={ContractAnnexDetail}
          exact
          auth
        />

        <ProtectedRoute
          path={CONTRACT_ANNEX_ROUTER.CREATE}
          key={CONTRACT_ANNEX_ROUTER.CREATE}
          component={ContractAnnexDetail}
          exact
          auth
        />

        <ProtectedRoute
          path={CONTRACT_ANNEX_ROUTER.DETAIL}
          key={CONTRACT_ANNEX_ROUTER.DETAIL}
          component={ContractAnnexView}
          exact
          auth
        />

        {/* Adjustment */}

        <ProtectedRoute
          path={CONTRACT_ADJUSTMENT_ROUTER.CREATE}
          key={CONTRACT_ADJUSTMENT_ROUTER.CREATE}
          component={ContractAdjustmentDetail}
          exact
          auth
        />
        <ProtectedRoute
          path={CONTRACT_ADJUSTMENT_ROUTER.DETAIL}
          key={CONTRACT_ADJUSTMENT_ROUTER.DETAIL}
          component={ContractAdjustmentDetail}
          exact
          auth
        />
        <ProtectedRoute
          path={CONTRACT_ADJUSTMENT_ROUTER.VIEW}
          key={CONTRACT_ADJUSTMENT_ROUTER.VIEW}
          component={ContractAdjustmentView}
          exact
          auth
        />

        <Route exact path={path}>
          <Redirect to={CONTRACT_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
}

export default ContractPage;
