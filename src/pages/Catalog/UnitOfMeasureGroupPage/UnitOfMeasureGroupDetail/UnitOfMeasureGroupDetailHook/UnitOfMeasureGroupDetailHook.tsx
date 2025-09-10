import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralAction } from "core/services/service-types";
import _, { isEqual } from "lodash";
import { UnitOfMeasureGroup } from "models/UnitOfMeasureGroup";
import React from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { unitOfMeasureGroupRepository } from "../../UnitOfMeasureGroupRepository";

export function useUnitOfMeasureGroupDetailHook(
  model: UnitOfMeasureGroup,
  dispatchModel: React.Dispatch<GeneralAction<UnitOfMeasureGroup>>,
  handleCloseModal: (type: "detail" | "preview") => void,
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

    const temp = _.cloneDeep(model);

    temp.unitOfMeasureGroupContents = temp?.unitOfMeasureGroupContents?.filter(
      (content) => {
        return content?.conversionUnit && content?.coefficientValue;
      }
    );
    unitOfMeasureGroupRepository
      .saveUnitOfMeasureGroup(temp)
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
            const errors = error.response?.data?.errors;

            const newContents = temp.unitOfMeasureGroupContents;

            Object.keys(errors).forEach((key: string) => {
              const match = key.match(/\[(\d+)\]/);
              if (match) {
                const matchKey = key.match(/\.([^.]+)$/);
                if (matchKey) {
                  const index = match[1];
                  const error = errors[key];
                  newContents[Number(index)].errors = {
                    ...newContents[Number(index)].errors,
                    [`${matchKey[1]}`]: error,
                  };
                }
              }
            });

            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
              unitOfMeasureGroupContents: newContents,
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
