import { RowSelectionType, TableRowSelection } from "antd/lib/table/interface";
import appMessageService from "core/services/common-services/app-message-service";
import _cloneDeep from "lodash/cloneDeep";
import _drop from "lodash/drop";
import _isEmpty from "lodash/isEmpty";
import _orderBy from "lodash/orderBy";
import _take from "lodash/take";
import {
  Reducer,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { Model, ModelFilter, OrderType } from "react-3layer-common";
import { finalize, Observable } from "rxjs";

import { webService } from "../common-services/web-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
  ListAction,
  ListActionType,
  ListResult,
  ListState,
} from "../service-types";

function listReducer<T>(state: ListState<T>, action: ListAction<T>) {
  switch (action.type) {
    case ListActionType.SET:
      return { ...action.payload };
    default:
      return state;
  }
}

export const listService = {
  /**
   * react hook for control list/count data from server
   * @param: getList: (filter: TFilter) => Observable<T[]>
   * @param: getCount: (filter: TFilter) => Observable<number>
   * @param: filter: TFilter
   * @param: dispatchFilter?: React.Dispatch<FilterAction<TFilter>>
   * @param: autoCallListByChange: boolean
   * @param: initData: ListState<T>
   * @return: { list,
      count,
      loadingList,
      setLoadingList,
      handleResetList,
      handleLoadList }
   * */
  useList<T extends Model, TFilter extends ModelFilter>(
    getList: (filter: TFilter) => Observable<ListResult<T>>,
    baseFilter?: TFilter,
    dispatchFilter?: React.Dispatch<FilterAction<TFilter>>,
    getCurrentFilter?: () => TFilter,
    initData?: ListState<T>
  ) {
    const [{ list, count, error }, dispatch] = useReducer<
      Reducer<ListState<T>, ListAction<T>>
    >(listReducer, initData ? initData : { list: [], count: 0 });
    let lastRequestIdx = 0;
    const [loadingList, setLoadingList] = useState<boolean>(false);

    const [subscription] = webService.useSubscription();

    const handleLoadList = useCallback(
      (filterParam?: TFilter, isOverrideFilter?: boolean) => {
        const currentQueryId = ++lastRequestIdx;
        const currentFilter = getCurrentFilter();
        let filterValue: TFilter;
        if (isOverrideFilter) {
          filterValue = filterParam;
        } else {
          filterValue = filterParam
            ? { ...currentFilter, ...filterParam }
            : currentFilter;
        }

        setLoadingList(true);
        subscription.add(
          getList(filterValue)
            .pipe(finalize(() => setLoadingList(false)))
            .subscribe({
              next: (list) => {
                if (currentQueryId === lastRequestIdx) {
                  // nếu là query cuối thì mới set vào list
                  dispatch({
                    type: ListActionType.SET,
                    payload: {
                      list: list?.data?.items,
                      count: list?.data?.totalRecords, // TODO
                      error: null,
                    },
                  });
                }
                // else {
                //   đây là các trường hợp query trước trả ra dữ liệu lâu hơn query cuối
                // }
              },

              error: (e) => {
                dispatch({
                  type: ListActionType.SET,
                  payload: {
                    list: [],
                    count: null,
                    error: e?.response,
                  },
                });
              },
            })
        );
      },
      [lastRequestIdx, getCurrentFilter, subscription, getList]
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
      error,
    };
  },

  /**
   *
   * react hook for handle action in row selection antd
   * @param: action?: (t: T) => Observable<T>
   * @param: bulkAction?: (ids: KeyType[]) => Observable<void>
   * @param: selectionType: RowSelectionType
   * @param: initialRowKeys?: KeyType[]
   * @param: onUpdateListSuccess?: (item?: T) => void
   * @param: handleResetList?: () => void
   * @return: {
      handleAction,
      handleBulkAction,
      canBulkAction,
      rowSelection,
      selectedRowKeys,
      setSelectedRowKeys,
    }
   */
  useRowSelection<T extends Model>(
    selectionType: RowSelectionType = "checkbox",
    initialRowKeys?: KeyType[],
    checkUsed?: boolean,
    selectedType: "auto" | "manual" = "manual",
    fixed?: boolean
  ) {
    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<KeyType[]>(
      initialRowKeys ?? []
    );
    const [selectedRow, setSelectedRow] = useState<T[]>([]);
    const canBulkAction = useMemo(
      () => selectedRowKeys.length > 0,
      [selectedRowKeys.length]
    );

    const rowSelection = useMemo(() => {
      const rowSelection: TableRowSelection<T> = {
        fixed: fixed ? true : false,
        selectedRowKeys,
        type: selectionType,
        getCheckboxProps: (record: T) => ({
          disabled: checkUsed ? record.isUsed : false,
        }),
      };
      if (selectedType === "auto") {
        rowSelection.onChange = function (
          selectedRowKeys: KeyType[],
          rows: T[]
        ) {
          setSelectedRowKeys(selectedRowKeys);
          setSelectedRow(rows);
        };
      } else {
        rowSelection.onSelect = function (record: T, selected: boolean) {
          const rowKey = record.id;
          const selectedValuesId = selected
            ? [...selectedRowKeys, rowKey]
            : selectedRowKeys.filter((item) => item !== rowKey);
          const selectedValues = selected
            ? [...selectedRow, record]
            : selectedRow.filter((item) => item.id !== rowKey);
          setSelectedRowKeys(selectedValuesId);
          setSelectedRow(selectedValues);
        };

        rowSelection.onSelectAll = function (
          selected: boolean,
          selectedRows: T[],
          changeRows: T[]
        ) {
          let selectedValues = [...selectedRowKeys];
          const listKeys = changeRows.map((value: T) => value.id);
          if (selected) {
            setSelectedRow([...selectedRow, ...changeRows]);
            selectedValues.push(...listKeys);
          } else {
            selectedValues = selectedValues.filter(
              (item) => !listKeys.includes(item as number)
            );
            setSelectedRow((prevState) =>
              prevState.filter((item) => !listKeys.includes(item.id))
            );
          }
          setSelectedRowKeys(selectedValues);
        };
      }
      return rowSelection;
    }, [checkUsed, selectedRowKeys, selectedType, selectionType]);

    return {
      canBulkAction,
      rowSelection,
      selectedRowKeys,
      setSelectedRowKeys,
      notifyUpdateItemSuccess,
      notifyUpdateItemError,
      selectedRow,
      setSelectedRow,
    };
  },
};
