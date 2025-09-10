import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import {
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_MASTER_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { lazy } from "react";

const PurchasePlanAdjustCompetitiveOfferDetail = lazy(
  () =>
    import(
      "./PurchasePlanAdjustCompetitiveOfferDetail/PurchasePlanAdjustCompetitiveOfferDetail"
    )
);
const PurchasePlanAdjustCompetitiveOfferView = lazy(
  () =>
    import(
      "./PurchasePlanAdjustCompetitiveOfferView/PurchasePlanAdjustCompetitiveOfferView"
    )
);

function PurchasePlanAdjustCompetitiveOfferPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | Purchase Plan Adjust CompetitiveOffer Page</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          key={PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE}
          path={`${PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE}`}
          component={PurchasePlanAdjustCompetitiveOfferDetail}
          auth
          exact
        />
        <ProtectedRoute
          key={PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE}
          path={`${PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE}/:id`}
          component={PurchasePlanAdjustCompetitiveOfferDetail}
          auth
          exact
        />
        <ProtectedRoute
          key={PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE}
          path={`${PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE}/:id`}
          component={PurchasePlanAdjustCompetitiveOfferView}
          auth
          exact
        />
        <Route exact path={path}>
          <Redirect to={PURCHASING_PLAN_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PurchasePlanAdjustCompetitiveOfferPage;
