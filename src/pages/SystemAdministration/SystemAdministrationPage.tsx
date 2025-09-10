import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import {
  COMMENT_MANAGEMENT_ROUTE,
  REPORT_TEMPLATE_MANAGEMENT_ROUTE,
  SYSTEM_ADMINISTRATION_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { CommentManagement } from "./Comment/CommentManagement";
import ReportTemplateManagement from "pages/SystemAdministration/ReportTemplate/ReportTemplateMaster/ReportTemplate";

export const SystemAdministrationPage = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | BudgetPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={COMMENT_MANAGEMENT_ROUTE}
          key={COMMENT_MANAGEMENT_ROUTE}
          component={CommentManagement}
          auth={true}
        />
        <ProtectedRoute
          path={REPORT_TEMPLATE_MANAGEMENT_ROUTE}
          key={REPORT_TEMPLATE_MANAGEMENT_ROUTE}
          component={ReportTemplateManagement}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={SYSTEM_ADMINISTRATION_ROUTE} />
        </Route>
      </Switch>
    </>
  );
};
