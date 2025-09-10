import { numberConstants } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { Dayjs, OpUnitType } from "dayjs";
import memoize from "fast-memoize";
import { isEmpty, isEqual } from "lodash";
import React, {
  Dispatch,
  Reducer,
  SetStateAction,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  GuidFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";
import { Observable } from "rxjs";
import { FilterAction, FilterActionEnum } from "../service-types";

export function filterReducer<TFilter extends ModelFilter>(
  state: TFilter,
  action: FilterAction<TFilter>
) {
  switch (action.type) {
    case FilterActionEnum.SET:
      return {
        ...action.payload,
      };
    case FilterActionEnum.UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    case FilterActionEnum.UPDATE_PAGINATION:
      return {
        ...state,
        pageIndex: action.payload?.pageIndex,
        pageSize: action.payload?.pageSize,
      };
  }
}

export const filterService = {
  /**
   *
   * react hook for manage state of model filter
   * @param: ModelFilterClass: new () => T
   * @param: initData?: T
   *
   * @return: { modelFilter, dispatchFilter }
   *
   * */
  useModelFilter<T extends ModelFilter>(
    ModelFilterClass: new () => T,
    initData?: T,
    exceptFieldFilter?: string[]
  ) {
    const [modelFilter, dispatchFilter] = useReducer<
      Reducer<T, FilterAction<T>>
    >(filterReducer, initData ? initData : new ModelFilterClass());

    const countFilter = React.useMemo(() => {
      return utilService.countValuedField(modelFilter, exceptFieldFilter);
    }, [modelFilter, exceptFieldFilter]);

    const stateRef = useRef(modelFilter);
    stateRef.current = modelFilter;
    const getModelFilter = useCallback(() => stateRef.current, []);

    return {
      modelFilter,
      dispatchFilter,
      countFilter,
      getModelFilter,
    };
  },

  /**
   *
   * react hook for handle actions to change filter field
   * @param: modelFilter: TFilter
   * @param: (action: FilterAction<TFilter>) => void
   *
   * @return: { value,
      handleChangeInputFilter,
      handleChangeSelectFilter,
      handleChangeMultipleSelectFilter,
      handleChangeDateFilter,
      handleChangeDateMasterFilter,
      handleChangeAllFilter,
      handleChangeSingleTreeFilter, }
   *
   * */
  useFilter<TFilter extends ModelFilter>(
    modelFilter: TFilter,
    dispatch: (action: FilterAction<TFilter>) => void
  ) {
    const value = useMemo(() => modelFilter, [modelFilter]);

    /** Handler for changing a Input Filter component
     */
    const handleChangeInputFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType?: string;
              classFilter?: new (partial?: unknown) =>
                | StringFilter
                | NumberFilter;
            }) =>
            (newValue?: string | number | null) => {
              const { fieldName, fieldType } = config;
              dispatch({
                type: FilterActionEnum.UPDATE,
                payload: {
                  [fieldName]: fieldType
                    ? {
                        [fieldType]: newValue,
                      }
                    : newValue,
                  pageIndex: 1,
                } as TFilter,
              });
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Select Filter component 
    */
    const handleChangeSelectFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType?: string;
              classFilter?: new (partial?: unknown) => IdFilter | GuidFilter;
            }) =>
            (idValue: number, value: Model) => {
              const { fieldName, fieldType } = config;
              dispatch({
                type: FilterActionEnum.UPDATE,
                payload: {
                  [`${fieldName}Value`]: value,
                  [`${fieldName}Id`]: fieldType
                    ? {
                        [fieldType]: idValue,
                      }
                    : idValue,
                  pageIndex: 1,
                } as TFilter,
              });
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Multiple Select Filter component 
    */
    const handleChangeMultipleSelectFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType?: string;
              classFilter?: new (partial?: unknown) => IdFilter | GuidFilter;
            }) =>
            (values: Model[]) => {
              const { fieldName, fieldType } = config;
              if (values) {
                const listIds =
                  values.length > 0
                    ? values.map((current) => current.id)
                    : undefined;
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [`${fieldName}Value`]: [...values],
                    [`${fieldName}Id`]: fieldType
                      ? {
                          [fieldType]: listIds,
                        }
                      : listIds,
                    pageIndex: 1,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Multiple Select Filter component 
    */
    const handleChangeCheckboxFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType?: string;
              classFilter?: new (partial?: unknown) => IdFilter | GuidFilter;
            }) =>
            (listIds: number[], values: Model[]) => {
              const { fieldName, fieldType } = config;
              if (values) {
                const newListIds =
                  listIds && listIds.length > 0 ? listIds : undefined;
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [`${fieldName}Value`]: [...values],
                    [`${fieldName}Id`]: fieldType
                      ? {
                          [fieldType]: newListIds,
                        }
                      : newListIds,
                    pageIndex: 1,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /** Handler specifically used for Numer Range Filter Component  */
    const handleChangeNumberRangeFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              classFilter?: new (partial?: unknown) => NumberFilter;
            }) =>
            (values: [number, number]) => {
              const { fieldName } = config;
              if (values && values.length === 2) {
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [fieldName]: {
                      greaterEqual: values[0],
                      lessEqual: values[1],
                    },
                    pageIndex: 1,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Date Filter component 
    */
    const handleChangeDateFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType: string | [string, string];
            }) =>
            (date: Dayjs | [Dayjs, Dayjs]) => {
              const { fieldName, fieldType } = config;

              if (date instanceof Array && fieldType instanceof Array) {
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [fieldName]: {
                      [fieldType[0]]: date[0]?.startOf("day"),
                      [fieldType[1]]: date[1]?.endOf("day"),
                    },
                    pageIndex: 1,
                  } as TFilter,
                });
              } else {
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [fieldName]: fieldType
                      ? {
                          [fieldType as string]: date,
                        }
                      : date,
                    pageIndex: 1,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /**
     * Handles the change of a date range filter.
     *
     * @param config - The configuration object for the filter.
     * @param config.fieldName - The name of the field to be filtered.
     * @param config.fieldType - The type of the field to be filtered.
     * @param config.useTime - Optional. Specifies whether to include time in the filter.
     * @returns A function that takes a date range and updates the filter state.
     */
    const handleChangeDateRangeFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType: string | [string, string];
              useTime?: boolean;
            }) =>
            (dateRange: [Dayjs, Dayjs]) => {
              if (!isEmpty(dateRange)) {
                const opUnitType: OpUnitType = "day";
                const { fieldName, fieldType, useTime } = config;
                const startDate = dateRange[numberConstants.ZERO];
                const endDate = dateRange[numberConstants.ONE];
                const startDateValue = isEqual(useTime, true)
                  ? startDate
                  : startDate?.startOf(opUnitType);
                const endDateValue = isEqual(useTime, true)
                  ? endDate
                  : endDate?.endOf(opUnitType);

                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [fieldName]: {
                      [fieldType[numberConstants.ZERO]]: startDateValue,
                      [fieldType[numberConstants.ONE]]: endDateValue,
                    },
                    pageIndex: 1,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Tree filter component 
    */
    const handleChangeSingleTreeFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType?: string;
              classFilter?: new (partial?: unknown) => IdFilter | GuidFilter;
            }) =>
            (values?: Model[]) => {
              const { fieldName, fieldType } = config;
              if (values) {
                const id =
                  values.length > 0
                    ? values.map((current) => current.id)
                    : undefined;
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [`${fieldName}Value`]: values?.length > 0 && values[0],
                    [`${fieldName}Id`]: fieldType
                      ? {
                          [fieldType]: id,
                        }
                      : id,
                    pageIndex: 1,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /** Handler to change input search value */
    const handleChangeInputSearch = React.useCallback(
      (value: string) => {
        dispatch({
          type: FilterActionEnum.UPDATE,
          payload: {
            search: value,
            pageIndex: 1,
          } as unknown as TFilter,
        });
      },
      [dispatch]
    );

    /**
      Handler to overwrite the whole filter
    */
    const handleChangeAllFilter = React.useCallback(
      (data: TFilter) => {
        dispatch({
          type: FilterActionEnum.SET,
          payload: data,
        });
      },
      [dispatch]
    );

    return {
      value,
      handleChangeInputFilter,
      handleChangeSelectFilter,
      handleChangeMultipleSelectFilter,
      handleChangeCheckboxFilter,
      handleChangeDateFilter,
      handleChangeAllFilter,
      handleChangeSingleTreeFilter,
      handleChangeNumberRangeFilter,
      handleChangeInputSearch,
      handleChangeDateRangeFilter,
    };
  },

  /**
   *
   * react hook for get a enum list
   * @param: handleList: () => Observable<T[]>
   *
   * @return:  [list, setList]
   * */
  useEnumList<T extends Model>(
    handleList: () => Observable<T[]>
  ): [T[], Dispatch<SetStateAction<T[]>>] {
    const [list, setList] = React.useState<T[]>([]);

    React.useEffect(() => {
      handleList().subscribe((list: T[]) => {
        setList(list);
      });
    }, [handleList]);

    return [list, setList];
  },
};
