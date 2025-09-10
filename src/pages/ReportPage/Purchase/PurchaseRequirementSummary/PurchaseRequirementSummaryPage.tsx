import { REPORT_PURCHASE_REQUIREMENT_SUMMARY_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import PurchaseRequirementSummary from "./PurchaseRequirementSummary";
import { MENU_CODE } from "config/const";

const PurchaseRequirementSummaryPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | PurchaseRequirementSummaryPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_PURCHASE_REQUIREMENT_SUMMARY_ROUTER}
          key={REPORT_PURCHASE_REQUIREMENT_SUMMARY_ROUTER}
          component={PurchaseRequirementSummary}
          code={MENU_CODE.REPORT_PURCHASE_REQUEST_SUMMARY}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_PURCHASE_REQUIREMENT_SUMMARY_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};

export default PurchaseRequirementSummaryPage;
