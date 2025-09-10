import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { PAYMENT_CONDITION_ROUTE_MASTER } from "config/route-const";
import { PaymentConditionMaster } from "./PaymentConditionMaster/PaymentConditionMaster";
import { MENU_CODE } from "config/const";

export const PaymentConditionPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("PC.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PAYMENT_CONDITION_ROUTE_MASTER}
          key={PAYMENT_CONDITION_ROUTE_MASTER}
          component={PaymentConditionMaster}
          code={MENU_CODE.CATALOG_PAYMENT_CONDITION}
        />
        <Route exact path={path}>
          <Redirect to={PAYMENT_CONDITION_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
