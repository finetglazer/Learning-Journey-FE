import { REPORT_PROPOSAL_SUMMARY_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ProposalSummary from "./ProposalSummary";
import { MENU_CODE } from "config/const";

export default function ProposalSummaryPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | ProposalSummaryPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_PROPOSAL_SUMMARY_ROUTER}
          key={REPORT_PROPOSAL_SUMMARY_ROUTER}
          component={ProposalSummary}
          code={MENU_CODE.REPORT_PURCHASE_SUMMARY_PURCHASING_POLICY}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_PROPOSAL_SUMMARY_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
