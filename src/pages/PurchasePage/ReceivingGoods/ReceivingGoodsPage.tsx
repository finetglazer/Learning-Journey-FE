import {
  RECEIVING_GOODS_CREATE_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  RECEIVING_GOODS_EDIT_ROUTE,
  RECEIVING_GOODS_ROUTE_MASTER,
} from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { ReceivingGoodsDetail } from "./ReceivingGoodsDetail/ReceivingGoodsDetail";
import { ReceivingGoodsMaster } from "./ReceivingGoodsMaster/ReceivingGoodsMaster";
import { ReceivingGoodsView } from "./ReceivingGoodsView/ReceivingGoodsView";

export const ReceivingGoodsPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("RG.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={RECEIVING_GOODS_ROUTE_MASTER}
          key={RECEIVING_GOODS_ROUTE_MASTER}
          component={ReceivingGoodsMaster}
          auth
        />
        <ProtectedRoute
          path={`${RECEIVING_GOODS_DETAIL_ROUTE}/:id`}
          key={`${RECEIVING_GOODS_DETAIL_ROUTE}/:id`}
          component={ReceivingGoodsView}
          exact
          auth
        />
        {/* Receiving */}
        <ProtectedRoute
          path={`${RECEIVING_GOODS_CREATE_ROUTE}/:id`}
          key={`${RECEIVING_GOODS_CREATE_ROUTE}/:id`}
          component={ReceivingGoodsDetail}
          exact
          auth
        />
        {/* Edit */}
        <ProtectedRoute
          path={`${RECEIVING_GOODS_EDIT_ROUTE}/:id`}
          key={`${RECEIVING_GOODS_EDIT_ROUTE}/:id`}
          component={ReceivingGoodsDetail}
          exact
          auth
        />
        <Route exact path={path}>
          <Redirect to={RECEIVING_GOODS_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
