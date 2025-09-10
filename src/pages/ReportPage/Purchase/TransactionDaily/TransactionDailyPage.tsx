import { REPORT_ORDER_TRANSACTION_DAILY_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import TransactionDaily from "./TransactionDaily";

export default function TransactionDailyPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | TransactionDailyPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_ORDER_TRANSACTION_DAILY_ROUTER}
          key={REPORT_ORDER_TRANSACTION_DAILY_ROUTER}
          component={TransactionDaily}
          auth={true}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_ORDER_TRANSACTION_DAILY_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
