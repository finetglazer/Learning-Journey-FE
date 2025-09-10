import appMessageService from "core/services/common-services/app-message-service";
import { isEqual, isNull } from "lodash";
import { AreaUnitCode } from "models/AreaUnitCode/AreaUnitCode";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import areaUnitCodeRepository from "../AreaUnitCodeRepository";

export const useAreaUnitCodeViewHooks = (
  open: boolean,
  areaUnitCodeId: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<AreaUnitCode | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    areaUnitCodeRepository
      .getDetail(areaUnitCodeId)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: AreaUnitCode) => setModel(response),
        error: () => {
          setModel(null);
          notifyToast({
            type: "error",
            message: translate("CM.message_system_error"),
          });
        },
      });
  }, [areaUnitCodeId, translate]);

  useEffect(() => {
    if (isNull(areaUnitCodeId) || isEqual(open, false)) {
      return;
    }

    getDetail();
  }, [areaUnitCodeId]);

  return {
    model,
    translate,
    isLoading,
    getDetail,
  };
};
