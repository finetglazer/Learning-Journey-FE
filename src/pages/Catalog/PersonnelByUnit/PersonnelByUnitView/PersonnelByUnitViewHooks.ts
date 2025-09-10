import appMessageService from "core/services/common-services/app-message-service";
import { isEqual, isNull } from "lodash";
import { PersonnelByUnit } from "models/PersonnelByUnit/PersonnelByUnit";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import personnelByUnitRepository from "../PersonnelByUnitRepository";

export const usePersonnelByUnitViewHooks = (
  open: boolean,
  personnelByUnitId: string
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<PersonnelByUnit | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const getDetail = useCallback(() => {
    setLoading(true);
    personnelByUnitRepository
      .getDetail(personnelByUnitId)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: PersonnelByUnit) => setModel(response),
        error: () => {
          setModel(null);
          notifyToast({
            type: "error",
            message: translate("CM.message_system_error"),
          });
        },
      });
  }, [personnelByUnitId, translate]);

  useEffect(() => {
    if (isNull(personnelByUnitId) || isEqual(open, false)) {
      return;
    }

    getDetail();
  }, [personnelByUnitId]);

  return {
    model,
    translate,
    isLoading,
    getDetail,
  };
};
