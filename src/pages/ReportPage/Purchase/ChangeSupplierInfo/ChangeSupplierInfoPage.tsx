import { REPORT_ORDER_CHANGE_SUPPLIER_INFO_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ChangeSupplierInfo from "./ChangeSupplierInfo";
import { MENU_CODE } from "config/const";

export default function ChangeSupplierInfoPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | ChangeSupplierInfoPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_ORDER_CHANGE_SUPPLIER_INFO_ROUTER}
          key={REPORT_ORDER_CHANGE_SUPPLIER_INFO_ROUTER}
          component={ChangeSupplierInfo}
          code={MENU_CODE.REPORT_PURCHASE_CHANGE_SUPPLIER_INFO}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_ORDER_CHANGE_SUPPLIER_INFO_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
