import {
  SUPPLIER_APPROVE_ROUTE,
  SUPPLIER_DETAIL_ROUTE,
  SUPPLIER_MASTER_ROUTE,
  SUPPLIER_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { SupplierMaster } from "./SupplierMaster";
import { SupplierDetail } from "./SupplierDetail/SupplierDetail";
import { MENU_CODE } from "config/const";
import { SupplierView } from "./SupplierView/SupplierView";

export const SupplierPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("SL.title")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={SUPPLIER_MASTER_ROUTE}
          key={SUPPLIER_MASTER_ROUTE}
          component={SupplierMaster}
          code={MENU_CODE.CATALOG_MANAGE_SUPPLIER}
        />

        <ProtectedRoute
          path={SUPPLIER_DETAIL_ROUTE}
          key={SUPPLIER_DETAIL_ROUTE}
          component={SupplierDetail}
          code={MENU_CODE.CATALOG_MANAGE_SUPPLIER}
        />
        <ProtectedRoute
          path={`${SUPPLIER_DETAIL_ROUTE}/:id`}
          key={SUPPLIER_DETAIL_ROUTE}
          component={SupplierDetail}
          code={MENU_CODE.CATALOG_MANAGE_SUPPLIER}
        />
        <ProtectedRoute
          path={`${SUPPLIER_VIEW_ROUTE}/:id`}
          key={SUPPLIER_VIEW_ROUTE}
          component={SupplierView}
          code={MENU_CODE.CATALOG_MANAGE_SUPPLIER}
        />
        <ProtectedRoute
          path={`${SUPPLIER_APPROVE_ROUTE}/:id`}
          key={SUPPLIER_DETAIL_ROUTE}
          component={SupplierDetail}
          code={MENU_CODE.CATALOG_MANAGE_SUPPLIER}
        />
        <Route exact path={path}>
          <Redirect to={SUPPLIER_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
};
