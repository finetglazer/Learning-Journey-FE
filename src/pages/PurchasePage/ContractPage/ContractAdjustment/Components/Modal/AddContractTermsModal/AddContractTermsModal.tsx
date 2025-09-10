import {
  MAX_LENGTH_2000,
  MAX_LENGTH_255,
  WIDTH_1000,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField } from "core/services/service-types";
import { ContractTermsModel } from "models/ContractTerms/ContractTerms";
import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface AddContractTermsModalProps {
  onClose: () => void;
  model: ContractTermsModel;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  onAddContractTerms: () => void;
}

export const AddContractTermsModal = ({
  model,
  onClose,
  handleChangeSingleField,
  onAddContractTerms,
}: AddContractTermsModalProps) => {
  const [translate] = useTranslation();

  return (
    <Modal
      open
      isShowIconBack={false}
      size={WIDTH_1000}
      handleCancel={onClose}
      handleClickIcon={onClose}
      title={translate("CT.add_contract_terms")}
      titleButtonApply={translate("CM.txt_add")}
      titleButtonCancel={translate("CM.txt_cancel")}
      handleSave={onAddContractTerms}
    >
      <div className="d-flex flex-column gap-1">
        <FormItem validateObject={utilService.getValidateObj(model, "name")}>
          <InputText
            label={translate("CT.terms_name")}
            placeHolder={translate("CM.placeholder_clause_name")}
            onChange={handleChangeSingleField({
              fieldName: "name",
            })}
            value={model?.name}
            maxLength={MAX_LENGTH_255}
            isSmall={false}
            allowClear={false}
            isRequired
          />
        </FormItem>
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <TextArea
            label={translate("CM.txt_description")}
            placeHolder={translate("CM.type_description")}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            value={model?.description}
            maxLength={MAX_LENGTH_2000}
            resize="none"
            rows={16}
            isRequired
            showCount
          />
        </FormItem>
      </div>
    </Modal>
  );
};
