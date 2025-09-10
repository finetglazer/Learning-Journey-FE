import { AREA_UNIT_CODE_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { AreaUnitCodeMaster } from "./AreaUnitCodeMaster";
import { MENU_CODE } from "config/const";

export const AreaUnitCodePage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | AreaUnitCodePage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={AREA_UNIT_CODE_ROUTE_MASTER}
          key={AREA_UNIT_CODE_ROUTE_MASTER}
          component={AreaUnitCodeMaster}
          code={MENU_CODE.CATALOG_COSTCENTERALLOCATION}
        />
        <Route exact path={path}>
          <Redirect to={AREA_UNIT_CODE_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
