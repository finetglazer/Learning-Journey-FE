import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { NextRoundSupplierModel } from "models/PurchasingPlan/PurchasingPlan";

export const useAddNextRoundSupplierConfirmationHook = () => {
  const { model, dispatch } = detailService.useModel<NextRoundSupplierModel>(
    NextRoundSupplierModel
  );

  const { handleChangeDateField, handleChangeAllField, handleChangeListField } =
    fieldService.useField(model, dispatch);

  return {
    model,
    handleChangeAllField,
    handleChangeDateField,
    handleChangeListField,
  };
};
