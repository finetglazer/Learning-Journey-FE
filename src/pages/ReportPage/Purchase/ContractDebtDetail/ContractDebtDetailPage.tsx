import { REPORT_ORDER_CONTRACT_DEBT_DETAIL_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ContractDebtDetail from "./ContractDebtDetail";
import { MENU_CODE } from "config/const";

export default function ContractDebtDetailPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | ContractDebtDetailPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_ORDER_CONTRACT_DEBT_DETAIL_ROUTER}
          key={REPORT_ORDER_CONTRACT_DEBT_DETAIL_ROUTER}
          component={ContractDebtDetail}
          code={MENU_CODE.REPORT_PURCHASE_DEBT_OF_CONTRACT_DETAIL}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_ORDER_CONTRACT_DEBT_DETAIL_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
