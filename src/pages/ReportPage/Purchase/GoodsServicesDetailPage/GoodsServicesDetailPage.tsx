import { REPORT_ORDER_GOOD_SERVICE_DETAIL_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import GoodsServicesDetail from "./GoodsServicesDetail";
import { MENU_CODE } from "config/const";

export default function ContractDebtDetailPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | GoodsServicesDetailPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_ORDER_GOOD_SERVICE_DETAIL_ROUTER}
          key={REPORT_ORDER_GOOD_SERVICE_DETAIL_ROUTER}
          component={GoodsServicesDetail}
          code={MENU_CODE.REPORT_PURCHASE_GOODS_SERVICE_DETAIL}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_ORDER_GOOD_SERVICE_DETAIL_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
