import { numberConstants } from "core/config/consts";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface ReceivingGoodsDetailDrawerContextType {
  goodsReceiptRequestItem: GoodsReceiptRequestItem;
  setGoodsReceiptRequestItem: Dispatch<SetStateAction<GoodsReceiptRequestItem>>;
  currency: string;
  exchangeRate: number;
}

const INITIAL_CONTEXT: ReceivingGoodsDetailDrawerContextType = {
  goodsReceiptRequestItem: undefined,
  setGoodsReceiptRequestItem: null,
  currency: null,
  exchangeRate: numberConstants.ONE,
};

const ReceivingGoodsDetailDrawerContext =
  createContext<ReceivingGoodsDetailDrawerContextType>(INITIAL_CONTEXT);

const useReceivingGoodsDetailDrawerContext = () => {
  const context = useContext(ReceivingGoodsDetailDrawerContext);

  return context;
};

export {
  ReceivingGoodsDetailDrawerContext,
  useReceivingGoodsDetailDrawerContext,
};
