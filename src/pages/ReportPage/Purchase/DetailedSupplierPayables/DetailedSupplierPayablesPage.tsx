import { REPORT_DETAILED_SUPPLIER_PAYABLES_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import DetailedSupplierPayables from "./DetailedSupplierPayables";
import { MENU_CODE } from "config/const";

const DetailedSupplierPayablesPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | DetailedSupplierPayablesPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_DETAILED_SUPPLIER_PAYABLES_ROUTER}
          key={REPORT_DETAILED_SUPPLIER_PAYABLES_ROUTER}
          component={DetailedSupplierPayables}
          code={MENU_CODE.REPORT_PURCHASE_DEBT_OF_SUPPLIER_DETAIL}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_DETAILED_SUPPLIER_PAYABLES_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};

export default DetailedSupplierPayablesPage;
