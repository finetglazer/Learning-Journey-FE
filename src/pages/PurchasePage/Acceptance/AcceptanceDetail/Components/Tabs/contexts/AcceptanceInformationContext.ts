import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { AcceptanceModel, GoodItemsModel } from "models/Acceptance/Acceptance";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface AcceptanceInformationContextType {
  model: AcceptanceModel;
  loadingGoodItems?: boolean;
  dispatch?: Dispatch<GeneralAction<AcceptanceModel>>;
  goodsReceiptSelect?: GoodItemsModel | null;
  setGoodsReceiptSelect: Dispatch<SetStateAction<GoodItemsModel>>;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeAllField?: (data: AcceptanceModel) => void;
  getGetGoodItems?: (goodItemIds: string[]) => void;
}

const INITIAL_CONTEXT: AcceptanceInformationContextType = {
  model: null,
  setGoodsReceiptSelect: null,
};

const AcceptanceInformationContext =
  createContext<AcceptanceInformationContextType>(INITIAL_CONTEXT);

const useAcceptanceInformationContext = () => {
  const context = useContext(AcceptanceInformationContext);

  return context;
};

export { AcceptanceInformationContext, useAcceptanceInformationContext };
