import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { isEqual, isNull, isUndefined } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { Dispatch, useEffect, useRef } from "react";

export const useListenAdjustData = (
  model: ContractAnnex,
  dispatch: Dispatch<GeneralAction<ContractAnnex>>
) => {
  const originData = useRef<ContractAnnex | null>(null);
  const isFirstUpdate = useRef(true);

  useEffect(() => {
    if (
      isNull(originData.current) &&
      !Object.values(model).every(isUndefined)
    ) {
      originData.current = model;
    }
  }, [model]);

  useEffect(() => {
    if (isNull(originData.current) || isUndefined(model)) return;

    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
      return;
    }

    const fieldsToCheck: {
      key: keyof ContractAnnex;
      adjustedKey: keyof ContractAnnex;
    }[] = [
      { key: "contractInfo", adjustedKey: "isAdjustedContractInfo" },
      { key: "legalInfo", adjustedKey: "isAdjustedLegalInfo" },
      { key: "supplierInfo", adjustedKey: "isAdjustedSupplierInfo" },
      { key: "receiverInfos", adjustedKey: "isAdjustedReceiveInfo" },
    ];

    let hasChanged = false;
    const updatedModel = { ...model };

    for (const { key, adjustedKey } of fieldsToCheck) {
      let isDifferent = false;

      if (key === "receiverInfos") {
        const left = {
          received: originData.current?.received,
          receivedDepartment: originData.current?.receivedDepartment,
          receivedPerson: originData.current?.receivedPerson,
          receivedPhoneNumber: originData.current?.receivedPhoneNumber,
          receiverInfos: originData.current?.receiverInfos,
        };
        const right = {
          received: model.received,
          receivedDepartment: model.receivedDepartment,
          receivedPerson: model.receivedPerson,
          receivedPhoneNumber: model.receivedPhoneNumber,
          receiverInfos: model.receiverInfos,
        };
        isDifferent = !isEqual(left, right);
      } else if (key === "contractInfo") {
        const left = {
          ...originData.current?.contractInfo,
          endDate: "",
        };
        const right = {
          ...model?.contractInfo,
          endDate: "",
        };
        const day1 = dayjs(originData.current?.contractInfo?.endDate).utc();
        const day2 = dayjs(model?.contractInfo?.endDate);
        const isEqualDate = day1.isSame(day2, "day");
        isDifferent = !(isEqual(left, right) && isEqualDate);
      } else {
        isDifferent = !isEqual(originData.current?.[key], model[key]);
      }

      if (isDifferent && model[adjustedKey] !== true) {
        updatedModel[adjustedKey] = true;
        hasChanged = true;
      }

      if (
        !isDifferent &&
        model[adjustedKey] === true &&
        (originData.current[adjustedKey] === false ||
          isUndefined(originData.current[adjustedKey]))
      ) {
        updatedModel[adjustedKey] = false;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: updatedModel,
      });
    }
  }, [model, dispatch]);
};
