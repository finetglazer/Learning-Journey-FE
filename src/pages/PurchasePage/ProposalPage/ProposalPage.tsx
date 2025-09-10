import {
  PROPOSAL_ADJUST_DETAIL_ROUTE,
  PROPOSAL_ADJUST_VIEW_ROUTE,
  PROPOSAL_CREATE_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PROPOSAL_MASTER_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ProposalAdjustDetail from "../ProposalAdjustPage/ProposalAdjustDetail/ProposalAdjustDetail";
import ProposalAdjustView from "../ProposalAdjustPage/ProposalAdjustView/ProposalAdjustView";
import ProposalCreate from "./ProposalCreate/ProposalCreate";
import ProposalDetail from "./ProposalDetail/ProposalDetail";
import ProposalMaster from "./ProposalMaster/ProposalMaster";
function ProposalPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | ProposalPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PROPOSAL_MASTER_ROUTE}
          key={PROPOSAL_MASTER_ROUTE}
          component={ProposalMaster}
          auth={true}
        />
        <ProtectedRoute
          path={PROPOSAL_CREATE_ROUTE}
          key={PROPOSAL_CREATE_ROUTE}
          component={ProposalCreate}
          auth={true}
        />
        <ProtectedRoute
          path={`${PROPOSAL_DETAIL_ROUTE}/:id`}
          key={PROPOSAL_DETAIL_ROUTE}
          component={ProposalDetail}
          auth={true}
        />
        <ProtectedRoute
          path={PROPOSAL_ADJUST_DETAIL_ROUTE}
          key={PROPOSAL_ADJUST_DETAIL_ROUTE}
          component={ProposalAdjustDetail}
          auth={true}
        />
        <ProtectedRoute
          path={PROPOSAL_ADJUST_VIEW_ROUTE}
          key={PROPOSAL_ADJUST_VIEW_ROUTE}
          component={ProposalAdjustView}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={PROPOSAL_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default ProposalPage;
