import { ACCESS_TOKEN } from "config/const";
import {
  FORBIDDEN_ROUTE,
  LOGIN_MAINTAINER_ROUTE,
  LOGIN_ROUTE,
  ROOT_ROUTE,
} from "core/config/consts";
import { isEmpty } from "lodash";
import Login from "pages/LoginPage/Login";
import { Provider } from "react-redux";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import AppGuard from "./AppGuard";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "rtk";
import { useTranslation } from "react-i18next";
import { useLayoutEffect } from "react";
import { i18nStore } from "react-components-design-system";
import MaintainerLogin from "pages/LoginPage/MaintainerLogin";
import ForbiddenPage from "pages/ForbiddenPage/ForbiddenPage";
import { httpInterceptor } from "core/config/http";

const AppRoot = () => {
  const isAuth = localStorage.getItem(ACCESS_TOKEN);
  const history = useHistory();

  const { t } = useTranslation();

  useLayoutEffect(() => {
    i18nStore.setGlobalT(t);
  }, [t]);

  httpInterceptor.setHistory(history);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Switch>
          <Route
            exact
            path={LOGIN_ROUTE}
            render={() => {
              if (!isEmpty(isAuth)) {
                return <Redirect to={`${ROOT_ROUTE}`} />;
              } else {
                return <Login />;
              }
            }}
          />

          <Route
            exact
            path={FORBIDDEN_ROUTE}
            render={() => {
              return <ForbiddenPage />;
            }}
          />

          <Route
            exact
            path={LOGIN_MAINTAINER_ROUTE}
            render={() => {
              return <MaintainerLogin />;
            }}
          />
          <Route
            path={ROOT_ROUTE}
            render={() => {
              if (!isEmpty(isAuth)) {
                return <AppGuard />;
              } else {
                return <Redirect to={`${LOGIN_ROUTE}`} />;
              }
            }}
          />
        </Switch>
      </PersistGate>
    </Provider>
  );
};

export default AppRoot;
