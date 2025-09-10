import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { isNil, isUndefined } from "lodash";
import qs from "qs";
import { Dispatch, Reducer, useCallback, useMemo, useReducer } from "react";
import { ModelFilter } from "react-3layer-common";
import { useHistory } from "react-router";
import { FilterAction, FilterActionEnum } from "../service-types";

export interface TabState {
  title: string;
  value: string;
  tabKey?: string;
}

export interface TabAction {
  type: string;
  data: TabState;
}

interface TabActionResult {
  repo: TabState;
  dispatchRepo: Dispatch<TabAction>;
  handleChangeTab: (activeTabKey: string) => void;
}

function repositoryReducer(state: TabState, action: TabAction) {
  switch (action.type) {
    case "UPDATE":
      return { ...action.data };
    default:
      return { ...state };
  }
}

export const tabServices = {
  /**
   * Custom hook for managing tab actions.
   *
   * @template TFilter - The type of the filter.
   * @param {TabState[]} tabItems - The array of tab items.
   * @param {Dispatch<FilterAction<TFilter>>} dispatchFilter - The dispatch function for filter actions.
   * @returns {TabActionResult} - An object containing the repo state, dispatch function, and handleChangeTab function.
   */
  useTabAction<TFilter extends ModelFilter>(
    tabItems: TabState[],
    dispatchFilter: Dispatch<FilterAction<TFilter>>
  ): TabActionResult {
    const history = useHistory();

    const initialTabState = useMemo<TabState>(() => {
      const queryParam = qs.parse(
        history.location.search.substring(1)
      ) as TabState;

      if (!isNil(queryParam) && queryParam.tabKey) {
        const currentTabState: TabState = tabItems
          .filter((currentItem) => currentItem.value === queryParam.tabKey)
          .shift();

        return currentTabState;
      }

      return tabItems[numberConstants.ZERO];
    }, [history, tabItems]);

    const [repo, dispatchRepo] = useReducer<Reducer<TabState, TabAction>>(
      repositoryReducer,
      initialTabState
    );

    const handleChangeTab = useCallback(
      (activeTabKey: string) => {
        const currentTabState: TabState = tabItems
          .filter((currentItem) => currentItem.value === activeTabKey)
          .shift();

        if (currentTabState) {
          dispatchRepo({
            type: "UPDATE",
            data: currentTabState,
          });

          if (!isUndefined(dispatchFilter)) {
            const newFilter = new ModelFilter();
            newFilter.tabKey = currentTabState.value;
            const DEFAULT_PAGE_INDEX = numberConstants.ONE;

            dispatchFilter({
              type: FilterActionEnum.SET,
              payload: {
                ...newFilter,
                pageIndex: DEFAULT_PAGE_INDEX,
                pageSize: DEFAULT_PAGE_SIZE,
              } as TFilter,
            });
          }
        }
      },
      [dispatchFilter, tabItems]
    );

    return {
      repo,
      dispatchRepo,
      handleChangeTab,
    };
  },
};
