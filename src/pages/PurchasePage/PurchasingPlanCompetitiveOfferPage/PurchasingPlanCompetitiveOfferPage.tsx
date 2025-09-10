import {
  PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
  PURCHASING_PLAN_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { lazy } from "react";

const PurchasingPlanCompetitiveOfferDetail = lazy(
  () =>
    import(
      "./PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetail"
    )
);
const PurchasingPlanCompetitiveOfferView = lazy(
  () =>
    import(
      "./PurchasingPlanCompetitiveOfferView/PurchasingPlanCompetitiveOfferView"
    )
);

function PurchasingPlanCompetitiveOfferPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PurchasingPlanCompetitiveOfferPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          key={PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE}
          path={`${PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE}/:id?`}
          component={PurchasingPlanCompetitiveOfferDetail}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE}
          path={`${PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE}/:id`}
          component={PurchasingPlanCompetitiveOfferView}
          auth={true}
          exact={true}
        />
        <Route exact path={path}>
          <Redirect to={PURCHASING_PLAN_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PurchasingPlanCompetitiveOfferPage;
