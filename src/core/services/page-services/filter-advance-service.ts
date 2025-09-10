import { HandleLoadList } from "core/models/Filter/Filter";
import { Dispatch, useCallback } from "react";
import { Model } from "react-3layer-common";
import { FilterAction, FilterActionEnum } from "../service-types";
import { filterService } from "./filter-service";
import { DEFAULT_PAGE_SIZE } from "core/config/consts";

interface FilterAdvanceServiceParams<T> {
  ModelFilterClass: new () => T;
  filter: T;
  updateFilter: Dispatch<FilterAction<T>>;
  handleCloseFilter: () => void;
  handleLoadList: HandleLoadList<T>;
  pageSize?: number;
}

export const filterAdvanceService = {
  /**
   *
   * react hook for manage state of model filter
   * @param: ModelFilterClass: new () => T
   * @param: filter: T
   * @param: dispatchFilter: Dispatch<FilterAction<T>>
   * @param: handleCloseFilter: () => void
   * @param: handleLoadList: HandleLoadList<T>
   * @param: pageSize?: number
   *
   * @return: { modelFilter, dispatchFilter, handleApplyFilter, handleClearFilter, handleApplyFilter }
   * */
  useFilterAdvance<T extends Model>({
    ModelFilterClass,
    filter,
    updateFilter,
    handleCloseFilter,
    handleLoadList,
    pageSize = DEFAULT_PAGE_SIZE,
  }: FilterAdvanceServiceParams<T>) {
    const { modelFilter, dispatchFilter } = filterService.useModelFilter(
      ModelFilterClass,
      filter
    );

    const handleApplyFilter = useCallback(() => {
      updateFilter({
        type: FilterActionEnum.SET,
        payload: modelFilter,
      });

      handleCloseFilter();
      handleLoadList(modelFilter, true);
    }, [handleCloseFilter, handleLoadList, modelFilter, updateFilter]);

    const handleResetFilter = useCallback(() => {
      dispatchFilter({
        type: FilterActionEnum.SET,
        payload: {
          ...new ModelFilterClass(),
          subSystemId: filter.subSystemId,
          pageSize: filter?.pageSize || pageSize,
          tab: filter?.tab,
          tabKey: filter?.tabKey,
        },
      });
    }, [
      ModelFilterClass,
      dispatchFilter,
      filter?.pageSize,
      filter?.subSystemId,
      filter?.tab,
      filter?.tabKey,
      pageSize,
    ]);

    const handleClearFilter = useCallback(() => {
      dispatchFilter({
        type: FilterActionEnum.SET,
        payload: filter,
      });
      handleCloseFilter();
    }, [dispatchFilter, handleCloseFilter, filter]);

    // function to reupdate model filter from origin filter
    const handleClickOutside = () => {
      dispatchFilter({
        type: FilterActionEnum.SET,
        payload: {
          ...filter,
        },
      });
    };

    return {
      handleResetFilter,
      handleClearFilter,
      handleApplyFilter,
      modelFilter,
      dispatchFilter,
      handleClickOutside,
    };
  },
};
