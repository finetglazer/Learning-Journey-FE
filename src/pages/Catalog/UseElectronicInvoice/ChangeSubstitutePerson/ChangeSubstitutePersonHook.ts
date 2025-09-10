import { useState } from "react";
import { finalize } from "rxjs";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { UseElectronicInvoiceCreation } from "models/UseElectronicInvoice";
import { ChangeSubstitutePersonProps } from "./ChangeSubstitutePerson";
import { detailService } from "core/services/page-services/detail-service";
import appMessageService from "core/services/common-services/app-message-service";
import { fieldService } from "core/services/page-services/field-service";
import useElectronicInvoiceRepository from "../UseElectronicInvoiceRepository";
import { handleError } from "core/helpers/handle-error";

export const useChangeSubstitutePersonHook = (
  electronicInvoiceIds: ChangeSubstitutePersonProps["selectedElectronicInvoiceIds"],
  dismiss: ChangeSubstitutePersonProps["dismiss"]
) => {
  const [translate] = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, dispatch } =
    detailService.useModel<UseElectronicInvoiceCreation>(
      UseElectronicInvoiceCreation,
      {
        ...new UseElectronicInvoiceCreation(),
      }
    );

  const { handleChangeSelectField, handleChangeAllField } =
    fieldService.useField(model, dispatch);

  const onSave = () => {
    const modelData = {
      ids: electronicInvoiceIds,
      substitutePerson: model?.substitutePerson?.email,
    };

    setLoading(true);
    useElectronicInvoiceRepository
      .changeSubstitutePerson(modelData)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<UseElectronicInvoiceCreation>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  return {
    translate,
    isLoading,
    model,
    handleChangeSelectField,
    onSave,
  };
};
