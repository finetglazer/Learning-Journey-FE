import {
  TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE,
  TEMPORARY_IMPORT_ASSET_MASTER_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import TemporaryImportAssetDetail from "./TemporaryImportAssetDetail/TemporaryImportAssetDetail";
import TemporaryImportAssetMaster from "./TemporaryImportAssetMaster/TemporaryImportAssetMaster";
import TemporaryImportAssetView from "./TemporaryImportAssetView/TemporaryImportAssetView";

function TemporaryImportAssetPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | TemporaryImportAssetPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          key={TEMPORARY_IMPORT_ASSET_MASTER_ROUTE}
          path={TEMPORARY_IMPORT_ASSET_MASTER_ROUTE}
          component={TemporaryImportAssetMaster}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE}
          path={`${TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE}/:id?`}
          component={TemporaryImportAssetDetail}
          auth={true}
          exact={true}
        />
        <ProtectedRoute
          key={TEMPORARY_IMPORT_ASSET_VIEW_ROUTE}
          path={`${TEMPORARY_IMPORT_ASSET_VIEW_ROUTE}/:id`}
          component={TemporaryImportAssetView}
          auth={true}
          exact={true}
        />

        <Route exact path={path}>
          <Redirect to={TEMPORARY_IMPORT_ASSET_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default TemporaryImportAssetPage;
