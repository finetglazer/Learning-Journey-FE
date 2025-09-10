import { Switch } from "antd";
import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";

import { utilService } from "core/services/common-services/util-service";
import { useManufacturerCategoriesDetailHook } from "./ManufacturerCategoriesDetailHook";
import { TEXT_AREA_MAX_LENGTH } from "../constants";

export interface ManufacturerCategoriesDetailProps {
  manufacturerCategoryId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;

export const ManufacturerCategoriesDetail = ({
  manufacturerCategoryId,
  dismiss,
}: ManufacturerCategoriesDetailProps) => {
  const {
    translate,
    isLoading,
    model,
    title,
    handleChangeSingleField,
    handleChangeBoolField,
    onSave,
  } = useManufacturerCategoriesDetailHook(dismiss, manufacturerCategoryId);

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
          {translate("CM.txt_status_active")}
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
              label={translate("MC.txt_manufacturer_categories_code")}
              placeHolder={translate(
                "MC.placeholder_select_manufacturer_categories_code"
              )}
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
              label={translate("MC.txt_manufacturer_categories_name")}
              placeHolder={translate(
                "MC.placeholder_manufacturer_categories_name"
              )}
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
            label={translate("MC.txt_manufacturer_categories_description")}
            placeHolder={translate(
              "MC.placeholder_type_manufacturer_categories_description"
            )}
            value={model?.description}
            showCount
            resize="none"
            maxLength={TEXT_AREA_MAX_LENGTH}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            translate={translate}
          />
        </FormItem>
      </div>
    </Modal>
  );
};
