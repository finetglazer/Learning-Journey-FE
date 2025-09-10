import { MAX_LENGTH_1000 } from "core/config/consts";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  ConfigField,
  GeneralAction,
  GeneralActionEnum,
} from "core/services/service-types";
import { gt, isEmpty, isNumber } from "lodash";
import { Goods } from "models/ProjectSettlement";
import { createContext, Dispatch, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface DrawerInformationHookTye {
  model: Goods;
  dispatch: Dispatch<GeneralAction<Goods>>;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
}

export const DrawerInformationContext = createContext<DrawerInformationHookTye>(
  {
    model: null,
    dispatch: null,
  }
);

export const useDrawerInformationHooks = (
  item: Goods,
  onSave: (item: Goods) => void
) => {
  const [translate] = useTranslation();

  const { model, dispatch } = detailService.useModel<Goods>(Goods, { ...item });

  const { handleChangeSingleField, handleChangeAllField } =
    fieldService.useField(model, dispatch);

  useEffect(() => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: { ...item },
    });
  }, [dispatch, item]);

  /**
   * Validates the goods note field.
   * @returns {string | null} - The validation error message, or null if the field is valid.
   */
  const validationGoodsNote = () => {
    if (gt(model?.note?.length, MAX_LENGTH_1000)) {
      return translate("CM.input_length_validation", {
        maxLength: MAX_LENGTH_1000,
      });
    }

    return null;
  };

  const validationSettlementBeforeTax = () => {
    if (!isNumber(model?.settlementBeforeTax)) {
      return translate("CM.input_require_validation");
    }

    return null;
  };

  /**
   * Handles the save action for the drawer information.
   */
  const handleSave = () => {
    const note = validationGoodsNote();
    const settlementBeforeTax = validationSettlementBeforeTax();
    const errors = {
      note,
      settlementBeforeTax,
    };

    if (!isEmpty(note) || !isEmpty(settlementBeforeTax)) {
      handleChangeAllField({ ...model, errors });
      return;
    }

    onSave(model);
  };

  return {
    model,
    dispatch,
    handleChangeSingleField,

    handleSave,
    translate,
  };
};
