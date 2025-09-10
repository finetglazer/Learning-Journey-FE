import type { TableRowSelection } from "antd/es/table/interface";
import { numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import { FilterAction } from "core/services/service-types";
import { AcceptanceFilter, AcceptancePersonRequest } from "models/Acceptance";
import { createContext, Dispatch, SetStateAction } from "react";

export interface AcceptanceSelectHooks {
  modelFilter: AcceptanceFilter;
  list: AcceptancePersonRequest[];
  count: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<AcceptancePersonRequest>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<AcceptanceFilter>>;
  handleLoadList: HandleLoadList<AcceptanceFilter>;
  handleResetList: () => void;
}

export const AcceptanceSelectHooksContext =
  createContext<AcceptanceSelectHooks>({
    modelFilter: new AcceptanceFilter(),
    list: [],
    count: numberConstants.ZERO,
    loadingList: false,
    rowSelection: undefined,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    dispatchFilter: null,
    handleLoadList: null,
    handleResetList: null,
  });
