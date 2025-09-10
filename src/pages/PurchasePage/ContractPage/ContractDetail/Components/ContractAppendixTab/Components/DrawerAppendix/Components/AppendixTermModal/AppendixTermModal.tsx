import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";

import {
  MAX_LENGTH_2000,
  MAX_LENGTH_255,
  WIDTH_1000,
} from "core/config/consts";
import { trimText } from "core/helpers/text";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEmpty, isEqual } from "lodash";
import { AppendixTerm } from "models/Contract";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  AppendixTermModalState,
  DrawerAppendixContext,
  DrawerAppendixContextType,
} from "../../DrawerAppendixHook";

const AppendixTermModal = () => {
  const [translate] = useTranslation();

  const {
    model: drawerModel,
    handleChangeSingleField: drawerHandleChangeSingleField,
    appendixTermModal,
    setAppendixTermModal,
    selectedTerm,
  } = useContext<DrawerAppendixContextType>(DrawerAppendixContext);

  const isEdit = isEqual(appendixTermModal, AppendixTermModalState.EDIT);

  const { model, dispatch } = detailService.useModel<AppendixTerm>(
    AppendixTerm,
    isEdit ? selectedTerm : {}
  );

  const { handleChangeSingleField, handleChangeAllField } =
    fieldService.useField(model, dispatch);

  const validate = () => {
    const validatedFields = [
      { fieldName: "name", maxLength: MAX_LENGTH_255 },
      { fieldName: "description", maxLength: MAX_LENGTH_2000 },
    ];

    const errors = validatedFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (!model?.[field?.fieldName]) {
          acc[field?.fieldName] = translate("CM.input_require_validation");
        } else if (model?.[field?.fieldName]?.length > field?.maxLength) {
          acc[field?.fieldName] = translate("CM.input_length_validation", {
            maxLength: field?.maxLength,
          });
        }
        return acc;
      },
      {}
    );

    if (!isEmpty(errors)) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }
    return true;
  };

  const title = isEdit
    ? translate("CT.contract_appendix.edit_appendix_term")
    : translate("CT.contract_appendix.add_appendix_term");

  const handleSaveContractTermModal = () => {
    if (!validate()) return;
    if (isEdit) {
      drawerHandleChangeSingleField({ fieldName: "appendixTerms" })(
        drawerModel?.appendixTerms?.map((term) =>
          term.id === model?.id ? model : term
        )
      );
    } else {
      drawerHandleChangeSingleField({ fieldName: "appendixTerms" })([
        ...(drawerModel?.appendixTerms ?? []),
        { ...model, id: Date.now().toString() },
      ]);
    }

    setAppendixTermModal(AppendixTermModalState.HIDE);
  };

  return (
    <Modal
      open={appendixTermModal !== AppendixTermModalState.HIDE}
      maskClosable={false}
      isShowIconBack={false}
      title={title}
      size={WIDTH_1000}
      titleButtonApply={
        isEdit ? translate("CM.txt_save") : translate("CM.txt_add")
      }
      titleButtonCancel={translate("CM.btn_cancel")}
      handleCancel={() => {
        setAppendixTermModal(AppendixTermModalState.HIDE);
      }}
      handleSave={handleSaveContractTermModal}
    >
      <div className="d-flex size-full flex-column gap-3">
        {/* Name */}
        <FormItem validateObject={utilService.getValidateObj(model, "name")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("CT.contract_appendix.appendix_term_name")}
            placeHolder={translate(
              "CT.contract_appendix.appendix_term_name_placeholder"
            )}
            maxLength={MAX_LENGTH_255}
            translate={translate}
            value={model?.name}
            onChange={(value: string) =>
              handleChangeSingleField({
                fieldName: "name",
              })(trimText(value))
            }
          />
        </FormItem>

        {/* Description */}
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <TextArea
            isRequired
            label={translate("CM.txt_description")}
            placeHolder={translate("CM.type_description")}
            value={model?.description}
            showCount
            resize="none"
            maxLength={MAX_LENGTH_2000}
            translate={translate}
            rows={15}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
          />
        </FormItem>
      </div>
    </Modal>
  );
};

export default AppendixTermModal;
