import { APP_USER_DETAIL_ROUTE } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Switch } from "react-router-dom";
import AppUserDetail from "./AppUserDetail/AppUserDetail";

export function AppUserPage() {
  return (
    <>
      <Helmet>
        <title>Portal | AppUser</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={`${APP_USER_DETAIL_ROUTE}/:id`}
          key={APP_USER_DETAIL_ROUTE}
          component={AppUserDetail}
          auth={true}
        />
      </Switch>
    </>
  );
}
