import { Switch } from "antd";
import { NUMBER_MAX_13 } from "config/const";
import { numberConstants } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { isNull } from "lodash";
import { useMemo } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import "./ContractClassificationDetail.scss";
import { useContractClassificationDetailHooks } from "./ContractClassificationHooks";

const MODAL_WIDTH = 600;
const TEXT_AREA_MAX_LENGTH = 500;

interface SpecializedBankDetailProps {
  open: boolean;
  personnelByUnitId: string;
  handleCancel: (shouldReloadList?: boolean) => void;
  date?: string;
}

export const ContractClassificationDetail = ({
  open,
  personnelByUnitId,
  date,
  handleCancel,
}: SpecializedBankDetailProps) => {
  const {
    model,
    isLoading,
    translate,
    handleChangeSingleField,
    handleChangeBoolField,
    onSave,
  } = useContractClassificationDetailHooks(
    handleCancel,
    personnelByUnitId,
    open,
    date
  );

  const title: string = useMemo(() => {
    const translatedKey = isNull(personnelByUnitId)
      ? "CC.title_create_config"
      : "CC.title_edit_config";

    return translate(translatedKey);
  }, [personnelByUnitId, translate]);

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
      open={open}
      loading={isLoading}
      isShowIconBack={false}
      size={MODAL_WIDTH}
      title={title}
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={onSave}
      handleCancel={handleCancel}
    >
      <div className="contract-classification-detail">
        <FormItem
          validateObject={utilService.getValidateObj(model, "isActive")}
        >
          <StatusView />
        </FormItem>
        <div className="d-flex gap-3">
          <FormItem validateObject={utilService.getValidateObj(model, "code")}>
            <InputText
              label={translate("CC.txt_config_code")}
              placeHolder={translate("CC.placeholder_input_config_code")}
              value={model?.code}
              onChange={handleChangeSingleField({
                fieldName: "code",
              })}
              className="form-item form-item--half"
              isSmall={false}
              isRequired
            />
          </FormItem>
          <FormItem validateObject={utilService.getValidateObj(model, "name")}>
            <InputText
              label={translate("CC.txt_config_name")}
              placeHolder={translate("CC.placeholder_input_config_name")}
              value={model?.name}
              onChange={handleChangeSingleField({
                fieldName: "name",
              })}
              className="form-item form-item--half"
              isSmall={false}
              isRequired
            />
          </FormItem>
        </div>
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <TextArea
            label={translate("CC.txt_config_description")}
            placeHolder={translate("CC.placeholder_input_config_value")}
            value={model?.description}
            onChange={handleChangeSingleField({ fieldName: "description" })}
            showCount
            maxLength={TEXT_AREA_MAX_LENGTH}
            resize="none"
            translate={translate}
          />
        </FormItem>
        <div className="d-flex gap-3">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "maxOverpaymentAmount"
            )}
          >
            <InputNumber
              label={translate("CC.txt_config_maximum_payment")}
              placeHolder={numberConstants.ZERO.toString()}
              value={model?.maxOverpaymentAmount}
              onChange={handleChangeSingleField({
                fieldName: "maxOverpaymentAmount",
              })}
              isSmall={false}
              numberType="DECIMAL"
              max={NUMBER_MAX_13}
              isRequired
            />
          </FormItem>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "maxOverpaymentPercentage"
            )}
          >
            <InputNumber
              label={translate("CC.txt_config_percentage")}
              placeHolder={numberConstants.ZERO.toString()}
              value={model?.maxOverpaymentPercentage}
              onChange={handleChangeSingleField({
                fieldName: "maxOverpaymentPercentage",
              })}
              isSmall={false}
              numberType="DECIMAL"
              max={100}
              isRequired
            />
          </FormItem>
        </div>
      </div>
    </Modal>
  );
};
