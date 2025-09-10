import { AppStateContext } from "app/AppContext";
import { Menu } from "config/config-type";
import { menu } from "config/menu";
import { authenticationRepository } from "core/repositories/AuthenticationRepository";
import _cloneDeep from "lodash/cloneDeep";
import _isEmpty from "lodash/isEmpty";
import {
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Subscription } from "rxjs";
import {
  AppAction,
  AppActionEnum,
  AppState,
  Permission,
} from "../service-types";
import { utilService } from "./util-service";

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionEnum.SET:
      return {
        ...action.payload,
      };
    case AppActionEnum.UPDATE:
      return {
        ...state,
        ...action.payload,
      };
  }
}

export const authorizationService = {
  useAuthorizedApp() {
    const [authorizationData, dispatch] = useReducer<
      Reducer<AppState, AppAction>
    >(appReducer, {
      permissions: [],
      authorizedMenus: [],
      authorizedAction: [],
      authorizedMenuMapper: null,
      loaded: false,
    });

    useEffect(() => {
      let isCancelled = false;
      if (!isCancelled) {
        dispatch({
          type: AppActionEnum.SET,
          payload: {
            permissions: [],
            authorizedMenus: [],
            authorizedAction: [],
            authorizedMenuMapper: {},
          },
        });
        const subscription = new Subscription();

        subscription.add(
          authenticationRepository.getUserPermission().subscribe({
            next: (results: Permission[]) => {
              const response = [...results];
              if (response && response.length > 0) {
                const authorizedMenus: Menu[] = _cloneDeep(menu);
                utilService.mapTreeMenu(authorizedMenus, response);
                dispatch({
                  type: AppActionEnum.SET,
                  payload: {
                    permissions: [...response],
                    authorizedMenus: authorizedMenus,
                    loaded: true,
                  },
                });
              } else {
                dispatch({
                  type: AppActionEnum.SET,
                  payload: {
                    permissions: [],
                    authorizedMenus: [],
                    authorizedAction: [],
                    authorizedMenuMapper: {},
                    loaded: true,
                  },
                });
              }
            },
            error: () => {
              // eslint-disable-next-line no-console
              console.log("Error when getting listPath");
            },
          })
        );

        return () => {
          isCancelled = true;
          subscription.unsubscribe();
        };
      }
    }, []);

    return {
      authorizationData,
    };
  },

  useAuthorizedAction(module: string, queryExtra?: string) {
    const appState = useContext<AppState>(AppStateContext);
    const permissionContext = useMemo(() => {
      if (!queryExtra) {
        return appState &&
          appState?.permissions &&
          appState?.permissions.length > 0
          ? appState.permissions
              ?.filter((item) => {
                return item?.key === module;
              })
              ?.map((current) => current?.value)
          : [];
      } else {
        return appState &&
          appState?.permissions &&
          appState?.permissions.length > 0
          ? appState.permissions
              ?.filter((item) => {
                return (
                  item?.key === module && item?.queryExtra?.includes(queryExtra)
                );
              })
              ?.map((current) => current?.value)
          : [];
      }
    }, [appState, module, queryExtra]);

    const validAction = useMemo(() => {
      return (action: string) => {
        return permissionContext.includes(action);
      };
    }, [permissionContext]);

    return { validAction };
  },

  useAuthorizedRoute() {
    const appState = useContext<AppState>(AppStateContext);
    const mapper = useMemo(() => {
      return appState &&
        appState.authorizedMenuMapper &&
        !_isEmpty(appState.authorizedMenuMapper)
        ? appState.authorizedMenuMapper
        : {};
    }, [appState]);

    const auth = useCallback(
      (path: string) => {
        if (!_isEmpty(mapper)) {
          if (
            Object.prototype.hasOwnProperty.call(mapper, "hasAnyPermission")
          ) {
            return true;
          }
          const regexDetail = new RegExp(/detail$/gi);
          if (regexDetail.exec(path)) {
            const queryString = window.location.search;
            const regexQueryId = new RegExp("id\\=\\w+");
            if (regexQueryId.test(queryString)) {
              path = path + "/*";
            }
          }

          const regexDynamic = new RegExp(/(dynamic-template\/:idRoute)$/gi);
          if (regexDynamic.exec(path)) {
            path = window.location.pathname;
          }

          if (!Object.prototype.hasOwnProperty.call(mapper, path)) {
            return false;
          }
        }
        return true;
      },
      [mapper]
    );

    return {
      auth,
    };
  },
};
