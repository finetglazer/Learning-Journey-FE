import React, { useCallback } from "react";
import { ModelFilter } from "react-3layer-common";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
type props = {
  translate: (key: string) => string;
};
const useReducerFilter = ({ translate }: props) => {
  const filterAdvancePaymentExtend = useCallback(
    <TFilter extends ModelFilter>(
      state: TFilter,
      action: FilterAction<TFilter>
    ) => {
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
        default:
          return state;
      }
    },
    [translate]
  );

  const filterDepositExtend = useCallback(
    <TFilter extends ModelFilter>(
      state: TFilter,
      action: FilterAction<TFilter>
    ) => {
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
        default:
          return state;
      }
    },
    [translate]
  );

  const filterExpenseExtend = useCallback(
    <TFilter extends ModelFilter>(
      state: TFilter,
      action: FilterAction<TFilter>
    ) => {
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
        default:
          return state;
      }
    },
    [translate]
  );
  return {
    filterAdvancePaymentExtend,
    filterDepositExtend,
    filterExpenseExtend,
  };
};

export default useReducerFilter;
