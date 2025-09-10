import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useContext, useEffect } from "react";
import {
  DateRangePicker,
  FormItem,
  InputText,
  Modal,
} from "react-components-design-system";

import { NOT_SPECIAL_CHARACTERS } from "core/config/consts";
import { Authorizers } from "pages/Catalog/LegalEntity/LegalEntityMaster/LegalEntityMasterHooks";
import { useTranslation } from "react-i18next";
import {
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../../LegalEntityDetailHooks";
import AttachedFile from "./AttachedFile/AttachedFile";

const MODAL_WIDTH = 600;

export const ModalAuthorizationInformation = ({
  onClose,
  recordEdit,
}: {
  onClose: () => void;
  recordEdit?: Authorizers;
}) => {
  const [translate] = useTranslation();
  const {
    model: modelDetail,
    isLoading,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<LegalEntityDetail>(LegalEntityDetailContext);

  const { model, dispatch } = detailService.useModel<Authorizers>(Authorizers, {
    ...new Authorizers(),
  });

  const {
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeDateField,
  } = fieldService.useField(model, dispatch);

  useEffect(() => {
    if (recordEdit) {
      handleChangeAllField({
        ...recordEdit,
        time: [dayjs(recordEdit?.startTime), dayjs(recordEdit?.endTime)],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordEdit]);

  const validate = (authorizers: Authorizers) => {
    const requiredFields = [
      "powerOfAttorney",
      "position",
      "name",
      "time",
      "attachmentDocuments",
    ];
    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (
          !authorizers?.[field] ||
          (field === "time" && isEmpty(authorizers.time?.[0]))
        ) {
          acc[field] = translate("CM.input_require_validation");
        } else {
          acc[field] = undefined;
        }
        return acc;
      },
      {}
    );

    const validateFields = [
      { name: "powerOfAttorney" },
      { name: "position" },
      { name: "name" },
    ];
    const length = 255;
    for (const { name } of validateFields) {
      if (authorizers[name]?.length > length) {
        errors[name] = translate("CM.input_length_validation", {
          maxLength: length,
        });
      }
    }

    // Invalid Characters validation

    for (const { name } of validateFields) {
      if (authorizers[name] && !NOT_SPECIAL_CHARACTERS.test(model[name])) {
        errors[name] = translate("CM.input_regex_validation", {
          regex: NOT_SPECIAL_CHARACTERS,
        });
      }
    }

    const filterErrors = Object.values(validateFields)?.filter((item) => {
      return (
        errors[`${item?.name}`] !== undefined &&
        errors[`${item?.name}`] !== null
      );
    });
    if (filterErrors?.length > 0) {
      authorizers.errors = errors;
    } else {
      authorizers.errors = undefined;
    }
    return authorizers;
  };

  const handleAddNew = () => {
    const validateModel = validate(model);

    handleChangeAllField(validateModel);

    if (!validateModel?.errors) {
      const newModel = {
        ...model,
        id: Date.now().toString(),
        startTime: model?.time?.[0],
        endTime: model?.time?.[1],
      };

      const updatedAuthorizers = recordEdit
        ? modelDetail?.authorizers?.map((authorizers: Authorizers) =>
            authorizers?.id === recordEdit?.id ? newModel : authorizers
          )
        : [...(modelDetail?.authorizers || []), newModel];
      handleChangeSingleFieldMaster({
        fieldName: "authorizers",
      })(updatedAuthorizers);

      onClose();
    }
  };

  return (
    <Modal
      open
      title={translate("LE.txt_legal_entity_add_authorization")}
      loading={isLoading}
      isShowIconBack={false}
      size={MODAL_WIDTH}
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={handleAddNew}
      handleCancel={onClose}
    >
      <div className="d-flex size-full flex-column gap-3">
        <div className="d-flex gap-3">
          <FormItem
            validateObject={utilService.getValidateObj(model, "name")}
            message={model?.errors?.name}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("LE.txt_legal_entity_authorized_person")}
              placeHolder={translate(
                "LE.plh_legal_entity_input_authorized_person"
              )}
              value={model?.name}
              onChange={handleChangeSingleField({
                fieldName: "name",
              })}
              maxLength={255}
              translate={translate}
              regexInput={NOT_SPECIAL_CHARACTERS}
            />
          </FormItem>

          <FormItem
            validateObject={utilService.getValidateObj(model, "position")}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate(
                "LE.txt_legal_entity_authorized_person_position"
              )}
              placeHolder={translate(
                "LE.plh_legal_entity_input_authorized_person_position"
              )}
              value={model?.position}
              onChange={handleChangeSingleField({
                fieldName: "position",
              })}
              maxLength={255}
              translate={translate}
              regexInput={NOT_SPECIAL_CHARACTERS}
            />
          </FormItem>
        </div>

        <FormItem
          validateObject={utilService.getValidateObj(model, "powerOfAttorney")}
        >
          <InputText
            isRequired
            label={translate("LE.txt_legal_entity_authorized_letter")}
            placeHolder={translate(
              "LE.txt_legal_entity_input_authorized_letter"
            )}
            value={model?.powerOfAttorney}
            onChange={handleChangeSingleField({
              fieldName: "powerOfAttorney",
            })}
            isSmall={false}
            maxLength={255}
            translate={translate}
            regexInput={NOT_SPECIAL_CHARACTERS}
          />
        </FormItem>
        <FormItem validateObject={utilService.getValidateObj(model, "time")}>
          <DateRangePicker
            value={model.time || [null, null]}
            onChange={handleChangeDateField({
              fieldName: "time",
            })}
            label={translate("LE.txt_legal_entity_date_ranger")}
            isSmall={false}
            isRequired={true}
            placeholder={[
              translate("LE.plh_legal_entity_from_date"),
              translate("LE.plh_legal_entity_to_date"),
            ]}
          />
        </FormItem>
        <div>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "attachmentDocuments"
            )}
          >
            <AttachedFile
              model={model}
              handleChangeSingleField={handleChangeSingleField}
            />
          </FormItem>
        </div>
      </div>
    </Modal>
  );
};
