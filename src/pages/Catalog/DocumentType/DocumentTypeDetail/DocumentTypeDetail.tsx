import { Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { isUndefined } from "lodash";
import { useMemo } from "react";
import { FormItem, InputText, Modal } from "react-components-design-system";
import { useDocumentTypeDetailHooks } from "./DocumentTypeDetailHooks";

interface DocumentTypeDetailProps {
  documentTypeId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;
export const DocumentTypeDetail = ({
  documentTypeId,
  dismiss,
}: DocumentTypeDetailProps) => {
  const {
    model,
    isLoading,
    translate,
    handleChangeSingleField,
    handleChangeBoolField,
    onSave,
  } = useDocumentTypeDetailHooks(dismiss, documentTypeId);

  const title: string = useMemo(() => {
    const translatedKey = isUndefined(documentTypeId)
      ? "DT.txt_create_document_type"
      : "DT.txt_edit_document_type";

    return translate(translatedKey);
  }, [documentTypeId, translate]);

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

        <div className="d-flex flex-column gap-3">
          {/* Code */}
          <FormItem validateObject={utilService.getValidateObj(model, "code")}>
            <InputText
              isRequired
              isSmall={false}
              label={translate("DT.txt_document_type_code")}
              placeHolder={translate("DT.plh_document_type_input_code")}
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
              label={translate("DT.txt_document_type_name")}
              placeHolder={translate("DT.plh_document_type_input_name")}
              value={model?.name}
              onChange={handleChangeSingleField({
                fieldName: "name",
              })}
            />
          </FormItem>
        </div>
      </div>
    </Modal>
  );
};
