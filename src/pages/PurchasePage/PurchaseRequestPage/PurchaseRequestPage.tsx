import {
  PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE,
  PURCHASE_REQUEST_ADJUST_VIEW_ROUTE,
  PURCHASE_REQUEST_DETAIL_ROUTE,
  PURCHASE_REQUEST_MASTER_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PurchaseRequestMaster from "./PurchaseRequestMaster/PurchaseRequestMaster";
import PurchaseRequestDetail from "./PurchaseRequestDetail/PurchaseRequestDetail";
import PurchaseRequestView from "./PurchaseRequestView/PurchaseRequestView";
import PurchaseRequestAdjustDetail from "../PurchaseRequestAdjustPage/PurchaseRequestAdjustDetail/PurchaseRequestAdjustDetail";
import PurchaseRequestAdjustView from "../PurchaseRequestAdjustPage/PurchaseRequestAdjustView/PurchaseRequestAdjustView";

function PurchaseRequestPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PurchaseRequestPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PURCHASE_REQUEST_MASTER_ROUTE}
          key={PURCHASE_REQUEST_MASTER_ROUTE}
          component={PurchaseRequestMaster}
          auth={true}
        />
        <ProtectedRoute
          path={PURCHASE_REQUEST_DETAIL_ROUTE}
          key={PURCHASE_REQUEST_DETAIL_ROUTE}
          component={PurchaseRequestDetail}
          auth={true}
        />
        <ProtectedRoute
          path={PURCHASE_REQUEST_VIEW_ROUTE}
          key={PURCHASE_REQUEST_VIEW_ROUTE}
          component={PurchaseRequestView}
          auth={true}
        />
        <ProtectedRoute
          path={PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE}
          key={PURCHASE_REQUEST_ADJUST_DETAIL_ROUTE}
          component={PurchaseRequestAdjustDetail}
          auth={true}
        />
        <ProtectedRoute
          path={PURCHASE_REQUEST_ADJUST_VIEW_ROUTE}
          key={PURCHASE_REQUEST_ADJUST_VIEW_ROUTE}
          component={PurchaseRequestAdjustView}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={PURCHASE_REQUEST_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PurchaseRequestPage;
