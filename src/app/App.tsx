import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppStateContext } from "./AppContext";
import { authorizationService } from "core/services/common-services/authorization-service";
import ErrorPage, { errorHandler } from "core/pages/ErrorPage/ErrorPage";
import { userRoutes as routes } from "config/route";
import { Route, Switch } from "react-router-dom";
import Layout from "layout/Layout";
import LoadingPage from "core/pages/LoadingPage/LoadingPage";

const App = (): JSX.Element => {
  const { authorizationData } = authorizationService.useAuthorizedApp();

  return (
    <React.Fragment>
      <ErrorBoundary FallbackComponent={ErrorPage} onError={errorHandler}>
        <AppStateContext.Provider value={authorizationData}>
          <Layout>
            <React.Suspense fallback={<LoadingPage />}>
              <Switch>
                {routes &&
                  authorizationData?.loaded &&
                  routes.length > 0 &&
                  routes.map(({ path, component }) => (
                    <Route key={path} path={path} component={component}></Route>
                  ))}
              </Switch>
            </React.Suspense>
          </Layout>
        </AppStateContext.Provider>
      </ErrorBoundary>
    </React.Fragment>
  );
};

export default App;
