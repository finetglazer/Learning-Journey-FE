import { MENU_CODE } from "config/const";
import { REPORT_ORDER_CONTRACT_DETAIL_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import OrderContractSummaryDetail from "pages/ReportPage/Purchase/OrderContractSummaryDetail/OrderContractSummaryDetail";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

export default function OrderContractSummaryDetailPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | OrderContractSummaryDetailPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_ORDER_CONTRACT_DETAIL_ROUTER}
          key={REPORT_ORDER_CONTRACT_DETAIL_ROUTER}
          component={OrderContractSummaryDetail}
          code={MENU_CODE.REPORT_PURCHASE_ORDER_CONTRACT_DETAIL}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_ORDER_CONTRACT_DETAIL_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
