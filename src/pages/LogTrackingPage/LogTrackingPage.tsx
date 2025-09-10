import { LOG_TRACKING_ROUTE } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { Fragment } from "react/jsx-runtime";
import LogTrackingMaster from "./LogTrackingMaster/LogTrackingMaster";

const LogTrackingPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <Fragment>
      <Helmet>
        <title> {translate("LT.page_helmet")} </title>
      </Helmet>

      <Switch>
        <ProtectedRoute
          path={LOG_TRACKING_ROUTE}
          key={LOG_TRACKING_ROUTE}
          component={LogTrackingMaster}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={LOG_TRACKING_ROUTE} />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default LogTrackingPage;
