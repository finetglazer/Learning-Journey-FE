import { RANK_MASTER_ROUTE } from "config/route-const";

import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { Helmet } from "react-helmet";
import { RankMaster } from "./RankMaster/RankMaster";
import { MENU_CODE } from "config/const";

export function RankPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | RankPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={RANK_MASTER_ROUTE}
          key={RANK_MASTER_ROUTE}
          component={RankMaster}
          code={MENU_CODE.CATALOG_RANK}
        />
        <Route exact path={path}>
          <Redirect to={RANK_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}
