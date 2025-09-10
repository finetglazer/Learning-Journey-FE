import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";

export const countTotal = (data: SelectAsset) => {
  if (!data) return 0;
  return data.reduce((acc: number, cur: { amount: number }) => {
    return acc + (typeof cur.amount === "number" ? cur.amount : 0);
  }, 0);
};

export const COLUMNS = {
  SHOW_LABEL_TOTAL: 1,
  SHOW_VALUE_TOTAL: 4,
};
