import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { REPORT_SUPPLIER_GOODS_DETAIL_ROUTER } from "config/route-const";
import SupplierGoodsItemsDetailMaster from "pages/ReportPage/Purchase/SupplierGoodsItemsDetail/SupplierGoodsItemsDetailMaster/SupplierGoodsItemsDetailMaster";
import { MENU_CODE } from "config/const";

const SupplierGoodsItemsDetailPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | SupplierGoodsItemsDetailPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_SUPPLIER_GOODS_DETAIL_ROUTER}
          key={REPORT_SUPPLIER_GOODS_DETAIL_ROUTER}
          component={SupplierGoodsItemsDetailMaster}
          code={MENU_CODE.REPORT_PURCHASE_GOODS_SERVICE_OF_CONTRACT_DETAIL}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_SUPPLIER_GOODS_DETAIL_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};

export default SupplierGoodsItemsDetailPage;
