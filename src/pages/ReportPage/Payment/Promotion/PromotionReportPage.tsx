import { REPORT_PAYMENT_BY_PROMO_MASTER_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Promotion from "./Promotion";
import { MENU_CODE } from "config/const";

export default function PromotionReportPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PromotionReportPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_PAYMENT_BY_PROMO_MASTER_ROUTER}
          key={REPORT_PAYMENT_BY_PROMO_MASTER_ROUTER}
          component={Promotion}
          code={MENU_CODE.REPORT_PAYMENT_BY_PROMOTION}
          exact
        />
        <Route exact path={path}>
          <Redirect to={REPORT_PAYMENT_BY_PROMO_MASTER_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
