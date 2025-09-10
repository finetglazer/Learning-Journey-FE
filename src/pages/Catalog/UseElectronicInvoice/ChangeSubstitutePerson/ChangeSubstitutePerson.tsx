import { FormItem, Modal, Select } from "react-components-design-system";

import { utilService } from "core/services/common-services/util-service";
import { useChangeSubstitutePersonHook } from "./ChangeSubstitutePersonHook";
import CommonFilter from "models/CommonFilter";
import useElectronicInvoiceRepository from "../UseElectronicInvoiceRepository";
import { WIDTH_400 } from "core/config/consts";

import "./ChangeSubstitutePerson.scss";

export interface ChangeSubstitutePersonProps {
  selectedElectronicInvoiceIds: string[];
  dismiss: (shouldReloadList?: boolean) => void;
}

export const ChangeSubstitutePerson = ({
  selectedElectronicInvoiceIds,
  dismiss,
}: ChangeSubstitutePersonProps) => {
  const { translate, isLoading, model, handleChangeSelectField, onSave } =
    useChangeSubstitutePersonHook(selectedElectronicInvoiceIds, dismiss);

  return (
    <Modal
      open
      loading={isLoading}
      isShowIconBack={false}
      size={WIDTH_400}
      title={translate("UEI.txt_select_substitute_person")}
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      className="substitute-person-modal"
      handleSave={onSave}
      handleCancel={dismiss}
    >
      <div className="d-flex size-full flex-column gap-3">
        <FormItem
          validateObject={utilService.getValidateObj(model, "substitutePerson")}
        >
          <Select
            isRequired
            value={model?.substitutePerson}
            label={translate("UEI.label_substitute_person")}
            placeHolder={translate("UEI.txt_select_substitute_person")}
            getList={useElectronicInvoiceRepository.getListUser}
            classFilter={CommonFilter}
            isSmall={false}
            isSearch
            render={(item) => (item ? `${item?.email}` : "")}
            searchProperty="name"
            appendToBody
            isEnumerable={false}
            onChange={handleChangeSelectField({
              fieldName: "substitutePerson",
            })}
          />
        </FormItem>
      </div>
    </Modal>
  );
};
