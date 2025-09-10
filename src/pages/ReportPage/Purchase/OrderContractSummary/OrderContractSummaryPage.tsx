import { MENU_CODE } from "config/const";
import { REPORT_ORDER_CONTRACT_MASTER_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import OrderContractSummary from "pages/ReportPage/Purchase/OrderContractSummary/OrderContractSummary";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

export default function OrderContractSummaryPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | OrderContractSummaryPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_ORDER_CONTRACT_MASTER_ROUTER}
          key={REPORT_ORDER_CONTRACT_MASTER_ROUTER}
          component={OrderContractSummary}
          code={MENU_CODE.REPORT_PURCHASE_ORDER_CONTRACT_MASTER}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_ORDER_CONTRACT_MASTER_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
