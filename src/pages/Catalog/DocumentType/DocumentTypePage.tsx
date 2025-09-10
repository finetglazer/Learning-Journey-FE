import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { DOCUMENT_TYPE_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { DocumentTypeMaster } from "./DocumentTypeMaster";
import { MENU_CODE } from "config/const";

export const UseDocumentTypePage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("DT.title_document_type")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={DOCUMENT_TYPE_ROUTE_MASTER}
          key={DOCUMENT_TYPE_ROUTE_MASTER}
          component={DocumentTypeMaster}
          code={MENU_CODE.CATALOG_DOCUMENT_TYPE}
        />
        <Route exact path={path}>
          <Redirect to={DOCUMENT_TYPE_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
