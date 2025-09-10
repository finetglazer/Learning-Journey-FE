import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import {
  AssetItemModel,
  ProjectSettlementProposal,
} from "models/ProjectSettlement";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface OrderInformationContextType {
  assetItemSelected: AssetItemModel | null;
  setAssetItemSelected: (value: SetStateAction<AssetItemModel>) => void;

  onSave: (index: number) => void;
  isOpenModelConfirmDeleteRow: boolean;
  setIsOpenModelConfirmDeleteRow: Dispatch<SetStateAction<boolean>>;
  handleDeleteOrderForm: (ids: string[]) => void;
  model: ProjectSettlementProposal;
  loadingGoodItems?: boolean;
  dispatch?: Dispatch<GeneralAction<ProjectSettlementProposal>>;
  orderFormSelect?: AssetItemModel | null;
  setOrderFormSelect: Dispatch<SetStateAction<AssetItemModel>>;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeAllField?: (data: ProjectSettlementProposal) => void;
  getGetGoodItems?: (goodItemIds: string[]) => void;
}

const INITIAL_CONTEXT: OrderInformationContextType = {
  model: null,
  setOrderFormSelect: null,
  onSave: null,
  isOpenModelConfirmDeleteRow: null,
  setIsOpenModelConfirmDeleteRow: null,
  handleDeleteOrderForm: null,

  assetItemSelected: null,
  setAssetItemSelected: null,
};

const OrderInformationContext =
  createContext<OrderInformationContextType>(INITIAL_CONTEXT);

const useOrderInformationContext = () => {
  const context = useContext(OrderInformationContext);

  return context;
};

export { OrderInformationContext, useOrderInformationContext };
