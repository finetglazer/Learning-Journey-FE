import { Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { isUndefined } from "lodash";
import { TEXT_AREA_MAX_LENGTH } from "pages/Catalog/constants";
import { useMemo } from "react";
import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useGuaranteeTypeDetailHooks } from "./GuaranteeTypeDetailHooks";

interface GuaranteeTypeDetailProps {
  guaranteeTypeId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;
export const GuaranteeTypeDetail = ({
  guaranteeTypeId,
  dismiss,
}: GuaranteeTypeDetailProps) => {
  const {
    model,
    isLoading,
    translate,
    handleChangeSingleField,
    handleChangeBoolField,
    onSave,
  } = useGuaranteeTypeDetailHooks(dismiss, guaranteeTypeId);

  const title: string = useMemo(() => {
    const translatedKey = isUndefined(guaranteeTypeId)
      ? "GT.txt_create_guarantee_type"
      : "GT.txt_edit_guarantee_type";

    return translate(translatedKey);
  }, [guaranteeTypeId, translate]);

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

        <div className="d-flex gap-3">
          {/* Code */}
          <FormItem validateObject={utilService.getValidateObj(model, "code")}>
            <InputText
              isRequired
              isSmall={false}
              label={translate("GT.txt_guarantee_type_code")}
              placeHolder={translate("GT.plh_guarantee_type_input_code")}
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
              label={translate("GT.txt_guarantee_type_name")}
              placeHolder={translate("GT.plh_guarantee_type_input_name")}
              value={model?.name}
              onChange={handleChangeSingleField({
                fieldName: "name",
              })}
            />
          </FormItem>
        </div>

        {/* Description */}
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <TextArea
            label={translate("GT.txt_guarantee_type_describe")}
            placeHolder={translate("GT.plh_guarantee_type_input_describe")}
            value={model?.description}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            showCount
            maxLength={TEXT_AREA_MAX_LENGTH}
            resize="none"
            translate={translate}
          />
        </FormItem>
      </div>
    </Modal>
  );
};
