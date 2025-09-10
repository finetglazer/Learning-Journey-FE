import {
  CONTRACT_TERMINATION_DETAIL_ROUTE,
  CONTRACT_TERMINATION_MASTER_ROUTE,
  CONTRACT_TERMINATION_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ContractTerminationDetail from "./ContractTerminationDetail/ContractTerminationDetail";
import ContractTerminationView from "./ContractTerminationView/ContractTerminationView";
import ContractTerminationMaster from "./ContractTerminationMaster/ContractTerminationMaster";

function ContractTerminationPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | contract-termination</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CONTRACT_TERMINATION_MASTER_ROUTE}
          key={CONTRACT_TERMINATION_MASTER_ROUTE}
          component={ContractTerminationMaster}
          auth={true}
        />
        <ProtectedRoute
          exact
          path={`${CONTRACT_TERMINATION_DETAIL_ROUTE}`}
          key={CONTRACT_TERMINATION_DETAIL_ROUTE}
          component={ContractTerminationDetail}
          auth={true}
        />
        <ProtectedRoute
          exact
          path={`${CONTRACT_TERMINATION_DETAIL_ROUTE}/:id`}
          key={`${CONTRACT_TERMINATION_DETAIL_ROUTE}/:id`}
          component={ContractTerminationDetail}
          auth={true}
        />
        <ProtectedRoute
          exact
          path={`${CONTRACT_TERMINATION_VIEW_ROUTE}/:id`}
          key={CONTRACT_TERMINATION_VIEW_ROUTE}
          component={ContractTerminationView}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={CONTRACT_TERMINATION_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default ContractTerminationPage;
