import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralAction } from "core/services/service-types";
import { isEqual } from "lodash";
import { GoodServiceType } from "models/GoodServiceType";
import React from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { goodServiceTypeRepository } from "../GoodServiceTypeRepository";

export function useGoodServiceTypeDetailHook(
  model: GoodServiceType,
  dispatchModel: React.Dispatch<GeneralAction<GoodServiceType>>,
  handleCloseModal: (type: "preview" | "detail") => void,
  handleLoadList: () => void
) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const handleSave = React.useCallback(() => {
    setLoading(true);
    goodServiceTypeRepository
      .saveGoodServiceType({
        ...model,
      })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CM.updateSuccess"),
            });
            handleCloseModal("detail");
            handleLoadList();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  }, [
    handleChangeAllField,
    handleCloseModal,
    handleLoadList,
    model,
    notifyToast,
    translate,
  ]);

  return {
    loading,
    setLoading,
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
    handleChangeAllField,
    handleSave,
  };
}
