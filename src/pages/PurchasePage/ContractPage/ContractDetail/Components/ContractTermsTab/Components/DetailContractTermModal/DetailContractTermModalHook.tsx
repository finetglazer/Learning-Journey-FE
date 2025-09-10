import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep, isEmpty, isEqual, omit } from "lodash";

import { detailService } from "core/services/page-services/detail-service";
import { ContractDetailModel, ContractTerm } from "models/Contract";
import { fieldService } from "core/services/page-services/field-service";
import {
  ContractTermsContext,
  ContractTermsModalType,
} from "../ContractTerms/ContractTermsHook";
import { MAX_LENGTH_2000, MAX_LENGTH_255 } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";

export const useDetailContractTermModalHook = () => {
  const [translate] = useTranslationContract();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    model: modelMaster,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const {
    contractTermsModalType,
    selectedContractTerm,
    setContractTermsModalType,
    setSelectedContractTerm,
  } = useContext(ContractTermsContext);

  const { model: modelContractTerm, dispatch: dispatchContractTerm } =
    detailService.useModel<ContractTerm>(ContractTerm, selectedContractTerm);

  const { handleChangeSingleField, handleChangeAllField } =
    fieldService.useField(modelContractTerm, dispatchContractTerm);

  const isEdit =
    selectedContractTerm &&
    contractTermsModalType === ContractTermsModalType.Detail;

  const title = isEdit
    ? translate("CT.edit_contract_term")
    : translate("CT.add_new_contract_term");

  const validate = () => {
    const validatedFields = [
      { fieldName: "name", maxLength: MAX_LENGTH_255, isUnique: false },
      { fieldName: "description", maxLength: MAX_LENGTH_2000 },
    ];

    const errors = validatedFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (!modelContractTerm?.[field?.fieldName]) {
          acc[field?.fieldName] = translate("CM.input_require_validation");
        } else if (
          modelContractTerm?.[field?.fieldName]?.length > field?.maxLength
        ) {
          acc[field?.fieldName] = translate("CM.input_length_validation", {
            maxLength: field?.maxLength,
          });
        } else if (field?.isUnique) {
          const duplicatedTerm = modelMaster?.contractTerms?.find(
            (item) =>
              item?.id !== modelContractTerm?.id &&
              item?.name?.toLowerCase() ===
                modelContractTerm?.[field?.fieldName]?.toLowerCase()
          );

          if (duplicatedTerm) {
            acc[field?.fieldName] = translate("CT.already_exist_contract_term");
          }
        }
        return acc;
      },
      {}
    );

    if (!isEmpty(errors)) {
      handleChangeAllField({
        ...modelContractTerm,
        errors: {
          ...modelContractTerm?.errors,
          ...errors,
        },
      });
      return false;
    }
    return true;
  };

  const handleCancelContractTermModal = () => {
    handleChangeAllField({
      name: "",
      description: "",
      errors: {},
    });
    setContractTermsModalType(null);
    setSelectedContractTerm(null);
  };

  const handleSaveContractTermModal = () => {
    if (!validate()) return;

    const newContractTerms = cloneDeep(modelMaster?.contractTerms) || [];

    const index = newContractTerms?.findIndex(
      (item) => item?.id === selectedContractTerm?.id
    );
    isEqual(index, -1)
      ? newContractTerms.push(
          omit(
            {
              ...modelContractTerm,
              id: uuidv4(),
            },
            ["errors"]
          )
        )
      : (newContractTerms[index] = omit(modelContractTerm, ["errors"]));

    handleChangeSingleFieldMaster({
      fieldName: "contractTerms",
    })(newContractTerms);

    notifyToast({
      message: isEdit
        ? translate("CM.txt_update_success")
        : translate("CT.add_contract_term_successfully"),
    });

    handleCancelContractTermModal();
  };

  useEffect(() => {
    if (selectedContractTerm) {
      handleChangeAllField(selectedContractTerm);
    }
  }, [handleChangeAllField, selectedContractTerm]);

  return {
    translate,
    modelContractTerm,
    title,
    isEdit,
    contractTermsModalType,
    handleChangeSingleField,
    handleCancelContractTermModal,
    handleSaveContractTermModal,
  };
};
