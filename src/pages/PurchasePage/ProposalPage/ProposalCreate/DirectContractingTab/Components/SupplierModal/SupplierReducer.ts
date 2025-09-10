import { FilterAction, FilterActionEnum } from "core/services/service-types";
import { ModelFilter } from "react-3layer-common";

export const supplierFilterReducerExtend = <TFilter extends ModelFilter>(
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
};
