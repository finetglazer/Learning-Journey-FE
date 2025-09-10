import {
  SUPPLIER_EVALUATION_CONFIG_DETAIL_ROUTE,
  SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE,
  SUPPLIER_EVALUATION_CONFIG_PREVIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { SupplierEvaluationConfigMaster } from "./SupplierEvaluationConfigMaster/SupplierEvaluationConfigMaster";
import SupplierEvaluationConfigDetail from "./SupplierEvaluationConfigDetail/SupplierEvaluationConfigDetail";
import SupplierEvaluationConfigPreview from "./SupplierEvaluationConfigPreview/SupplierEvaluationConfigPreview";
import { MENU_CODE } from "config/const";

export function SupplierEvaluationConfigPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | SupplierEvaluationConfigPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE}
          key={SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE}
          component={SupplierEvaluationConfigMaster}
          code={MENU_CODE.CATALOG_SUPPLIER_EVALUATION_CONFIG}
        />
        <ProtectedRoute
          path={SUPPLIER_EVALUATION_CONFIG_DETAIL_ROUTE}
          key={SUPPLIER_EVALUATION_CONFIG_DETAIL_ROUTE}
          component={SupplierEvaluationConfigDetail}
          code={MENU_CODE.CATALOG_SUPPLIER_EVALUATION_CONFIG}
        />
        <ProtectedRoute
          path={`${SUPPLIER_EVALUATION_CONFIG_DETAIL_ROUTE}/:id`}
          key={SUPPLIER_EVALUATION_CONFIG_DETAIL_ROUTE}
          component={SupplierEvaluationConfigDetail}
          code={MENU_CODE.CATALOG_SUPPLIER_EVALUATION_CONFIG}
        />

        <ProtectedRoute
          path={`${SUPPLIER_EVALUATION_CONFIG_PREVIEW_ROUTE}/:id`}
          key={SUPPLIER_EVALUATION_CONFIG_PREVIEW_ROUTE}
          component={SupplierEvaluationConfigPreview}
          code={MENU_CODE.CATALOG_SUPPLIER_EVALUATION_CONFIG}
        />
        <Route exact path={path}>
          <Redirect to={SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
