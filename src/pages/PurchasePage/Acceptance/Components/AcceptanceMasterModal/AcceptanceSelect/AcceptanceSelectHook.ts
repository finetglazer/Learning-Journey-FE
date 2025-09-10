import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { acceptanceUserRepository } from "core/repositories/AcceptanceUserRepository";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { isEmpty } from "lodash";
import { AcceptanceFilter, AcceptancePersonRequest } from "models/Acceptance";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface AcceptanceSelectHooks {
  receivedId: string;
  goodItemSelectCurrent: string[];
  selectedItems: string[];
}

export const useAcceptanceSelectHooks = ({
  receivedId,
  goodItemSelectCurrent,
  selectedItems,
}: AcceptanceSelectHooks) => {
  const [translate] = useTranslation();
  const baseFilter: AcceptanceFilter = useMemo(() => {
    return {
      ...new AcceptanceFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(AcceptanceFilter, baseFilter);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<AcceptancePersonRequest, AcceptanceFilter>(
      (filter) =>
        acceptanceUserRepository.listAcceptancePersons({
          ...filter,
          isIncludeOrganization: true,
          userIgnoreIds: selectedItems,
        }),
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<AcceptancePersonRequest>("checkbox", [], true);

  useEffect(() => {
    if (isEmpty(list)) {
      return;
    }

    setSelectedRowKeys(goodItemSelectCurrent || []);
  }, [goodItemSelectCurrent, list, setSelectedRowKeys]);

  useEffect(() => {
    handleLoadList();
  }, [modelFilter]);

  return {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    translate,
    handleLoadList,
    handleResetList,
    dispatchFilter,
    setSelectedRowKeys,
  };
};
