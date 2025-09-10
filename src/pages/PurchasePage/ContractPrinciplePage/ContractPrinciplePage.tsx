import {
  CONTRACT_PRINCIPLE_APPENDIX_CREATE_ROUTE,
  CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_APPENDIX_EDIT_ROUTE,
  CONTRACT_PRINCIPLE_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_MASTER_ROUTE,
  CONTRACT_PRINCIPLE_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import ContractPrincipleAppendixDetail from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixDetail/ContractPrincipleAppendixDetail";
import ContractPrincipleAppendixView from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixView/ContractPrincipleAppendixView";
import ContractPrincipleDetail from "./ContractPrincipleDetail/ContractPrincipleDetail";
import ContractPrincipleMaster from "./ContractPrincipleMaster/ContractPrincipleMaster";
import ContractPrincipleView from "./ContractPrincipleView/ContractPrincipleView";

export const CONTRACT_PRINCIPLE_APPENDIX_ROUTER = {
  EDIT: `${CONTRACT_PRINCIPLE_APPENDIX_EDIT_ROUTE}/:id`,
  CREATE: `${CONTRACT_PRINCIPLE_APPENDIX_CREATE_ROUTE}/:contractId`,
  DETAIL: `${CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE}/:id`,
};

function ContractPrinciplePage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | ContractPrinciplePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CONTRACT_PRINCIPLE_MASTER_ROUTE}
          key={CONTRACT_PRINCIPLE_MASTER_ROUTE}
          component={ContractPrincipleMaster}
          auth={true}
        />
        <ProtectedRoute
          path={CONTRACT_PRINCIPLE_DETAIL_ROUTE}
          key={CONTRACT_PRINCIPLE_DETAIL_ROUTE}
          component={ContractPrincipleDetail}
          auth={true}
        />
        <ProtectedRoute
          path={CONTRACT_PRINCIPLE_VIEW_ROUTE}
          key={CONTRACT_PRINCIPLE_VIEW_ROUTE}
          component={ContractPrincipleView}
          auth={true}
        />

        {/* Contract Principle Appendix */}
        <ProtectedRoute
          path={CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE}
          key={CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE}
          component={ContractPrincipleAppendixDetail}
          auth={true}
        />

        <ProtectedRoute
          path={CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT}
          key={CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT}
          component={ContractPrincipleAppendixDetail}
          auth={true}
        />

        <ProtectedRoute
          path={CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL}
          key={CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL}
          component={ContractPrincipleAppendixView}
          auth={true}
        />

        <Route exact path={path}>
          <Redirect to={CONTRACT_PRINCIPLE_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default ContractPrinciplePage;
