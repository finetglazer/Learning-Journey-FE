import { REPORT_GOODS_RECEIPT_TRACKING_ROUTER } from "config/route-const";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import GoodsReceiptTracking from "./GoodsReceiptTracking";
import { MENU_CODE } from "config/const";

const GoodsReceiptTrackingPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | GoodsReceiptTrackingPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_GOODS_RECEIPT_TRACKING_ROUTER}
          key={REPORT_GOODS_RECEIPT_TRACKING_ROUTER}
          component={GoodsReceiptTracking}
          code={MENU_CODE.REPORT_PURCHASE_TRACKING_DELIVERY_GOODS_SERVICE}
        />

        <Route exact path={path}>
          <Redirect to={REPORT_GOODS_RECEIPT_TRACKING_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};

export default GoodsReceiptTrackingPage;
