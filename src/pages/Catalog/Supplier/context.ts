import { TableRowSelection } from "antd/lib/table/interface";
import { numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import { FilterAction, KeyType } from "core/services/service-types";
import { SupplierFilter } from "models/Payment";
import { Supplier } from "models/Supplier/Supplier";
import { createContext, Dispatch, SetStateAction } from "react";

export interface SupplierContextType {
  modelFilter: SupplierFilter;
  list: Supplier[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<Supplier>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<SupplierFilter>>;
  handleLoadList: HandleLoadList<SupplierFilter>;
  handleResetList: () => void;
  handleGoDetail: (id?: string) => void;
  handleSaveAccountModal: () => void;
  visibleAccountModal: boolean;
  handleCloseAccountModal: () => void;
  handleOpenAccountModal: (id: string, action: "CREATE" | "RECOVER") => void;
  actionWithAccount: "CREATE" | "RECOCOVER";
  currentId: string;
  validAction: (action: string) => boolean;
}

const INITIAL_CONTEXT: SupplierContextType = {
  modelFilter: new SupplierFilter(),
  list: [],
  count: numberConstants.ZERO,
  countFilter: numberConstants.ZERO,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  handleGoDetail: null,
  handleSaveAccountModal: null,
  visibleAccountModal: false,
  handleCloseAccountModal: null,
  handleOpenAccountModal: null,
  actionWithAccount: null,
  currentId: null,
  validAction: null,
};

export const SupplierContext =
  createContext<SupplierContextType>(INITIAL_CONTEXT);
