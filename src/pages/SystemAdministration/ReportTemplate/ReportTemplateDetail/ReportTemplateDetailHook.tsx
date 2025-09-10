import React from "react";
import { GeneralAction } from "core/services/service-types";
import { ReportTemplate } from "models/ReportTemplate";
import appMessageService from "core/services/common-services/app-message-service";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { AxiosError } from "axios";
import { fieldService } from "core/services/page-services/field-service";
import { reportTemplateRepository } from "pages/SystemAdministration/ReportTemplate/ReportTemplateRepository";

export const useReportTemplateDetailHook = (
  model: ReportTemplate,
  dispatchModel: React.Dispatch<GeneralAction<ReportTemplate>>,
  handleCloseModal: (type: "detail" | "preview") => void,
  handleLoadList: () => void
) => {
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const handleSave = React.useCallback(() => {
    setLoading(true);
    reportTemplateRepository
      .saveReport(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          notifyToast({
            message: translate("CM.updateSuccess"),
          });
          handleCloseModal("detail");
          handleLoadList();
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
};
