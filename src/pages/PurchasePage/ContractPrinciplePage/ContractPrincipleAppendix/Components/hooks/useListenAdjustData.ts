import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { isEqual, isNull, isUndefined } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { Dispatch, useEffect, useRef } from "react";

export const useListenAdjustData = (
  model: ContractAnnex,
  dispatch: Dispatch<GeneralAction<ContractAnnex>>
) => {
  const originData = useRef<ContractAnnex | null>(null);

  useEffect(() => {
    if (
      isNull(originData.current) &&
      !Object.values(model).every(isUndefined)
    ) {
      originData.current = model;
    }
  }, [model]);

  useEffect(() => {
    if (isUndefined(model) || isNull(originData.current)) return;

    const fieldsToCheck: {
      key: keyof ContractAnnex;
      adjustedKey: keyof ContractAnnex;
    }[] = [
      { key: "contractInfo", adjustedKey: "isAdjustedContractInfo" },
      { key: "legalInfo", adjustedKey: "isAdjustedLegalInfo" },
      { key: "supplierInfo", adjustedKey: "isAdjustedSupplierInfo" },
      { key: "attachments", adjustedKey: "isAdjustedAttachment" },
    ];

    let hasChanged = false;
    const updatedModel = { ...model };

    for (const { key, adjustedKey } of fieldsToCheck) {
      if (model[adjustedKey] === true) continue;

      if (!isEqual(originData.current[key], model[key])) {
        updatedModel[adjustedKey] = true;
        hasChanged = true;
      }
    }

    if (hasChanged && !isEqual(model, updatedModel)) {
      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: updatedModel,
      });
    }
  }, [model, dispatch]);
};
