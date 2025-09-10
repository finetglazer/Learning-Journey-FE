import { FORBIDDEN_ROUTE } from "core/config/consts";
import { authorizationService } from "core/services/common-services/authorization-service";
import React from "react";
import { Redirect, Route } from "react-router-dom";

interface ProtectedRouteProps {
  component?: typeof React.Component | ((props?: unknown) => JSX.Element);
  auth?: boolean;
  redirectPath?: string;
  path: string;
  exact?: boolean;
  /**Thay vì truyền auth true thì truyền code của menu để check có quyền xem hay không*/
  code?: string;
}

export function ProtectedRoute({
  component: Component,
  auth,
  redirectPath,
  code,
  ...rest
}: ProtectedRouteProps) {
  const { validAction } = authorizationService.useAuthorizedAction(code);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true || validAction("READ") ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirectPath ? redirectPath : FORBIDDEN_ROUTE} />
        )
      }
    />
  );
}
