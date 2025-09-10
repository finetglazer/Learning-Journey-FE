import { OPINION_COLLECTOR_LIST_ROUTE } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import OpinitionCollectorList from "./OpinitionCollectorList/OpinitionCollectorList";

const ProfilePage = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | Profile</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={OPINION_COLLECTOR_LIST_ROUTE}
          key={OPINION_COLLECTOR_LIST_ROUTE}
          component={OpinitionCollectorList}
          auth={true}
        />
        <Route exact path={path}>
          <Redirect to={OPINION_COLLECTOR_LIST_ROUTE} />
        </Route>
      </Switch>
    </>
  );
};

export default ProfilePage;
