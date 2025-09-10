import { webService } from "core/services/common-services/web-service";
import {
  FilterAction,
  FilterActionEnum,
  ListAction,
  ListActionType,
  ListState,
} from "core/services/service-types";
import { Reducer, useCallback, useReducer, useState } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import { finalize, Observable } from "rxjs";

function listReducer<T>(state: ListState<T>, action: ListAction<T>) {
  switch (action.type) {
    case ListActionType.SET:
      return { ...action.payload };
    default:
      return state;
  }
}

export function useCostLineCostItemContentList<
  T extends Model,
  TFilter extends ModelFilter
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getList: (filter: TFilter) => Observable<any>,
  baseFilter?: TFilter,
  dispatchFilter?: React.Dispatch<FilterAction<TFilter>>,
  getCurrentFilter?: () => TFilter,
  initData?: ListState<T>
) {
  const [{ list, count }, dispatch] = useReducer<
    Reducer<ListState<T>, ListAction<T>>
  >(listReducer, initData ? initData : { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (filterParam?: TFilter, isOverideFilter?: boolean) => {
      const currentFilter = getCurrentFilter();
      let filterValue: TFilter;
      if (isOverideFilter) {
        filterValue = filterParam;
        dispatchFilter({
          type: FilterActionEnum.SET,
          payload: {
            ...filterParam,
          },
        });
      } else {
        filterValue = filterParam
          ? { ...currentFilter, ...filterParam }
          : currentFilter;
      }
      setLoadingList(true);
      subscription.add(
        getList({
          ...filterValue,
        })
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe({
            next: (res) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: res?.items,
                  count: res?.totalRecords, // TODO
                },
              });
            },

            error: () => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: [],
                  count: null,
                },
              });
            },
          })
      );
    },
    [getCurrentFilter, subscription, getList, dispatchFilter]
  );

  const handleResetList = useCallback(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...baseFilter,
      },
    });
    handleLoadList(
      {
        ...baseFilter,
      },
      true
    );
  }, [baseFilter, dispatchFilter, handleLoadList]);

  return {
    list,
    count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
  };
}
