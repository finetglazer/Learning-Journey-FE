import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useDetailContractTermModalHook } from "./DetailContractTermModalHook";
import { utilService } from "core/services/common-services/util-service";
import {
  MAX_LENGTH_2000,
  MAX_LENGTH_255,
  WIDTH_1000,
} from "core/config/consts";
import { trimText } from "core/helpers/text";

const DetailContractTermModal = () => {
  const [translate] = useTranslation();

  const {
    translate: translateContract,
    modelContractTerm,
    title,
    isEdit,
    handleChangeSingleField,
    handleCancelContractTermModal,
    handleSaveContractTermModal,
  } = useDetailContractTermModalHook();

  return (
    <Modal
      open={true}
      maskClosable={false}
      isShowIconBack={false}
      title={title}
      size={WIDTH_1000}
      titleButtonApply={
        isEdit
          ? translateContract("CM.txt_save")
          : translateContract("CM.txt_add")
      }
      titleButtonCancel={translateContract("CM.btn_cancel")}
      handleCancel={handleCancelContractTermModal}
      handleSave={handleSaveContractTermModal}
    >
      <div className="d-flex size-full flex-column gap-3">
        {/* Name */}
        <FormItem
          validateObject={utilService.getValidateObj(modelContractTerm, "name")}
        >
          <InputText
            isRequired
            isSmall={false}
            label={translateContract("CT.name_contract_term")}
            placeHolder={translateContract("CT.placeholder_contract_term")}
            maxLength={MAX_LENGTH_255}
            translate={translate}
            value={modelContractTerm?.name}
            onChange={(value: string) =>
              handleChangeSingleField({
                fieldName: "name",
              })(trimText(value))
            }
          />
        </FormItem>

        {/* Description */}
        <FormItem
          validateObject={utilService.getValidateObj(
            modelContractTerm,
            "description"
          )}
        >
          <TextArea
            isRequired
            label={translateContract("CM.txt_description")}
            placeHolder={translateContract("CM.type_description")}
            value={modelContractTerm?.description}
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

export default DetailContractTermModal;
