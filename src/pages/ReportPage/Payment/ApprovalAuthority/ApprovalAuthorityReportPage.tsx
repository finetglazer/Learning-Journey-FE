import { REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_MASTER_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ApprovalAuthority from "./ApprovalAuthority";
import { MENU_CODE } from "config/const";

export default function ApprovalAuthorityReportPage() {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | ApprovalAuthorityReportPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_MASTER_ROUTER}
          key={REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_MASTER_ROUTER}
          component={ApprovalAuthority}
          code={MENU_CODE.REPORT_PAYMENT_BY_APPROVAL_AUTHORITY}
          exact
        />

        <Route exact path={path}>
          <Redirect to={REPORT_PAYMENT_BY_APPROVAL_AUTHORITY_MASTER_ROUTER} />
        </Route>
      </Switch>
    </>
  );
}
