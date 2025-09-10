import { Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { isUndefined } from "lodash";
import CommonFilter from "models/CommonFilter";
import { useMemo } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
  Modal,
  Select,
} from "react-components-design-system";
import { listType } from "../constants";
import { useSpecializedBankDetailHooks } from "./SpecializedBankDetailHooks";

interface SpecializedBankDetailProps {
  specialBankId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;
export const SpecializedBankDetail = ({
  specialBankId,
  dismiss,
}: SpecializedBankDetailProps) => {
  const {
    model,
    isLoading,
    translate,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeBoolField,
    handleChangeDateField,
    onSave,
  } = useSpecializedBankDetailHooks(dismiss, specialBankId);

  const title: string = useMemo(() => {
    const translatedKey = isUndefined(specialBankId)
      ? "SB.txt_create_specialized_bank"
      : "SB.txt_edit_specialized_bank";

    return translate(translatedKey);
  }, [specialBankId, translate]);

  const StatusView = () => {
    return (
      <div className="d-flex flex-row gap-2">
        <span className="status-style">{translate("CM.txt_status")}</span>
        <Switch
          className="switch__custom"
          value={model.isActive}
          onChange={handleChangeBoolField({
            fieldName: "isActive",
          })}
        />
        <span className="active-style">
          {translate("CL.active_status_txt")}
        </span>
      </div>
    );
  };

  return (
    <Modal
      open
      loading={isLoading}
      isShowIconBack={false}
      size={MODAL_WIDTH}
      title={title}
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={onSave}
      handleCancel={dismiss}
    >
      <div className="d-flex size-full flex-column gap-3">
        {/* Status */}
        <FormItem
          validateObject={utilService.getValidateObj(model, "isActive")}
        >
          <StatusView />
        </FormItem>

        {/* Code */}
        <FormItem validateObject={utilService.getValidateObj(model, "code")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("SB.txt_specialized_bank_code")}
            placeHolder={translate("SB.placeholder_input_specialized_bank")}
            value={model?.code}
            onChange={handleChangeSingleField({
              fieldName: "code",
            })}
          />
        </FormItem>

        {/* Name */}
        <FormItem validateObject={utilService.getValidateObj(model, "name")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("SB.txt_specialized_bank_name")}
            placeHolder={translate(
              "SB.placeholder_input_specialized_bank_name"
            )}
            value={model?.name?.replace(/\s+/g, " ")}
            onChange={handleChangeSingleField({
              fieldName: "name",
            })}
          />
        </FormItem>

        {/* Type */}
        <FormItem validateObject={utilService.getValidateObj(model, "type")}>
          <Select
            isSmall={false}
            isRequired
            label={translate("SB.txt_specialized_bank_type")}
            placeHolder={translate("SB.placeholder_specialized_bank_type")}
            classFilter={CommonFilter}
            getList={listType}
            value={model?.typeId}
            isEnumerable={false}
            render={(t) => t?.name}
            onChange={handleChangeSelectField({
              fieldName: "typeId",
            })}
            appendToBody
          />
        </FormItem>

        {/* Time */}
        <div className="d-flex flex-row gap-3">
          {/* Start date */}
          <FormItem
            validateObject={utilService.getValidateObj(model, "startDate")}
          >
            <DatePicker
              isRequired
              isSmall={false}
              label={translate("CM.txt_start_date")}
              placeholder={translate("SB.placeholder_select_start_date")}
              value={model?.startDateValue}
              onChange={handleChangeDateField({
                fieldName: "startDateValue",
              })}
            />
          </FormItem>

          {/* End date */}
          <FormItem
            validateObject={utilService.getValidateObj(model, "endDate")}
          >
            <DatePicker
              isSmall={false}
              label={translate("CM.txt_end_date")}
              placeholder={translate("SB.placeholder_select_end_date")}
              value={model?.endDateValue}
              onChange={handleChangeDateField({
                fieldName: "endDateValue",
              })}
            />
          </FormItem>
        </div>
      </div>
    </Modal>
  );
};
